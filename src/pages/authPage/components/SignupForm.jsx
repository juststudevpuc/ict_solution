import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidate({}); // Clear old errors

    try {
      const res = await request("register", "post", {
        ...form,
        // Using password directly for confirmation as per your logic
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
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup className="space-y-4">
              {/* Full Name */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={validate?.name ? "border-red-500" : ""}
                />
                {validate?.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {validate.name[0]}
                  </p>
                )}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={validate?.email ? "border-red-500" : ""}
                />
                {validate?.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {validate.email[0]}
                  </p>
                )}
              </Field>

              {/* Password Area */}
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className={validate?.password ? "border-red-500" : ""}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm</FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      // Keeping synced with password as per your original logic
                      value={form.password}
                      readOnly
                      className="bg-slate-50 cursor-not-allowed"
                    />
                  </Field>
                </div>
                {validate?.password ? (
                  <p className="text-xs text-red-500 mt-1">
                    {validate.password[0]}
                  </p>
                ) : (
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                )}
              </Field>

              {/* Submit Button */}
              <Field>
                <Button
                  type="submit"
                  className="w-full bg-[#006039] hover:bg-[#004d2f]"
                >
                  Create Account
                </Button>
                <FieldDescription className="text-center mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login" // Use an absolute path starting with /
                    className="font-bold text-[#006039] hover:underline"
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-[11px] text-slate-500">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
