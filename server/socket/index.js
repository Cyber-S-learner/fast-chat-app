import { Server } from "socket.io";

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join-room", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their personal room`);
        });

        socket.on("send-message", (message) => {
            // Emit to all participants in the chat
            // In a real app, you'd emit to specific members' rooms
            console.log("New message received via socket:", message.text);
            io.to(message.members[0]).to(message.members[1]).emit("receive-message", message);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

export default initSocket;
