import React, { useState } from "react";
import { ArrowRight, Code2, Cpu, Smartphone, Globe } from "lucide-react";

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    "All",
    "Web Development",
    // "AI & IoT",
    //  "Mobile Apps"
  ];

  const projects = [
    // {
    //   title: "Smart Classroom Command Center",
    //   category: "AI & IoT",
    //   image: "/img/portfolio-smart-class.jpg",
    //   description:
    //     "Automated environment control combining a web interface with microcontroller hardware for automated door locks and lighting.",
    //   techStack: ["Laravel", "Arduino", "MySQL"],
    //   icon: <Cpu className="w-4 h-4" />,
    // },
    {
      title: "ICT Center",
      category: "Web Development",
      image: "/img/software/ict-center.png",
      description: "",
      techStack: ["Laravel", "REST API"],
      icon: <Globe className="w-4 h-4" />,
    },
    {
      title: "ICT Solution ",
      category: "Web Development",

      image: "/img/software/ict-solut.png",

      description: "",
      techStack: ["React", "Laravel", "REST API"],
      icon: <Globe className="w-4 h-4" />,
    },
    // {
    //   title: "Face Recognition Attendance",
    //   category: "AI & IoT",
    //   image: "/img/portfolio-face-rec.jpg",
    //   description:
    //     "Local face tracking application engineered with deep learning libraries to optimize camera detection feeds and logging.",
    //   techStack: ["Python", "OpenCV", "Raspberry Pi 5"],
    //   icon: <Cpu className="w-4 h-4" />,
    // },
    // {
    //   title: "E-Commerce Mobile Store",
    //   category: "Mobile Apps",
    //   image: "/img/portfolio-mobile.jpg",
    //   description:
    //     "Native mobile application featuring modern visual designs, custom layout components, and secure authentication flows.",
    //   techStack: ["Kotlin", "Jetpack Compose", "Firebase"],
    //   icon: <Smartphone className="w-4 h-4" />,
    // },
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] py-24 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              Our Work.
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              A selection of our most recent engineering, design, and hardware
              solutions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === cat
                    ? "bg-blue-600 text-white shadow-md dark:bg-blue-500"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {filteredProjects.map((project, idx) => (
            <div
              key={idx}
              className="group flex flex-col bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {project.icon} {project.category}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 flex-grow leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      <Code2 className="w-3 h-3 text-blue-500" /> {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    View Case Study{" "}
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="relative overflow-hidden bg-blue-600 dark:bg-blue-600/20 border border-transparent dark:border-blue-500/30 rounded-[2.5rem] p-10 md:p-16 text-center shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Have a project in mind?
            </h2>
            <p className="text-blue-100 dark:text-blue-200 text-lg mb-8">
              Whether it is a full-stack web application or a custom hardware
              integration, our team is ready to build it.
            </p>
            <a
              href="https://t.me/ictinfo1"
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-slate-50 transition-colors hover:shadow-xl inline-flex items-center gap-2"
            >
              Start a Conversation <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
