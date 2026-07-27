import express from 'express';
import {
  createExperience,
  deleteExperience,
  getExperiences,
} from '../controllers/experienceController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getExperiences);
router.post('/', verifyToken, requireAdmin, createExperience);
router.delete('/:id', verifyToken, requireAdmin, deleteExperience);

export default router;
