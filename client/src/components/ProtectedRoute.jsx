import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, getLoggedInUserDetails } from '../API_Calls/userAPI.js';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../redux/loaderSlice.js';
import { setUser, setAllUsers ,setAllChats } from '../redux/userSlice.js';
import { getAllChats } from '../API_Calls/chat.js';
import toast from 'react-hot-toast';


const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.userReducer)
    const getLoggedInUser = async () => {
        let response = null
        try {
            dispatch(showLoader())
            response = await getLoggedInUserDetails();
            dispatch(hideLoader())
            if (response?.success) {
                dispatch(setUser(response?.data))
            }
            
        } catch (error) {
            dispatch(hideLoader())
            navigate('/login')

        }
    }

    const getAllUsersInDB = async () => {
        let response = null
        try {
            dispatch(showLoader())
            response = await getAllUsers();
            dispatch(hideLoader())
          
            if (response?.success) {
                dispatch(setAllUsers(response?.allUsers))
            }
          
        } catch (error) {
            dispatch(hideLoader())
        }
    }

    const getAllChatsInDB = async ()=>{
        let response = null
        try {
             response = await getAllChats();
             if(response?.success)
             {
                dispatch(setAllChats(response?.data))
             }
            
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getLoggedInUser()
            getAllUsersInDB()
            getAllChatsInDB()
        }
        else {
            navigate('/login', { replace: true })
        }
    }, [navigate])


    return (
        children
    )
}

export default ProtectedRoute