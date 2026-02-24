import { axiosInstance } from "."

export const getLoggedInUserDetails = async () => {
    try {
        const response = await axiosInstance.get('/api/user/get-logged-user');
        return response.data;
    } catch (error) {
        return error
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/api/user/get-all-users')
        return response.data;
    } catch (error) {
        return error
    }
}

export const updateUserProfile = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/user/update-profile', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        return error
    }
}