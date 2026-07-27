import express from 'express';
import { getThesis, updateThesis } from '../controllers/thesisController.js';
import { requireAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getThesis);
router.put('/', verifyToken, requireAdmin, updateThesis);

export default router;
