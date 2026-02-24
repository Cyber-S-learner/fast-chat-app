import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User, MessageSquare } from 'lucide-react'
import { clearUnreadMessage, createNewChat } from '../API_Calls/chat.js'
import { hideLoader, showLoader } from '../redux/loaderSlice.js'
import { setAllChats, setSelectedChat } from '../redux/userSlice.js'
import { toast } from 'react-hot-toast'
import moment from 'moment'
import { useEffect } from 'react'
import Store from '../redux/store.js'


import { useSocket } from '../context/SocketContext.jsx'
import { SOCKET_EVENTS } from '../constants/socketEvents.js'

const UsersList = ({ searchKey }) => {
    const { allUsers, allChats, user: currentUser, selectedChat, onlineUsers } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const socket = useSocket()

    const startNewchat = async (searchUserId) => {
        if (!currentUser) return;
        let response = null;
        try {
            response = await createNewChat([currentUser._id, searchUserId]);
            if (response.success) {
                toast.success(response.message)
                const newChat = response.data;
                const updatedChat = [...allChats, newChat]
                dispatch(setAllChats(updatedChat))
                dispatch(setSelectedChat(newChat))
            }
            else {
                toast.error(response.message)
            }

        } catch (error) {

        }
    }

    const openChat = (selectedUserId) => {
        if (!currentUser) return;
        const chat = allChats.find(chat => chat.members.map(a => a._id).includes(currentUser._id) &&
            chat.members.map(a => a._id).includes(selectedUserId))

        if (chat) {
            dispatch(setSelectedChat(chat))
        }
    }

    const getLastMessage = (userId, chatObj = null) => {
        if (!currentUser) return "";
        const chat = chatObj || allChats.find(chat => chat.members.map(a => a._id).includes(userId))

        if (!chat || !chat.lastMessage) {
            return ""
        }

        const isMine = chat.lastMessage.sender === currentUser._id;
        const prefix = isMine ? "You: " : "";

        let messageBody = chat.lastMessage.text || "";
        if (!messageBody && chat.lastMessage.image) {
            messageBody = "📷 Photo";
        }

        return (prefix + messageBody).substring(0, 25)
    }

    const getLastMessageTimeStamp = (userId, chatObj = null) => {
        if (!currentUser) return "";
        const chat = chatObj || allChats.find(chat => chat.members.map(a => a._id).includes(userId))
        if (!chat || !chat.lastMessage)
            return "";
        return moment(chat?.lastMessage?.createdAt).format('hh:mm A')
    }



    const getData = () => {
        if (!currentUser) return [];

        // 1. Get and sort all chats by most recent activity
        const sortedChats = [...allChats].sort((a, b) => {
            const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.updatedAt);
            const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.updatedAt);
            return dateB - dateA;
        });

        // 2. Extract unique users from sorted chats (preserving sort order)
        const chatList = []
        const userIdsInChats = new Set()

        sortedChats.forEach(chat => {
            const otherUser = chat.members.find(mem => mem._id !== currentUser._id)
            if (otherUser && !userIdsInChats.has(otherUser._id)) {
                userIdsInChats.add(otherUser._id)
                chatList.push(chat)
            }
        })

        // 3. Handle Filtering
        if (searchKey === "") {
            return chatList
        }

        // Search mode: Filter chats and then add matching users from global list
        const filteredChats = chatList.filter(chat => {
            const otherUser = chat.members.find(mem => mem._id !== currentUser._id)
            return (
                otherUser.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
                otherUser.lastName.toLowerCase().includes(searchKey.toLowerCase())
            )
        })

        const matchingNewUsers = allUsers.filter(user => {
            return (
                user._id !== currentUser._id &&
                !userIdsInChats.has(user._id) &&
                (user.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
                    user.lastName.toLowerCase().includes(searchKey.toLowerCase()))
            )
        })

        return [...filteredChats, ...matchingNewUsers]
    }

    useEffect(() => {
        if (!socket || !currentUser) return;

        const handleReceiveMessage = (message) => {
            const selectedChat = Store.getState().userReducer.selectedChat;
            const allChats = Store.getState().userReducer.allChats;

            // Update the chat in allChats with the new message and potentially update unread count
            const updatedChats = allChats.map(chat => {
                if (chat._id === message.chatId) {
                    return {
                        ...chat,
                        unReadMessagesCount: (selectedChat?._id !== message.chatId && message.sender !== currentUser?._id)
                            ? (chat?.unReadMessagesCount || 0) + 1
                            : (chat?.unReadMessagesCount || 0),
                        lastMessage: message
                    }
                }
                return chat
            });

            // Move the updated chat to the top of the list
            const latestChat = updatedChats.find(chat => chat?._id === message.chatId);
            const otherChats = updatedChats.filter(chat => chat?._id !== message.chatId);

            dispatch(setAllChats([latestChat, ...otherChats]));
        };

        socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);

        return () => {
            socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
        };
    }, [socket, allChats, selectedChat, currentUser])


    const data = getData()

    return (
        <div className="flex flex-col gap-3 mt-4 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
            {data.length > 0 ? (
                data.map((obj) => {
                    let user = obj
                    let chat = null
                    if (obj.members) {
                        chat = obj
                        user = obj.members.find(mem => mem._id !== currentUser._id)
                    } else {
                        // If it's just a user from search, find if a chat already exists for them
                        chat = allChats.find(c => c.members.some(m => m._id === user._id))
                    }

                    // Check if this user is part of the selected chat
                    const isSelected = selectedChat && selectedChat.members &&
                        selectedChat.members.map(m => m._id).includes(user._id)

                    const isOnline = onlineUsers.includes(user._id);

                    return (
                        <div
                            onClick={() => openChat(user._id)}
                            key={user._id}
                            className={`relative flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer border group ${isSelected
                                ? 'bg-orange-600/20 border-orange-600/50 hover:bg-orange-600/30'
                                : 'border-transparent hover:bg-[#2A2A2A] hover:border-[#333333]'
                                }`}
                        >
                            {/* Unread Message Count Badge */}
                            {chat && chat.unReadMessagesCount > 0 && chat.lastMessage?.sender !== currentUser._id && (
                                <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold rounded-full min-w-[19px] h-5 flex items-center justify-center px-1.5 shadow-lg border border-orange-500 z-5">
                                    {chat.unReadMessagesCount}
                                </div>
                            )}

                            {/* Avatar */}
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${isSelected
                                    ? 'bg-orange-600/30 border-orange-600/50 text-orange-400'
                                    : 'bg-orange-600/10 border-orange-600/20 text-orange-500'
                                    } border border-[#2A2A2A]`}>
                                    {user.profilePic ? (
                                        <img src={user.profilePic} alt={user.firstName} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-lg">{user.firstName?.[0]?.toUpperCase() + user.lastName?.[0]?.toUpperCase() || <User size={20} />}</span>
                                    )}
                                </div>
                                {isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#1E1E1E] group-hover:border-[#2A2A2A]"></div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-medium truncate transition-colors ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                                    }`}>
                                    {user.firstName} {user.lastName}
                                </h3>
                                <div className='flex justify-between items-center'>
                                    <p className={`text-sm truncate ${isSelected ? 'text-orange-300' : 'text-gray-500 group-hover:text-gray-400'
                                        }`}>
                                        {getLastMessage(user._id, chat) || user.email}
                                    </p>
                                    <span className={`text-xs ml-2 flex-shrink-0 ${isSelected ? 'text-orange-300' : 'text-gray-500 group-hover:text-gray-400'
                                        }`}>{getLastMessageTimeStamp(user._id, chat)}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {!allChats.find((chat) => chat.members.map(a => a._id).includes(user._id)) ? <button onClick={() => startNewchat(user._id)} className="p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 shadow-md transition-all"><MessageSquare size={15} /></button> : ''}

                        </div>
                    )
                })
            ) : (
                <div className="text-center text-gray-500 py-10">
                    <p>No {searchKey ? "users" : "chats"} found</p>
                </div>
            )}
        </div>
    )
}

export default UsersList