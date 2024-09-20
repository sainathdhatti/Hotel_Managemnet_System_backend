import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { BookingsService } from "src/bookings/bookings.service";
import { SpaBookingService } from "src/spa_booking/spa_booking.service";
import { SpaBookingStatus } from "src/spa_booking/spa_bookingEntity";
import { OrderService } from "src/Food_module/Food_order/food_order.service";
import { Repository } from "typeorm";
import { FinalBilling } from "./final_billing.Entity";
import { BookingStatus } from "src/bookings/bookings.Entity";
import { OrderStatus } from "src/Food_module/Food_order/dto/updateFoodOrderDto.dto";

@Injectable()
export class FinalBillingService {
  constructor(
    @InjectRepository(FinalBilling)
    private readonly finalBillingService: Repository<FinalBilling>,
    private readonly bookingService: BookingsService
  ) {}

  async getAllFinalBillings() {
    return await this.finalBillingService.find({
      relations: [
        "booking",
        "booking.user",
        "booking.spabookings",
        "booking.foodOrders",
      ],
    });
  }

  async getFinalBillingsByUser(userId: number) {
    return await this.finalBillingService.find({
      where: { booking: { user: { id: userId } } },
      relations: [
        "booking",
        "booking.user",
        "booking.spabookings",
        "booking.foodOrders",
      ],
    });
  }

  // async calculateTotalAmount(userId:number,bookingId:number) {
  //   console.log("I am in calculate total amount");
  //     const bookedBookings=await this.bookingService.getPresentBookings(userId,bookingId);
  //     console.log(bookedBookings);
  //     // if(bookedBookings.length==0){
  //     //   throw new NotFoundException('No bookings found');
  //     // }
  //     // console.log(bookedBookings.)

  //     // if(bookedBookings[0].status!=BookingStatus.BOOKED){
  //     //   throw new NotFoundException('Bill will get generated only after checkout');
  //     // }
  //     let totalSpaAmount = 0;
  //     let totalFoodAmount = 0;
  //     bookedBookings.forEach(booking => {
  //       booking.spabookings.forEach(spaBooking => {
  //         // If price is a string, parse it
  //         if (typeof spaBooking.spaservice.price === 'string') {
  //           totalSpaAmount += parseFloat(spaBooking.spaservice.price);
  //         }
  //       });

  //       booking.foodOrders.forEach(foodOrder => {
  //         // If totalAmount is a string, parse it
  //         if (typeof foodOrder.totalAmount === 'string') {
  //           totalFoodAmount += parseFloat(foodOrder.totalAmount);
  //         }
  //       });
  //     });
  //     const finalBilling=this.finalBillingService.create ({
  //       booking:bookedBookings[0],
  //       bookingAmount:bookedBookings[0].TotalAmount,
  //       spaAmount:totalSpaAmount,
  //       foodAmount:totalFoodAmount,
  //       totalAmount:totalSpaAmount+totalFoodAmount+bookedBookings[0].TotalAmount,
  //       advancePayment:bookedBookings[0].advancePayment,
  //       remainingPayment:bookedBookings[0].TotalAmount-bookedBookings[0].advancePayment,
  //     })
  //     console.log(finalBilling);
  //     return this.finalBillingService.save(finalBilling);
  // }

  async calculateTotalAmount(userId: number, bookingId: number) {
    console.log("I am in calculate total amount");
    const bookedBookings = await this.bookingService.getPresentBookings(userId, bookingId);
    
    if (!bookedBookings) {
      throw new NotFoundException('No bookings found');
    }
    
    // Assuming bookedBookings is an array with a single booking
    //const booking = bookedBookings[0];
  
    // if (booking.status !== BookingStatus.BOOKED) {
    //   throw new NotFoundException('Bill will get generated only after checkout');
    // }
  
    let totalSpaAmount = 0;
    let totalFoodAmount = 0;
    bookedBookings.spabookings.forEach((spaBooking) => {
      if (spaBooking && spaBooking.spaservice && spaBooking.status === SpaBookingStatus.DONE) {
        if (typeof spaBooking.spaservice.price === "string") {
          totalSpaAmount += parseFloat(spaBooking.spaservice.price);
        } else if (typeof spaBooking.spaservice.price === "number") {
          console.log("Service price ",spaBooking.spaservice.price);
          totalSpaAmount += spaBooking.spaservice.price;
        }
      }
    });
  
    bookedBookings.foodOrders.forEach((foodOrder) => {
      if (foodOrder && foodOrder.status === OrderStatus.DELIVERED) {
        if (typeof foodOrder.totalAmount === "string") {
          totalFoodAmount += parseFloat(foodOrder.totalAmount);
        } else if (typeof foodOrder.totalAmount === "number") {
          totalFoodAmount += foodOrder.totalAmount;
        }
      }
    });
  
    const finalBilling = this.finalBillingService.create({
      booking: bookedBookings,
      bookingAmount: bookedBookings.TotalAmount,
      spaAmount: totalSpaAmount,
      foodAmount: totalFoodAmount,
      totalAmount: totalSpaAmount + totalFoodAmount + bookedBookings.TotalAmount,
      advancePayment: bookedBookings.advancePayment,
      remainingPayment: bookedBookings.TotalAmount - bookedBookings.advancePayment,
    });
  
    console.log(finalBilling);
    return this.finalBillingService.save(finalBilling);
  }
  
}
