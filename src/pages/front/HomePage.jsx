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
  BrainCircuit,
  Database,
  Layout,
  Server,
  Cloud,
  Image, // Added this as a placeholder icon
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* ======================================= */}
      {/* 1. HERO SECTION (Cinematic & Minimal)   */}
      {/* ======================================= */}
      {/* 1. The Header: w-screen and h-screen makes it follow the browser size perfectly */}
      <header className="relative w-screen h-screen overflow-hidden">
        {/* 2. The Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          {/* Replace this src with the actual path to your .mp4 file */}
          <source src="/ppct2.mp4" type="video/mp4" />

          {/* Optional fallback image just in case the video fails to load */}
          <img
            src="/img/phnompenh.jpg"
            alt="Phnom Penh City"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </video>

        {/* 3. The Overlay: z-10 to sit on top of the video */}
        <div className="absolute inset-0 bg-slate-70 z-10"></div>

        {/* 4. The Content: z-20 to sit on top of everything */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center w-full h-full px-6">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-5xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-[1.1] mb-8 drop-shadow-md"
            >
              Technology that works. <br className="hidden md:block" />
              <span className="text-slate-300 font-light">
                Business that scales.
              </span>
            </motion.h1>

            {/* Paragraph */}
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

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            >
              <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 focus:ring-4 focus:ring-blue-600/20">
                Start Your Transformation <ArrowRight className="w-5 h-6" />
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      <main>
        {/* ======================================= */}
        {/* 2. FOUNDER SECTION (Mission Statement)  */}
        {/* ======================================= */}
        <section className="py-24 bg-slate-50/50 my-12">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-[40px] opacity-20"></div>
              <img
                src="img/nhim.jpg"
                alt="Mr. Nhem Nhim"
                className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl border-4 border-white z-10"
              />
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-full shadow-xl z-20">
                <Quote className="w-6 h-6 fill-current" />
              </div>
            </div>

            <div className="text-center md:text-left max-w-xl">
              <h2 className="text-2xl md:text-3xl font-medium text-slate-800 tracking-tight leading-relaxed mb-8">
                "Our mission is to empower the next generation of digital
                innovators with the tools they need to change the world."
              </h2>
              <div className="flex flex-col md:items-start items-center">
                <p className="text-xl font-bold text-slate-900">
                  Mr. Nhanh Nhim
                </p>
                <p className="text-blue-600 font-medium tracking-wide text-sm uppercase mt-1">
                  Founder & CEO, ICT Center
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================= */}
        {/* 3. SERVICES SECTION (Clean Cards)       */}
        {/* ======================================= */}
        <section className="py-24 max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Solutions made easy.
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed">
              We assist clients of all sizes in seamlessly adapting to and
              implementing digital technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Engineering */}
            <Card className="relative flex flex-col w-full min-h-[500px] border-none rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
              {/* 1. Full Background Image (Fills the entire card) */}
              <img
                src="img/programming.jpg"
                alt="Engineering"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out z-0"
              />

              {/* 2. Dark Gradient Overlay (Crucial for making the white text readable) */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-[#00152e] z-10 transition-opacity duration-500"></div>

              {/* 3. Content Area (Floating above the image and overlay) */}
              <div className="relative z-20 p-8 flex flex-col flex-grow h-full">
                <h3 className="text-2xl font-bold text-white tracking-tight mb-8 drop-shadow-md">
                  Software Engineering
                </h3>

                <ul className="space-y-4 flex-grow mb-10">
                  {[
                    { icon: Code, text: "Web Development" },
                    { icon: Smartphone, text: "Mobile App Development" },
                    { icon: Calculator, text: "POS Systems" },
                    { icon: ShoppingCart, text: "E-Commerce Platforms" },
                    { icon: Wrench, text: "Maintenance & Support" },
                    { icon: Settings, text: "QA & Testing" },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-slate-200 font-medium group/item hover:text-white transition-colors cursor-default"
                    >
                      {/* Frosted Glass Icon Wrapper */}
                      <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 group-hover/item:bg-blue-600 group-hover/item:border-blue-500 text-blue-300 group-hover/item:text-white transition-all duration-300 shadow-sm">
                        <item.icon className="w-5 h-5" />
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>

                {/* Frosted Glass Button */}
                <button className="flex items-center justify-between w-full py-4 px-6 bg-white/10 hover:bg-blue-600 text-white backdrop-blur-md border border-white/20 hover:border-blue-500 rounded-2xl font-semibold transition-all duration-300 group/btn focus:ring-4 focus:ring-blue-600/30 shadow-lg">
                  Explore Services{" "}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </Card>

            {/* Card 2: Creative */}
            {/* Card 2: Creative & Branding */}
            <Card className="relative flex flex-col w-full min-h-[500px] border-none rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
              <img
                src="img/marketing.jpg"
                alt="Creative"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out z-0"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-[#00152e] z-10 transition-opacity duration-500"></div>

              <div className="relative z-20 p-8 flex flex-col flex-grow h-full">
                <h3 className="text-2xl font-bold text-white tracking-tight mb-8 drop-shadow-md">
                  Digital Media & Design
                </h3>

                <ul className="space-y-4 flex-grow mb-10">
                  {[
                    { icon: Palette, text: "Graphic Design" },
                    { icon: Film, text: "Video Editing" },
                    { icon: Megaphone, text: "Digital Marketing" },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-slate-200 font-medium group/item hover:text-white transition-colors cursor-default"
                    >
                      <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 group-hover/item:bg-blue-600 group-hover/item:border-blue-500 text-blue-300 group-hover/item:text-white transition-all duration-300 shadow-sm">
                        <item.icon className="w-5 h-5" />
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>

                <button className="flex items-center justify-between w-full py-4 px-6 bg-white/10 hover:bg-blue-600 text-white backdrop-blur-md border border-white/20 hover:border-blue-500 rounded-2xl font-semibold transition-all duration-300 group/btn focus:ring-4 focus:ring-blue-600/30 shadow-lg">
                  View Portfolio{" "}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </Card>

            {/* Card 3: Licensing & Hardware */}
            <Card className="relative flex flex-col w-full min-h-[500px] border-none rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
              <img
                src="img/licen.jpg"
                alt="Hardware"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out z-0"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-[#00152e] z-10 transition-opacity duration-500"></div>

              <div className="relative z-20 p-8 flex flex-col flex-grow h-full">
                <h3 className="text-2xl font-bold text-white tracking-tight mb-8 drop-shadow-md">
                  Licensing & Hardware
                </h3>

                <ul className="space-y-4 flex-grow mb-10">
                  {[
                    { icon: Package, text: "Enterprise Licensing" },
                    { icon: Cpu, text: "Hardware & Equipment" },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-slate-200 font-medium group/item hover:text-white transition-colors cursor-default"
                    >
                      <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 group-hover/item:bg-blue-600 group-hover/item:border-blue-500 text-blue-300 group-hover/item:text-white transition-all duration-300 shadow-sm">
                        <item.icon className="w-5 h-5" />
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>

                <button className="flex items-center justify-between w-full py-4 px-6 bg-white/10 hover:bg-blue-600 text-white backdrop-blur-md border border-white/20 hover:border-blue-500 rounded-2xl font-semibold transition-all duration-300 group/btn focus:ring-4 focus:ring-blue-600/30 shadow-lg">
                  Request Quote{" "}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </Card>
          </div>
          {/* why choose us */}
          {/* ======================================= */}
          {/* 4. WHY CHOOSE US (Value Proposition)    */}
          {/* ======================================= */}
          <div className="py-20 bg-white max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
              {/* <span className="text-blue-600 font-semibold tracking-widest uppercase text-xs mb-4">
                The ICT Advantage
              </span> */}
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                Why businesses choose ICT Solution{" "}
                <br className="hidden md:block" />
                as their technology partner.
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-3xl">
                We help startups, growing businesses, and enterprises build
                reliable, scalable software solutions. By applying AI where it
                adds real value, we improve efficiency, accuracy, and long-term
                system performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Benefit 1: Reliability */}
              <div className="flex flex-col p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                  <ShieldCheck className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  100% Reliable
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Your business needs software that just works. We build strong
                  systems that won't crash or slow down, even as your company
                  grows.
                </p>
              </div>

              {/* Benefit 2: Speed */}
              <div className="flex flex-col p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                  <Rocket className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  fast Deployment
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Time is money. Our agile development process ensures your
                  software gets to market faster without sacrificing quality.
                </p>
              </div>

              {/* Benefit 3: AI/Innovation */}
              <div className="flex flex-col p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                  <Zap className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  AI-Driven Innovation
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  We integrate practical AI automation to reduce manual labor,
                  eliminate errors, and drastically scale your operations.
                </p>
              </div>

              {/* Benefit 4: Support */}
              <div className="flex flex-col p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                  <Users className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  Customer Support
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  We don't just launch and leave. You get a dedicated technical
                  team for ongoing maintenance, updates, and scaling.
                </p>
              </div>
            </div>
          </div>
          {/* ======================================= */}
          {/* 5. technology that we use     */}
          {/* ======================================= */}
          <div className="py-24 bg-white relative">
            {/* Subtle background glow - keeping your existing design element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                {/* <span className="text-blue-600 font-semibold tracking-widest uppercase text-xs mb-4">
                  Our Tech Stack
                </span> */}
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                  Technology Behind the Modern Software
                </h2>
                <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed">
                  Our teams work with modern software architectures, cloud
                  platforms, and applied AI technologies to build secure,
                  scalable systems designed for real-world production use.
                </p>
              </div>

              {/* Tech Stack Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4 md:px-10">
                {[
                  // Add unique imageUrls here. If lucide icons are needed, keep the structure.
                  // For distinct images, add the `imageUrl` property.
                  {
                    name: "Cloud Infrastructure",
                    tool: "AWS & Google Cloud",
                    icon: Cloud,
                    imageUrl: "/img/cloud.jpg",
                  },
                  // {
                  //   name: "Backend Architecture",
                  //   tool: "Node.js & Python",
                  //   icon: Server,
                  //   imageUrl: "/img/backend-bg.jpg",
                  // },
                  {
                    name: "Programming Languages  ",
                    // tool: "React & Next.js",
                    icon: Layout,
                    imageUrl: "/img/code.jpeg",
                  },
                  {
                    name: "Database Systems",
                    tool: "MySQL & MongoDB",
                    icon: Database,
                    imageUrl: "/img/db.webp",
                  },
                  // {
                  //   name: "AI & Machine Learning",
                  //   tool: "OpenAI & TensorFlow",
                  //   icon: BrainCircuit,
                  //   imageUrl: "/img/ai-bg.jpg",
                  // },
                  {
                    name: "Mobile Development",
                    tool: "React Native & Flutter",
                    icon: Smartphone,
                    imageUrl: "/img/app.png",
                  },
                  {
                    name: "Version Control",
                    tool: "GitHub & CI/CD",
                    icon: Github,
                    imageUrl: "/img/github.jpg",
                  },
                  {
                    name: "Security & Auth",
                    tool: "OAuth & JWT",
                    icon: ShieldCheck,
                    imageUrl: "/img/jwt.webp",
                  },
                ].map((tech, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center justify-center p-8 bg-slate-900 rounded-3xl hover:-translate-y-1 transition-all duration-300 group cursor-default overflow-hidden border border-slate-700 hover:border-blue-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20"
                    style={{
                      backgroundImage: `url(${tech.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* 1. Dark Overlay (Essential for text readability) */}
                    <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/80 transition-colors z-10"></div>

                    {/* 2. Frosted Glass Hover Effect */}
                    <div className="absolute inset-0 backdrop-blur-sm group-hover:backdrop-blur-none transition z-0 opacity-0 group-hover:opacity-100"></div>

                    {/* 3. Icon and Text Content (Floating above image and overlay) */}
                    <div className="relative z-20 flex flex-col items-center justify-center text-center">
                      {/* Icon Wrapper - made frosted glass */}
                      <div className="w-16 h-16">
                        <tech className="w-8 h-8 text-blue-300 group-hover:text-white transition-colors" />
                      </div>

                      {/* Text Content - now white/blue */}
                      <h3 className="text-white font-bold text-center mb-1 drop-shadow-sm">
                        {tech.name}
                      </h3>
                      <p className="text-blue-400 text-sm font-medium text-center drop-shadow-sm">
                        {tech.tool}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* ======================================= */}
          {/* 6. Our client     */}
          {/* ======================================= */}
          <div className="">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                {/* <span className="text-blue-600 font-semibold tracking-widest uppercase text-xs mb-4">
                  Our Tech Stack
                </span> */}
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                  Our Clients and Partnerships
                </h2>
                <p className="text-slate-600">
                  We help our clients optimize business spend and maximize their
                  revenues
                </p>
                <div className="">
                  <Slider />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
