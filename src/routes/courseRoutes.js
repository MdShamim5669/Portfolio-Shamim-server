import express from 'express';
import {
  createCourse,
  deleteCourse,
  getCourses,
} from '../controllers/courseController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/', verifyToken, requireAdmin, createCourse);
router.delete('/:id', verifyToken, requireAdmin, deleteCourse);

export default router;
