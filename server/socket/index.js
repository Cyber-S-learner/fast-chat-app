import { Server } from "socket.io";
import { SOCKET_EVENTS } from "./constants.js";

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    const onlineUsers = new Set();

    io.on("connection", (socket) => {

        socket.on(SOCKET_EVENTS.JOIN_ROOM, (userId) => {
            socket.join(userId);
            onlineUsers.add(userId);
            io.emit(SOCKET_EVENTS.ONLINE_USERS_UPDATED, Array.from(onlineUsers));
        });

        socket.on(SOCKET_EVENTS.SEND_MESSAGE, (message) => {
            // Emit to all participants in the chat dynamically
            if (message.members && Array.isArray(message.members)) {
                message.members.forEach(memberId => {
                    io.to(memberId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);
                });
            }
        });

        socket.on(SOCKET_EVENTS.CLEAR_UNREAD_MESSAGE, (data) => {
            if (data.members && Array.isArray(data.members)) {
                data.members.forEach(memberId => {
                    io.to(memberId).emit(SOCKET_EVENTS.MESSAGE_COUNT_CLEARED, data);
                });
            }
        });

        socket.on(SOCKET_EVENTS.TYPING, (data) => {
            if (data.members && Array.isArray(data.members)) {
                data.members.forEach(memberId => {
                    io.to(memberId).emit(SOCKET_EVENTS.TYPING, data);
                });
            }
        });

        socket.on("disconnecting", () => {
            const rooms = Array.from(socket.rooms);
            rooms.forEach(room => {
                // If the room ID is a valid user ID (it's their personal room)
                // we check if they have other sockets still connected to that room
                // For simplicity, since we use userId as room name:
                const isUserRoom = room.length === 24; // Assuming MongoDB ObjectId length
                if (isUserRoom) {
                    const socketsInRoom = io.sockets.adapter.rooms.get(room);
                    if (socketsInRoom && socketsInRoom.size === 1) {
                        onlineUsers.delete(room);
                        io.emit(SOCKET_EVENTS.ONLINE_USERS_UPDATED, Array.from(onlineUsers));
                    }
                }
            });
        });

        socket.on("disconnect", () => {
        });
    });

    return io;
};

export default initSocket;
