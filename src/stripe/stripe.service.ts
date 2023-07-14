import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    async createCustomer(body: Stripe.CustomerCreateParams) {
        const { payment_method, email, name } = body;
        const stripe = new Stripe(process.env.STRIPE_SECRET, {
            apiVersion: process.env.STRIPE_API_VERSION as '2022-11-15',
        });

        const customer = await stripe.customers.create({
            email: email,
            name: name,
            payment_method: payment_method,
        });

        return customer.id;
    }

    async getCustomer(query: Stripe.CustomerCreateParams) {
        const stripe = new Stripe(process.env.STRIPE_SECRET, {
            apiVersion: process.env.STRIPE_API_VERSION as '2022-11-15',
        });
        const customer = await stripe.customers.search({
            query: `email:'${query.email}'`,
        });
        return customer?.data[0]?.id;
    }

    async createPaymentMethod(body: Stripe.PaymentMethodCreateParams.Card1) {
        const stripe = new Stripe(process.env.STRIPE_SECRET, {
            apiVersion: process.env.STRIPE_API_VERSION as '2022-11-15',
        });

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: body.number,
                exp_month: body.exp_month,
                exp_year: body.exp_year,
                cvc: body.cvc,
            },
        });

        return paymentMethod;
    }

    async createPaymentTransaction(body: Stripe.PaymentIntentCreateParams) {
        const stripe = new Stripe(process.env.STRIPE_SECRET, {
            apiVersion: process.env.STRIPE_API_VERSION as '2022-11-15',
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: body.amount,
            currency: body.currency,
            customer: body.customer,
            payment_method: body.payment_method,
            automatic_payment_methods: { enabled: true },
        })

        const paymentIntentConfirm = await stripe.paymentIntents.confirm(
            paymentIntent.id,
            {
                return_url: body.return_url
            }
        );


        return paymentIntentConfirm
    }

}
