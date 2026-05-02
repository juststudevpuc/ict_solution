import { useEffect, useState } from "react"; // 1. Import useState
import { User, Mail, Phone } from "lucide-react";
import { useSelector } from "react-redux";
import { request } from "@/utils/request/request";

// I added onPhoneChange as a prop so you can pass the phone number up to your main Checkout page
export default function InfoPayment({ phone, setPhone }) {
  const [me, setMe] = useState(null);

  const fetchingData = async () => {
    const res = await request("me", "get");
    if (res) {
      setMe(res?.user);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  return (
    <div className="lg:col-span-7 space-y-10">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
        <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-100">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              User Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={me?.name || ""}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed text-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={me?.email || ""}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed text-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                placeholder="+855 12 345 678"
                // 2. Bind the input to the state!
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
