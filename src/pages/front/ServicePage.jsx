import {
  ArrowRight,
  Check,
  Cpu,
  Key,
  PenTool,
  Rocket,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ServicePage() {
  const specializedServices = [
    {
      title: "Software Deployment",
      description:
        "Seamless CI/CD pipelines and secure cloud-native application hosting.",
      icon: Rocket,
    },
    {
      title: "Video Editing & Design",
      description:
        "Professional motion graphics, branding, and high-end digital media.",
      icon: PenTool,
    },
    {
      title: "Software Licensing",
      description:
        "Enterprise-grade software procurement and centralized license management.",
      icon: Key,
    },
    {
      title: "Hardware Solutions",
      description:
        "High-performance workstations, secure servers, and IT infrastructure.",
      icon: Cpu,
    },
  ];
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Added 'h-[90vh] min-h-[600px]' to force the section to be large like a real image banner */}
      <section className="relative w-full h-[40vh] min-h-[400px] md:h-[50vh] flex flex-col justify-end pb-12 md:pb-16 overflow-hidden group bg-slate-900">
        {/* Background Image with slow cinematic entrance */}
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="img/programming.jpg"
          alt="Our Services"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out"
        />

        {/* FIXED Gradient: Added 'from-black/80' so the text pops perfectly! */}
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
                What We Do
              </span>
            </motion.div>

            {/* Fixed Typography Scaling (Smoothly goes from 4xl to 6xl) */}
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
              Our Services. <br />
              <span className="text-white/60">Engineered for scale.</span>
            </motion.h1>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1400px] mx-auto p-6">
        {specializedServices.map((service, index) => (
          <div
            key={index}
            className="flex flex-col p-8 rounded-[1rem] bg-slate-50/80 border border-slate-100 hover:bg-white hover:border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 group cursor-pointer"
          >
            {/* Icon Container */}
            <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:scale-110 group-hover:border-slate-900 transition-all duration-500 shadow-sm">
              <service.icon
                className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors duration-300"
                strokeWidth={1.5}
              />
            </div>

            {/* Text Content */}
            <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
              {service.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
              {service.description}
            </p>
          </div>
        ))}
      </div>
      <section className="py-24 max-w-[1400px] mx-auto px-6 lg:px-5 bg-white font-sans">
        {/* Using items-center ensures the text is perfectly vertically aligned 
        with the center of the image, no matter how tall the image gets! 
      */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* ======================================= */}
          {/* LEFT SIDE: The Framed Image             */}
          {/* ======================================= */}
          <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3]  overflow-hidden bg-slate-100 border border-slate-200 group order-2 lg:order-1">
            <img
              src="img/programming.jpg"
              alt="Software Development"
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
            />
            {/* Subtle inner shadow to make it look like a physical frame */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none"></div>
          </div>

          {/* ======================================= */}
          {/* RIGHT SIDE: Typography & Features       */}
          {/* ======================================= */}
          <div className="flex flex-col max-w-xl order-1 lg:order-2">
            {/* Eyebrow / Kicker */}
            <div className="flex items-center gap-4 mb-6">
              {/* <div className="h-px w-8 bg-blue-600"></div> */}
              {/* <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs">
                Custom Solutions
              </span> */}
            </div>

            <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight leading-[1.1] mb-6">
              Software Engineering.
            </h2>

            <p className="text-lg text-slate-500 font-light leading-relaxed mb-10">
              We build scalable, high-performance web applications and
              enterprise systems tailored to streamline your unique operational
              workflows.
            </p>

            {/* Premium Bullet List (Replacing the basic "- pos") */}
            <ul className="space-y-5 mb-12 border-l-2 border-slate-100 pl-6">
              {[
                "Point of Sale (POS) Systems",
                "Systems Development",
                "E-Commerce Development",
                "Web developmetn",
                "Mobile App development",
                "API Development",
                // "Legacy System Modernization",
                // "Legacy System Modernization",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-slate-700 font-medium group cursor-default"
                >
                  {/* Custom Checkmark Circle */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            {/* Call to Action */}
            <div>
              <a
                href="https://t.me/ictinfo1"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Discuss your project
                {/* The paper plane tilts slightly when hovered! */}
                <Send
                  size={18}
                  className="group-hover:rotate-12 transition-transform duration-300"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-5">
            {/* ======================================= */}
            {/* LEFT SIDE: The Framed Image             */}
            {/* ======================================= */}
            <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3]  overflow-hidden bg-slate-100 border border-slate-200 group order-2 lg:order-2">
              <img
                src="img/vdo.jpg"
                alt="Software Development"
                className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
              />
              {/* Subtle inner shadow to make it look like a physical frame */}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none"></div>
            </div>

            {/* ======================================= */}
            {/* RIGHT SIDE: Typography & Features       */}
            {/* ======================================= */}
            <div className="flex flex-col max-w-xl order-1 lg:order-1">
              {/* Eyebrow / Kicker */}

              <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight leading-[1.1] mb-6">
                Digital Media & Marketing.
              </h2>

              <p className="text-lg text-slate-500 font-light leading-relaxed mb-10">
                We craft compelling visual narratives, intuitive user
                experiences, and data-driven campaigns to elevate your brand
                identity and engage your target audience.
              </p>

              {/* Premium Bullet List */}
              <ul className="space-y-5 mb-12 border-l-2 border-slate-100 pl-6">
                {[
                  "Professional Video Editing",
                  "Creative Graphic Design",
                  "Intuitive UI/UX Design",
                  "Performance Marketing Campaigns",

                  // "Legacy System Modernization",
                  // "Legacy System Modernization",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-slate-700 font-medium group cursor-default"
                  >
                    {/* Custom Checkmark Circle */}
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Call to Action */}
              <div>
                <a
                  href="https://t.me/ictinfo1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Discuss your project
                  {/* The paper plane tilts slightly when hovered! */}
                  <Send
                    size={18}
                    className="group-hover:rotate-12 transition-transform duration-300"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-5">
          {/* ======================================= */}
          {/* LEFT SIDE: The Framed Image             */}
          {/* ======================================= */}
          <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3]  overflow-hidden bg-slate-100 border border-slate-200 group order-2 lg:order-1">
            <img
              src="img/licen2.jpg"
              alt="Software Development"
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
            />
            {/* Subtle inner shadow to make it look like a physical frame */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none"></div>
          </div>

          {/* ======================================= */}
          {/* RIGHT SIDE: Typography & Features       */}
          {/* ======================================= */}
          <div className="flex flex-col max-w-xl order-1 lg:order-2">
            {/* Eyebrow / Kicker */}

            <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight leading-[1.1] mb-6">
              Software Licensing.
            </h2>

            <p className="text-lg text-slate-500 font-light leading-relaxed mb-10">
              We simplify enterprise software procurement. From essential
              productivity suites to advanced AI platforms, we provide
              centralized licensing solutions to keep your team equipped,
              secure, and fully compliant.
            </p>

            {/* Premium Bullet List */}
            <ul className="space-y-5 mb-12 border-l-2 border-slate-100 pl-6">
              {[
                "Enterprise Productivity (Microsoft 365, Workspace)",
                "Advanced AI Tools (ChatGPT Enterprise, Copilot)",
                "Creative & Media Suites (Adobe CC, Canva Pro)",
                "Cloud Infrastructure & Security Subscriptions",

                // "Legacy System Modernization",
                // "Legacy System Modernization",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-slate-700 font-medium group cursor-default"
                >
                  {/* Custom Checkmark Circle */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            {/* Call to Action */}
            <div>
              <a
                href="https://t.me/ictinfo1"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Discuss your project
                {/* The paper plane tilts slightly when hovered! */}
                <Send
                  size={18}
                  className="group-hover:rotate-12 transition-transform duration-300"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-5">
          {/* ======================================= */}
          {/* LEFT SIDE: The Framed Image             */}
          {/* ======================================= */}
          <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3]  overflow-hidden bg-slate-100 border border-slate-200 group order-2 lg:order-2">
            <img
              src="img/hardware.jpg"
              alt="Software Development"
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
            />
            {/* Subtle inner shadow to make it look like a physical frame */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none"></div>
          </div>

          {/* ======================================= */}
          {/* RIGHT SIDE: Typography & Features       */}
          {/* ======================================= */}
          <div className="flex flex-col max-w-xl order-1 lg:order-1">
            {/* Eyebrow / Kicker */}

            <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight leading-[1.1] mb-6">
              Hardware & Infrastructure.
            </h2>

            <p className="text-lg text-slate-500 font-light leading-relaxed mb-10">
              We architect and deploy enterprise-grade IT environments. From
              high-performance workstations to secure server networks, we
              provide the reliable physical hardware your team needs to operate
              at peak efficiency.
            </p>

            {/* Premium Bullet List */}
            <ul className="space-y-5 mb-12 border-l-2 border-slate-100 pl-6">
              {[
                "Enterprise Laptops & High-Performance Workstations",
                "Secure Networking (Routers, Switches & Firewalls)",
                "On-Premise Servers & Scalable Storage Solutions",
                "Integrated POS Hardware & Retail Terminals",

                // "Legacy System Modernization",
                // "Legacy System Modernization",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-slate-700 font-medium group cursor-default"
                >
                  {/* Custom Checkmark Circle */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            {/* Call to Action */}
            <div>
              <a
                href="https://t.me/ictinfo1"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Discuss your project
                {/* The paper plane tilts slightly when hovered! */}
                <Send
                  size={18}
                  className="group-hover:rotate-12 transition-transform duration-300"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
