import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/front/HomePage";
import AboutPage from "./pages/front/AboutPage";
import ServicePage from "./pages/front/ServicePage";
import ClientPage from "./pages/front/ClientPage";
import ContactPage from "./pages/front/ContactPage";
import ServicePage2 from "./pages/front/ServicePage2";
import SoftwareCard from "./pages/front/category/SoftwareCard";
import PaymentPage from "./pages/front/PaymentPage";
import AdminLayout from "./components/layout/AdminLayout";
import { TooltipProvider } from "./components/ui/tooltip";
import ProductAdmin from "./pages/admin/ProductAdmin";
import OrderPage from "./pages/admin/OrderPage";
import SignupPage from "./pages/authPage/signup/SignupPage";
import LoginPage from "./pages/authPage/login/LoginPage";
import SignUpAdmin from "./pages/adminAuth/signup/SignUpAdmin";
import LoginAdmin from "./pages/adminAuth/login/LoginAdmin";
import UserProfile from "./pages/front/profile/UserProfile";
import Dashboard from "./pages/admin/Dashboard";
import RequestOrder from "./pages/admin/RequestOrder";
import Inventory from "./pages/admin/Inventory";
import StaffManagement from "./pages/admin/StaffManagement";
import Settings from "./pages/admin/Settings";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/layout/ProtectedRoute";
export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          {/* MAIN FRONT-END LAYOUT */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="service" element={<ServicePage />} />
            <Route path="service2" element={<ServicePage2 />} />
            <Route path="client" element={<ClientPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="category/softwarePage" element={<SoftwareCard />} />
            <Route path="userProfile" element={<UserProfile />} />

            {/* Added a fallback user dashboard route so it doesn't crash */}
            <Route path="user" element={<HomePage />} />
          </Route>

          {/* AUTHENTICATION ROUTES (Fixed Path) */}
          <Route path="/auth">
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<SignupPage />} />
          </Route>

          {/* ADMIN AUTH ROUTES (Stand-alone) */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/signup" element={<SignUpAdmin />} />

          {/* ADMIN DASHBOARD ROUTES (Protected by AdminLayout) */}
          {/* ADMIN DASHBOARD ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="productPage"
              element={
                <ProtectedRoute moduleKey="productPage">
                  <ProductAdmin />
                </ProtectedRoute>
              }
            />

            <Route
              path="orderPage"
              element={
                <ProtectedRoute moduleKey="orderPage">
                  <OrderPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="request_order"
              element={
                <ProtectedRoute moduleKey="request_order">
                  <RequestOrder />
                </ProtectedRoute>
              }
            />

            <Route
              path="inventory"
              element={
                <ProtectedRoute moduleKey="inventory">
                  <Inventory />
                </ProtectedRoute>
              }
            />

            <Route
              path="staff_management"
              element={
                <ProtectedRoute moduleKey="staff_management">
                  <StaffManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="setting"
              element={
                <ProtectedRoute moduleKey="super_admin_only_setting">
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </TooltipProvider>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
