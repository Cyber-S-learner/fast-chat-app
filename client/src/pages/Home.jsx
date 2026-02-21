import React from 'react'
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx'
import ChatArea from '../components/ChatArea.jsx'
import io from 'socket.io-client'
const Home = () => {
  const socket = io(import.meta.env.VITE_BACKEND_URL)

  return (
    <div className="h-screen bg-[#1E1E1E] text-white flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  )
}

export default Home