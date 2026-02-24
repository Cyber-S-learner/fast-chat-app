import React, { useState } from 'react'
import Search from './Search.jsx'
import UsersList from './UsersList.jsx';
import { useSelector } from 'react-redux';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [searchKey, setSearchKey] = useState('');
    const { user } = useSelector(state => state.userReducer);
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-xs flex flex-col h-full bg-[#1E1E1E] border-r border-[#2A2A2A]">
            <div className="pt-4 pb-2">
                <Search searchKey={searchKey} setSearchKey={setSearchKey} />
            </div>
            <div className="flex-1 overflow-hidden px-2">
                <UsersList searchKey={searchKey} />
            </div>

            {/* User Footer */}
            <div className="p-4 bg-[#121212] border-t border-[#2A2A2A] flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="Me" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            user?.firstName?.[0] || 'U'
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-gray-500 text-xs truncate">My Profile</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/profile')}
                    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-gray-800 rounded-full transition-all"
                    title="Profile Settings"
                >
                    <Settings size={20} />
                </button>
            </div>
        </div>
    )
}

export default Sidebar