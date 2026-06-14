import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { request } from "@/utils/request/request";

export default function ProtectedRoute({ moduleKey, children }) {
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // --- UPDATED LOGIC FOR REDUX PERSIST ---
        const persistString = localStorage.getItem("persist:root");
        let role = "staff"; // Default safety net

        if (persistString) {
            try {
                // Redux Persist double-stringifies objects, so we parse twice!
                const parsedRoot = JSON.parse(persistString);
                if (parsedRoot.user) {
                    const userObj = JSON.parse(parsedRoot.user); 
                    role = userObj?.role?.toLowerCase() || "staff";
                }
            } catch (e) {
                console.error("Failed to parse Redux Persist data:", e);
            }
        }
        // --- END UPDATED LOGIC ---

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
        const moduleRules = matrix.find((m) => m.key === moduleKey);

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

  if (hasAccess === null) return <div className="p-10 text-center font-semibold text-slate-500">Authenticating access...</div>; 
  if (hasAccess === false) return <Navigate to="/admin/dashboard" replace />; 

  return children;
}