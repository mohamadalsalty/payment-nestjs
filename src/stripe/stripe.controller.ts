import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Query,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
    constructor(private stripeService: StripeService) { }

    @Post('create-customer')
    async createCustomer(@Body() body: Stripe.CustomerCreateParams) {
        return await this.stripeService.createCustomer(body);
    }

    @Get('get-customer')
    async getCustomer(@Query() query: Stripe.CustomerCreateParams) {
        const id = await this.stripeService.getCustomer(query);
        console.log(id);
        if (!id) {
            throw new NotFoundException('Customer not found');
        }
        return { id: id };
    }

    @Post('create-payment-method')
    async createPaymentMethod(
        @Body() body: Stripe.PaymentMethodCreateParams.Card1,
    ) {
        const paymentMethod = await this.stripeService.createPaymentMethod(body);
        return { id: paymentMethod.id };
    }

    @Post('creatre-payment-transaction')
    async createPaymentTransaction(@Body() body: Stripe.PaymentIntentCreateParams) {
        return await this.stripeService.createPaymentTransaction(body);
    }
}
