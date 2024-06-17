import express, { Request, Response } from "express";
import {
    AddToCart,
    GetCartProducts,
    RemoveFromCart,
} from "../controllers/cart";

const router = express.Router();

// Route for saving a new product
router.post("/", (req: Request, res: Response) => AddToCart(req, res));

// Route to get all products
router.get("/", (req: Request, res: Response) => GetCartProducts(req, res));

// Route to delete a product
router.delete("/:id", (req: Request, res: Response) => RemoveFromCart(req, res));

export default router;
