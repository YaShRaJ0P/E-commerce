import { Request, Response } from "express";
import Cart, { ICart } from "../models/cartModel";
import Product, { IProduct } from "../models/productModel";

export const AddToCart = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reqBody = req.body;
        const productId = reqBody.id;
        const product: IProduct | null = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found." });
        }
        console.log(product);

        const cartProduct: ICart = new Cart({
            name: product.name,
            price: product.price,
            quantity: reqBody.quantity,
            image: product.image,
            category: product.category,
            productId: productId
        });
        const savedCartProduct = await cartProduct.save();

        return res.status(201).send({ id: savedCartProduct.id });
    } catch (err) {
        return res.status(500).send({ message: `Backend error: ${err}` });
    }
};

export const GetCartProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const cartProducts = await Cart.find();
        return res.status(200).send({ count: cartProducts.length, cartProducts });
    } catch (err) {
        return res.status(500).send({ message: "Server Error." });
    }
};

export const RemoveFromCart = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await Cart.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ message: "Product not found." });
        }
        return res.status(200).send({ message: "Removed from Cart." });
    } catch (err) {
        return res.status(500).send({ message: "Server Error." });
    }
};

export const UpdateQuantity = async (req: Request, res: Response): Promise<Response> => {
    try {
        const quantity = req.body.quantity;
        const result = await Cart.findByIdAndUpdate(req.params.id, quantity);
        if (!result) {
            return res.status(404).send({ message: "Product not found." });
        }
        return res.status(200).send({ message: "Quantity Updated" });
    } catch (err) {
        return res.status(500).send({ message: "Server Error." });
    }
};