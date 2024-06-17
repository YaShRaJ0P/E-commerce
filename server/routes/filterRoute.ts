import express, { Request, Response } from "express";
import {
    MaxPrice,
    Sort,
    Category,
} from "../controllers/filter";

const router = express.Router();

// Route for getting products below the price range
router.get("/price-range/:maxPrice", (req: Request, res: Response) => MaxPrice(req, res));

// Route to get products by sort type
router.get("/sort/:sortType", (req: Request, res: Response) => Sort(req, res));

// Route to get products of a specific category
router.get("/category/:category", (req: Request, res: Response) => Category(req, res));

export default router;
