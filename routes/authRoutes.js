
import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();        // ← bikin instance baru
router.post('/register', register);
router.post('/login',    login);
router.post('/logout',   authMiddleware, logout);

export default router;
