import { Schema, Document, model, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IProduct } from './productModel';
import { cartSchema } from './cartModel';



// Interface representing a user document in MongoDB
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    token?: string;
    cartsList: Array<{ productId: IProduct; quantity: number }>;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
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
        cartsList: [cartSchema],
    },
    {
        timestamps: true,
    }
);

// Password encryption before saving the user model
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as CallbackError);
    }
});
// Method to match user entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

// Creating the user model from the schema
const User = model<IUser>('User', userSchema);

export default User;
