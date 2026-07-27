import express from 'express';
import {
  deleteMessage,
  getMessages,
  sendMessage,
} from '../controllers/messageController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/', verifyToken, requireAdmin, getMessages);
router.delete('/:id', verifyToken, requireAdmin, deleteMessage);

export default router;
