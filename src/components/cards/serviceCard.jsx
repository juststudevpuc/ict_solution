import { ArrowRight } from "lucide-react";
import { useState } from "react";

// FIX 1: Capitalized 'S' in ServiceCard
export default function ServiceCard() {

 
  
  // FIX 2: Removed the { serviceSell } prop from the function brackets so this array works perfectly
  const serviceSell = [
    {
      title: "Web Development", // Fixed spelling
      description: "Custom enterprise software solutions.",
      img: "client/khmer24.png",
    },
    // You can add more services to this array later!
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-16 max-w-2xl">
          <div className="h-px w-8 bg-blue-600 mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-medium text-slate-900 tracking-tight mb-4">
            Our Core Services
          </h2>
          <p className="text-slate-500 font-light text-lg">
            End-to-end solutions designed to engineer scale, secure your data,
            and drive performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
          {serviceSell.map((serveSell, index) => (
            <div
              key={index}
              className="group flex flex-col items-start p-8 bg-white border border-slate-200 hover:border-blue-600 transition-colors duration-300 cursor-pointer"
            >
              <div className="relative w-14 h-14 mb-8">
                <img
                  src={serveSell.img}
                  alt={serveSell.title}
                  className="w-full h-full object-contain opacity-100"
                />
              </div>

              <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-3">
                {serveSell.title}
              </h3>

              <p className="text-slate-500 font-light leading-relaxed mb-8 flex-grow">
                {serveSell.description}
              </p>

              <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                Explore service
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}