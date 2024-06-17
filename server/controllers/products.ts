import { Request, Response } from "express";
import Product from "../models/productModel";

export const AddProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reqBody = req.body;
        const product = new Product({
            name: reqBody.name,
            price: parseInt(reqBody.price),
            stock: parseInt(reqBody.stock),
            image: req.file?.filename,
            category: reqBody.category
        });

        const savedProduct = await product.save();
        return res.status(201).send({ product: savedProduct });
    } catch (err) {
        return res.status(500).send({ message: `Backend error: ${err}` });
    }
};

export const GetProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const products = await Product.find();
        return res.status(200).send({ count: products.length, products });
    } catch (err) {
        return res.status(500).send({ message: "Server Error." });
    }
};

export const GetProductById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: "Product not found." });
        }
        return res.status(200).send(product);
    } catch (err) {
        return res.status(500).send({ message: "Product not found." });
    }
};

export const UpdateProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found." });
        }
        return res.status(200).send({ message: "Product Updated Successfully.", product: updatedProduct });
    } catch (err) {
        return res.status(500).send({ message: "Product Not Found." });
    }
};

export const DeleteProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ message: "Product not found." });
        }
        return res.status(200).send({ message: "Product Deleted Successfully." });
    } catch (err) {
        return res.status(500).send({ message: "Server Error." });
    }
};