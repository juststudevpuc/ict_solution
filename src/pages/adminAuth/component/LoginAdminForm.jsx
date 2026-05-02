import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { request } from "@/utils/request/request";
import { setUser } from "@/store/userSlice";
import { setToken } from "@/store/tokenSlice";

export function LoginAdminForm({ className, ...props }) {
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
        // 1. Convert to lowercase just in case the database says "Admin"
        const userRole = res?.user?.role?.toLowerCase();

        if (userRole === "admin") {
          // ✅ They are an admin! Save data and let them in.
          dispatch(setUser(res?.user));
          dispatch(setToken(res?.token));
          localStorage.setItem("token", res?.token);

          navigate("/admin/productPage", { replace: true });
        } else {
          // 🛑 They are a normal user trying to sneak in!
          alert("Access Denied: You do not have Admin privileges.");
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      // 💥 THIS IS WHAT WAS MISSING!
      // If the server crashes or the internet drops, this catches it.
      console.error("Login failed due to a network or server error:", error);
      alert(
        "An error occurred while trying to log in. Please check your connection.",
      );
    } finally {
      // This runs no matter what happens (success or fail) to stop the spinning loader
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
          {/* <CardDescription>
            Login with your Apple or Google account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={validate?.email ? "border-red-500" : ""}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={validate?.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {validate?.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {validate.password[0]}
                  </p>
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full bg-[#045a8f] hover:bg-[#00244d]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Login in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/admin/signup">Sign Up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  );
}
