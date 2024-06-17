import { Request, Response } from "express";
import Product from "../models/productModel";

export const getFilteredProducts = async (req: Request, res: Response) => {
    const { category, priceRange, sort } = req.query;

    try {
        let products = await Product.find();

        if (category && category != "All") {
            products = products.filter((product) => product.category === category);
        }

        if (priceRange) {
            const maxPrice = parseInt(priceRange as string, 10);
            if (maxPrice !== 0)
                products = products.filter((product) => product.price <= maxPrice);
        }

        if (sort) {
            switch (sort) {
                case "Ascending":
                    products = products.sort((a, b) => a.price - b.price);
                    break;
                case "Descending":
                    products = products.sort().reverse();
                    break;
                case "Latest":
                    break;
                default:
                    throw new Error(`Invalid sort type: ${sort}`);
            }
        }

        return res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch filtered products", error });
    }
};