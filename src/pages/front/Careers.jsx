import React, { useState, useEffect } from "react";
// Added Loader2 for a spinning loading icon
import { Briefcase, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
// Import your request utility (adjust the path if necessary!)
import { request } from "@/utils/request/request";
import { Link } from "react-router-dom";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when the component loads
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // 🔥 Hits your PUBLIC route (only returns 'open' jobs)
      const res = await request("careers", "get");

      // We use the exact same bulletproof unwrapping logic as your admin panel
      let fetchedData = [];
      if (Array.isArray(res)) {
        fetchedData = res;
      } else if (res && Array.isArray(res.data)) {
        fetchedData = res.data;
      } else if (res?.data && Array.isArray(res.data.data)) {
        fetchedData = res.data.data;
      }

      setJobs(fetchedData);
    } catch (error) {
      console.error("Error fetching public careers:", error);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Conditional Rendering based on data state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600 dark:text-blue-500" />
              <p>Loading available positions...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-12 rounded-[1.5rem] text-center">
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                There are currently no open positions. Please check back later!
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id || job.id}
                className="group bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 rounded-[1.5rem] hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />{" "}
                      {job.department || "General"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {job.location || "Remote"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {job.job_type}
                    </span>
                  </div>
                </div>
               <Link 
                  to={`/careers/info/${job._id || job.id}`} 
                  className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-50 dark:hover:text-slate-900 px-6 py-3 rounded-full font-semibold transition-colors duration-300 shrink-0"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
