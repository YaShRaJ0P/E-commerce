import { Request, Response } from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import ProductModel from '../models/productModel';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: '2024-04-10',
});

interface ProductItem {
    _id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
    category: string;
}

interface CartItem {
    product: ProductItem;
    quantity: number;
}

interface Product {
    items: CartItem[];
    price: number;
}

interface Token {
    email: string;
    card: {
        name: string;
        address_line1: string;
        address_city: string;
        address_country: string;
        address_zip: string;
    };
}

export const Payment = async (req: Request, res: Response): Promise<Response> => {
    const MAX_RETRIES = 5;
    let retryCount = 0;

    const executeTransaction = async (): Promise<Response> => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { product, token }: { product: Product; token: Token } = req.body;

            if (!product.items || product.items.length === 0 || product.price <= 0) {
                return res.status(400).send({ message: 'Invalid product data' });
            }

            // Convert amount to smallest currency unit (e.g., paise for INR)
            const amount = Math.round(product.price * 100); // Convert INR to paise

            // Ensure amount is above minimum charge amount (e.g., ₹1)
            if (amount < 100) {
                return res.status(400).send({ message: 'Amount is below the minimum charge amount.' });
            }


            const productDescriptions: string[] = [];
            for (const item of product.items) {
                const productToUpdate = await ProductModel.findById(item.product._id);
                if (!productToUpdate) {
                    throw new Error(`Product with ID ${item.product._id} not found`);
                }
                productToUpdate.stock -= item.quantity;
                if (productToUpdate.stock < 0) {
                    throw new Error(`Not enough stock for product ID ${item.product._id}`);
                }
                await productToUpdate.save();
                productDescriptions.push(`${item.product._id} (x${item.quantity})`);
            }
            const productDescription = productDescriptions.join(', ');



            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'inr',
                receipt_email: token.email,
                description: productDescription,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            await session.commitTransaction();
            return res.status(200).send({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            await session.abortTransaction();
            console.error('Error processing payment:', error);

            if (error instanceof mongoose.Error && error.message.includes('Write conflict')) {
                retryCount++;
                if (retryCount < MAX_RETRIES) {
                    const backoffDelay = Math.pow(2, retryCount) * 100 + Math.random() * 100; // Exponential backoff with jitter
                    console.log(`Retrying transaction... Attempt ${retryCount}, waiting ${backoffDelay}ms`);
                    await new Promise(res => setTimeout(res, backoffDelay));
                    return await executeTransaction();
                } else {
                    return res.status(409).send({ message: 'Write conflict error, please retry the transaction' });
                }
            }

            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error:', error);
                return res.status(400).send({ message: `Payment failed: ${error.message}` });
            }

            return res.status(400).send({ message: 'Payment failed.' });
        } finally {
            session.endSession();
        }
    };

    return await executeTransaction();
};
