import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Eagerly loaded layout/wrapper shell (Keep fast for client)
import App from "../App";
import { LoaderScreen } from "@/components/LoaderScreen";

// Lazy load Admin shells to isolate heavy dependencies (mdxeditor, recharts, etc.)
const AdminAuth = lazy(() => import("@/pages/Admin/auth/page.index"));
const AdminApp = lazy(() => import("@/pages/Admin/admin.app"));

// --- LAZY IMPORT MAPS ---

// Main Client Pages
const HomePage = lazy(() => import("../pages/home/page"));
const ProductSearchPage = lazy(() => import("@/pages/search/page"));
const ProductDetailsPage = lazy(() => import("@/pages/product/page"));
const CartPage = lazy(() => import("@/pages/cart/page"));
const LoginPage = lazy(() => import("@/pages/login/page"));
const SignUpPage = lazy(() => import("@/pages/signup/page"));
const PrivacyPolicyPage = lazy(() => import("@/pages/privacy/page"));
const NotFoundPage = lazy(() => import("@/pages/notfound/page"));
const RedirectPage = lazy(() => import("@/pages/redirect/gprovider"));
const Orderhistory = lazy(() => import("@/pages/orderhistory/Orderhistory"));
const Wishlist = lazy(() => import("@/pages/wishlist/Wishlist"));
const SettingsPage = lazy(() => import("@/pages/settings/page"));
const AddressBookPage = lazy(() => import("@/pages/addressbook/page"));
const AboutPage = lazy(() => import("@/pages/aboutUs/page"));
const TermsAndConditions = lazy(
  () => import("@/pages/TermsAndConditions/TermsAndConditions"),
);
const ContactUs = lazy(() => import("@/pages/contactus/page"));
const ShippingInfo = lazy(() => import("@/pages/shippingInfo/page"));
const Return = lazy(() => import("@/pages/return/page"));
const CategoriesPage = lazy(() => import("@/pages/categories/categories.page"));

// Admin Pages
const AdminDashboardPage = lazy(() => import("@/pages/Admin/dashboard/page"));
const AdminProductsPage = lazy(() => import("@/pages/Admin/products/page"));
const NewProductPage = lazy(
  () => import("@/pages/Admin/products/pages/new/page"),
);
const EditProductPage = lazy(
  () => import("@/pages/Admin/products/pages/edit/[id]"),
);
const OrdersPage = lazy(() => import("@/pages/Admin/orders"));
const CustomersPage = lazy(() => import("@/pages/Admin/customers"));

// --- ROUTE CONFIGURATION MAPS ---

const clientRoutes = [
  { index: true, element: <HomePage /> },
  { path: "search", element: <ProductSearchPage /> },
  { path: "product/:id", element: <ProductDetailsPage /> },
  { path: "cart", element: <CartPage /> },
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignUpPage /> },
  { path: "privacy", element: <PrivacyPolicyPage /> },
  { path: "404", element: <NotFoundPage /> },
  { path: "*", element: <NotFoundPage /> },
  { path: "redirect", element: <RedirectPage /> },
  { path: "order", element: <Orderhistory /> },
  { path: "wishlist", element: <Wishlist /> },
  { path: "settings", element: <SettingsPage /> },
  { path: "addressbook", element: <AddressBookPage /> },
  { path: "about", element: <AboutPage /> },
  { path: "terms", element: <TermsAndConditions /> },
  { path: "contact", element: <ContactUs /> },
  { path: "shipping", element: <ShippingInfo /> },
  { path: "return", element: <Return /> },
  { path: "categories", element: <CategoriesPage /> },
];

const adminSubRoutes = [
  { index: true, element: <AdminDashboardPage /> },
  { path: "dashboard", element: <AdminDashboardPage /> },
  { path: "products", element: <AdminProductsPage /> },
  { path: "products/new", element: <NewProductPage /> },
  { path: "products/:id/edit", element: <EditProductPage /> },
  { path: "orders", element: <OrdersPage /> },
  { path: "customers", element: <CustomersPage /> },
];

// --- MAIN ROUTER COMPONENT ---

export default function Router() {
  return (
    // Global fallback loader while any lazy route chunk is being downloaded
    <Suspense fallback={<LoaderScreen />}>
      <Routes>
        {/* Client Layout Shell */}
        <Route path="/" element={<App />}>
          {clientRoutes.map((route, index) => (
            <Route
              key={route.path || `client-${index}`}
              index={route.index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        {/* Admin Authentication Shell */}
        <Route path="/auth" element={<AdminAuth />}>
          {/* Admin Application Layout Shell */}
          <Route path="admin" element={<AdminApp />}>
            {adminSubRoutes.map((route, index) => (
              <Route
                key={route.path || `admin-${index}`}
                index={route.index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
