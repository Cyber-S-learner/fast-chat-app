import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Camera, Loader2, Save, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { updateUserProfile } from '../API_Calls/userAPI'
import { hideLoader, showLoader } from '../redux/loaderSlice'
import { setUser } from '../redux/userSlice'
import toast from 'react-hot-toast'

const Profile = () => {
    const { user } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        profilePic: user?.profilePic || ''
    })
    const [imageFile, setImageFile] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setForm({ ...form, profilePic: reader.result });
            };
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        try {
            dispatch(showLoader())
            const formData = new FormData();
            formData.append('firstName', form.firstName);
            formData.append('lastName', form.lastName);
            if (imageFile) {
                formData.append('profilePic', imageFile);
            }

            const response = await updateUserProfile(formData)
            dispatch(hideLoader())
            if (response.success) {
                toast.success(response.message)
                dispatch(setUser(response.data))
                navigate('/')
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            dispatch(hideLoader())
            toast.error(error.message)
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1A1A1A] via-[#0A0A0A] to-[#050505]">
            <div className="w-full max-w-lg bg-[#121212]/80 backdrop-blur-xl border border-[#2A2A2A] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">

                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-orange-600 to-orange-800">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-6 left-6 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all duration-300"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {/* Profile Pic Section */}
                <div className="relative -mt-16 flex flex-col items-center px-8 pb-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-[#121212] bg-[#1E1E1E] flex items-center justify-center overflow-hidden shadow-2xl">
                            {form.profilePic ? (
                                <img src={form.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={50} className="text-gray-600" />
                            )}
                        </div>
                        <label className="absolute bottom-1 right-1 p-2.5 bg-orange-600 hover:bg-orange-500 rounded-full text-white shadow-xl cursor-pointer transition-all duration-300 transform group-hover:scale-110">
                            <Camera size={18} />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <h1 className="mt-6 text-3xl font-bold text-white text-center">
                        {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">{user?.email}</p>

                    {/* Edit Form */}
                    <form onSubmit={handleUpdateProfile} className="w-full mt-10 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">First Name</label>
                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white py-3 px-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600"
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Last Name</label>
                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white py-3 px-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600"
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 transform transition-all duration-300 active:scale-[0.98] flex items-center justify-center space-x-2"
                        >
                            <Save size={20} />
                            <span>Save Changes</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile
