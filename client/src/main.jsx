import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Routers } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Routers>
      <App />
    </Routers>
)
