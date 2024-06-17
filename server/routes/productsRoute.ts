import express, { Request, Response } from "express";
import {
    AddProduct,
    GetProducts,
    GetProductById,
    UpdateProduct,
    DeleteProduct
} from "../controllers/products";
import { upload } from "../middlewares/multer.middleware";

const router = express.Router();

// Route for saving a new product
router.post("/", upload.single("image"), (req: Request, res: Response) => AddProduct(req, res));

// Route to get all products
router.get("/", (req: Request, res: Response) => GetProducts(req, res));

// Route to get a product by id
router.get("/:id", (req: Request, res: Response) => GetProductById(req, res));

// Route to update a product
router.put("/:id", (req: Request, res: Response) => UpdateProduct(req, res));

// Route to delete a product
router.delete("/:id", (req: Request, res: Response) => DeleteProduct(req, res));

export default router;
