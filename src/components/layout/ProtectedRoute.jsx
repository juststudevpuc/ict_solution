import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { request } from "@/utils/request/request";
import { Lock, ArrowLeft } from "lucide-react"; // 🔥 NEW: Added icons for the error screen
import { Button } from "@/components/ui/button"; // Adjust path if your button is elsewhere

export default function ProtectedRoute({ moduleKey, children }) {
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // --- REDUX PERSIST LOGIC ---
        const persistString = localStorage.getItem("persist:root");
        let role = "staff"; // Default safety net

        if (persistString) {
            try {
                const parsedRoot = JSON.parse(persistString);
                if (parsedRoot.user) {
                    const userObj = JSON.parse(parsedRoot.user); 
                    role = userObj?.role?.toLowerCase() || "staff";
                }
            } catch (e) {
                console.error("Failed to parse Redux Persist data:", e);
            }
        }

        // 3. Super Admin Bypass
        if (role === "admin") {
          setHasAccess(true);
          return;
        }

        // 4. Fetch DB Rules for Staff/User
        const res = await request("permissions", "get");
        const matrix = res?.data || res;

        // Prevent crashes if API fails
        if (!Array.isArray(matrix)) {
            setHasAccess(false);
            return;
        }

        // 5. Check the specific rule
        // Make sure "setting" maps to the DB key just like we did in the Sidebar!
        const dbKey = moduleKey === "setting" ? "super_admin_only_setting" : moduleKey;
        const moduleRules = matrix.find((m) => m.key === dbKey);

        if (moduleRules && moduleRules[role] === true) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }

      } catch (error) {
        console.error("Gatekeeper Error:", error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [moduleKey]);

  // Loading State
  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="size-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-slate-400 tracking-wider uppercase">Authenticating...</span>
        </div>
      </div>
    );
  }

  // 🔥 NEW: Beautiful "Access Denied" Screen instead of a Redirect!
  if (hasAccess === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-rose-50 text-rose-500 p-5 rounded-3xl mb-6 shadow-sm border border-rose-100">
          <Lock className="size-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 font-medium max-w-sm mb-8 leading-relaxed">
          You don't have the necessary permissions to view the <span className="font-bold text-slate-700">"{moduleKey}"</span> module. 
        </p>
        <Link to="/admin/orderPage">
          <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 px-6">
            <ArrowLeft className="size-4" />
            Return to Orders
          </Button>
        </Link>
      </div>
    );
  }

  return children;
}