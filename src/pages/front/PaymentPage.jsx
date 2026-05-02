import { useEffect, useState } from "react";
import {
  Building,
  CheckCircle2,
  CreditCard,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
  User,
} from "lucide-react";
import CheckoutCard from "../paymentPage/CheckoutCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InfoPayment from "@/components/cards/InfoPayment";

export default function PaymentPage() {
  // State to track which payment method the user selected
  const [paymentMethod, setPaymentMethod] = useState("bakong");
  const navigate = useNavigate();
  // grab login user from redux
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    // 1. Check if we have a token saved in the browser's local storage
    const savedToken = localStorage.getItem("token");

    // 2. If Redux is empty AND there is no saved token, kick them out
    if (!user && !savedToken) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, navigate]);

  // Prevent rendering the page while it redirects  
  if (!user && !localStorage.getItem("token")) return null;

  // if (!user) return null;

  // Dummy data for the cart (You would normally pass this in via props or context)
  const orderSummary = {
    product: "Point of Sale (POS) System",
    plan: "Enterprise Monthly License",
    price: 30.0,
    setupFee: 0.0,
  };

  const total = orderSummary.price + orderSummary.setupFee;

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24 font-sans text-slate-900">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Secure Checkout
          </h1>
          <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck size={18} className="text-green-600" />
            256-bit encrypted secure payment
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: Forms & Selection (Takes up 7 out of 12 columns) */}
          <InfoPayment/>

          {/* RIGHT COLUMN: Order Summary (Takes up 5 out of 12 columns) */}
          <div className="lg:col-span-5">
            <CheckoutCard />
          </div>
        </div>
      </div>
    </div>
  );
}
