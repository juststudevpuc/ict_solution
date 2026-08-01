import React, { useState, useEffect, useRef } from "react";
import { request } from "@/utils/request/request";
import { CreditCard, Search, ArrowRightLeft, Calendar, X, Printer, Download } from "lucide-react"; // 🔥 ADDED: Download icon
import { Spinner } from "@/components/ui/spinner";
import { useReactToPrint } from "react-to-print";
import InvoiceCard from "../paymentPage/InvoiceCard";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDay, setFilterDay] = useState("");

  const printRef = useRef();
  const [selectedTxn, setSelectedTxn] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let url = "order?";
      const params = [];

      if (filterYear) params.push(`year=${filterYear}`);
      if (filterMonth) params.push(`month=${filterMonth}`);
      if (filterDay) params.push(`day=${filterDay}`);

      url += params.join("&");

      const res = await request(url, "get");
      if (res && res.data) {
        const records = Array.isArray(res.data) ? res.data : res.data.data || [];
        setTransactions(records);
      }
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (orderId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this refund?`)) return;
    try {
      await request(`admin/order/${orderId}/process-refund`, "post", { action });
      fetchTransactions();
    } catch (error) {
      console.error("Refund processing failed", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterYear, filterMonth, filterDay]);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.order_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const executePrint = useReactToPrint({ contentRef: printRef });

  const handlePrintClick = (txn) => {
    setSelectedTxn(txn);
    setTimeout(() => {
      executePrint();
    }, 100); 
  };

  // 🔥 NEW: Robust CSV Export Logic
  const handleExportCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert("No data available to export.");
      return;
    }

    // 1. Define Column Headers
    const headers = [
      "Order No",
      "Customer Name",
      "Date",
      "Total Amount (USD)",
      "Amount Paid (USD)",
      "Payment Method",
      "Status",
      "Items Purchased"
    ];

    // 2. Format Rows
    const rows = filteredTransactions.map((txn) => {
      const isPaid = parseFloat(txn.total_paid) >= parseFloat(txn.total_amount);
      const status = txn.status === "refund_requested" ? "Refund Requested" 
                   : txn.status === "refunded" ? "Refunded" 
                   : isPaid ? "Paid" : "Pending";
      
      const date = new Date(txn.created_at).toLocaleDateString("en-GB", { 
        day: "2-digit", month: "short", year: "numeric" 
      });

      // Extract products and separate them with a pipe "|" so commas inside names don't break the CSV
      const items = (txn.order_details || txn.orderDetails || [])
        .map(d => `${d.product?.name || "Item"} (x${d.qty || 1})`)
        .join(" | ");

      // Escape quotes and wrap items in quotes just to be extra safe
      const escapedItems = `"${items.replace(/"/g, '""')}"`;

      return [
        txn.order_no,
        txn.customer_name || "Guest",
        date,
        parseFloat(txn.total_amount || 0).toFixed(2),
        parseFloat(txn.total_paid || 0).toFixed(2),
        txn.payment_method || "N/A",
        status,
        escapedItems
      ];
    });

    // 3. Assemble CSV Content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // 4. Create Blob & Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // File name matches the current date
    const fileNameDate = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `ICT_Ledger_Export_${fileNameDate}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" },
    { value: 3, label: "March" }, { value: 4, label: "April" },
    { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" },
    { value: 9, label: "September" }, { value: 10, label: "October" },
    { value: 11, label: "November" }, { value: 12, label: "December" },
  ];
  const daysInMonth = filterYear && filterMonth ? new Date(filterYear, filterMonth, 0).getDate() : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
              <ArrowRightLeft className="text-blue-600 dark:text-blue-400 size-6" />
            </div>
            Transaction Ledger
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Monitor incoming payments and filter directly from the database.
          </p>
        </div>

        {/* Filters and Export Button Group */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Calendar className="size-4" />
            </div>
            <select
              className="bg-transparent border-none text-sm font-semibold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer outline-none pl-2 pr-6 dark:[&>option]:bg-slate-800"
              value={filterYear}
              onChange={(e) => {
                setFilterYear(e.target.value);
                if (filterDay === "29" && filterMonth === "2") setFilterDay("");
              }}
            >
              <option value="">All Years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>
            <select
              className="bg-transparent border-none text-sm font-semibold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer outline-none pl-2 pr-6 disabled:opacity-50 dark:[&>option]:bg-slate-800"
              value={filterMonth}
              onChange={(e) => {
                setFilterMonth(e.target.value);
                setFilterDay("");
              }}
              disabled={!filterYear}
            >
              <option value="">All Months</option>
              {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>
            <select
              className="bg-transparent border-none text-sm font-semibold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer outline-none pl-2 pr-6 disabled:opacity-50 dark:[&>option]:bg-slate-800"
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              disabled={!filterMonth}
            >
              <option value="">All Days</option>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {(filterYear || filterMonth || filterDay) && (
              <button
                onClick={() => { setFilterYear(""); setFilterMonth(""); setFilterDay(""); }}
                className="p-1.5 ml-1 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                title="Clear Filters"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* 🔥 NEW: Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-2xl shadow-sm transition-all"
            title="Download CSV"
          >
            <Download className="size-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center">
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Search TXN or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50">
              <tr>
                <th className="py-5 pl-6 pr-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap">No</th>
                <th className="py-5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap">TXN ID (Order)</th>
                <th className="py-5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Customer</th>
                <th className="py-5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Date</th>
                <th className="py-5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap">Payment Method</th>
                <th className="py-5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-right">Total Amount</th>
                <th className="py-5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-right">Amount Paid</th>
                <th className="py-5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-center">Status</th>
                <th className="py-5 pr-6 pl-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={9}>
                    <div className="flex justify-center py-12">
                      <Spinner className="size-8 text-blue-600 dark:text-blue-500 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium text-sm align-middle">
                    No transactions found for this date.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn, index) => {
                  const isPaid = parseFloat(txn.total_paid) >= parseFloat(txn.total_amount);

                  return (
                    <tr key={txn.id || txn._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="py-4 pl-6 pr-4 font-medium text-slate-500 dark:text-slate-400 align-middle">{index + 1}</td>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white align-middle">{txn.order_no}</td>
                      <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-300 align-middle">{txn.customer_name || "Guest"}</td>
                      <td className="py-4 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs align-middle">
                        {new Date(txn.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <CreditCard className="size-4 text-slate-400 dark:text-slate-500" />
                          <span className="capitalize font-medium text-slate-600 dark:text-slate-300">{txn.payment_method || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-slate-900 dark:text-white align-middle">${parseFloat(txn.total_amount || 0).toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-black text-blue-600 dark:text-blue-400 align-middle">${parseFloat(txn.total_paid || 0).toFixed(2)}</td>
                      <td className="py-4 px-4 text-center align-middle">
                        {txn.status === "refund_requested" ? (
                           <div className="flex flex-col gap-2 items-center">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 animate-pulse border border-amber-200 dark:border-amber-500/20">
                              REFUND REQUESTED
                            </span>
                            <div className="flex gap-2 mt-1">
                              <button onClick={() => handleRefund(txn.id, "approve")} className="text-xs font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 dark:hover:bg-emerald-500/80 transition-colors shadow-sm">Approve</button>
                              <button onClick={() => handleRefund(txn.id, "reject")} className="text-xs font-bold bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 dark:hover:bg-red-500/80 transition-colors shadow-sm">Reject</button>
                            </div>
                           </div>
                        ) : txn.status === "refunded" ? (
                          <span className="inline-flex px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">REFUNDED</span>
                        ) : (
                          <span className={`inline-flex px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider ${isPaid ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20" : "bg-blue-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-blue-100 dark:border-blue-500/20"}`}>
                            {isPaid ? "PAID" : "PENDING"}
                          </span>
                        )}
                      </td>
                      
                      <td className="py-4 pr-6 pl-4 text-right align-middle">
                        <button
                          onClick={() => handlePrintClick(txn)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                          title="Print Receipt"
                        >
                          <Printer className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hidden">
        <InvoiceCard 
          ref={printRef} 
          pastOrder={selectedTxn} 
          paidAmount={selectedTxn?.total_paid || 0} 
        />
      </div>
    </div>
  );
}