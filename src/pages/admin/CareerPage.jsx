import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Briefcase, MapPin, Users } from "lucide-react";
import { request } from "@/utils/request/request";
// Import your API request wrapper here. Update the path as needed.
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";

const CareerPage = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    job_type: "Full-time",
    location: "",
    job_level: "",
    vacancies: 1,
    salary_range: "",
    job_description: "",
    job_requirement: "",
    job_responsibility: "",
    status: "draft",
  });

  // Fetch Careers on Load
  useEffect(() => {
    fetchCareers();
  }, []);
  const fetchCareers = async () => {
    setLoading(true);
    try {
      // 🔥 FIX: Now this hits the adminIndex method to get ALL jobs (including drafts)
      const res = await request("admin/careers", "get");

      console.log("Raw API Response:", res);

      // Bulletproof unwrapping
      let fetchedData = [];
      if (Array.isArray(res)) {
        fetchedData = res;
      } else if (res && Array.isArray(res.data)) {
        fetchedData = res.data;
      } else if (res?.data && Array.isArray(res.data.data)) {
        fetchedData = res.data.data;
      }

      setCareers(fetchedData);
    } catch (error) {
      console.error("Error fetching careers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (career = null) => {
    if (career) {
      setIsEditing(true);
      setCurrentId(career._id || career.id);
      setFormData({
        title: career.title || "",
        department: career.department || "",
        job_type: career.job_type || "Full-time",
        location: career.location || "",
        job_level: career.job_level || "",
        vacancies: career.vacancies || 1,
        salary_range: career.salary_range || "",
        job_description: career.job_description || "",

        // 🔥 FIX: Safely fallback to empty string if null
        job_requirement: Array.isArray(career.job_requirement)
          ? career.job_requirement.join("\n")
          : career.job_requirement || "",

        job_responsibility: Array.isArray(career.job_responsibility)
          ? career.job_responsibility.join("\n")
          : career.job_responsibility || "",

        status: career.status || "draft",
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        title: "",
        department: "",
        job_type: "Full-time",
        location: "",
        job_level: "",
        vacancies: 1,
        salary_range: "",
        job_description: "",
        job_requirement: "",
        job_responsibility: "",
        status: "draft",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 FIX: Optional chaining added so .split() doesn't crash on empty fields
    const payload = {
      ...formData,
      job_requirement: formData.job_requirement
        ? formData.job_requirement
            .split("\n")
            .filter((item) => item.trim() !== "")
        : [],
      job_responsibility: formData.job_responsibility
        ? formData.job_responsibility
            .split("\n")
            .filter((item) => item.trim() !== "")
        : [],
    };

    try {
      if (isEditing) {
        await request(`admin/careers/${currentId}`, "put", payload);
      } else {
        await request("careers", "post", payload);
      }
      setIsModalOpen(false);
      fetchCareers();
    } catch (error) {
      console.error("Error saving career:", error);
    }
  };

  // Note: Your handle delete function logic is already perfect!
  //   table of career

  // Table of career
  const tbl_head = [
    "Title",
    "Slug",
    "Department",
    "Job Type",
    "Location",
    "Job Level",
    "Vacancies",
    "Salary Range",
    "Job Description",
    "Job Requirement",
    "Job Responsibility",
    "Closing Date",
    "Status",
  ];

  return (
    <div className="p-6">
      {/* Header Section */}

      {/* ===== HEADER & ADD BUTTON/MODAL ===== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Career Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create and manage job postings.
          </p>
        </div>
        <button
          onClick={() => openModal()} // This perfectly resets the form and opens the modal
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl shadow-sm shadow-blue-200 dark:shadow-none transition-all w-full sm:w-auto"
        >
          <Plus className="size-5" /> Add New Job
        </button>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          {/* <DialogTrigger asChild>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl shadow-sm shadow-blue-200 dark:shadow-none transition-all w-full sm:w-auto"
            >
              <Plus className="size-5" /> Add New Job
            </button>
          </DialogTrigger> */}

          <DialogContent className="max-w-5xl w-[95vw] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl sm:rounded-2xl p-0 flex flex-col max-h-[90vh] overflow-hidden transition-colors duration-300">
            {/* HEADER */}
            <div className="px-6 md:px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 shrink-0 transition-colors">
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isEditing ? "Update Job Posting" : "Create New Job Posting"}
              </DialogTitle>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                Fill in the details below to{" "}
                {isEditing ? "update this" : "add a new"} job posting.
              </p>
            </div>

            {/* FORM BODY */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col overflow-hidden min-h-0"
            >
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Job Type
                    </label>
                    <select
                      name="job_type"
                      value={formData.job_type}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors"
                    >
                      <option value="draft">Draft</option>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      name="salary_range"
                      placeholder="e.g., $500 - $800"
                      value={formData.salary_range}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Vacancies
                    </label>
                    <input
                      type="number"
                      name="vacancies"
                      min="1"
                      value={formData.vacancies}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Job Description
                    </label>
                    <textarea
                      name="job_description"
                      required
                      rows="3"
                      value={formData.job_description}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Requirements (One per line)
                    </label>
                    <textarea
                      name="job_requirement"
                      rows="4"
                      placeholder="Bachelor's Degree...&#10;3 years experience..."
                      value={formData.job_requirement}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors resize-none"
                    ></textarea>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Responsibilities (One per line)
                    </label>
                    <textarea
                      name="job_responsibility"
                      rows="4"
                      placeholder="Develop web apps...&#10;Manage databases..."
                      value={formData.job_responsibility}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl p-3 transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="px-6 md:px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shrink-0 transition-colors">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                  }}
                  className="px-6 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  {isEditing ? "Update Job" : "Publish Job"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* delete dialog */}
      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogContent className="sm:rounded-2xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white text-xl">
              Do you want to delete {deleteData?.title}?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteData(null);
                  setIsDelete(false);
                }}
                className="px-4 py-2 font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await request(
                      `admin/careers/${deleteData?._id || deleteData?.id}`,
                      "delete",
                    );
                    if (res) {
                      fetchCareers();
                      setDeleteData(null);
                      setIsDelete(false);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="px-4 py-2 font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              {tbl_head.map((head, index) => (
                <TableHead
                  key={index}
                  className="p-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap"
                >
                  {/* Directly renders your clean Title Case headers */}
                  {head}
                </TableHead>
              ))}
              <TableHead className="p-4 text-xs font-semibold text-slate-500 uppercase text-right whitespace-nowrap">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tbl_head.length + 1}
                  className="p-4 text-center text-slate-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : careers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tbl_head.length + 1}
                  className="p-4 text-center text-slate-500"
                >
                  No job postings found.
                </TableCell>
              </TableRow>
            ) : (
              careers.map((career) => (
                <TableRow
                  key={career._id || career.id}
                  className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <TableCell className="p-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {career.title}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {career.slug}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {career.department || "—"}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {career.job_type}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {career.location || "—"}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {career.job_level || "—"}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {career.vacancies}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {career.salary_range || "—"}
                  </TableCell>

                  {/* Long text fields are truncated to keep the table clean */}
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                    {career.job_description}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                    {Array.isArray(career.job_requirement)
                      ? career.job_requirement.join(", ")
                      : career.job_requirement}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                    {Array.isArray(career.job_responsibility)
                      ? career.job_responsibility.join(", ")
                      : career.job_responsibility}
                  </TableCell>

                  <TableCell className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {career.closing_date
                      ? new Date(career.closing_date).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        career.status === "open"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : career.status === "closed"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {career.status ? career.status.toUpperCase() : "DRAFT"}
                    </span>
                  </TableCell>
                  <TableCell className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openModal(career)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors inline-block"
                    >
                      <Edit className="size-4" />
                    </button>
                    {/* Replace the current Trash2 button with this: */}
                    <button
                      onClick={() => {
                        setDeleteData(career);
                        setIsDelete(true);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors inline-block"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CareerPage;
