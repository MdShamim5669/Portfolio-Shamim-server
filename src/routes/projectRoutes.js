import express from 'express';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../controllers/projectController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', verifyToken, requireAdmin, createProject);
router.put('/:id', verifyToken, requireAdmin, updateProject);
router.delete('/:id', verifyToken, requireAdmin, deleteProject);

export default router;
