import express from 'express';
import { SignUp, LogIn, DeleteUser, Logout } from '../controllers/user';

const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', LogIn);
router.post('/logout', Logout);
router.delete('/:id', DeleteUser);

export default router;
