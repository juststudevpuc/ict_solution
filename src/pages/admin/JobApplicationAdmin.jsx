import React, { useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { request } from "@/utils/request/request";
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
  DialogHeader,
} from "@/components/ui/dialog";

export default function JobApplicationAdmin() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await request("admin/job-applications", "get");
      // Bulletproof unwrapping
      let fetchedData = [];
      if (Array.isArray(res)) fetchedData = res;
      else if (res && Array.isArray(res.data)) fetchedData = res.data;
      else if (res?.data && Array.isArray(res.data.data))
        fetchedData = res.data.data;

      setApplications(fetchedData);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await request(`admin/job-applications/${id}`, "put", {
        status: newStatus,
      });
      fetchApplications(); // Refresh table
      if (selectedApp) setSelectedApp({ ...selectedApp, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to archive this application?"))
      return;
    try {
      await request(`admin/job-applications/${id}`, "delete");
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const tbl_head = [
    "Candidate",
    "Applied For",
    "Email",
    "Phone",
    "Status",
    "Resume",
    "Actions",
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Job Applications
        </h1>
        <p className="text-sm text-slate-500">
          Review and manage candidate applications.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/20">
              {tbl_head.map((head, idx) => (
                <TableHead
                  key={idx}
                  className="p-4 text-xs font-semibold text-slate-500 uppercase"
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-4">
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id || app._id}>
                  <TableCell className="p-4 font-bold dark:text-white">
                    {app.first_name} {app.last_name}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400">
                    {app.career?.title || "Unknown Job"}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400">
                    {app.email}
                  </TableCell>
                  <TableCell className="p-4 text-slate-600 dark:text-slate-400">
                    {app.phone}
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase">
                      {app.status || "PENDING"}
                    </span>
                  </TableCell>

                  {/* Clean Resume Link in Table */}
                  <TableCell className="p-4">
                    {app.cv_url ? (
                      <a
                        href={app.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" /> CV
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>

                  <TableCell className="p-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id || app._id)}
                      className="p-2 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <div className="">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          {/* Updated line below: Changed max-w-2xl to w-[90vw] max-w-5xl */}
          <DialogContent className="sm:max-w-5xl w-[95vw] bg-white dark:bg-slate-900 rounded-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl dark:text-white font-bold">
                Applicant Details
              </DialogTitle>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Name:</strong> {selectedApp.first_name}{" "}
                    {selectedApp.last_name}
                  </div>
                  <div>
                    <strong>Applied For:</strong> {selectedApp.career?.title}
                  </div>
                  <div>
                    <strong>Experience:</strong> {selectedApp.experience_years}{" "}
                    Years
                  </div>
                  <div>
                    <strong>Expected Salary:</strong>{" "}
                    {selectedApp.expected_salary}
                  </div>
                  {selectedApp.portfolio_url && (
                    <div className="col-span-2">
                      <strong>Portfolio:</strong>{" "}
                      <a
                        href={selectedApp.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {selectedApp.portfolio_url}
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                  <strong>Cover Letter:</strong>
                  <p className="mt-2 text-sm">
                    {selectedApp.cover_letter || "No cover letter provided."}
                  </p>
                </div>

                {/* CV Preview Embedded in Modal */}
                {selectedApp.cv_url && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <strong>Resume / CV:</strong>
                      <a
                        href={selectedApp.cv_url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        <Download className="w-4 h-4" /> Download File
                      </a>
                    </div>

                    {selectedApp.cv_url.toLowerCase().includes(".pdf") ? (
                      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden h-[600px]">
                        <iframe
                          src={selectedApp.cv_url}
                          className="w-full h-full"
                          title="CV Preview"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500">
                        Cannot preview this file type in the browser. Please use
                        the download link above to view it.
                      </div>
                    )}
                  </div>
                )}

                {/* Status Update Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedApp.id || selectedApp._id,
                        "reviewing",
                      )
                    }
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold flex gap-2 transition-transform hover:scale-105"
                  >
                    <Clock className="w-4 h-4" /> Reviewing
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedApp.id || selectedApp._id,
                        "interview",
                      )
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold flex gap-2 transition-transform hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4" /> Interview
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedApp.id || selectedApp._id,
                        "rejected",
                      )
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold flex gap-2 transition-transform hover:scale-105"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
