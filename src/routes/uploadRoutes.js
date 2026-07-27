import express from 'express';
import { deleteFile, uploadFile } from '../controllers/uploadController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, requireAdmin, upload.single('file'), uploadFile);
router.delete('/', verifyToken, requireAdmin, deleteFile);

export default router;
