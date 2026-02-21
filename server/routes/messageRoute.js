import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { getAllMessagesController, newMessageController } from '../controllers/messageController.js'
const router = express.Router()

router.post('/new-message',authMiddleware,newMessageController)
router.get('/all-messages/:id',authMiddleware,getAllMessagesController)

export default router