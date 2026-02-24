import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Loader from './components/Loader.jsx'
import { useSelector } from 'react-redux'

import { SocketProvider } from './context/SocketContext.jsx'

function App() {
  const { loader } = useSelector(state => state.loaderReducer)

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      {loader && <Loader />}
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>}>
            </Route>
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>}>
            </Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/signup' element={<Signup />}></Route>

          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </>
  )
}

export default App
