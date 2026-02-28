import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Send, Phone, Video, MoreVertical, Smile, Check, CheckCheck, Image, X } from 'lucide-react'
import { createNewMessage, getAllMessages } from '../API_Calls/message.js'
import { hideLoader, showLoader } from '../redux/loaderSlice.js'
import moment from 'moment'
import { clearUnreadMessage } from '../API_Calls/chat.js'
import { setAllChats } from '../redux/userSlice.js'
import toast from 'react-hot-toast'
import Store from '../redux/store.js'
import { useSocket } from '../context/SocketContext.jsx'
import { SOCKET_EVENTS } from '../constants/socketEvents.js'
import EmojiPicker from 'emoji-picker-react'

const ChatArea = () => {
  const { selectedChat, user, allChats, onlineUsers } = useSelector((state) => state.userReducer)
  const dispatch = useDispatch();
  const socket = useSocket();

  const [message, setMessage] = useState('');
  const [allMessage, setAllMessage] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getOtherUser = () => {
    if (!selectedChat || !selectedChat.members || !user) return null

    return selectedChat.members.find(member => member._id !== user?._id)
  }

  const otherUser = getOtherUser()
  const isOnline = otherUser && user && onlineUsers.includes(otherUser._id)

  const onEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !imageFile) || !socket) return;

    try {
      const formData = new FormData();
      formData.append('chatId', selectedChat._id);
      formData.append('sender', user._id);
      if (message) formData.append('text', message);
      if (imageFile) formData.append('image', imageFile);

      const response = await createNewMessage(formData)

      if (response.success) {
        socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
          ...response.data,
          members: selectedChat?.members?.map(a => a?._id)
        })

        setMessage('')
        setImageFile(null)
        setImagePreview('')
        setShowEmojiPicker(false)

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
      toast.error(error.message)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
    }
  }


  const allMessages = async () => {
    try {
      const response = await getAllMessages(selectedChat?._id)
      if (response.success) {
        setAllMessage(response.data)
      }
    } catch (error) {
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
    if (!socket) return;
    try {
      socket.emit(SOCKET_EVENTS.CLEAR_UNREAD_MESSAGE, {
        chatId: selectedChat?._id,
        members: selectedChat?.members?.map(a => a?._id)
      })

      const response = await clearUnreadMessage(selectedChat?._id)

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
    }
  }

  useEffect(() => {
    if (!selectedChat) return;

    allMessages();
    clearUnreadMessageCount()

    if (!socket) return;

    const handleReceiveMessage = (data) => {
      const currentSelectedChat = Store?.getState().userReducer?.selectedChat;

      if (currentSelectedChat?._id === data?.chatId) {
        setAllMessage(prev => [...prev, data]);
        if (data.sender !== user?._id) {
          clearUnreadMessageCount();
        }
      }
    };

    const handleMessageCountCleared = (data) => {
      const currentSelectedChat = Store.getState()?.userReducer?.selectedChat;
      const currentAllChats = Store.getState()?.userReducer?.allChats;

      if (currentSelectedChat?._id === data?.chatId) {
        const updatedChats = currentAllChats.map(chat => {
          if (chat?._id === data?.chatId) {
            return { ...chat, unReadMessagesCount: 0 }
          }
          return chat
        })
        dispatch(setAllChats(updatedChats));

        setAllMessage(prev => {
          return prev.map(msg => {
            return { ...msg, read: true }
          })
        })
      }
    };

    const handleTyping = (data) => {
      const currentSelectedChat = Store?.getState().userReducer?.selectedChat;
      if (currentSelectedChat?._id === data?.chatId && data?.sender !== user?._id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_COUNT_CLEARED, handleMessageCountCleared);
    socket.on(SOCKET_EVENTS.TYPING, handleTyping);

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_COUNT_CLEARED, handleMessageCountCleared);
      socket.off(SOCKET_EVENTS.TYPING, handleTyping);
    }
  }, [selectedChat, socket])

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
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#121212] ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-white font-semibold text-lg">
              {otherUser ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}` : 'User'}
            </h3>
            {isTyping ? (
              <p className="text-orange-500 text-sm animate-pulse">Typing...</p>
            ) : (
              <p className="text-gray-400 text-sm">{isOnline ? 'Online' : 'Offline'}</p>
            )}
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
          allMessage.map((msg, index) => {
            const isCurrentUser = msg?.sender === user?._id;
            if (!isCurrentUser) {
              return (
                <div key={msg._id || index} className="flex justify-start">
                  <div className="max-w-[70%] bg-[#2A2A2A] rounded-lg rounded-tl-none px-4 py-3 shadow-md">
                    {msg.image && (
                      <img src={msg.image} alt="Sent" className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.image, '_blank')} />
                    )}
                    {msg.text && <p className="text-white text-sm">{msg.text}</p>}
                    <span className="text-gray-500 text-xs mt-1 block">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              )
            }
            else {
              return (
                <div key={msg._id || index} className="flex justify-end">

                  <div className="max-w-[70%] bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg rounded-tr-none px-4 py-3 shadow-md">
                    {msg.image && (
                      <img src={msg.image} alt="Sent" className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.image, '_blank')} />
                    )}
                    {msg.text && <p className="text-white text-sm">{msg.text}</p>}
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
      <div className="bg-[#121212] border-t border-[#2A2A2A] px-6 py-4 relative">
        {/* Image Preview */}
        {imagePreview && (
          <div className="absolute bottom-full left-0 w-full bg-[#121212] border-t border-[#2A2A2A] p-4 flex items-center space-x-4 animate-in slide-in-from-bottom duration-300">
            <div className="relative group">
              <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-[#2A2A2A]" />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview('');
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs truncate">{imageFile?.name}</p>
              <p className="text-gray-500 text-[10px]">{(imageFile?.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-20 left-6 z-50">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme="dark"
              searchDisabled={false}
              skinTonesDisabled={true}
              height={400}
              width={300}
            />
          </div>
        )}

        <form className="flex items-center space-x-3">
          {/* Emoji Button */}
          <button
            type="button"
            className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'bg-gray-800 text-orange-500' : 'text-gray-400 hover:text-orange-500 hover:bg-gray-800'}`}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={22} />
          </button>

          {/* Image Upload Button */}
          <label className="p-2 rounded-full cursor-pointer transition-colors text-gray-400 hover:text-orange-500 hover:bg-gray-800">
            <Image size={22} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {/* Message Input */}
          <div className="flex-1 relative group">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (socket && selectedChat) {
                  socket.emit(SOCKET_EVENTS.TYPING, {
                    chatId: selectedChat?._id,
                    sender: user?._id,
                    members: selectedChat?.members?.map(m => m?._id),
                    isTyping: true
                  });

                  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

                  typingTimeoutRef.current = setTimeout(() => {
                    socket.emit(SOCKET_EVENTS.TYPING, {
                      chatId: selectedChat?._id,
                      sender: user?._id,
                      members: selectedChat?.members?.map(m => m?._id),
                      isTyping: false
                    });
                  }, 2000);
                }
              }}
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