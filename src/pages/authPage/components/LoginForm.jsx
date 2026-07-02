import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { request } from "@/utils/request/request";
import { setUser } from "@/store/userSlice";
import { clearAllCart } from "@/store/cartSlice"; // Token slice removed, which is correct!
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import axios from "axios";

export function LoginForm({ className, ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logic States
  const [form, setForm] = useState({ email: "", password: "" });
  const [validate, setValidate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setValidate({});

    try {
      // 1. CRITICAL STEP: Get the CSRF Security Cookie
      // Added Accept: application/json to prevent HTML redirects on failure
      await axios.get("https://ict-solution-2.vercel.app/sanctum/csrf-cookie", { 
          withCredentials: true,
          headers: {
              "Accept": "application/json"
          }
      });

      // 2. Send the login request using your custom wrapper
      const res = await request("login", "post", form);

      if (res && res.user) {
        // 3. Wipe the slate clean BEFORE saving the new user
        dispatch(clearAllCart());
        localStorage.removeItem("persist:root");
        
        // 4. Set the new user data in Redux (No token needed!)
        dispatch(setUser(res.user)); 

        // 5. Navigate based on role
        if (res.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user", { replace: true });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Safely catch validation errors from either standard Axios or your custom request wrapper
      const validationErrors = error?.errors || error?.response?.data?.errors;
      
      if (validationErrors) {
         setValidate(validationErrors); 
      }
      
    } finally {
      // Always turn off the loading spinner, even if it fails
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center mb-4">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Email Field */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={validate?.email ? "border-red-500" : ""}
            required
          />
          {validate?.email && (
            <p className="text-xs text-red-500 mt-1">{validate.email[0]}</p>
          )}
        </Field>

        {/* Password Field */}
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="text-xs underline-offset-4 hover:underline text-blue-600"
            >
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={validate?.password ? "border-red-500" : ""}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {validate?.password && (
            <p className="text-xs text-red-500 mt-1">{validate.password[0]}</p>
          )}
        </Field>

        {/* Submit Button */}
        <Field>
          <Button
            type="submit"
            className="w-full bg-[#045a8f] hover:bg-[#00244d]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center mt-4">
            Don&apos;t have an account?{" "}
            <a
              href="register"
              className="font-bold text-[#045a8f] underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}