import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productsRoute from "./routes/productsRoute";
import cartRoute from "./routes/cartRoute";
import { Request, Response } from 'express';
import Product from "./models/productModel";
import { getFilteredProducts } from './controllers/filter';
import userRoute from "./routes/userRoute";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// const corsOptions = {
//     origin: "https://bookstore-frontend-two.vercel.app",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     allowedHeaders: ["Content-Type"],
//     credentials: true,
// };

app.use(cors());
app.use(express.json());
app.use(express.static("images"))
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.use("/products", productsRoute);
app.use("/cart", cartRoute);
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
