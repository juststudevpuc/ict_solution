import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Slider } from "radix-ui";
import { useRef } from "react";

export default function slider() {
  // 1. Reference for our scroll container
  const sliderRef = useRef(null);

  // 2. Scroll function for the custom buttons
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 320; // Width of card + gap
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 3. Your Data Array
  const slider = [
    {
      name: "Kell Dawx",
      description:
        "Passionate about development and design, I carry out projects at the request of users.",
      img: "assets/img/avatar-1.png", // Update these paths to your actual images
    },
    {
      name: "Lotw Fox",
      description:
        "Passionate about development and design, I carry out projects at the request of users.",
      img: "assets/img/avatar-2.png",
    },
    {
      name: "Sara Mit",
      description:
        "Passionate about development and design, I carry out projects at the request of users.",
      img: "assets/img/avatar-3.png",
    },
    {
      name: "Jenny Wert",
      description:
        "Passionate about development and design, I carry out projects at the request of users.",
      img: "assets/img/avatar-4.png",
    },
    {
      name: "Lexa Kin",
      description:
        "Passionate about development and design, I carry out projects at the request of users.",
      img: "assets/img/avatar-5.png",
    },
  ];

  return (
    <section className="relative overflow-hidden ">
      <div className="max-w-[1400px] mx-auto px-7 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            {/* <span className="text-blue-600 font-semibold tracking-widest uppercase text-xs mb-4 block">
              Meet The Experts
            </span> */}
            {/* <h2 className="text-3xl text-center md:text-4xl font-bold text-slate-900 tracking-tight">
              Our Dedicated Team
            </h2> */}
          </div>
        </div>

        {/* Carousel Container */}
        {/* OUTER WRAPPER: Keeps everything contained and relative for absolute buttons */}
        <div className="relative w-full max-w-[1400px] mx-auto group ">
          {/* LEFT NAVIGATION BUTTON (Floating) */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 hidden md:flex"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} />
          </button>

          {/* RIGHT NAVIGATION BUTTON (Floating) */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 hidden md:flex"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} />
          </button>

          {/* FADE GRADIENTS: Makes it look like cards are fading off-screen */}
          <div className="absolute top-0 bottom-0 left-0 w-8 md:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-8 md:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

          {/* SCROLLING TRACK */}
          <div
            ref={sliderRef}
            className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory px-8 md:px-12 pb-12 pt-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {slider.map((member, index) => (
              /* INDIVIDUAL CARD (Clean White) */
              <article
                key={index}
                className="relative flex flex-col p-8 bg-slate-100 rounded-[2rem] transition-all duration-500 shrink-0 snap-center w-[280px] md:w-[320px] border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 cursor-grab active:cursor-grabbing group/card"
              >
                {/* Image Wrapper */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  {/* Subtle decorative glow behind image */}
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-0 group-hover/card:opacity-20 transition-opacity duration-500"></div>

                  <img
                    src={member.img}
                    alt={member.name}
                    className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md z-10 bg-slate-50"
                  />
                </div>

                {/* Text Data */}
                <div className="text-center flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {member.name}
                  </h3>

                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4 flex-grow">
                    {member.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
