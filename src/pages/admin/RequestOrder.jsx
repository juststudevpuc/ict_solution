import {
  AlertCircle,
  CheckCheck,
  LoaderIcon,
  X,
  Eye,
  ImageIcon,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/helper/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export default function RequestOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- FILTER STATES ---
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDay, setFilterDay] = useState("");

  // 🔥 NEW: PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Approve Modal State
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveData, setApproveData] = useState(null);
  const [customDuration, setCustomDuration] = useState(30);

  // Image Viewer State
  const [slipPreview, setSlipPreview] = useState(null);

  const fetchingData = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
      };

      if (filterStatus !== "all") params.status = filterStatus;
      if (filterYear) params.year = filterYear;
      if (filterMonth) params.month = filterMonth;
      if (filterDay) params.day = filterDay;

      const orderRes = await request("admin/order", "get", params);

      if (orderRes) {
        // 🔥 THE FIX IS HERE:
        // orderRes is already the Laravel object { current_page: 1, data: [...], total: 10 }
        // We just grab exactly what we need from it directly!

        setOrders(orderRes.data || []);
        setLastPage(orderRes.last_page || 1);
        setTotalRecords(orderRes.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 EXPERT FIX: Reset to Page 1 whenever a filter is changed
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterYear, filterMonth, filterDay]);

  // Fetch data whenever the page OR filters change
  useEffect(() => {
    fetchingData();
  }, [currentPage, filterStatus, filterYear, filterMonth, filterDay]);

  // --- Derived State (Metrics) ---
  // Note: These counts reflect the CURRENT PAGE (10 items).
  // 'totalRecords' reflects the ENTIRE database matching the filter.
  const approvedCount =
    orders?.filter((o) => o.status === "approved").length || 0;
  const rejectedCount =
    orders?.filter((o) => o.status === "rejected").length || 0;
  const pendingCount =
    orders?.filter((o) => o.status !== "approved" && o.status !== "rejected")
      .length || 0;

  // --- Date Generators for Dropdowns ---
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) =>
    (currentYear - i).toString(),
  );
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  // --- Approve/Reject Logic ---
  const handleApprove = async () => {
    if (!approveData) return;
    setIsProcessing(true);
    try {
      const res = await request(
        `admin/order/${approveData.id || approveData._id}/approve`,
        "patch",
        { duration_days: customDuration },
      );

      if (res) {
        fetchingData();
        setIsApproveOpen(false);
        setApproveData(null);
        Swal.fire({
          title: "Approved!",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
          background: "#1e293b",
          color: "#fff",
        });
      }
    } catch (error) {
      console.log("Error approving order: ", error);
      // 🔥 NEW: Actually show the backend error to the user!
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to approve the order.",
        icon: "error",
        background: "#0f172a",
        color: "#f8fafc",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject Order?",
      text: "Are you sure you want to reject this request? This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      confirmButtonText: "Yes, reject it!",
      background: "#0f172a",
      color: "#f8fafc",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await request(`admin/order/${id}/reject`, "patch");
          fetchingData();
          Swal.fire({
            title: "Rejected!",
            text: "The order has been rejected.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: "#0f172a",
            color: "#f8fafc",
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: "Failed to reject the order.",
            icon: "error",
            background: "#0f172a",
            color: "#f8fafc",
          });
        }
      }
    });
  };

  const tbl_head = [
    "Date & Time",
    "Customer Info",
    "Order Summary",
    "Payment Proof",
    "Total",
    "Status",
    "Action",
  ];

  return (
    <div className="p-2 space-y-6 transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
          Request Orders
        </h1>
        <p className="text-sm mt-1 text-slate-500 dark:text-slate-400 transition-colors">
          Review and approve pending customer payments.
        </p>
      </div>

      {/* --- TOP ROW: MAIN METRICS --- */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        {/* Total Requests - Now uses 'totalRecords' straight from Laravel! */}
        <div className="flex h-32 flex-col justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Found
            </h3>
            <div className="rounded-xl bg-blue-100 dark:bg-blue-500/10 p-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {loading ? "..." : totalRecords}
          </p>
        </div>
        <div className="flex h-32 flex-col justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Approved (Page)
            </h3>
            <div className="rounded-xl bg-emerald-100 dark:bg-emerald-500/10 p-2">
              <CheckCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {loading ? "..." : approvedCount}
          </p>
        </div>
        <div className="flex h-32 flex-col justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rejected (Page)
            </h3>
            <div className="rounded-xl bg-red-100 dark:bg-red-500/10 p-2">
              <X className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {loading ? "..." : rejectedCount}
          </p>
        </div>
        <div className="flex h-32 flex-col justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending (Page)
            </h3>
            <div className="rounded-xl bg-amber-100 dark:bg-amber-500/10 p-2">
              <LoaderIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-spin-slow" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {loading ? "..." : pendingCount}
          </p>
        </div>
      </div>

      {/* --- FILTER TOOLBAR --- */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-white dark:bg-slate-900/60 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 px-2 text-slate-500 dark:text-slate-400">
          <Filter className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wide">Filters:</span>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
          <select
            className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none px-3 w-full cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending Only</option>
            <option value="approved">Approved Only</option>
            <option value="rejected">Rejected Only</option>
          </select>
        </div>

        {/* Date Dropdowns */}
        <div className="flex flex-1 sm:flex-none items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto overflow-hidden">
          <div className="pl-3 pr-1 text-slate-400 dark:text-slate-500">
            <Calendar className="w-4 h-4" />
          </div>
          <select
            className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none px-2 cursor-pointer w-full"
            value={filterYear}
            onChange={(e) => {
              setFilterYear(e.target.value);
              setFilterMonth("");
              setFilterDay("");
            }}
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <select
            className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none px-2 cursor-pointer w-full disabled:opacity-30"
            value={filterMonth}
            onChange={(e) => {
              setFilterMonth(e.target.value);
              setFilterDay("");
            }}
            disabled={!filterYear}
          >
            <option value="">Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <select
            className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none px-2 cursor-pointer w-full disabled:opacity-30"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            disabled={!filterMonth}
          >
            <option value="">Day</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {(filterStatus !== "all" || filterYear || filterMonth || filterDay) && (
          <Button
            variant="ghost"
            onClick={() => {
              setFilterStatus("all");
              setFilterYear("");
              setFilterMonth("");
              setFilterDay("");
            }}
            className="ml-auto sm:ml-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold"
          >
            Clear
          </Button>
        )}
      </div>

      {/* --- ORDERS TABLE --- */}
      {/* --- ORDERS TABLE --- */}
      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <Table className="w-full text-sm text-left">
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50">
                {tbl_head?.map((item, index) => (
                  <TableHead
                    key={index}
                    className="py-4 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap"
                  >
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={tbl_head.length}
                    className="text-center py-12"
                  >
                    <LoaderIcon className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={tbl_head.length}
                    className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium"
                  >
                    No orders match your current filters.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((item, index) => {
                  const orderDate = new Date(item?.created_at);
                  const timeString = orderDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <TableRow
                      key={index}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <TableCell className="pl-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {formatDate(item?.created_at)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {timeString}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {item.customer_name || "Guest"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {item.phone || "No Phone"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-bold text-slate-700 dark:text-slate-300">
                          {item.orderDetails?.length || 0} Items
                        </p>
                        {item.remark && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[150px]">
                            {item.remark}
                          </p>
                        )}
                      </TableCell>

                      <TableCell>
                        {item.payment_slip ? (
                          <div
                            onClick={() => setSlipPreview(item.payment_slip)}
                            className="relative w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer group shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                          >
                            <img
                              src={item.payment_slip}
                              alt="Receipt"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                            <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                            <span className="text-[9px] font-bold tracking-wider">
                              NO SLIP
                            </span>
                          </div>
                        )}
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1.5 text-center w-16">
                          {item.payment_method || "N/A"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-black text-slate-900 dark:text-white text-lg">
                          ${Number(item.total_amount).toFixed(2)}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold shadow-sm border ${
                            item.status === "approved"
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20"
                              : item.status === "rejected"
                                ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-500/20"
                                : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20"
                          }`}
                        >
                          {item.status
                            ? item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)
                            : "Pending"}
                        </span>
                      </TableCell>

                      <TableCell>
                        {item.status === "rejected" ? (
                          <Button
                            disabled
                            size="sm"
                            className="bg-slate-100 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 rounded-xl font-bold shadow-none px-4 opacity-100 cursor-not-allowed"
                          >
                            <X className="h-4 w-4 mr-1" /> Canceled
                          </Button>
                        ) : item.status === "approved" ? (
                          <Button
                            disabled
                            size="sm"
                            className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 rounded-xl font-bold shadow-none px-4 opacity-100 cursor-not-allowed"
                          >
                            <CheckCheck className="h-4 w-4 mr-1" /> Approved
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl font-bold shadow-sm shadow-emerald-200 dark:shadow-none px-4 transition-all"
                              onClick={() => {
                                setApproveData(item);
                                setIsApproveOpen(true);
                              }}
                            >
                              <CheckCheck className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="rounded-xl shadow-sm shadow-red-200 dark:shadow-none dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 transition-all"
                              onClick={() => handleReject(item.id || item._id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* 🔥 NEW: PAGINATION FOOTER */}
        {totalRecords > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Showing page{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {lastPage}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-700 dark:text-slate-300"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, lastPage))
                }
                disabled={currentPage === lastPage || loading}
                className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-700 dark:text-slate-300"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 NEW: PAGINATION FOOTER */}
      {totalRecords > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Showing page{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {lastPage}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, lastPage))
              }
              disabled={currentPage === lastPage || loading}
              className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <ApproveOrderModal
            isOpen={isApproveOpen}
            onClose={setIsApproveOpen}
            approveData={approveData}
            customDuration={customDuration}
            setCustomDuration={setCustomDuration}
            onConfirm={handleApprove}
          />

          <ImageViewerModal
            slipPreview={slipPreview}
            onClose={setSlipPreview}
          />
        </div>
      )}
    </div>
  );
}

// ==========================================
// 🧩 COMPONENT 1: The Image Viewer Modal
// ==========================================
function ImageViewerModal({ slipPreview, onClose }) {
  return (
    <Dialog open={!!slipPreview} onOpenChange={() => onClose(null)}>
      <DialogContent className="sm:max-w-md w-[95vw] rounded-3xl border-none p-2 bg-transparent shadow-none flex flex-col items-center justify-center">
        <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-slate-800 transition-colors duration-300">
          <img
            src={slipPreview}
            alt="Payment Slip Full Size"
            className="w-full h-auto max-h-[80vh] object-contain bg-slate-50 dark:bg-slate-900"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// 🧩 COMPONENT 2: The Approve Order Modal
// ==========================================
function ApproveOrderModal({
  isOpen,
  onClose,
  approveData,
  customDuration,
  setCustomDuration,
  onConfirm,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose(false)}>
      <DialogContent className="sm:max-w-md rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-2xl bg-white dark:bg-slate-900 transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Approve Order:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {approveData?.order_no}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {approveData?.payment_slip && (
            <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 transition-colors">
              <img
                src={approveData.payment_slip}
                alt="slip"
                className="w-12 h-12 rounded-lg object-cover shadow-sm border border-emerald-200 dark:border-emerald-500/30"
              />
              <div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  Receipt Verified
                </p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500/80 mt-0.5">
                  Total: ${Number(approveData.total_amount).toFixed(2)}
                </p>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              How many days will this service take?
            </Label>
            <Input
              type="number"
              value={customDuration}
              onChange={(e) =>
                setCustomDuration(Math.max(1, Number(e.target.value)))
              }
              min="1"
              className="font-black text-xl h-14 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 focus-visible:ring-blue-500 transition-colors"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              The deadline will be calculated from today automatically.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-12 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => onClose(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl h-12 font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
            onClick={onConfirm}
          >
            Confirm & Start
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
