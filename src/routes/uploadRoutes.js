import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, requireAdmin, upload.single('file'), uploadFile);

export default router;
