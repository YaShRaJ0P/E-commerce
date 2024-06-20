import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productsRoute from "./routes/productsRoute";
import cartRoute from "./routes/cartRoute";
import Product from "./models/productModel";
import { getFilteredProducts } from './controllers/filter';
import userRoute from "./routes/userRoute";
import cookieParser from 'cookie-parser';
import authMiddleware from './middlewares/auth.middleware';
import paymentRoute from "./routes/paymentRoute";
dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:5173']; // Frontend origin

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("images"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.use("/products", productsRoute);
app.use("/cart", authMiddleware, cartRoute);
app.get("/filter", (req: Request, res: Response) => getFilteredProducts(req, res));
app.get("/category", async (req: Request, res: Response): Promise<Response> => {
  try {
    const uniqueCategories = await Product.distinct("category");
    return res.status(200).send({ categories: uniqueCategories });
  } catch (err) {
    return res.status(500).send({ message: "Server Error." });
  }
});
app.use("/auth", userRoute);
app.use("/payment", paymentRoute);

app.get("/config", async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log(process.env.STRIPE_PUBLISHABLE_KEY);
    if (!process.env.STRIPE_PUBLISHABLE_KEY) {
      throw new Error("STRIPE_PUBLISHABLE_KEY is not defined in the environment variables");
    }
    return res.status(200).send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
  } catch (error) {
    console.error("Error in /config route:", error);
    return res.status(500).send({ message: "Server Error." });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log("App connected to database");
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
