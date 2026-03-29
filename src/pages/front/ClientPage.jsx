import { motion } from "framer-motion";

export default function ClientPage() {
  // Loaded your actual client data!
  const clients = [
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
    // Changed to bg-slate-900 so the whole page feels like one seamless, premium dark-mode experience
    <div className="bg-slate-900 min-h-screen pb-24">
      
      {/* ======================================= */}
      {/* 1. ANIMATED BANNER                      */}
      {/* ======================================= */}
      <section className="relative w-full h-[40vh] min-h-[400px] md:h-[50vh] flex flex-col justify-end pb-12 md:pb-16 overflow-hidden group bg-black">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="img/handshake02.webp"
          alt="Our Clients and Partners"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />

        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-8 bg-blue-500"></div>
              <span className="text-blue-400 font-bold tracking-[0.2em] uppercase text-xs">
                Who We Work With
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-white font-medium tracking-tight leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem]"
            >
              Our Clients, <br />
              <span className="text-white/60">Built on trust.</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 2. MINIMALIST GRID                      */}
      {/* ======================================= */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-20">
        
        <div className="mb-16 md:text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-4">
            Trusted by industry leaders.
          </h2>
          <p className="text-slate-400 font-light text-lg">
            We partner with innovative companies to build, scale, and secure
            their digital infrastructure.
          </p>
        </div>

        {/* Changed to grid-cols-4 for big, spacious logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
          {clients.map((client, index) => (
            <div
              key={index}
              // Ultra-clean card: No shadow, no translate-y hover effects. Just a crisp border change.
              className="flex flex-col items-center justify-center p-8 rounded-sm bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-500 transition-colors duration-300 group cursor-default"
            >
              {/* Big Logo Wrapper */}
              <div className="relative w-full h-20 mb-6 flex items-center justify-center">
                <img
                  src={client.img}
                  alt={client.name}
                  // Original image: No grayscale, 100% opacity
                  className="max-w-full max-h-full object-contain opacity-100"
                />
              </div>

              {/* Client Name Centered */}
              <h3 className="text-base font-semibold text-slate-300 tracking-tight text-center group-hover:text-white transition-colors duration-300">
                {client.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}