import React from 'react'
import { Search as SearchIcon, X } from 'lucide-react'

const Search = ({ searchKey, setSearchKey }) => {
    const handleCancel = () => {
        setSearchKey('')
    }
    return (
        <div className="w-full px-2 py-2">
            <div className="relative group">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2A2A2A] text-gray-200 text-sm rounded-full py-2.5 pl-3 pr-10 outline-none focus:border-orange-500 transition-all duration-300 placeholder-gray-500 shadow-sm"
                />
                <div className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300 pointer-events-none">
                    {searchKey ? <button className='cursor-pointer pointer-events-auto' onClick={handleCancel}  ><X size={15} /></button> : <SearchIcon size={15} />}
                </div>
            </div>
        </div>
    )
}

export default Search