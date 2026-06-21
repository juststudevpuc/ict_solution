import ServiceCard from "@/components/cards/serviceCard";
import { Cpu, Key, PenTool, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicePage2() {
  const specializedServices = [
    {
      title: "Software Deployment",
      description: "Seamless CI/CD pipelines and secure cloud-native application hosting.",
      icon: Rocket,
    },
    {
      title: "Video Editing & Design",
      description: "Professional motion graphics, branding, and high-end digital media.",
      icon: PenTool,
    },
    {
      title: "Software Licensing",
      description: "Enterprise-grade software procurement and centralized license management.",
      icon: Key,
    },
    {
      title: "Hardware Solutions",
      description: "High-performance workstations, secure servers, and IT infrastructure.",
      icon: Cpu,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <div className="bg-slate-950 min-h-screen font-sans selection:bg-blue-500/30">
      <div className="px-6 py-24 md:py-32 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-blue-500"></div>
            <span className="text-blue-400 font-bold tracking-[0.2em] uppercase text-xs">
              Specialized Solutions
            </span>
            <div className="h-px w-8 bg-blue-500"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">
            Enterprise Infrastructure
          </h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Robust, scalable, and secure technical foundations engineered to accelerate your digital transformation.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full"
        >
          {specializedServices.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group flex flex-col p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 hover:border-blue-500/30 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors duration-500"></div>

              <div className="relative z-10 w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-500">
                <service.icon
                  className="w-7 h-7 text-slate-400 group-hover:text-white transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="relative z-10 text-xl font-medium text-slate-100 mb-4 tracking-tight">
                {service.title}
              </h3>
              <p className="relative z-10 text-base text-slate-400 font-light leading-relaxed flex-grow group-hover:text-slate-300 transition-colors duration-300">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ServiceCard />
    </div>
  );
}