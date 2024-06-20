import express from 'express';
import { Request, Response } from 'express';
import { Payment } from '../controllers/payment';

const router = express.Router();

router.post("/", (req: Request, res: Response) => Payment(req, res));

export default router;