import Slider from "@/components/cards/slider";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Calculator,
  Code,
  Cpu,
  Film,
  Megaphone,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Smartphone,
  Wrench,
  Quote,
  Users,
  Zap,
  Rocket,
  ShieldCheck,
  Github,
  Database,
  Layout,
  Cloud,
  BrainCircuit,
  BarChart,
  Headphones,
  Network,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ServicesSection from "@/components/cards/ServicesSection";

export default function HomePage() {
  const navigate = useNavigate();

  const navClick = () => {
    navigate("service");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-slate-50 font-sans antialiased selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-500/30 dark:selection:text-white overflow-x-hidden transition-colors duration-300 no-scrollbar">
      {/* ======================================= */}
      {/* 1. HERO SECTION                         */}
      {/* ======================================= */}
      {/* Note: Hero text stays light because the video/image background is always dark */}
      <header className="relative w-screen h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/0323.mp4" type="video/mp4" />
          <img
            src="/img/phnompenh.jpg"
            alt="Phnom Penh City"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </video>

        {/* Darkened overlay to ensure text readability */}
        <div className="absolute inset-0 bg-slate-950/40 z-10"></div>

        <div className="relative z-20 flex flex-col items-center justify-center text-center w-full h-full px-6">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-[1.1] mb-8 drop-shadow-md"
            >
              Technology that works. <br className="hidden md:block" />
              <span className="text-blue-100 font-light opacity-90">
                Business that scales.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed mb-12 drop-shadow-md"
            >
              We provide the robust IT infrastructure, custom software, and
              digital strategies you need to streamline operations and
              accelerate your revenue growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            >
              <a
                href="https://t.me/nhanhnhim"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgb(37,99,235,0.4)] hover:-translate-y-1 focus:ring-4 focus:ring-blue-600/30"
              >
                Start Your Transformation <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </header>

      <main>
        {/* ======================================= */}
        {/* 2. OUR CLIENTS                          */}
        {/* ======================================= */}
        <section className="py-20 bg-slate-100 dark:bg-[#050B14] border-b border-slate-100 dark:border-slate-800/50 transition-colors duration-300">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight mb-4">
                Trusted by industry leaders
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                We help our clients optimize business spend and maximize their
                revenues.
              </p>
            </div>

            <div className="w-full">
              {/* Ensure your <Slider /> component also has dark mode classes inside it! */}
              <Slider />
            </div>
          </div>
        </section>

        <div className="">
          <ServicesSection />
        </div>

        {/* ======================================= */}
        {/* 4. FOUNDER SECTION                      */}
        {/* ======================================= */}
        <section className="py-24 bg-slate-100 dark:bg-[#050B14] border-y border-slate-100 dark:border-slate-800/50 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
            {/* Image & Icon Wrapper */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-[60px] opacity-20 dark:opacity-40"></div>
              <img
                src="/img/nhim.jpg"
                alt="Mr. Nhem Nhim"
                className="relative w-56 h-56 md:w-72 md:h-72 rounded-full object-cover shadow-2xl border-4 border-white dark:border-slate-800 z-10 transition-colors"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-4 rounded-full shadow-xl z-20 ring-4 ring-white dark:ring-slate-900 transition-colors">
                <Quote className="w-6 h-6 fill-current" />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight mb-8">
                Message from the CEO
              </h2>

              <div className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed space-y-5 mb-10">
                <p>
                  Welcome to ICT Solution Co., Ltd. Our mission is to empower
                  businesses and individuals through innovative, reliable, and
                  high-quality technology solutions. Since our founding, we have
                  been committed to delivering excellence in software
                  development, web and mobile application development, UI/UX
                  design, IT consulting, and digital transformation services.
                </p>
                <p>
                  As the CEO & Founder, I firmly believe that technology is more
                  than just a tool—it is a driving force for innovation, growth,
                  and long-term success. Our dedicated team continuously strives
                  to create practical, scalable, and user-focused solutions that
                  help our clients achieve their goals in an ever-evolving
                  digital world.
                </p>
                <p className="font-medium text-slate-900 dark:text-slate-200 italic border-l-4 border-blue-600 pl-6 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-r-2xl">
                  "Thank you for your trust and confidence in ICT Solution Co.,
                  Ltd. We look forward to partnering with you and shaping a
                  smarter digital future together."
                </p>
              </div>

              {/* Signature Block */}
              <div className="flex flex-col md:items-start items-center">
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  Mr. Nhanh Nhim
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-medium tracking-wide text-sm uppercase mt-1">
                  CEO & Founder
                </p>
                <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide text-sm mt-0.5">
                  ICT Solution Co., Ltd.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================= */}
        {/* 5. WHY CHOOSE US                        */}
        {/* ======================================= */}
        <section className="py-24 bg-slate-100 dark:bg-[#050B14] transition-colors duration-300">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
                Why businesses choose ICT Solution{" "}
                <br className="hidden md:block" />
                as their technology partner.
              </h2>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-3xl">
                We help startups, growing businesses, and enterprises build
                reliable, scalable software solutions. By applying AI where it
                adds real value, we improve efficiency, accuracy, and long-term
                system performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "100% Reliable",
                  desc: "Your business needs software that just works. We build strong systems that won't crash or slow down.",
                },
                {
                  icon: Rocket,
                  title: "Fast Deployment",
                  desc: "Time is money. Our agile development process ensures your software gets to market faster.",
                },
                {
                  icon: Zap,
                  title: "AI-Driven Innovation",
                  desc: "We integrate practical AI automation to reduce manual labor and drastically scale your operations.",
                },
                {
                  icon: Users,
                  title: "Customer Support",
                  desc: "We don't just launch and leave. You get a dedicated technical team for ongoing maintenance.",
                },
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col p-8 rounded-[2rem] bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 group"
                  >
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                      <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {benefit.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
