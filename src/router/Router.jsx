import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/home/page'
import LoginPage from '@/pages/login/page'
import SignUpPage from '@/pages/signup/page'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>
    </Routes>
  )
}
