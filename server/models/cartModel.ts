import { Schema, Document, model } from 'mongoose';
export interface ICart extends Document {
    productId: Schema.Types.ObjectId;
    quantity: number;
}

export const cartSchema = new Schema<ICart>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
});

// Creating the cart model from the schema
const Cart = model<ICart>('Cart', cartSchema);

export default Cart;