import React, { useState, useEffect } from "react";
import { request } from "@/utils/request/request";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CalendarDays,
  ReceiptText,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

// ✅ Import Excel & PDF Utilities
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [thisMonth, setThisMonth] = useState({ total: 0, orders: 0 });
  const [yearlyData, setYearlyData] = useState([]);
  const [ordersList, setOrdersList] = useState([]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const yearOptions = Array.from(
    new Array(5),
    (val, index) => currentYear - index,
  );

  const months = [
    { value: 1, label: "January", short: "Jan" },
    { value: 2, label: "February", short: "Feb" },
    { value: 3, label: "March", short: "Mar" },
    { value: 4, label: "April", short: "Apr" },
    { value: 5, label: "May", short: "May" },
    { value: 6, label: "June", short: "Jun" },
    { value: 7, label: "July", short: "Jul" },
    { value: 8, label: "August", short: "Aug" },
    { value: 9, label: "September", short: "Sep" },
    { value: 10, label: "October", short: "Oct" },
    { value: 11, label: "November", short: "Nov" },
    { value: 12, label: "December", short: "Dec" },
  ];

  const activeMonthLabel =
    months.find((m) => m.value === selectedMonth)?.label || "";

  useEffect(() => {
    const fetchReportsAndOrders = async () => {
      setLoading(true);
      try {
        const formattedMonth = String(selectedMonth).padStart(2, "0");
        const queryDate = `${selectedYear}-${formattedMonth}-01`;
        const lastDayOfMonth = new Date(
          selectedYear,
          selectedMonth,
          0,
        ).getDate();
        const endDate = `${selectedYear}-${formattedMonth}-${lastDayOfMonth}`;

        const [summaryRes, ordersRes] = await Promise.all([
          request(`admin/sales-summary?date=${queryDate}`, "get"),
          request(
            `admin/order?start_date=${queryDate}&end_date=${endDate}`,
            "get",
          ),
        ]);

        if (summaryRes) {
          setThisMonth({
            total: summaryRes.sale_this_month?.total || 0,
            orders: summaryRes.sale_this_month?.total_order || 0,
          });

          const mongoData = summaryRes.summary_sale_by_month || [];
          const fullYearChart = months.map((m) => {
            const foundData = mongoData.find((item) => item.title === m.short);
            return {
              title: m.short,
              total: foundData ? foundData.total : 0,
            };
          });
          setYearlyData(fullYearChart);
        }

        if (ordersRes && ordersRes.data) {
          setOrdersList(ordersRes.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsAndOrders();
  }, [selectedMonth, selectedYear]);

  // =======================================
  // 📈 FUNCTION: EXCEL DOWNLOAD MECHANISM
  // =======================================
  const handleExportExcel = () => {
    if (ordersList.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Map your database array objects to crisp column titles
    const dataToExport = ordersList.map((order, i) => ({
      "No.": i + 1,
      "Order Number": order.order_no,
      "Customer Name": order.customer_name,
      "Creation Date": new Date(order.created_at).toLocaleDateString(),
      "Payment Method": (order.payment_method || "N/A").toUpperCase(),
      "Total Amount ($)": parseFloat(order.total_amount || 0),
      Status: (order.status || "PENDING").toUpperCase(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders Record");

    // Auto-compute dynamic column width constraints so entries don't clip
    const maxProps = [
      { wch: 6 },
      { wch: 18 },
      { wch: 22 },
      { wch: 15 },
      { wch: 16 },
      { wch: 18 },
      { wch: 12 },
    ];
    worksheet["!cols"] = maxProps;

    // Save the spreadsheet binary layout string out to file download link node
    XLSX.writeFile(
      workbook,
      `Financial_Report_${activeMonthLabel}_${selectedYear}.xlsx`,
    );
  };

  // =======================================
  // 📑 FUNCTION: PDF DOWNLOAD MECHANISM
  // =======================================
  const handleExportPDF = () => {
    if (ordersList.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF();

    // 1. Structural Branding Text Headers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(11, 21, 40); // Matches deep primary brand #0B1528
    doc.text("ICT SOLUTIONS CO., LTD.", 14, 20);

    // 2. Metadata Context Sub-Labels
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Report Node: Financial Sales Summary`, 14, 27);
    doc.text(`Target Scope: ${activeMonthLabel} ${selectedYear}`, 14, 32);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 37);

    // 3. Mini Financial Summary Box Metric Lines
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(
      `Total Monthly Revenue: $${parseFloat(thisMonth.total).toFixed(2)}`,
      14,
      47,
    );
    doc.text(`Total Completed Volume: ${thisMonth.orders} Orders`, 14, 53);

    // 4. Generate the Clean Grid Table Node Array
    const tableHeaders = [
      ["No", "Order No", "Customer", "Date", "Payment", "Amount", "Status"],
    ];
    const tableBody = ordersList.map((order, index) => [
      index + 1,
      order.order_no,
      order.customer_name,
      new Date(order.created_at).toLocaleDateString(),
      (order.payment_method || "N/A").toUpperCase(),
      `$${parseFloat(order.total_amount).toFixed(2)}`,
      (order.status || "PENDING").toUpperCase(),
    ]);

    autoTable(doc, {
      head: tableHeaders,
      body: tableBody,
      startY: 60,
      theme: "striped",
      headStyles: { fillColor: [11, 21, 40], fontSize: 9, fontStyle: "bold" },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        5: { halign: "right" },
        6: { halign: "center" },
      },
    });

    // Fire the stream out to file handler
    doc.save(`Financial_Report_${activeMonthLabel}_${selectedYear}.pdf`);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-lg">
          <p className="font-bold text-slate-900 mb-1">{label} Revenue</p>
          <p className="text-blue-600 font-medium">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-transparent min-h-screen font-sans">
      {/* Header & Advanced Quick-Tools Controls Grid */}
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-6 pb-2 border-b border-slate-100 dark:border-slate-800/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="text-blue-600 dark:text-blue-400 size-8" />
            Financial Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Track your revenue, analyze sales trends, and view detailed records.
          </p>
        </div>

        {/* Filters and Document Downloader Layout block */}
        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          {/* Selectors */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 px-3 shadow-sm font-semibold cursor-pointer outline-none"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 px-3 shadow-sm font-semibold cursor-pointer outline-none mr-1"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Separation boundary line marker */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />

          {/* ✅ EXCEL GENERATOR BUTTON */}
          <button
            onClick={handleExportExcel}
            disabled={loading || ordersList.length === 0}
            className="h-10 px-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <FileSpreadsheet size={16} />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          {/* ✅ PDF GENERATOR BUTTON */}
          <button
            onClick={handleExportPDF}
            disabled={loading || ordersList.length === 0}
            className="h-10 px-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-blue-600 dark:text-blue-400 animate-pulse font-medium gap-3">
          <div className="size-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Crunching metrics...
          </span>
        </div>
      ) : (
        <>
          {/* Summary Metric Grid Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-[#0B1528]/40 p-6 rounded-2xl border border-slate-200/70 dark:border-white/5 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 border border-emerald-100/20">
                <DollarSign className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                  Revenue ({activeMonthLabel})
                </p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  ${parseFloat(thisMonth.total).toFixed(2)}
                </h2>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0B1528]/40 p-6 rounded-2xl border border-slate-200/70 dark:border-white/5 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0 border border-blue-100/20">
                <ShoppingBag className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                  Orders ({activeMonthLabel})
                </p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {thisMonth.orders}
                </h2>
              </div>
            </div>
          </div>

          {/* Revenue Chart Visualizer Node */}
          <div className="bg-white dark:bg-[#0B1528]/40 p-6 rounded-2xl border border-slate-200/70 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <CalendarDays className="size-4 text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Yearly Revenue Overview ({selectedYear})
              </h3>
            </div>

            <div className="h-[360px] w-full dark:brightness-95">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                    className="dark:opacity-10"
                  />
                  <XAxis
                    dataKey="title"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f8fafc", className: "dark:opacity-5" }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                    animationDuration={600}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Order Data Ledger Grid */}
          <div className="bg-white dark:bg-[#0B1528]/30 rounded-2xl border border-slate-200/70 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-2">
              <ReceiptText className="size-4 text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Order Records for {activeMonthLabel} {selectedYear}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                <thead className="text-xs text-slate-400 dark:text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/40">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Order No</th>
                    <th className="px-6 py-3.5 font-bold">Customer</th>
                    <th className="px-6 py-3.5 font-bold">Date</th>
                    <th className="px-6 py-3.5 font-bold">Pay Method</th>
                    <th className="px-6 py-3.5 font-bold text-right">Amount</th>
                    <th className="px-6 py-3.5 font-bold text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {ordersList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-slate-400 dark:text-slate-600 italic font-medium"
                      >
                        No orders found for this selection window.
                      </td>
                    </tr>
                  ) : (
                    ordersList.map((order) => (
                      <tr
                        key={order._id || order.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                          {order.order_no}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-300">
                          {order.customer_name}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 uppercase text-xs font-black tracking-wider text-slate-400">
                          {order.payment_method || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                              order.status === "approved"
                                ? "bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : order.status === "rejected"
                                  ? "bg-rose-100/70 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                                  : "bg-amber-100/70 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                            }`}
                          >
                            {order.status || "PENDING"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
