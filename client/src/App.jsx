
import './App.css'
import { useState , lazy} from 'react'
import { Routes, Route ,Navigate } from "react-router-dom"
const LoginPage = lazy(()=> import("./page/loginPg")) 
const RegisterPage = lazy(() => import('./page/registerPg'))  
const ChatPage = lazy(() => import('./page/chatPg')) 

export default function App() {
  const user = sessionStorage.getItem("user")

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={user?<Navigate to="/chats" />:<LoginPage  />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chats" element={!user?<Navigate to="/login" />:<ChatPage />} />
      </Routes>
    </>
  )
}

