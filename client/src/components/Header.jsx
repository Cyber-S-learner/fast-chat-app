import React from 'react';
import { User } from 'lucide-react';
import Logo from '../assets/home_page_logo.png';
import { useSelector } from 'react-redux';

const Header = () => {
    const { user } = useSelector(state => state.userReducer)
    const fullName = user?.firstName && user?.lastName ? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}` : 'User';
    const initial = user?.firstName ? user.firstName[0].toUpperCase() : 'U';

    return (
        <div className="flex justify-between items-center bg-[#292829] px-4 py-3 border-b border-[#2A2A2A]">
            {/* Left: Logo */}
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity rounded-xs">
                <img src={Logo} alt="Fast Chat Logo" className="h-13 rounded-md w-auto object-contain" />
            </div>

            {/* Right: User Profile */}
            <div className="flex items-center gap-4 bg-[#1e1e1e] px-4 py-2 rounded-full border border-[#2A2A2A]">
                <div className="text-right hidden sm:block">
                    <p className="text-gray-200 font-medium text-sm">{fullName}</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-orange-600/20">
                    {/* If user has profile pic URL, use img tag here. For now, using Initials/Icon fallback */}
                    {initial}
                </div>
            </div>
        </div>
    );
};

export default Header;