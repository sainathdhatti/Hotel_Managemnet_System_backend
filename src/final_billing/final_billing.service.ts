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

@Injectable()
export class FinalBillingService {
  constructor(
    @InjectRepository(FinalBilling)
    private readonly finalBillingService: Repository<FinalBilling>,
    private readonly bookingService: BookingsService,
  ) {}

  async getAllFinalBillings() {
    return await this.finalBillingService.find({
      relations: ["booking","booking.user","booking.spabookings",'booking.foodOrders'],
    });
  }
 
  async calculateTotalAmount(userId:number) {
      const bookedBookings=await this.bookingService.getSpaBookingsOfBookedStatus(userId);
      if(bookedBookings.length==0){
        throw new NotFoundException('No bookings found');
      }


      if(bookedBookings[0].status!=BookingStatus.CHECKED_OUT){
        throw new NotFoundException('Bill will get generated only after checkout');
      }
      let totalSpaAmount = 0;
      let totalFoodAmount = 0;
    
      bookedBookings.forEach(booking => {
        booking.spabookings.forEach(spaBooking => {
          // If price is a string, parse it
          if (typeof spaBooking.spaservice.price === 'string') {
            totalSpaAmount += parseFloat(spaBooking.spaservice.price);
          }
        });
      
        booking.foodOrders.forEach(foodOrder => {
          // If totalAmount is a string, parse it
          if (typeof foodOrder.totalAmount === 'string') {
            totalFoodAmount += parseFloat(foodOrder.totalAmount);
          }
        });
      });
      const finalBilling=this.finalBillingService.create ({
        booking:bookedBookings[0],
        bookingAmount:bookedBookings[0].TotalAmount,
        spaAmount:totalSpaAmount,
        foodAmount:totalFoodAmount,
        totalAmount:totalSpaAmount+totalFoodAmount+bookedBookings[0].TotalAmount,
        advancePayment:bookedBookings[0].advancePayment,
        remainingPayment:bookedBookings[0].TotalAmount-bookedBookings[0].advancePayment,
      })
      return this.finalBillingService.save(finalBilling);
  }

}
