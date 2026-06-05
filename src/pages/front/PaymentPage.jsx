import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import CheckoutCard from "../paymentPage/CheckoutCard";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InfoPayment from "@/components/cards/InfoPayment";

export default function PaymentPage() {
  const navigate = useNavigate();
  const backClick = () => {
    navigate("/category/softwarePage");
  };

  // Grab login user from redux
  // Note: Depending on your slice setup, it might just be state.user instead of state.user.value!
  const user = useSelector((state) => state.user?.value || state.user);

  // 1. ADDED: We must create the state here in the Parent!
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 2. ADDED: Package it up for the CheckoutCard
  const formData = {
    phone: phone,
    address: address,
  };

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

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24 font-sans text-slate-900">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Secure Checkout
          </h1>
        </div>
        <button onClick={backClick} className="text-xl px-5 mb-5 hover:font-mono"> ↩ Back </button>

        <div className="">
          <Link></Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: InfoPayment */}
          {/* 3. ADDED: Pass the state and updater functions down! */}
          <InfoPayment
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
          />

          {/* RIGHT COLUMN: CheckoutCard */}
          <div className="lg:col-span-5">
            {/* 4. ADDED: Pass the packaged formData down! */}
            <CheckoutCard formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
