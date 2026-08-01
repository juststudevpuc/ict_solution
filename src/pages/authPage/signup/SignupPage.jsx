import React from "react";
import { Link } from "react-router-dom";
import { SignupForm } from "../components/SignupForm";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white font-sans">
      {/* Left Column - Form Area */}
      <div className="flex flex-col p-8 md:p-16 lg:p-24 justify-center relative">
        {/* Top Left Text Logo */}
        <div className="absolute top-8 left-8 md:top-12 md:left-16 lg:left-24">
          <Link
            to="/"
            className="text-blue-600 font-bold text-xl tracking-wide"
          >
            ICT Solution
          </Link>
        </div>

        <div className="w-full max-w-md mt-12">
          {/* Big Blue Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4 leading-tight">
            Join the Digital Transformation
          </h1>
          <p className="text-sm text-slate-500 mb-10">
            Enter your details below to create your account.
          </p>

          <SignupForm />
        </div>
      </div>

      {/* Right Column - Illustration & Nav */}
      <div className="hidden lg:flex flex-col bg-slate-50 border-l border-slate-100 relative p-12 items-center justify-center">
        {/* Top Navigation */}

        {/* Illustration */}
        <div className="w-full max-w-lg mt-16">
          <img
            src="/logo_ict_solu.png"
            alt="Illustration"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
