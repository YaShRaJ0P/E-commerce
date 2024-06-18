import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface representing a user document in MongoDB
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    cartsList: Schema.Types.ObjectId[];
    token?: string;
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
        cartsList: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Cart'
            }
        ],
    },
    {
        timestamps: true,
    }
);

// Password encryption before saving the user model
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to match user entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Creating the user model from the schema
const User = model<IUser>('User', userSchema);

export default User;
