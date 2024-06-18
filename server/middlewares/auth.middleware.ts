import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        user_id: string;
        email: string;
        username: string;
    };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        console.log("No token");
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY as string) as {
            user_id: string;
            email: string;
            username: string;
        };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default authMiddleware;
