import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { createNewChat, getAllChats, clearUnreadMessage } from '../controllers/chatController.js'

const router = express.Router()

router.post('/create-new-chat',authMiddleware,createNewChat)
router.get('/get-all-chats',authMiddleware,getAllChats)
router.post('/clear-unread-message',authMiddleware,clearUnreadMessage)

export default router