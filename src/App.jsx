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
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="productPage" replace />} />
            <Route path="productPage" element={<ProductAdmin />} />
            <Route path="orderPage" element={<OrderPage />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}
