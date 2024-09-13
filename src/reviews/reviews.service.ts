import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { Review } from './reviews.entity';
import { CreateReviewDto } from './dtos/createReviewdto.dtos';
import { MailerService } from '@nestjs-modules/mailer';
import { Booking } from 'src/bookings/bookings.Entity';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private mailerService: MailerService,
  ) {}

  async sendReviewLink(bookingId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { bookingId: bookingId },
      relations: ['user'], // Ensure the user relation is loaded
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.reviewLinkSent) {
      throw new BadRequestException('Review link has already been sent for this booking.');
    }

    const linkToken = nanoid(); // Generate a unique token

    const review = new Review();
    review.booking = booking;
    review.linkToken = linkToken;
    await this.reviewRepository.save(review); // Save the review with only the token

    const reviewLink = `http://localhost:3000/review?token=${linkToken}`;

    try {
      await this.mailerService.sendMail({
        to: booking.user.email,
        subject: 'We Value Your Feedback!',
        text: `Dear Valued Customer,\n\nPlease click the following link to leave your review:\n\n${reviewLink}\n\nBest regards,\nThe Hotel Management Team`,
        html: `<p>Dear Valued Customer,</p><p>Please click the following link to leave your review:</p><p><a href="${reviewLink}">${reviewLink}</a></p>`,
      });

      // Mark the review link as sent
      booking.reviewLinkSent = true;
      await this.bookingRepository.save(booking); // Save the updated booking

      this.logger.log(`Review link sent to ${booking.user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send review link to ${booking.user.email}`, error.stack);
      throw new BadRequestException('Failed to send review link');
    }
  }

  async getReviewByToken(token: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { linkToken: token },
    });

    if (!review) {
      this.logger.warn(`Review with token ${token} not found`);
      throw new NotFoundException('Review not found');
    }

    if (review.createdAt < new Date(Date.now() - 3600000)) {
      // Token expired after 1 hour
      this.logger.warn(`Expired token ${token}`);
      throw new BadRequestException('Token expired');
    }

    this.logger.log(`Review with token ${token} found`);
    return review;
  }

  async submitReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { linkToken, rating, description} = createReviewDto;

    // Check if the review with the given token exists
    const review = await this.getReviewByToken(linkToken);

    // Ensure the review corresponds to the bookingId (optional but good practice)
    // if (review.booking.bookingId !== +bookingId) {
    //   throw new BadRequestException('Booking ID does not match');
    // }

    // Update review details
    review.rating = rating;
    review.description = description;
    await this.reviewRepository.save(review);

    this.logger.log(`Review with token ${linkToken} updated successfully`);

    return review;
  }

  async getAllReviews(){
    return this.reviewRepository.find({
      relations: ['booking','booking.user'], // Adjust 'booking' to match the name of the relation in your Review entity
    })
  }
}
