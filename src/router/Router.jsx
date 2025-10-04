import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/home/page'
import LoginPage from '@/pages/login/page'
import SignUpPage from '@/pages/signup/page'
import ProductSearchPage from '@/pages/search/page'
import ProductDetailsPage from '@/pages/product/page'
import CartPage from '@/pages/cart/page'
import PrivacyPolicyPage from '@/pages/privacy/page'
import NotFoundPage from '@/pages/notfound/page'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<ProductSearchPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="404" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
