import React from "react";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

export default function Careers() {
  const jobs = [
    { title: "Frontend Developer", location: "Phnom Penh / Remote", type: "Full-time", dept: "Engineering" },
    { title: "Backend Developer (Laravel)", location: "Phnom Penh", type: "Full-time", dept: "Engineering" },
    { title: "IT Support Specialist", location: "Kandal", type: "Part-time", dept: "IT" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] py-24 transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Join us.
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Help us build exceptional digital experiences. 
          </p>
        </div>

        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <div 
              key={idx} 
              className="group bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 rounded-[1.5rem] hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.dept}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.type}</span>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-50 dark:hover:text-slate-900 px-6 py-3 rounded-full font-semibold transition-colors duration-300 shrink-0">
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}