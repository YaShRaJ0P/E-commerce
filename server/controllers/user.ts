import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
    user?: {
        user_id: string;
        email: string;
        username: string;
    };
}

const createToken = (user: any) => {
    if (!process.env.TOKEN_KEY)
        throw new Error('Token key is not defined');
    return jwt.sign(
        { user_id: user._id, email: user.email, username: user.username },
        process.env.TOKEN_KEY,
    );
};

export const SignUp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, email, password } = req.body;

        // Validate user input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All input is required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        // Create token
        const token = createToken(user);

        // Set user token in cookie
        res.cookie('token', token, {
            // httpOnly: true,
            // secure: process.env.NODE_ENV === 'production' 
        });
        res.redirect("/");
        // Send user info back to client
        return res.status(200).json({ message: 'Logged in successfully', username: user.username, id: user._id, token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const LogIn = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        // Validate user input
        if (!email || !password) {
            return res.status(400).json({ message: "All input is required" });
        }

        // Validate if user exists in our database
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            // Create token
            const token = createToken(user);

            // Set user token in cookie
            res.cookie('token', token, {
                // httpOnly: true,
                //  secure: process.env.NODE_ENV === 'production'
            });
            // res.redirect("/");
            // Send user info back to client
            return res.status(201).json({ message: 'User logged in successfully', username: user.username, id: user._id, token });
        }
        else
            return res.status(401).json({ message: "Invalid Credentials" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const Logout = (req: Request, res: Response): Response => {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.status(200).json({ message: "Logged out successfully" });
};


export const DeleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const checkAuthentication = async (req: AuthRequest, res: Response): Promise<Response> => {
    console.log(req.user);
    return res.status(200).json({ username: req.user!.username, id: req.user!.user_id });
}