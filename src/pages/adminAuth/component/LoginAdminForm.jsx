import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        "An error occurred while trying to log in. Please check your connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  // ------------------------------------------

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-slate-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none transition-all duration-300 rounded-[2rem] p-2">
        <CardHeader className="text-center pb-2 pt-6">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup className="space-y-5">
              {/* Email Field */}
              <Field className="space-y-2">
                <FieldLabel
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
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
                    "h-11 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200/70 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500 transition-all",
                    validate?.email
                      ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500"
                      : "",
                  )}
                />
                {validate?.email && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 pl-1">
                    {validate.email[0]}
                  </p>
                )}
              </Field>

              {/* Password Field */}
              <Field className="space-y-2">
                <FieldLabel
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </FieldLabel>

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
                      "h-11 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200/70 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500 pr-11 transition-all",
                      validate?.password
                        ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500"
                        : "",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={2} />
                    ) : (
                      <Eye size={18} strokeWidth={2} />
                    )}
                  </button>
                </div>
                {validate?.password && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 pl-1">
                    {validate.password[0]}
                  </p>
                )}
              </Field>

              {/* Submit Button */}
              <Field className="pt-2">
                <Button
                  type="submit"
                  className="h-11 w-full bg-[#0B1528] hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 font-medium rounded-xl transition-all duration-200 shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>

                <FieldDescription className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/admin/signup"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
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
