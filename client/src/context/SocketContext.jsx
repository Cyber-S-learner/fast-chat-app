import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { SOCKET_EVENTS } from '../constants/socketEvents';
import { setOnlineUsers } from '../redux/userSlice';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        let socketInstance = null;

        if (user) {
            socketInstance = io(import.meta.env.VITE_BACKEND_URL);
            setSocket(socketInstance);

            socketInstance.on(SOCKET_EVENTS.ONLINE_USERS_UPDATED, (users) => {
                dispatch(setOnlineUsers(users));
            });

            socketInstance.emit(SOCKET_EVENTS.JOIN_ROOM, user._id);
        }

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
                setSocket(null);
            }
        };
    }, [user, dispatch]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
