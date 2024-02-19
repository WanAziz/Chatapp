
import './App.css'
import { useState } from 'react'
import { Routes, Route ,Navigate } from "react-router-dom"
import LoginPage from "./page/loginPg"
import ChatPage from './page/chatPg'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chats" element={<ChatPage/>} />
      </Routes>
    </>
  )
}

