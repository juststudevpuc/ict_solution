import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Clock, 
  Calendar, 
  Users, 
  Banknote,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { request } from "@/utils/request/request";

export default function JobInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await request(`careers/${id}`, "get");
        const fetchedJob = res?.data?.data || res?.data || res;
        setJob(fetchedJob);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Job Not Found</h1>
        <button onClick={() => navigate("/careers")} className="text-blue-600 hover:underline">
          Return to Careers
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] py-24 transition-colors duration-300">
      <div className="max-w-[900px] mx-auto px-6">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate("/careers")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-semibold mb-8"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Careers
        </button>

        {/* Job Header */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-8 md:p-10 rounded-[2rem] shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold rounded-full text-sm mb-4">
                {job.department}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                {job.title}
              </h1>
            </div>
            
            <Link 
              to={`/careers/apply/${job.id || job._id}`}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all text-center shrink-0"
            >
              Apply Now
            </Link>
          </div>

          {/* Job Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><MapPin className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Location</p>
                <p className="font-medium text-slate-900 dark:text-white">{job.location || "Phnom Penh"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Briefcase className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Type</p>
                <p className="font-medium text-slate-900 dark:text-white">{job.job_type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Level</p>
                <p className="font-medium text-slate-900 dark:text-white">{job.job_level}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Banknote className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Salary</p>
                <p className="font-medium text-slate-900 dark:text-white">{job.salary_range || "Negotiable"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Users className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Vacancies</p>
                <p className="font-medium text-slate-900 dark:text-white">{job.vacancies || "1"} Position(s)</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Calendar className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Closing Date</p>
                <p className="font-medium text-slate-900 dark:text-white">{job.closing_date ? new Date(job.closing_date).toLocaleDateString() : "Open until filled"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Content */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-8 md:p-10 rounded-[2rem] shadow-sm space-y-10">
          
          {job.job_description && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Job Description</h2>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {job.job_description}
              </div>
            </section>
          )}

          {job.job_responsibility && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Responsibilities</h2>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {job.job_responsibility}
              </div>
            </section>
          )}

          {job.job_requirement && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Requirements</h2>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {job.job_requirement}
              </div>
            </section>
          )}

        </div>
        
        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link 
            to={`/careers/apply/${job.id || job._id}`}
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            Apply for this position
          </Link>
        </div>

      </div>
    </div>
  );
}