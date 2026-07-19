import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function ClientSlider() {
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const originalSlider = [
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

  // We render the list twice to create the infinite loop trick
  const slider = [...originalSlider, ...originalSlider];

  // 🔥 NEW: Smooth Continuous Scroll using requestAnimationFrame
  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (!sliderElement) return;

    let animationFrameId;
    
    // Adjust this number to make it scroll faster or slower
    const scrollSpeed = 3; 

    const scrollContinuous = () => {
      if (!isPaused) {
        sliderElement.scrollLeft += scrollSpeed;
        
        // The Magic Trick: Once we scroll past the first set of duplicated items, 
        // instantly silently reset back to 0. It happens so fast the eye can't see it!
        if (sliderElement.scrollLeft >= sliderElement.scrollWidth / 2) {
          sliderElement.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollContinuous);
    };

    animationFrameId = requestAnimationFrame(scrollContinuous);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  // Manual scroll for the buttons
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 350;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-100 dark:bg-[#050B14] dark:text-white py-8 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        
        <div
          className="relative w-full group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Navigation Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex rounded-full shadow-md"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>

          {/* Right Navigation Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex rounded-full shadow-md"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>

          {/* 🔥 FIXED: Gradients now fade correctly in both Light and Dark mode */}
          <div className="absolute top-0 bottom-0 left-0 w-12 md:w-24 bg-gradient-to-r from-slate-100 dark:from-[#050B14] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-12 md:w-24 bg-gradient-to-l from-slate-100 dark:from-[#050B14] to-transparent z-10 pointer-events-none"></div>

          {/* 🔥 FIXED: Removed snap classes so it doesn't stutter while auto-scrolling */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {slider.map((client, index) => (
              <article
                key={index}
                // 🔥 FIXED: Added proper dark mode background and border
                className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900/60 transition-all duration-300 shrink-0 w-[240px] md:w-[260px] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-grab active:cursor-grabbing group/card rounded-xl"
              >
                <div className="relative w-full h-24 mb-6 flex items-center justify-center">
                  <img
                    src={client.img}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain opacity-100"
                  />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight text-center transition-colors">
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