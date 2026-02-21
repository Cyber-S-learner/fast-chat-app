import tryErrorHandler from "../handlers/try-errorHandler.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js"

const newMessageController = async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        const currentChat = await Chat.findByIdAndUpdate(
            { _id: savedMessage.chatId},
            {
                lastMessage: savedMessage._id,
                $inc: { unReadMessagesCount: 1 }
            }
        )

        res.status(201).json({
            message: "message saved successfully",
            success: true,
            data: savedMessage
        })
    } catch (error) {
        res.status(400).json(tryErrorHandler(error))
    }



}

const getAllMessagesController = async (req,res)=>{
    try {
        
        const allMessages = await Message.find({chatId : req.params.id}).select('-__v').sort({createdAt : 1})

    res.status(200).json({
        message : "Messages fetched successfully",
        success : true,
        data : allMessages
    })

    } catch (error) {
        res.status(400).json(tryErrorHandler(error))
    }



}

export {newMessageController, getAllMessagesController}