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
import RedirectPage from '@/pages/redirect/gprovider'
import Orderhistory from '@/pages/orderhistory/Orderhistory'
import Wishlist from '@/pages/wishlist/Wishlist'
import AdminDashboardPage from '@/pages/Admin/dashboard/page'
import AdminApp from '@/pages/Admin/admin.app'
import AdminProductsPage from '@/pages/Admin/products/page'
import NewProductPage from '@/pages/Admin/products/new/page'
import EditProductPage from '@/pages/Admin/products/edit/[id]'

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
        <Route path="*" element={<NotFoundPage />} />
        <Route path="redirect" element={<> <RedirectPage /> </>} />
        <Route path="order" element={<Orderhistory />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      <Route path="/admin" element={<AdminApp />} >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<NewProductPage />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
      </Route>
    </Routes>
  );
}
