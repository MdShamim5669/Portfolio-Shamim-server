import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/', verifyToken, requireAdmin, updateProfile);

export default router;
