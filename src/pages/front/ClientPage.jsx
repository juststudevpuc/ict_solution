import {
  Cpu,
  Key,
  LifeBuoy,
  LineChart,
  PenTool,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ClientPage() {
  const clients = [
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
    { name: "Global Finance Corp", img: "image.png" },
  ];

  return (
    <div className="py-24 bg-slate-700">
      <section className="relative w-full h-[40vh] min-h-[400px] md:h-[50vh] flex flex-col justify-end pb-12 md:pb-16 overflow-hidden group bg-slate-900">
        {/* Background Image with slow cinematic entrance */}
        {/* Fixed: Replaced h-120 with h-full so it actually fills the container */}
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="img/handshake02.webp"
          alt="Our Clients and Partners"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out"
        />

        {/* FIXED Gradient: Added 'from-black/80' so your white text is actually readable! */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        {/* Text Content */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            {/* Premium "Eyebrow" Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-8 bg-blue-500"></div>
              <span className="text-blue-400 font-bold tracking-[0.2em] uppercase text-xs">
                Who We Work With
              </span>
            </motion.div>

            {/* Fixed Typography Scaling (Removed the weird sm:text-xl shrink bug) */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="text-white font-medium tracking-tight leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem]"
            >
              Our Clients. <br />
              <span className="text-white/60">Built on trust.</span>
            </motion.h1>
          </div>
        </div>
      </section>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-15">
        {/* Header - Fixed text colors for Dark Mode */}
        <div className="mb-16 md:text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-4">
            Trusted by industry leaders.
          </h2>
          <p className="text-slate-400 font-light text-lg">
            We partner with innovative companies to build, scale, and secure
            their digital infrastructure.
          </p>
        </div>

        {/* The Minimalist Client Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-9 w-full">
          {clients.map((client, index) => (
            <div
              key={index}
              // Changed px-8 to p-4 md:p-6 to give an even, small border of breathing room all the way around
              className="flex items-center justify-center  rounded-sm bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-500 group cursor-pointer"
            >
              {/* The Logo Image */}
              <img
                src={client.img}
                alt={client.name}
                // w-full h-full forces it to take up the whole box. object-contain stops it from stretching weirdly!
                className="w-full h-full object-contain group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
