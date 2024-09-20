import { Controller, Get, Param, Post } from '@nestjs/common';
import { FinalBillingService } from './final_billing.service';

@Controller('final_billing')
export class FinalBillingController {
    constructor(private readonly finalBillingService: FinalBillingService) {}

    @Get()
    async getAllFinalBillings() {
        return await this.finalBillingService.getAllFinalBillings();
    }

    @Get("user/:userId/booking/:bookingId")
    async calculateTotalAmount(@Param('userId') userId: number,@Param('bookingId') bookingId: number) {
        return await this.finalBillingService.calculateTotalAmount(userId,bookingId);
    }

    @Get("user/:userId")
    async getFinalBillingsByUser(@Param('userId') userId: number) {
        return await this.finalBillingService.getFinalBillingsByUser(userId);
    }
}

