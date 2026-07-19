import { useEffect } from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function InfoPayment({ phone, setPhone, address, setAddress }) {
  // 1. Grab the user instantly from Redux memory
  const me = useSelector((state) => state.user?.value || state.user);
  const navigate = useNavigate();

  // 2. Auto-fill the checkout fields the second the page loads
  useEffect(() => {
    if (me) {
      if (!phone && me.phone) {
        setPhone(me.phone);
      }
      if (!address && me.address) {
        setAddress(me.address);
      }
    }
  }, [me, phone, address, setPhone, setAddress]);

  return (
    <div className="lg:col-span-7 space-y-10">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-300 relative">
        <h2 className="text-2xl font-bold mb-8 pb-6 border-b border-slate-100 dark:border-slate-800/60 text-slate-900 dark:text-white tracking-tight">
          Contact & Shipping Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* User Name (Read Only) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              User Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
              <input
                type="text"
                value={me?.name || ""}
                readOnly
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl cursor-not-allowed text-slate-500 dark:text-slate-400 outline-none font-medium transition-colors"
              />
            </div>
          </div>

          {/* Email Address (Read Only) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
              <input
                type="email"
                value={me?.email || ""}
                readOnly
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl cursor-not-allowed text-slate-500 dark:text-slate-400 outline-none font-medium transition-colors"
              />
            </div>
          </div>

          {/* Phone Number (Editable) */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="tel"
                placeholder="+855 12 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
              />
            </div>
          </div>

          {/* Shipping Address (Editable) */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Shipping Address
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <textarea
                rows="4"
                placeholder="Enter your full delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm custom-scrollbar"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}