import { axiosInstance } from "./index.js"

export const SignUpUser = async(user)=>{
    try {
        const response = await axiosInstance.post('/api/auth/signup',user)
        return response.data;
    } catch (error) {
     return error.response.data.message;   
    }
}

export const loginUser = async (user)=>{
    try {
        const response = await axiosInstance.post('/api/auth/login',user)
        
        return response.data;
    } catch (error) {
      
        return error
    }
}