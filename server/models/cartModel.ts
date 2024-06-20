import { Schema, model, Document } from 'mongoose';

// Interface representing a cart document in MongoDB
interface ICart extends Document {
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
    productId: string;
}

// Schema definition for the cart model
const cartSchema = new Schema<ICart>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    }
});

// Creating the cart model from the schema
const Cart = model<ICart>('Cart', cartSchema);

export default Cart;
export { ICart };
