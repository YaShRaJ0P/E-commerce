import multer from "multer";
import path from "path";
import { Request } from "express";

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: Function) {
        cb(null, "./images/uploads");
    },
    filename: function (req: Request, file: Express.Multer.File, cb: Function) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

// Create multer instance for file upload
const upload = multer({ storage: storage });

export { upload };