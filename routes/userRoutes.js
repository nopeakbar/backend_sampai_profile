import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getUsers, getProfile, getUserById,
  updateProfile, changePassword,
  createUser, updateUser, deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Static routes sebelum dynamic `/:id`
 router.get('/profile', authMiddleware, getProfile)
 router.put('/profile/update', authMiddleware, updateProfile)
 router.put('/profile/change-password', authMiddleware, changePassword)
 // Dynamic
 router.get('/:id', authMiddleware, getUserById)
// Dynamic by ID
router.get('/',      authMiddleware, getUsers);
router.get('/:id',   authMiddleware, getUserById);
router.put('/:id',   authMiddleware, updateUser);
router.delete('/:id',authMiddleware, deleteUser);

// Create user (admin)
router.post('/', createUser);

export default router;