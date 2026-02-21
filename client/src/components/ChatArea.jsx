import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Send, Phone, Video, MoreVertical, Smile, Check, CheckCheck } from 'lucide-react'
import { createNewMessage, getAllMessages } from '../API_Calls/message.js'
import { hideLoader, showLoader } from '../redux/loaderSlice.js'
import moment from 'moment'
import { clearUnreadMessage } from '../API_Calls/chat.js'
import { setAllChats } from '../redux/userSlice.js'
const ChatArea = () => {
  const { selectedChat, user, allChats } = useSelector((state) => state.userReducer)
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [allMessage, setAllMessage] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getOtherUser = () => {
    if (!selectedChat || !selectedChat.members || !user) return null

    return selectedChat.members.find(member => member._id !== user._id)
  }

  const otherUser = getOtherUser()

  const sendMessage = async (e) => {
    e.preventDefault();
    let response = null;
    dispatch(showLoader());
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message
      }

      response = await createNewMessage(newMessage)
      dispatch(hideLoader());
      if (response.success) {
        setMessage('')
        // Update allChats with the new lastMessage
        const updatedChats = allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return {
              ...chat,
              lastMessage: response.data,
              unReadMessagesCount: 0 // Reset since we are in the chat
            }
          }
          return chat
        })
        dispatch(setAllChats(updatedChats))
      }
    } catch (error) {
      dispatch(hideLoader())


    }
  }


  const allMessages = async () => {
    let response = null;
    dispatch(showLoader());
    try {

      response = await getAllMessages(selectedChat._id)

      dispatch(hideLoader());
      if (response.success) {
        setAllMessage(response.data)
      }

    } catch (error) {
      dispatch(hideLoader())


    }
  }

  const formatTime = (timestamp) => {
    const now = moment()
    const diff = now.diff(moment(timestamp), 'days')
    if (diff < 1) {
      return `Today ${moment(timestamp).format('hh:mm A')}`
    }
    else if (diff == 1) {
      return `Yesterday ${moment(timestamp).format('hh:mm A')}`
    } else {
      return moment(timestamp).format('MMM D, hh:mm A')
    }
  }

  const clearUnreadMessageCount = async () => {
    let response = null;
    try {
      dispatch(showLoader())
      response = await clearUnreadMessage(selectedChat._id)
      dispatch(hideLoader())
      if (response.success) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data
          }
          return chat
        })
        dispatch(setAllChats(updatedChats))
      }
    } catch (error) {
      dispatch(hideLoader())

    }
  }





  useEffect(() => {
    allMessages();
    clearUnreadMessageCount()
  }, [selectedChat])

  useEffect(() => {
    scrollToBottom();
  }, [allMessage]);


  // If no chat is selected, show a placeholder
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1E1E1E] text-gray-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to Fast Chat</h2>
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1E1E1E] border-l border-[#2A2A2A]">
      {/* User Details Header */}
      <div className="bg-[#121212] border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {otherUser ? `${otherUser.firstName?.[0] || ''}${otherUser.lastName?.[0] || ''}` : 'U'}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]"></div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-white font-semibold text-lg">
              {otherUser ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}` : 'User'}
            </h3>
            <p className="text-gray-400 text-sm">Online</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-orange-500">
            <Phone size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-orange-500">
            <Video size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-orange-500">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#1E1E1E] custom-scrollbar">
        {/* Sample messages - replace with actual messages from your backend */}

        {
          allMessage.map((msg) => {
            const isCurrentUser = msg.sender === user._id;
            if (!isCurrentUser) {
              return (
                <div key={msg._id} className="flex justify-start">
                  <div className="max-w-[70%] bg-[#2A2A2A] rounded-lg rounded-tl-none px-4 py-3 shadow-md">
                    <p className="text-white text-sm">{msg.text}</p>
                    <span className="text-gray-500 text-xs mt-1 block">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              )
            }
            else {
              return (
                <div key={msg._id} className="flex justify-end">

                  <div className="max-w-[70%] bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg rounded-tr-none px-4 py-3 shadow-md">
                    <p className="text-white text-sm">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-orange-100 text-xs">{formatTime(msg.createdAt)}</span>
                      {msg.read ? (
                        <CheckCheck size={15} className="text-orange-100" />
                      ) : (
                        <Check size={14} className="text-orange-100 opacity-70" />
                      )}
                    </div>
                  </div>
                </div>
              )
            }
          })
        }
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="bg-[#121212] border-t border-[#2A2A2A] px-6 py-4">
        <form className="flex items-center space-x-3">
          {/* Emoji Button */}
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-orange-500"
          >
            <Smile size={22} />
          </button>

          {/* Message Input */}
          <div className="flex-1 relative group">
            <input
              type="text"

              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-[#2A2A2A] border border-[#2A2A2A] text-white py-3 px-4 rounded-lg focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500 text-sm"
            />
          </div>

          {/* Send Button */}
          <button

            className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg shadow-lg transform transition hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={(e) => sendMessage(e)}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatArea