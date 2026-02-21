import tryErrorHandler from "../handlers/try-errorHandler.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js";

const createNewChat = async (req, res) => {
    try {
        const newChat = new Chat(req.body);
        const savedChat = await newChat.save()

        res.status(201).json({
            message: "Chat created successfully",
            success: true,
            data: savedChat

        })
    } catch (error) {
        res.status(400).json(tryErrorHandler(error))
    }
}

const getAllChats = async (req, res) => {
    try {
        const allChats = await Chat.find({ members: { $in: req.user._id } }).select('-__v')
            .populate('members').populate('lastMessage')


        res.status(200).json({
            message: "All chats fetched successfully",
            success: true,
            data: allChats
        })
    } catch (error) {
        res.status(400).json(tryErrorHandler(error))
    }
}

export const clearUnreadMessage = async(req,res)=>{
    try {
        const chatId = req.body.chatId
        const chat = await Chat.findById(chatId)
        if(!chat)
        {
            return res.status(400).json({
                message : 'Chat does not exist',
                success : false
            })
        }

        const udpatedChat = await Chat.findByIdAndUpdate(chatId,{unReadMessagesCount:0},{new : true})
        .populate('members')
        .populate('lastMessage')
        await Message.updateMany({chatId:chatId,read:false},{read:true})

        res.send({
            message:'unread message count updated successfully',
            success :true,
            data: udpatedChat
        })
        
    } catch (error) {
         res.status(400).json(tryErrorHandler(error))
    }
}

export { createNewChat, getAllChats }