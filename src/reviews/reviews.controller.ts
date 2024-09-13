import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/createReviewdto.dtos';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('send-link')

  async sendReviewLink(@Body('bookingId') bookingId: number) {
    return this.reviewsService.sendReviewLink(bookingId);
  }

  @Post('submit')
  async submitReview(@Body() createReviewDto: CreateReviewDto) {
    const { linkToken, rating, description, bookingId } = createReviewDto;
    return this.reviewsService.submitReview({
      linkToken,
      rating,
      description,
      bookingId,
    });
  }

  @Get()
  async getAllReviews(){
    return this.reviewsService.getAllReviews();
  }
}
