import express from 'express';
import {
  getCampusMoments,
  getCampusMomentById,
  createCampusMoment,
  updateCampusMoment,
  deleteCampusMoment,
} from '../controllers/campusMomentController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCampusMoments);
router.get('/:id', getCampusMomentById);

// Admin routes with Multer multiple file upload support (up to 10 photos per request)
router.post('/', verifyToken, requireAdmin, upload.array('images', 10), createCampusMoment);
router.put('/:id', verifyToken, requireAdmin, upload.array('images', 10), updateCampusMoment);
router.delete('/:id', verifyToken, requireAdmin, deleteCampusMoment);

export default router;
