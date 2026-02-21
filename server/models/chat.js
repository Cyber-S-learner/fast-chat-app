import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    members: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },

    unReadMessagesCount: {
        type: mongoose.Schema.Types.Number,
        default: 0
    }

}, { timestamps: true })

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;