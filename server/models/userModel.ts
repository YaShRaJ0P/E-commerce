import { Schema, Document, model } from 'mongoose';

// Interface representing a user document in MongoDB
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    productsList: string[];
}

// Schema definition for the user model
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        productsList: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Creating the user model from the schema
const User = model<IUser>('User', userSchema);

export default User;
export { IUser };
