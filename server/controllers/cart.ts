import { Request, Response } from 'express';
import Product from '../models/productModel';
import User, { ICart } from '../models/userModel';
import { AuthRequest } from '../middlewares/auth.middleware';

export const AddToCart = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.user_id;
        const { id: productId, quantity } = req.body;

        // Validate input
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate quantity
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add product to cart
        const newCartItem = {
            productId,
            quantity
        };

        user.cartsList.push(newCartItem);
        await user.save();

        return res.status(200).json({ message: "Product added to cart" });
    } catch (err) {
        console.error(`Backend error: ${err}`);
        return res.status(500).send({ message: `Backend error: ${err}` });
    }
};

export const GetCartProducts = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.user_id;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find the user by userId and populate cartsList with product details
        const user = await User.findById(userId).populate('cartsList.productId');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract cartsList from user
        const cartProducts = user.cartsList.map(cartItem => ({
            product: cartItem.productId,
            quantity: cartItem.quantity
        }));

        return res.status(200).json({ count: cartProducts.length, cartProducts });
    } catch (err) {
        console.error(`Server error: ${err}`);
        return res.status(500).json({ message: "Server Error." });
    }
};
export const RemoveFromCart = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.user_id;
        const cartItemId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId).populate('cartsList.productId');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(user.cartsList);

        const cartItemIndex = user.cartsList.findIndex(item => ((item as any).productId._id.toString()) === cartItemId);

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        user.cartsList.splice(cartItemIndex, 1);
        await user.save();

        return res.status(200).json({ message: "Removed from Cart." });
    } catch (err) {
        console.error(`Server error: ${err}`);
        return res.status(500).json({ message: "Server Error." });
    }
};
export const UpdateQuantity = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.user_id;
        const cartItemId = req.params.id;
        const { quantity } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        const user = await User.findById(userId).populate('cartsList.productId');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cartItem = user.cartsList.find(item => ((item as any).productId._id.toString()) === cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        console.log(cartItem.productId);
        const productStock = cartItem.productId.stock;

        if (quantity > productStock) {
            return res.status(400).json({ message: "Quantity exceeds available stock" });
        }

        cartItem.quantity = quantity;
        await user.save();

        return res.status(200).json({ message: "Quantity Updated" });
    } catch (err) {
        console.error(`Server error: ${err}`);
        return res.status(500).json({ message: "Server Error." });
    }
};

export const emptyCart = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user!.user_id;
        console.log(userId);
        const user = await User.findById(userId).populate('cartsList.productId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.cartsList = [];
        await user.save();
        return res.status(200);
    } catch (error) {
        return res.status(400).send({ message: "Server Error" });
    }
}