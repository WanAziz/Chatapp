
import './App.css'
import { useState } from 'react'
import { Routes, Route ,Navigate } from "react-router-dom"
import LoginPage from "./page/loginPg"
import RegisterPage from './page/registerPg'
import ChatPage from './page/chatPg'

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

