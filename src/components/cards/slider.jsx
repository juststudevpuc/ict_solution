import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function ClientSlider() {
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 350; 
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        
        // If we have reached the very end of the scrollable track
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
          // behavior: "auto" makes it instantly snap to the start WITHOUT the fast rewind animation
          sliderRef.current.scrollTo({ left: 280, behavior: "auto" });
        } else {
          // Normal smooth scroll to the right
          sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
      }
    }, 3000); 

    return () => clearInterval(intervalId);
  }, [isPaused]);

  // To make the loop feel longer before it resets, we can duplicate the array
  // This helps trick the eye into feeling like it goes on forever
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

  // We render the list twice so it feels like a massive continuous list
  const slider = [...originalSlider, ...originalSlider];

  return (
    <section className="relative overflow-hidden bg-slate-100 dark:bg-[#050B14] dark:text-white py-8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        
        <div 
          className="relative w-full group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12  bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-colors duration-300 opacity-0 group-hover:opacity-100 hidden md:flex rounded-full shadow-sm"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-colors duration-300 opacity-0 group-hover:opacity-100 hidden md:flex rounded-full shadow-sm"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>

          <div className="absolute top-0 bottom-0 left-0 w-12 md:w-24 bg-gradient-to-r  to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-12 md:w-24 bg-gradient-to-lto-transparent z-10 pointer-events-none"></div>

          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {slider.map((client, index) => (
              
              <article
                key={index}
                className="relative flex flex-col items-center justify-center p-8 bg-white transition-all duration-300 shrink-0 snap-center w-[240px] md:w-[260px] border border-slate-200 hover:border-slate-300 cursor-grab active:cursor-grabbing group/card rounded-xl"
              >
                <div className="relative w-full h-24 mb-6 flex items-center justify-center">
                  <img
                    src={client.img}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain opacity-100"
                  />
                </div>

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