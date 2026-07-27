import express from 'express';
import { getMe, login } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', verifyToken, getMe);

export default router;
