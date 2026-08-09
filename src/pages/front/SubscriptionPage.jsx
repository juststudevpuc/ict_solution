import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { CalendarDays, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const cartData = useSelector((state) => state.cart);
  const [selectedPlan, setSelectedPlan] = useState(1);

  // If cart is empty, kick them back to the software page
  if (cartData.length === 0) {
    return <Navigate to="/category/softwarePage" replace />;
  }

  // Calculate base monthly cost of the cart
  const baseMonthlyTotal = cartData.reduce(
    (acc, item) => acc + Number(item?.price || 0) * Number(item?.qty || 0),
    0
  );

  // Define our Subscription Plans
  const plans = [
    {
      id: 1,
      name: "Monthly Pay-As-You-Go",
      duration_days: 30,
      multiplier: 1, // 1 month
      discountPercentage: 0,
      icon: CalendarDays,
      badge: "",
    },
    {
      id: 2,
      name: "Semi-Annual Plan",
      duration_days: 180,
      multiplier: 6, // 6 months
      discountPercentage: 10, // 10% off for committing to 6 months
      icon: Zap,
      badge: "Save 10%",
    },
    {
      id: 3,
      name: "Annual Enterprise Plan",
      duration_days: 365,
      multiplier: 12, // 12 months
      discountPercentage: 20, // 20% off for committing to a year
      icon: ShieldCheck,
      badge: "Best Value - Save 20%",
    }
  ];

 const handleProceed = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    
    // Create a safe copy of the plan data without the React component (icon)
    const safePlanData = {
      id: plan.id,
      name: plan.name,
      duration_days: plan.duration_days,
      multiplier: plan.multiplier,
      discountPercentage: plan.discountPercentage
    };

    // Route to payment page AND pass the safe data!
    navigate("/payment", { state: { subscriptionPlan: safePlanData } });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto mt-10">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Choose Your Billing Cycle
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select a duration for your software licenses. Commit to a longer plan to unlock significant discounts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const grossTotal = baseMonthlyTotal * plan.multiplier;
            const discountAmount = (grossTotal * plan.discountPercentage) / 100;
            const finalTotal = grossTotal - discountAmount;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-xl shadow-blue-900/10 scale-105"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <plan.icon 
                  className={`w-10 h-10 mb-4 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} 
                />
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{plan.duration_days} Days License</p>
                
                <div className="mt-auto">
                  {plan.discountPercentage > 0 && (
                    <div className="text-sm text-slate-400 line-through mb-1">
                      ${grossTotal.toFixed(2)}
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      ${finalTotal.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-slate-500">total</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center"> 
          <Button 
            onClick={handleProceed}
            size="lg"
            className="w-full md:w-auto px-12 py-6 text-lg rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xl flex items-center gap-2 transition-transform active:scale-95"
          >
            Continue to Payment
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </div>
  );
}