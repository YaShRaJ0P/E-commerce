import { Schema, model, Document } from 'mongoose';

// Interface representing a product document in MongoDB
interface IProduct extends Document {
    name: string;
    price: number;
    stock: number;
    image: string;
    category: string;
}

// Schema definition for the product model
const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
});


// Creating the product model from the schema
const Product = model<IProduct>('Product', productSchema);

export default Product;
export { IProduct };
