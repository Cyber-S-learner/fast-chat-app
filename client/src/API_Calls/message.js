import { axiosInstance } from "./index.js";

export const createNewMessage = async (message) => {
    try {
        const response = await axiosInstance.post('/api/message/new-message', message, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data;
    }
    catch (error) {
        return error
    }
}

export const getAllMessages = async (chatId) => {
    try {
        const response = await axiosInstance.get(`/api/message/all-messages/${chatId}`)
        return response.data;
    }
    catch (error) {
        return error
    }
}