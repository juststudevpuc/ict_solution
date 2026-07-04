import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { request } from "@/utils/request/request";
import { setUser } from "@/store/userSlice";

export function LoginAdminForm({ className, ...props }) {
  // --- LOGIC REMAINS COMPLETELY UNCHANGED ---
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [validate, setValidate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setValidate({});

    try {
      const res = await request("login", "post", form);

      if (res?.error) {
        if (res?.errors) setValidate(res.errors);
        setIsLoading(false);
        return;
      }

      if (res) {
        const userRole = res?.user?.role?.toLowerCase();

        if (["admin", "staff"].includes(userRole)) {
          dispatch(setUser(res?.user));
          navigate("/admin/productPage", { replace: true });
        } else {
          alert("Access Denied: You do not have Admin privileges.");
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Login failed due to a network or server error:", error);
      alert(
        "An error occurred while trying to log in. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };
  // ------------------------------------------

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup className="space-y-4">
              
              {/* Email Field */}
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="email" className="text-slate-700 dark:text-slate-300">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={cn(
                    "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500",
                    validate?.email ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500" : ""
                  )}
                />
                {validate?.email && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {validate.email[0]}
                  </p>
                )}
              </Field>

              {/* Password Field */}
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="password" className="text-slate-700 dark:text-slate-300">
                  Password
                </FieldLabel>
                
                {/* UI FIX: Added relative wrapper for the absolute positioned eye icon */}
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className={cn(
                      "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500 pr-10",
                      validate?.password ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500" : ""
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {validate?.password && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {validate.password[0]}
                  </p>
                )}
              </Field>

              {/* Submit Button */}
              <Field className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-[#0B1528] hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                
                <FieldDescription className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Don&apos;t have an account?{" "}
                  <Link 
                    to="/admin/signup" 
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Sign Up
                  </Link>
                </FieldDescription>
              </Field>
              
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}