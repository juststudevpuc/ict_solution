import { useEffect, useState } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react"; // 🔥 ADDED: ArrowLeft for the back button
import CheckoutCard from "../paymentPage/CheckoutCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InfoPayment from "@/components/cards/InfoPayment";

export default function PaymentPage() {
  const navigate = useNavigate();
  const backClick = () => {
    navigate("/category/softwarePage");
  };

  // Grab login user from redux
  const user = useSelector((state) => state.user?.value || state.user);

  // 1. State for InfoPayment
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 2. Package it up for the CheckoutCard
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 md:py-16 font-sans transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* --- SLEEK BACK BUTTON --- */}
        <button 
          onClick={backClick} 
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
        > 
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> 
          Back to Software 
        </button>

        {/* --- HEADER --- */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-2xl w-fit mx-auto md:mx-0">
            <ShieldCheck className="size-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Secure Checkout
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Complete your payment and personal details below.
            </p>
          </div>
        </div>

        {/* --- TWO COLUMN LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: InfoPayment (Takes up 7 columns) */}
          <div className="lg:col-span-7 w-full">
            <InfoPayment
              phone={phone}
              setPhone={setPhone}
              address={address}
              setAddress={setAddress}
            />
          </div>

          {/* RIGHT COLUMN: CheckoutCard (Takes up 5 columns) */}
          <div className="lg:col-span-5 w-full sticky top-8">
            <CheckoutCard formData={formData} />
          </div>
          
        </div>
      </div>
    </div>
  );
}