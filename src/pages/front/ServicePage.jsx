import {
  ArrowRight,
  CheckCircle2,
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
      link: "/category/softwarePage",
    },
    {
      title: "Video Editing & Design",
      description:
        "Professional motion graphics, branding, and high-end digital media.",
      icon: PenTool,
      link: "/services/video-editing",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* ======================================= */}
      {/* 1. HERO SECTION                         */}
      {/* ======================================= */}
      <section className="relative w-full h-[45vh] min-h-[400px] md:h-[55vh] flex flex-col justify-end pb-16 overflow-hidden group bg-slate-950">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="img/programming.jpg"
          alt="Our Services"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out opacity-80"
        />

        {/* Smooth, deep gradient for perfect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10" />

        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-10 bg-blue-500"></div>
              <span className="text-blue-400 font-bold tracking-[0.2em] uppercase text-xs">
                What We Do
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-white font-semibold tracking-tight leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem]"
            >
              Our Services. <br />
              <span className="text-white/50 font-light">Engineered for scale.</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 2. CATEGORIES GRID                      */}
      {/* ======================================= */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
              Categories
            </h2>
            <p className="text-slate-500 font-normal text-lg leading-relaxed">
              Targeted expertise to solve your most complex technical challenges and elevate your digital presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
            {specializedServices.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group flex flex-col items-start p-10 bg-slate-50 rounded-3xl border border-slate-200/60 hover:bg-white hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="mb-8 p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300">
                  <service.icon size={32} strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                  {service.title}
                </h3>

                <p className="text-slate-500 font-light leading-relaxed mb-8 flex-grow text-lg">
                  {service.description}
                </p>

                <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                  Explore category
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1.5 transition-transform"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 3. FEATURE: SOFTWARE ENGINEERING        */}
      {/* ======================================= */}
      <section className="py-20 lg:py-28 max-w-[1400px] mx-auto px-6 lg:px-12 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="flex flex-col max-w-xl order-2 lg:order-1">
            <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Software Engineering.
            </h2>
            <p className="text-lg text-slate-500 font-light leading-relaxed mb-10">
              We build scalable, high-performance web applications and enterprise systems tailored to streamline your unique operational workflows.
            </p>

            <ul className="space-y-4 mb-12">
              {[
                "Point of Sale (POS) Systems",
                "Systems Development",
                "E-Commerce Development",
                "Web Development",
                "Mobile App Development",
                "API Development",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-slate-700 font-medium text-lg">
                  <CheckCircle2 size={24} className="text-blue-500 shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div>
              <a
                href="https://t.me/ictinfo1"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Discuss your project
                <Send size={18} className="group-hover:rotate-12 transition-transform duration-300" />
              </a>
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-slate-100 group order-1 lg:order-2 shadow-2xl shadow-slate-200/50">
            <img
              src="img/programming.jpg"
              alt="Software Development"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2.5rem] pointer-events-none"></div>
          </div>

        </div>
      </section>

      {/* ======================================= */}
      {/* 4. FEATURE: DIGITAL MEDIA               */}
      {/* ======================================= */}
      <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-slate-200 group order-1 lg:order-1 shadow-2xl shadow-slate-200/50">
              <img
                src="img/vdo.jpg"
                alt="Digital Media & Marketing"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2.5rem] pointer-events-none"></div>
            </div>

            <div className="flex flex-col max-w-xl order-2 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Digital Media & Marketing.
              </h2>
              <p className="text-lg text-slate-500 font-light leading-relaxed mb-10">
                We craft compelling visual narratives, intuitive user experiences, and data-driven campaigns to elevate your brand identity and engage your target audience.
              </p>

              <ul className="space-y-4 mb-12">
                {[
                  "Professional Video Editing",
                  "Creative Graphic Design",
                  "Intuitive UI/UX Design",
                  "Performance Marketing Campaigns",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700 font-medium text-lg">
                    <CheckCircle2 size={24} className="text-blue-500 shrink-0 mt-0.5" strokeWidth={2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div>
                <a
                  href="https://t.me/ictinfo1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Discuss your project
                  <Send size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}