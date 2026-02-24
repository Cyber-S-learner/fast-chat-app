import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { getAllMessagesController, newMessageController } from '../controllers/messageController.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/new-message', authMiddleware, upload.single('image'), newMessageController)
router.get('/all-messages/:id', authMiddleware, getAllMessagesController)

export default router