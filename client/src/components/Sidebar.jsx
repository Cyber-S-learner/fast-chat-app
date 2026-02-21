import React, { useState } from 'react'
import Search from './Search.jsx'
import UsersList from './UsersList.jsx';
const Sidebar = () => {
    const [searchKey, setSearchKey] = useState('');

    return (
        <div className="w-full max-w-xs flex flex-col h-full bg-[#1E1E1E] border-r border-[#2A2A2A]">
            <div className="pt-4 pb-2">
                <Search searchKey={searchKey} setSearchKey={setSearchKey} />
            </div>
            <div className="flex-1 overflow-hidden px-2">
                <UsersList searchKey={searchKey} />
            </div>
        </div>
    )
}

export default Sidebar