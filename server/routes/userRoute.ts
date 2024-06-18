import express from 'express';
import { SignUp, LogIn, DeleteUser, Logout, checkAuthentication } from '../controllers/user';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', LogIn);
router.post('/logout', Logout);
router.delete('/:id', DeleteUser);
router.get("/check", authMiddleware, checkAuthentication)

export default router;
