import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js';
import { getAllLoggedInUsers, getLoggedInUserController } from '../controllers/userController.js';
const router = express.Router();

router.get('/get-logged-user',authMiddleware,getLoggedInUserController)
router.get('/get-all-users',authMiddleware,getAllLoggedInUsers)
export default router