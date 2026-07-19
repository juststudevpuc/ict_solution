import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  Code, Smartphone, Calculator, ShoppingCart, Wrench, Settings, ArrowRight, 
  Palette, Film, Megaphone, Package, Cpu, Shield, Network, Cloud, Headphones, 
  BarChart, BrainCircuit, ChevronLeft, ChevronRight 
} from "lucide-react";

export default function ServicesSection() {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      // Adjusted scroll amount to match the new smaller card widths
      const scrollAmount = 380; 
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#050B14] transition-colors duration-300 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header with Navigation Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between max-w-full mb-12 gap-6 text-center md:text-left">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              Solutions made easy.
            </h2>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Swipe through our services. We assist clients of all sizes in seamlessly adapting to and implementing digital technologies.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 justify-center md:justify-end shrink-0 mb-1">
            <button 
              onClick={() => scroll("left")}
              className="p-3 rounded-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-3 rounded-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-10 pt-4 px-4 -mx-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          
          {/* Card 1: Engineering */}
          <Card className="snap-center shrink-0 flex flex-col w-[85vw] sm:w-[360px] bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-2.5 shadow-lg hover:shadow-xl dark:shadow-none backdrop-blur-xl transition-all duration-500 group">
            <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden mb-6">
              <div className="absolute inset-0 bg-blue-900/10 dark:bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
              <img
                src="/img/programming.jpg"
                alt="Engineering"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
            </div>
            <div className="px-5 pb-5 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-5">
                Software Engineering
              </h3>
              <ul className="space-y-2.5 mb-8 flex-grow">
                {[
                  { icon: Code, text: "Web Development" },
                  { icon: Smartphone, text: "Mobile App Development" },
                  { icon: Calculator, text: "POS Systems" },
                  { icon: ShoppingCart, text: "E-Commerce Platforms" },
                  { icon: Wrench, text: "Maintenance & Support" },
                  { icon: Settings, text: "QA & Testing" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium text-sm group/item cursor-default">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md group-hover/item:bg-[#0B1528] group-hover/item:text-white text-slate-400 transition-colors duration-300">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors duration-300">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/category/softwarePage"
                className="mt-auto flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-300 group/btn bg-slate-50 text-slate-700 hover:bg-[#0B1528] hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-[#ffddb2] dark:hover:text-slate-800"
              >
                Explore Services
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Card>

          {/* Card 2: Creative */}
          <Card className="snap-center shrink-0 flex flex-col w-[85vw] sm:w-[360px] bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-2.5 shadow-lg hover:shadow-xl dark:shadow-none backdrop-blur-xl transition-all duration-500 group">
            <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden mb-6">
              <div className="absolute inset-0 bg-blue-900/10 dark:bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
              <img
                src="/img/marketing.jpg"
                alt="Creative"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
            </div>
            <div className="px-5 pb-5 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-5">
                Digital Media & Design
              </h3>
              <ul className="space-y-2.5 mb-8 flex-grow">
                {[
                  { icon: Palette, text: "Graphic Design" },
                  { icon: Film, text: "Video Editing" },
                  { icon: Megaphone, text: "Digital Marketing" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium text-sm group/item cursor-default">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md group-hover/item:bg-[#0B1528] group-hover/item:text-white text-slate-400 transition-colors duration-300">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors duration-300">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <button className="mt-auto flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-300 group/btn bg-slate-50 text-slate-700 hover:bg-[#0B1528] hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-[#ffddb2] dark:hover:text-slate-800">
                View Portfolio
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>

          {/* Card 3: Licensing & Hardware */}
          <Card className="snap-center shrink-0 flex flex-col w-[85vw] sm:w-[360px] bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-2.5 shadow-lg hover:shadow-xl dark:shadow-none backdrop-blur-xl transition-all duration-500 group">
            <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden mb-6">
              <div className="absolute inset-0 bg-blue-900/10 dark:bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
              <img
                src="/img/licen.jpg"
                alt="Hardware"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
            </div>
            <div className="px-5 pb-5 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-5">
                Licensing & Hardware
              </h3>
              <ul className="space-y-2.5 mb-8 flex-grow">
                {[
                  { icon: Package, text: "Enterprise Licensing" },
                  { icon: Cpu, text: "Hardware & Equipment" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium text-sm group/item cursor-default">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md group-hover/item:bg-[#0B1528] group-hover/item:text-white text-slate-400 transition-colors duration-300">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors duration-300">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <button className="mt-auto flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-300 group/btn bg-slate-50 text-slate-700 hover:bg-[#0B1528] hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-[#ffddb2] dark:hover:text-slate-800">
                Browse Hardware
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>

          {/* Card 4: Enterprise Services (Wider Card) */}
          <Card className="snap-center shrink-0 flex flex-col lg:flex-row w-[85vw] sm:w-[600px] lg:w-[700px] bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-2.5 shadow-lg hover:shadow-xl dark:shadow-none backdrop-blur-xl transition-all duration-500 group overflow-hidden">
            
            <div className="relative w-full lg:w-2/5 h-48 lg:h-auto rounded-[1.5rem] overflow-hidden mb-5 lg:mb-0 lg:mr-6 shrink-0">
              <div className="absolute inset-0 bg-blue-900/20 dark:bg-black/40 z-10 group-hover:bg-blue-900/10 transition-colors duration-500"></div>
              <img
                src="/img/cloud2.png" 
                alt="Enterprise Solutions"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-xs">
                  Enterprise
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/5 px-3 lg:px-4 py-4 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
                Cloud, Data & Security
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                    Infrastructure
                  </h4>
                  <ul className="space-y-3">
                    {[
                      { icon: Shield, text: "Cyber Security" },
                      { icon: Network, text: "Network Solutions" },
                      { icon: Cloud, text: "Cloud Services" },
                      { icon: Headphones, text: "IT Support" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium text-sm group/item cursor-default">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md group-hover/item:bg-blue-600 group-hover/item:text-white text-blue-600 dark:text-blue-400 transition-colors duration-300">
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors duration-300">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                    Innovation
                  </h4>
                  <ul className="space-y-3">
                    {[
                      { icon: BarChart, text: "Data Analysis" },
                      { icon: BrainCircuit, text: "AI Solutions" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium text-sm group/item cursor-default">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md group-hover/item:bg-purple-600 group-hover/item:text-white text-purple-600 dark:text-purple-400 transition-colors duration-300">
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors duration-300">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}