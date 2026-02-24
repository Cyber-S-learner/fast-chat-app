import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        allUsers: [],
        allChats: [],
        selectedChat: null,
        onlineUsers: []
    },
    reducers: {
        setUser: (state, action) => { state.user = action.payload },
        setAllUsers: (state, action) => { state.allUsers = action.payload },
        setAllChats: (state, action) => { state.allChats = action.payload },
        setSelectedChat: (state, action) => { state.selectedChat = action.payload },
        setOnlineUsers: (state, action) => { state.onlineUsers = action.payload }
    }
})

export const { setUser, setAllUsers, setAllChats, setSelectedChat, setOnlineUsers } = usersSlice.actions;
export default usersSlice.reducer;