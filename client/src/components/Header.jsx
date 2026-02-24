import { LogOut, User } from 'lucide-react';
import Logo from '../assets/home_page_logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/userSlice.js';
import toast from 'react-hot-toast';

const Header = () => {
    const { user } = useSelector(state => state.userReducer)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fullName = user?.firstName && user?.lastName ? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}` : 'User';
    const initial = user?.firstName ? user.firstName[0].toUpperCase() : 'U';

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(setUser(null));
        toast.success("Logged out successfully");
        navigate('/login');
    }

    return (
        <div className="flex justify-between items-center bg-[#292829] px-4 py-3 border-b border-[#2A2A2A]">
            {/* Left: Logo */}
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity rounded-xs">
                <img src={Logo} alt="Fast Chat Logo" className="h-13 rounded-md w-auto object-contain" />
            </div>

            <div className="flex items-center gap-4">
                {/* Right: User Profile */}
                <div
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-4 bg-[#1e1e1e] px-4 py-2 rounded-full border border-[#2A2A2A] cursor-pointer hover:bg-[#2A2A2A] transition-all group shadow-md"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-gray-200 font-medium text-sm group-hover:text-orange-500 transition-colors">{fullName}</p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-orange-600/20 overflow-hidden">
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            initial
                        )}
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2.5 rounded-full bg-[#1e1e1e] border border-[#2A2A2A] text-gray-400 hover:text-red-500 hover:bg-[#2A2A2A] transition-all shadow-md group"
                >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Header;