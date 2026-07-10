import React from "react";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

export default function Portfolio() {
  const projects = [
    {
      title: "Smart Classroom Manager",
      category: "AI & IoT",
      image: "/img/portfolio-1.jpg", // Add your images to public/img
      description: "Face recognition attendance and IoT hardware integration.",
    },
    {
      title: "Enterprise POS System",
      category: "Web Development",
      image: "/img/portfolio-2.jpg",
      description: "Full-stack point of sale with real-time inventory tracking.",
    },
    {
      title: "FinTech Dashboard",
      category: "UI/UX Design",
      image: "/img/portfolio-3.jpg",
      description: "Financial analytics platform with interactive charting.",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] py-24 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Our Work.
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            A selection of our most recent engineering and design solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div 
              key={idx} 
              className="group relative flex flex-col bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
                {/* Fallback color if image is missing */}
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
                  {project.category}
                </span>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 flex-grow">
                  {project.description}
                </p>
                <div className="flex gap-4 mt-auto">
                  <button className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    View Project <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}