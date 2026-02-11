# RazorBills - TODO Tasks 📋

A comprehensive list of actionable improvement tasks for the RazorBills e-commerce platform.

---

## 🐛 Bug Fixes

- [ ] **Remove debug `console.log` statements from production code**
  - `src/components/admin-sidebar.jsx` (line 100): `console.log(group)`
  - `src/components/horizontal-card/horizontal-card.jsx` (line 59): `console.log('Add to cart:', ...)`
  - `src/components/horizontal-card/horizontal-card.jsx` (line 64): `console.log('Quick view:', ...)`
  - `src/components/product-card/ProductCard.jsx` (line 50): `console.log('Quick view:', ...)`
  - `src/components/product-card/ProductCard.jsx` (line 56): `console.log('Add to cart:', ...)`
  - `src/pages/login/page.jsx` (line 64): `console.log("user data from", ...)`
  - `Server/routes/auth.js` (line 11): `console.log(email)`
  - `Server/routes/auth.js` (line 63): `console.log(email, decryptedPassword, ...)`

- [ ] **Fix responsiveness issues on large screens** (Issue [#10](https://github.com/muhammed-radin/razorbills/issues/10))
  - Review CSS media queries and grid/flex layouts for widths above 1920px
  - Test with ultra-wide resolutions (2560px, 3440px)
  - Add `max-width` constraints and fluid layout adjustments

- [ ] **Fix unused import in login page**
  - `src/pages/login/page.jsx` (line 16): Unused `set` imported from Zod

- [ ] **Fix typo in wishlist schema filename**
  - `Server/models/schema/whishlist.js` should be renamed to `wishlist.js`

---

## 🚀 Feature Implementation

- [ ] **Implement Add to Cart handler in product cards**
  - `src/components/product-card/ProductCard.jsx`: `handleAddToCart()` only logs to console (line 53–57)
  - `src/components/horizontal-card/horizontal-card.jsx`: `handleAddToCart()` only logs to console (line 57–60)
  - Connect these handlers to the cart API/state management

- [ ] **Implement Quick View functionality**
  - `src/components/product-card/ProductCard.jsx`: `handleQuickView()` only logs to console (line 47–51)
  - `src/components/horizontal-card/horizontal-card.jsx`: `handleQuickView()` only logs to console (line 62–65)
  - Create a quick view modal/dialog for product preview

- [ ] **Create Admin Settings page**
  - The admin sidebar links to `/admin/settings` (`src/components/admin-sidebar.jsx`, line 145)
  - No corresponding page or route exists in the router (`src/router/Router.jsx`)
  - Create the settings page and add the route

- [ ] **Replace mock data with real API calls**
  - `src/pages/Admin/customers/index.jsx` (lines 104–202): Uses hardcoded `mockCustomers` array
  - `src/pages/Admin/orders/index.jsx` (lines 158–240): Uses hardcoded `mockOrders` array
  - `src/pages/search/SearchPage.jsx` (line 37): Uses mock product data instead of API

- [ ] **Implement Server API routes for cart, wishlist, orders, and reviews**
  - Mongoose schemas exist (`Server/models/schema/`) for cart, wishlist, order, and review
  - No corresponding Express routes exist in `Server/routes/`
  - The users route (`Server/routes/users.js`) is a placeholder returning only "respond with a resource"

- [ ] **Implement checkout flow**
  - Cart page exists but no checkout/payment page is implemented
  - Add checkout page with order summary and payment integration

---

## 🔒 Security & Code Quality

- [ ] **Replace hardcoded admin email**
  - `src/components/admin-sidebar.jsx` (line 137): Hardcoded `"admin@razorbills.com"`
  - Should dynamically display the authenticated admin user's email

- [ ] **Improve error handling for API calls**
  - `src/pages/home/page.jsx` (lines 26–35): Fetch errors are silently caught and only logged
  - `src/pages/Admin/orders/index.jsx`: Error handlers only show toast notifications without recovery options
  - Add user-friendly error messages and retry mechanisms across all API calls

- [ ] **Move sensitive keys out of source code**
  - Review `Server/utils/key.js` to ensure API keys and secrets use environment variables
  - Ensure Firebase config values use environment variables

---

## 🧪 Testing

- [ ] **Set up testing infrastructure**
  - No test files or testing framework currently exists in the project
  - Add a testing framework (e.g., Vitest for Vite compatibility)
  - Add unit tests for utility functions (`src/utils/`, `src/lib/`)
  - Add component tests for critical UI components
  - Add API endpoint tests for server routes

---

## 📖 Documentation

- [ ] **Update README.md project structure**
  - The project structure in README.md is outdated and doesn't reflect all current directories
  - Missing: `Server/` directory, `src/pages/Admin/`, `src/pages/order/`, `src/pages/wishlist/`, `src/pages/settings/`, `src/pages/addressbook/`, `src/models/`

- [ ] **Add Server setup instructions to README**
  - README only covers frontend setup
  - Add instructions for setting up and running the Express/MongoDB backend
  - Document required environment variables

- [ ] **Add API documentation**
  - Document all available API endpoints in the Server
  - Include request/response formats and authentication requirements
