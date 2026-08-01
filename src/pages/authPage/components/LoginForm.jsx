import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import { setUser } from "@/store/userSlice";
import { clearAllCart } from "@/store/cartSlice";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";

export function LoginForm({ className, ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logic States (Untouched)
  const [form, setForm] = useState({ email: "", password: "" });
  const [validate, setValidate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setValidate({});

    try {
      await axios.get("https://ict-solution-2.vercel.app/sanctum/csrf-cookie", {
        withCredentials: true,
        headers: {
          Accept: "application/json",
        },
      });

      const res = await request("login", "post", form);

      if (res && res.user) {
        dispatch(clearAllCart());
        localStorage.removeItem("persist:root");

        dispatch(setUser(res.user));

        if (res.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user", { replace: true });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const validationErrors = error?.errors || error?.response?.data?.errors;
      if (validationErrors) {
        setValidate(validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} {...props}>
      <div className="flex flex-col mb-6">
        {/* Grouped Input Box from the Image */}
        <div
          className={`border rounded-sm bg-white transition-colors ${validate?.email || validate?.password ? "border-red-400" : "border-slate-300 focus-within:border-blue-500"}`}
        >
          {/* Email Area */}
          <div className="p-3 border-b border-slate-200 relative group">
            {/* Blue Left Focus Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-focus-within:bg-blue-600 transition-colors" />
            <label
              htmlFor="email"
              className="block text-xs text-slate-400 mb-1 pl-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full outline-none text-sm text-blue-600 font-medium bg-transparent pl-2 placeholder:text-slate-300 placeholder:font-normal"
              required
            />
          </div>

          {/* Password Area */}
          <div className="p-3 relative group">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-focus-within:bg-blue-600 transition-colors" />
            <label
              htmlFor="password"
              className="block text-xs text-slate-400 mb-1 pl-2"
            >
              Password
            </label>
            <div className="flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="****************"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full outline-none text-sm text-blue-600 font-medium tracking-widest bg-transparent pl-2 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-300 hover:text-slate-500 pr-2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {validate?.email && (
          <p className="text-xs text-red-500 mt-2">{validate.email[0]}</p>
        )}
        {validate?.password && (
          <p className="text-xs text-red-500 mt-1">{validate.password[0]}</p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-8 px-1">
        <label className="flex items-center gap-2 cursor-pointer hover:text-slate-600 transition-colors">
          <input
            type="checkbox"
            className="w-3 h-3 border-slate-300 rounded-[2px] text-blue-600 focus:ring-blue-500 focus:ring-1"
          />
          Remember Me
        </label>
        <a href="#" className="hover:text-blue-600 transition-colors">
          Forgot Password?
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-10">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-32 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-[4px] shadow-sm font-semibold transition-colors"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
        </Button>

        <Button
          type="button"
          onClick={() => navigate("/auth/register")}
          variant="outline"
          className="w-32 bg-white dark:bg-transparent border-blue-200 dark:border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:text-blue-950 dark:hover:bg-blue-500/10  rounded-[4px] font-semibold transition-colors"
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
}
