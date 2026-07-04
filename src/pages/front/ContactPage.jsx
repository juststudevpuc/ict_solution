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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 pb-24">
      {/* ======================================= */}
      {/* 1. PAGE HEADER                          */}
      {/* ======================================= */}
      <section className="relative bg-gradient-to-b from-blue-950 to-slate-100/80 border-b border-slate-200 pt-32 pb-20 md:pt-48 md:pb-24 px-6 lg:px-12 mx-auto text-center overflow-hidden">
        {/* 1. Animated Background Glow (Slowly blooms outward on load) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none -z-10"
        />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* 2. Animated Pill Badge (Slides up first) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="inline-flex items-center justify-center mb-8 px-5 py-2 rounded-full bg-white border border-blue-100 shadow-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3 animate-pulse"></div>
            <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs">
              Let's Connect
            </span>
          </motion.div>

          {/* 3. Animated Heading (Slides up second) */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium text-slate-900 tracking-tight leading-[1.05] mb-8"
          >
            Ready to scale your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              business?
            </span>
          </motion.h1>

          {/* 4. Animated Subtitle (Slides up last) */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="text-lg md:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto"
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
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Mail size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Email Us
                </h3>
                <a
                  href="mailto:sak220506@gmail.com"
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                >
                  ictsolution3@gmail.com
                </a>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Phone size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Call Us
                </h3>
                <a
                  href="tel:0976765045"
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                >
                  092 702 175 / 096 287 5270
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin size={20} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Headquarters
                  </h3>
                </div>
                <p className="text-slate-500">Phnom Penh, Kampuchea Krom</p>
              </div>
              <p className="text-slate-900 font-medium">Mr.NHANH NHIM </p>
            </div>

            {/* Leaflet Map Container */}
            <div className="w-full h-80 rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm relative z-0">
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
                    <strong>ICT Solution</strong> <br /> Kampuchea krom
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* RIGHT SIDE: The Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-8">
              Send us a message
            </h2>

            <form
              className="flex flex-col gap-6 flex-grow"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-slate-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="John"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-slate-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-2 flex-grow">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-slate-700"
                >
                  How can we help?
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us about your project..."
                  className="w-full h-40 resize-none bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                ></textarea>
              </div>

              <button className="group mt-auto w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors duration-300 shadow-md hover:shadow-xl">
                Send Message
                <Send
                  size={18}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
