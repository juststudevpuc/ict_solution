import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function ClientSlider() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      // Adjusted scroll amount to match the new, sleeker card width
      const scrollAmount = 280; 
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 1. Removed all descriptions, keeping only name and image
  const slider = [
    { name: "CamboTech", img: "client/cambotech.png" },
    { name: "Camintel", img: "client/camintel.png" },
    { name: "Emerald HUB", img: "client/emeraldhub.jpg" },
    { name: "Ezecom", img: "client/ezecom.webp" },
    { name: "Khmer24", img: "client/khmer24.png" },
    { name: "Loma", img: "client/loma.jpg" },
    { name: "Naki", img: "client/naki.jpg" },
    { name: "Sabay", img: "client/saby.png" },
    { name: "TechnoKhmer", img: "client/technokhmer.jpg" },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        
        {/* Carousel Container */}
        <div className="relative w-full group">
          
          {/* Left Navigation Button (Removed shadow-sm) */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-colors duration-300 opacity-0 group-hover:opacity-100 hidden md:flex rounded-full"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>

          {/* Right Navigation Button (Removed shadow-sm) */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-colors duration-300 opacity-0 group-hover:opacity-100 hidden md:flex rounded-full"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>

          {/* FADE GRADIENTS */}
          <div className="absolute top-0 bottom-0 left-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* SCROLLING TRACK */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {slider.map((client, index) => (
              
              /* MINIMALIST CARD DESIGN (No shadows, centered content) */
              <article
                key={index}
                className="relative flex flex-col items-center justify-center p-8 bg-white transition-all duration-300 shrink-0 snap-center w-[240px] md:w-[260px] border border-slate-200 hover:border-slate-300 cursor-grab active:cursor-grabbing group/card"
              >
                {/* Logo Wrapper - Big and centered */}
                <div className="relative w-full h-24 mb-6 flex items-center justify-center">
                  <img
                    src={client.img}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain opacity-100"
                  />
                </div>

                {/* Client Name */}
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight text-center">
                  {client.name}
                </h3>
              </article>
              
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}