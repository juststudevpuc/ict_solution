import { useEffect } from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { useSelector } from "react-redux"; // <--- We use Redux now!

export default function InfoPayment({ phone, setPhone, address, setAddress }) {
  // 1. Grab the user instantly from Redux memory instead of the database!
  // (Make sure state.user matches how you named it in your store.js)
  const me = useSelector((state) => state.user);

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
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
        <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-100">
          Contact & Shipping Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Name (Read Only) */}
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

          {/* Email Address (Read Only) */}
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

          {/* Phone Number (Editable, auto-filled from Redux) */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                placeholder="+855 12 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Shipping Address (Editable, auto-filled from Redux) */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Shipping Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
              <textarea
                rows="3"
                placeholder="Enter your full delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}