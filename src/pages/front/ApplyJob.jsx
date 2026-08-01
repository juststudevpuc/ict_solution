import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  UploadCloud, 
  Briefcase, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import { request } from "@/utils/request/request";
import { toast } from "sonner";

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    experience_years: "",
    expected_salary: "",
    portfolio_url: "",
    cover_letter: "",
  });
  const [file, setFile] = useState(null);

  // Fetch the specific job details so the user knows what they are applying for
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await request(`careers/${id}`, "get");
        const fetchedJob = res?.data?.data || res?.data || res;
        setJob(fetchedJob);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Could not load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file size (5MB limit) matching your Laravel backend
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      e.target.value = null; // Reset input
      return;
    }
    
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload your CV document.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create a FormData object (Required for file uploads)
      const payload = new FormData();
      
      // 2. Append all text fields
      payload.append("career_id", id);
      payload.append("first_name", formData.first_name);
      payload.append("last_name", formData.last_name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      
      if (formData.experience_years) payload.append("experience_years", formData.experience_years);
      if (formData.expected_salary) payload.append("expected_salary", formData.expected_salary);
      if (formData.portfolio_url) payload.append("portfolio_url", formData.portfolio_url);
      if (formData.cover_letter) payload.append("cover_letter", formData.cover_letter);

      // 3. Append the physical file
      payload.append("cv_file", file);

      // 4. Send request (your request.js handles the headers automatically!)
      await request("job-applications", "post", payload);
      
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-slate-900/60 p-10 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl max-w-md w-full">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Application Sent!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Thank you for applying for the <strong>{job?.title}</strong> position. Our team will review your application and get back to you soon.
          </p>
          <button 
            onClick={() => navigate("/careers")}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all w-full"
          >
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] py-24 transition-colors duration-300">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-semibold mb-8"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Jobs
        </button>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Submit your application
          </h1>
          <div className="flex items-center gap-3 text-lg text-slate-500 dark:text-slate-400">
            <Briefcase className="w-5 h-5" />
            <span>Applying for: <strong className="text-slate-900 dark:text-white">{job?.title}</strong></span>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-6 md:p-10 rounded-[2rem] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">First Name *</label>
                <input type="text" name="first_name" required value={formData.first_name} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Name *</label>
                <input type="text" name="last_name" required value={formData.last_name} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3" />
              </div>
            </div>

            {/* Professional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Years of Experience</label>
                <input type="number" name="experience_years" min="0" value={formData.experience_years} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Expected Salary</label>
                <input type="text" name="expected_salary" placeholder="e.g. $800 - $1200" value={formData.expected_salary} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Portfolio / LinkedIn URL</label>
                <input type="url" name="portfolio_url" placeholder="https://" value={formData.portfolio_url} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cover Letter (Optional)</label>
                <textarea name="cover_letter" rows="4" value={formData.cover_letter} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 resize-none"></textarea>
              </div>
            </div>

            {/* CV Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Upload CV/Resume *</label>
              <div className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-colors border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800">
                <input type="file" required accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {file ? file.name : "Click or drag file to this area to upload"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Application...</>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}