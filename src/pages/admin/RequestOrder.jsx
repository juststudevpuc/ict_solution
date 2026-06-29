import {
  AlertCircle,
  CheckCheck,
  LoaderIcon,
  X,
  Eye,
  ImageIcon,
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

export default function RequestOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Approve Modal State
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveData, setApproveData] = useState(null);
  const [customDuration, setCustomDuration] = useState(30);

  // 🔥 NEW: Image Viewer State
  const [slipPreview, setSlipPreview] = useState(null);

  const fetchingData = async () => {
    setLoading(true);
    try {
      // 🔥 FIX: Fetch ALL orders so the top metric cards actually work!
      const orderRes = await request("admin/order", "get");
      if (orderRes) setOrders(orderRes?.data || orderRes);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  // Calculate the Metric Cards automatically
  const totalRequests = orders?.length || 0;
  const approvedCount =
    orders?.filter((o) => o.status === "approved").length || 0;
  const rejectedCount =
    orders?.filter((o) => o.status === "rejected").length || 0;

  // Filter for the table (Only show Pending)
  const pendingOrders =
    orders?.filter((o) => o.status !== "approved" && o.status !== "rejected") ||
    [];
  const pendingCount = pendingOrders.length;

  const handleApprove = async () => {
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
      }
    } catch (error) {
      console.log("Error approving order: ", error);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this order?")) {
      try {
        await request(`admin/order/${id}/reject`, "patch");
        fetchingData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const tbl_head = [
    "Date & Time",
    "Customer Info",
    "Order Summary",
    "Payment Proof", // 🔥 NEW COLUMN
    "Total",
    "Status",
    "Action",
  ];

  return (
    <div className="p-2 space-y-6">
      <div>
        <h1 className="text-2xl font-bold ">Request Orders</h1> 
        <p className=" text-sm mt-1">
          Review and approve pending customer payments.
        </p>
      </div>

      {/* --- TOP ROW: MAIN METRICS --- */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <div className="flex h-32 flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Total Requests
            </h3>
            <div className="rounded-xl bg-blue-100 p-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {loading ? "..." : totalRequests}
          </p>
        </div>

        <div className="flex h-32 flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Approved
            </h3>
            <div className="rounded-xl bg-emerald-100 p-2">
              <CheckCheck className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {loading ? "..." : approvedCount}
          </p>
        </div>

        <div className="flex h-32 flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Rejected
            </h3>
            <div className="rounded-xl bg-red-100 p-2">
              <X className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {loading ? "..." : rejectedCount}
          </p>
        </div>

        <div className="flex h-32 flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Pending
            </h3>
            <div className="rounded-xl bg-amber-100 p-2">
              <LoaderIcon className="h-5 w-5 text-amber-600 animate-spin-slow" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {loading ? "..." : pendingCount}
          </p>
        </div>
      </div>

      {/* --- PENDING ORDERS TABLE --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="w-full text-sm text-left">
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                {tbl_head?.map((item, index) => (
                  <TableHead
                    key={index}
                    className="py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider whitespace-nowrap"
                  >
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={tbl_head.length}
                    className="text-center py-10"
                  >
                    <LoaderIcon className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : pendingOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={tbl_head.length}
                    className="text-center py-10 text-slate-400 font-medium"
                  >
                    No pending requests right now.
                  </TableCell>
                </TableRow>
              ) : (
                orders.filter(o => o.status !== "approved").map((item, index) => {
                  // Format the date and time beautifully
                  const orderDate = new Date(item?.created_at);
                  const timeString = orderDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <TableRow
                      key={index}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell>
                        <p className="font-bold text-slate-900">
                          {formatDate(item?.created_at)}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {timeString}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-bold text-slate-900">
                          {item.customer_name || "Guest"}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {item.phone || "No Phone"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-bold text-slate-700">
                          {item.orderDetails?.length || 0} Items
                        </p>
                        {item.remark && (
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">
                            {item.remark}
                          </p>
                        )}
                      </TableCell>

                      {/* 🔥 NEW: Payment Proof Column */}
                      <TableCell>
                        {item.payment_slip ? (
                          <div
                            onClick={() => setSlipPreview(item.payment_slip)}
                            className="relative w-16 h-16 rounded-xl border-2 border-slate-200 overflow-hidden cursor-pointer group shadow-sm hover:border-blue-400 transition-all"
                          >
                            <img
                              src={item.payment_slip}
                              alt="Receipt"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                            <span className="text-[9px] font-bold">
                              NO SLIP
                            </span>
                          </div>
                        )}
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 text-center w-16">
                          {item.payment_method || "N/A"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-black text-slate-900 text-lg">
                          ${Number(item.total_amount).toFixed(2)}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 shadow-sm border border-amber-200/50">
                          Pending Review
                        </span>
                      </TableCell>

                      <TableCell>
                        {item.status === "rejected" ? (
                          // Show Gray Canceled Button if Rejected
                          <Button
                            disabled
                            size="sm"
                            className="bg-slate-800 text-white border border-slate-200 rounded-xl font-bold shadow-none px-4 opacity-100 cursor-not-allowed"
                          >
                            <X className="h-4 w-4 mr-1" /> Canceled
                          </Button>
                        ) : item.status === "approved" ? (
                          // Show Green Approved Label if Approved
                          <Button
                            disabled
                            size="sm"
                            className="bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-xl font-bold shadow-none px-4 opacity-100 cursor-not-allowed"
                          >
                            <CheckCheck className="h-4 w-4 mr-1" /> Approved
                          </Button>
                        ) : (
                          // Show Active Buttons if Pending
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-sm shadow-emerald-200 px-4 transition-all"
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
                              className="rounded-xl shadow-sm shadow-red-200 transition-all"
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
      </div>

      {/* --- APPROVE MODAL --- */}
      <Dialog
        open={isApproveOpen}
        onOpenChange={(isOpen) => !isOpen && setIsApproveOpen(false)}
      >
        <DialogContent className="sm:max-w-md rounded-3xl border-none p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              Approve Order:{" "}
              <span className="text-blue-600">{approveData?.order_no}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Show a tiny reminder of the slip here too */}
            {approveData?.payment_slip && (
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <img
                  src={approveData.payment_slip}
                  alt="slip"
                  className="w-12 h-12 rounded-lg object-cover shadow-sm border border-emerald-200"
                />
                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Receipt Verified
                  </p>
                  <p className="text-xs font-medium text-emerald-600">
                    Total: ${Number(approveData.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-700">
                How many days will this service take?
              </Label>
              <Input
                type="number"
                value={customDuration}
                onChange={(e) =>
                  setCustomDuration(Math.max(1, Number(e.target.value)))
                }
                min="1"
                className="font-black text-xl h-14 rounded-xl border-slate-300 text-blue-700"
              />
              <p className="text-xs text-slate-500 font-medium">
                The deadline will be calculated from today automatically.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-12"
              onClick={() => setIsApproveOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-emerald-200"
              onClick={handleApprove}
            >
              Confirm & Start
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- 🔥 NEW: FULL SCREEN IMAGE VIEWER MODAL --- */}
      <Dialog open={!!slipPreview} onOpenChange={() => setSlipPreview(null)}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-3xl border-none p-2 bg-transparent shadow-none flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src={slipPreview}
              alt="Payment Slip Full Size"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            {/* <Button 
              size="icon" 
              variant="destructive" 
              className="absolute top-2 right-2 rounded-full shadow-lg"
              onClick={() => setSlipPreview(null)}
            >
              <X className="w-4 h-4" />
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
