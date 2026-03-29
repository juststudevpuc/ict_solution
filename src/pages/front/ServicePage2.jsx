import ServiceCard from "@/components/cards/serviceCard";
import { Cpu, Key, PenTool, Rocket } from "lucide-react";
// FIX 3: Imported with a Capital 'S'
// import ServiceCard from "@/components/cards/serviceCard";

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

  return (
    // Only applied the padding to the bottom so the white component below sits flush!
    <div className="bg-slate-900 min-h-screen">
      
      {/* Top Section (Dark Mode) */}
      <div className="px-6 py-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {specializedServices.map((service, index) => (
            <div
              key={index}
              className="flex flex-col p-8 rounded-[1rem] bg-slate-50/10 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all duration-500 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 group-hover:border-blue-600 transition-all duration-500 shadow-sm">
                <service.icon
                  className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed mb-8 flex-grow">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FIX 4: Just drop the component right here! It handles its own layout perfectly. */}
      <ServiceCard />
      
    </div>
  );
}