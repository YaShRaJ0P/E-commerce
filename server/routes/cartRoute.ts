import express, { Request, Response } from "express";
import { AddToCart, GetCartProducts, RemoveFromCart, UpdateQuantity, emptyCart } from '../controllers/cart';

const router = express.Router();

// Route for saving a new product
router.post("/", (req: Request, res: Response) => AddToCart(req, res));

// Route to get all products
router.get("/", (req: Request, res: Response) => GetCartProducts(req, res));

// Route to delete a product
router.delete("/:id", (req: Request, res: Response) => RemoveFromCart(req, res));

//Route to update quantity
router.patch("/:id", (req: Request, res: Response) => UpdateQuantity(req, res));

//Route to empty cart
router.post("/empty", (req: Request, res: Response) => emptyCart(req, res));

export default router;
