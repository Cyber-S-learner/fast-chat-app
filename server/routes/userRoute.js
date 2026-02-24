import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js';
import { getAllLoggedInUsers, getLoggedInUserController, updateUserProfile } from '../controllers/userController.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/get-logged-user', authMiddleware, getLoggedInUserController)
router.get('/get-all-users', authMiddleware, getAllLoggedInUsers)
router.post('/update-profile', authMiddleware, upload.single('profilePic'), updateUserProfile)

export default router