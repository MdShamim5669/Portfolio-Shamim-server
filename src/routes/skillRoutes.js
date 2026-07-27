import express from 'express';
import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from '../controllers/skillController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', verifyToken, requireAdmin, createSkill);
router.put('/:id', verifyToken, requireAdmin, updateSkill);
router.delete('/:id', verifyToken, requireAdmin, deleteSkill);

export default router;
