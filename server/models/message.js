import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    chatId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Chat"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },

    text: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    image: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    read: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    }

}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)
export default Message