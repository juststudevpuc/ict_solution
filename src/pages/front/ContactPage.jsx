import { MapPin, Phone, Mail, Send } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for React-Leaflet's missing default marker icon issue
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;
import { motion } from "framer-motion";

export default function ContactPage() {
  const position = [11.565485376357492, 104.89150611833514];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-slate-50 font-sans antialiased selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-500/30 dark:selection:text-white pb-24 transition-colors duration-300 overflow-x-hidden no-scrollbar">
      
      {/* ======================================= */}
      {/* 1. PAGE HEADER                          */}
      {/* ======================================= */}
      <section className="relative bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#0B1528] dark:to-[#050B14] border-b border-slate-200/60 dark:border-slate-800/60 pt-32 pb-20 md:pt-48 md:pb-24 px-6 lg:px-12 mx-auto text-center overflow-hidden transition-colors duration-300">
        
        {/* Animated Background Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10"
        />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Animated Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="inline-flex items-center justify-center mb-8 px-5 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-3 animate-pulse"></div>
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-[0.2em] uppercase text-xs">
              Let's Connect
            </span>
          </motion.div>

          {/* Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-8"
          >
            Ready to scale your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
              business?
            </span>
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Reach out to our engineering team to discuss your next project,
            request a quote, or learn more about our enterprise solutions.
          </motion.p>
        </div>
      </section>

      {/* ======================================= */}
      {/* 2. CONTACT LAYOUT (Map + Form)          */}
      {/* ======================================= */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* LEFT SIDE: Info & Map */}
          <div className="flex flex-col gap-8">
            
            {/* Contact Details Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Card: Email */}
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none transition-colors duration-300">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-100/30">
                  <Mail size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Email Us
                </h3>
                <a
                  href="mailto:ictsolution3@gmail.com"
                  className="text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-words"
                >
                  ictsolution3@gmail.com
                </a>
              </div>

              {/* Card: Call */}
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none transition-colors duration-300">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-100/30">
                  <Phone size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Call Us
                </h3>
                <a
                  href="tel:092702175"
                  className="text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block layout-default"
                >
                  092 702 175 / 096 287 5270
                </a>
              </div>
            </div>

            {/* Card: Headquarters */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition-colors duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin size={20} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Headquarters
                  </h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">Phnom Penh, Kampuchea Krom</p>
              </div>
              <p className="text-slate-900 dark:text-white font-semibold px-4 py-2 bg-slate-100/80 dark:bg-slate-800 rounded-xl transition-colors text-sm">
                Mr. NHANH NHIM
              </p>
            </div>

            {/* Leaflet Map Container */}
            <div className="w-full h-80 rounded-[2rem] overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-sm relative z-0 dark:brightness-[0.85] dark:contrast-[1.1] transition-all">
              <MapContainer
                center={position}
                zoom={14}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    <strong>ICT Solution</strong> <br /> Kampuchea Krom
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* RIGHT SIDE: The Contact Form */}
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none h-full flex flex-col transition-colors duration-300">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mb-8">
              Send us a message
            </h2>

            <form
              className="flex flex-col gap-5 flex-grow"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="John"
                    className="w-full h-12 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-5 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Doe"
                    className="w-full h-12 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-5 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@company.com"
                  className="w-full h-12 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-5 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-2 flex-grow">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  How can we help?
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us about your project..."
                  className="w-full h-40 resize-none bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 outline-none transition-all"
                ></textarea>
              </div>

              <button className="group mt-4 w-full h-12 flex items-center justify-center gap-2 bg-[#0B1528] hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 font-semibold rounded-xl transition-all duration-300 shadow-sm">
                <span>Send Message</span>
                <Send
                  size={16}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                />
              </button>
            </form>
          </div>
          
        </div>
      </section>
    </div>
  );
}