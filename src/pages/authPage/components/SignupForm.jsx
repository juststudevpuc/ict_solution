import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function SignupForm({ className, ...props }) {
  const navigate = useNavigate();
  const [validate, setValidate] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidate({});
    setIsLoading(true);

    try {
      const res = await request("register", "post", {
        ...form,
        password_confirmation: form.password,
      });

      if (res?.error) {
        if (res?.errors) setValidate(res.errors);
        return;
      }

      if (res) {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} {...props}>
      <div className="flex flex-col mb-6">
        
        {/* Grouped Input Box */}
        <div className={`border rounded-sm bg-white transition-colors ${validate?.email || validate?.password || validate?.name ? 'border-red-400' : 'border-slate-300 focus-within:border-blue-500'}`}>
          
          {/* Full Name Area */}
          <div className="p-3 border-b border-slate-200 relative group">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-focus-within:bg-blue-600 transition-colors" />
            <label htmlFor="name" className="block text-xs text-slate-400 mb-1 pl-2">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full outline-none text-sm text-blue-600 font-medium bg-transparent pl-2 placeholder:text-slate-300 placeholder:font-normal"
            />
          </div>

          {/* Email Area */}
          <div className="p-3 border-b border-slate-200 relative group">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-focus-within:bg-blue-600 transition-colors" />
            <label htmlFor="email" className="block text-xs text-slate-400 mb-1 pl-2">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full outline-none text-sm text-blue-600 font-medium bg-transparent pl-2 placeholder:text-slate-300 placeholder:font-normal"
            />
          </div>
          
          {/* Password Area */}
          <div className="p-3 border-b border-slate-200 relative group">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-focus-within:bg-blue-600 transition-colors" />
            <label htmlFor="password" className="block text-xs text-slate-400 mb-1 pl-2">Password</label>
            <div className="flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="****************"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full outline-none text-sm text-blue-600 font-medium tracking-widest bg-transparent pl-2 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-300 hover:text-slate-500 pr-2 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Area (ReadOnly) */}
          <div className="p-3 relative group bg-slate-50">
            <label htmlFor="confirm-password" className="block text-xs text-slate-400 mb-1 pl-2">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={form.password}
              readOnly
              className="w-full outline-none text-sm text-slate-400 font-medium tracking-widest bg-transparent pl-2 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Validation Errors */}
        {validate?.name && <p className="text-xs text-red-500 mt-2 pl-1">{validate.name[0]}</p>}
        {validate?.email && <p className="text-xs text-red-500 mt-1 pl-1">{validate.email[0]}</p>}
        {validate?.password && <p className="text-xs text-red-500 mt-1 pl-1">{validate.password[0]}</p>}
        
        {/* Show password instruction if no error */}
        {!validate?.password && (
          <p className="text-xs text-slate-400 mt-2 pl-1">Must be at least 8 characters long.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-32 bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] shadow-sm font-semibold transition-colors"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
        </Button>
        
        <Button
          type="button"
          onClick={() => navigate('/auth/login')}
          variant="outline"
          className="w-32 bg-white border-blue-200 text-blue-600 hover:bg-blue-50 rounded-[4px] dark:bg-white dark:hover:bg-white dark:hover:text-blue-400 font-semibold transition-colors"
        >
          Login
        </Button>
      </div>

      {/* Terms and Privacy Policy */}
      <p className="text-[11px] text-slate-500 leading-relaxed px-1">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}