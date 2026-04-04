import { useState } from "react";
import { 
  Building, 
  CheckCircle2, 
  CreditCard, 
  Mail, 
  Phone, 
  QrCode, 
  ShieldCheck, 
  User 
} from "lucide-react";

export default function PaymentPage() {
  // State to track which payment method the user selected
  const [paymentMethod, setPaymentMethod] = useState("bakong");

  // Dummy data for the cart (You would normally pass this in via props or context)
  const orderSummary = {
    product: "Point of Sale (POS) System",
    plan: "Enterprise Monthly License",
    price: 30.00,
    setupFee: 0.00,
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
          <div className="lg:col-span-7 space-y-10">
            
            {/* 1. Customer Information Form */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-100">
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="John" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="john@company.com" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="tel" 
                      placeholder="+855 12 345 678" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Company (Optional)</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Tech Corp" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selection */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-100">
                Payment Method
              </h2>
              
              <div className="space-y-4">
                {/* Bakong KHQR Option */}
                <label 
                  className={`flex items-center p-5 border rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === "bakong" 
                      ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" 
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                  onClick={() => setPaymentMethod("bakong")}
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "bakong" ? "border-blue-600" : "border-slate-300"}`}>
                      {paymentMethod === "bakong" && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <QrCode size={18} className="text-blue-600" /> 
                      Bakong KHQR
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">Scan with ABA, Acleda, or any supported banking app.</p>
                  </div>
                </label>

                {/* Credit Card Option */}
                <label 
                  className={`flex items-center p-5 border rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === "card" 
                      ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" 
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-blue-600" : "border-slate-300"}`}>
                      {paymentMethod === "card" && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard size={18} className="text-blue-600" /> 
                      Credit / Debit Card
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">Visa, Mastercard, or UnionPay.</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary (Takes up 5 out of 12 columns) */}
          <div className="lg:col-span-5">
            {/* sticky top-8 makes this box float nicely if the left side gets very long */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md sticky top-8">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Product Info */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-slate-900">{orderSummary.product}</h3>
                  <p className="text-sm text-slate-500 mt-1">{orderSummary.plan}</p>
                </div>
                <span className="font-semibold text-slate-900">${orderSummary.price.toFixed(2)}</span>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 py-4 border-y border-slate-100 mb-6">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${orderSummary.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Setup Fee</span>
                  <span>${orderSummary.setupFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-slate-900">Total Due Today</span>
                <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <CheckCircle2 size={16} className="text-green-500" /> Immediate digital delivery
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <CheckCircle2 size={16} className="text-green-500" /> 24/7 technical support
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <CheckCircle2 size={16} className="text-green-500" /> Free minor updates
                </li>
              </ul>

              {/* Submit Button */}
              {/* This is the button that will eventually trigger your Bakong QR Modal! */}
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-blue-600/30 hover:-translate-y-1">
                {paymentMethod === "bakong" ? "Generate KHQR Code" : "Proceed to Payment"}
              </button>
              
              <p className="text-center text-xs text-slate-400 mt-4">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}