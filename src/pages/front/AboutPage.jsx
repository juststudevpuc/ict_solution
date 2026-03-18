import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950 selection:bg-white selection:text-black font-sans">
      {/* ======================================= */}
      {/* 1. HERO SECTION (Text on Full Image)    */}
      {/* ======================================= */}
      <section className="relative w-full h-screen flex flex-col justify-end pb-24 md:pb-32 overflow-hidden group">
        {/* Full Screen Background Image */}
        <img
          src="img/ict03.jpg"
          alt="ICT Center Campus"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3000ms] ease-out"
        />

        {/* Deep Bottom Gradient to make text pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

        {/* Minimal Text Content at the bottom */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <h1 className="text-white font-medium tracking-tight leading-[1.05] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] mb-8">
              ICT Solution. <br />
              <span className="text-white/60">Engineered for scale.</span>
            </h1>

            {/* Frosty Glass Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/services")}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-slate-100 text-black font-bold rounded-full transition-all duration-300"
              >
                Explore Services
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-full backdrop-blur-md transition-all duration-300">
                Our Mission
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 2. VISUAL BENTO GRID (Text on Images)   */}
      {/* ======================================= */}
      {/* I wrapped it in a dark section for context, assuming this is on a dark background */}
      <section className="py-24 bg-slate-950 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* ======================================= */}
            {/* 1. IMAGE SIDE (Left)                    */}
            {/* ======================================= */}
            <div className="relative group w-full max-w-2xl mx-auto lg:mx-0">
              {/* Subtle background glow that appears on hover */}
              <div className="absolute -inset-4 bg-white/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition duration-700"></div>

              {/* Framed Image Container */}
              <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800">
                <img
                  src="img/who.jpg"
                  alt="Who we are"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
                />
              </div>
            </div>

            {/* ======================================= */}
            {/* 2. TEXT SIDE (Right)                    */}
            {/* ======================================= */}
            <div className="flex flex-col max-w-2xl mx-auto lg:mx-0">
              {/* Minimalist Kicker/Eyebrow Text */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-slate-700"></div>
                <span className="text-slate-400 font-bold tracking-[0.2em] uppercase text-xs">
                  The Company
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-8 leading-[1.1]">
                Engineers, designers, <br className="hidden md:block" />
                <span className="text-slate-500">and problem solvers.</span>
              </h2>

              {/* Main Paragraph */}
              <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-12">
                We are a collective of digital architects. Our teams work with
                modern software architectures, cloud platforms, and applied AI
                technologies to build secure, scalable systems designed for
                real-world production use.
              </p>

              {/* Optional: Minimalist Stats Grid to add authority */}
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-800/60 mb-10">
                <div>
                  <h4 className="text-4xl md:text-5xl font-light text-white tracking-tighter mb-2">
                    10+
                  </h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Years Experience
                  </p>
                </div>
                <div>
                  <h4 className="text-4xl md:text-5xl font-light text-white tracking-tighter mb-2">
                    200+
                  </h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Projects Shipped
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
