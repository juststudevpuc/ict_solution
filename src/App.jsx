import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { ProductAdmin } from "./pages/admin/ProductAdmin";

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
          </Route>

          {/* ADMIN LAYOUT */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Add your admin sub-routes here, e.g.: */}
            {/* <Route index element={<AdminLayout />} /> */}
            <Route path="product" element={<ProductAdmin />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}
