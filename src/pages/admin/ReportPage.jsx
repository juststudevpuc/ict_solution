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
} from "lucide-react";

export default function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [thisMonth, setThisMonth] = useState({ total: 0, orders: 0 });
  const [yearlyData, setYearlyData] = useState([]);

  // 1. ADDED: State to hold the table data
  const [ordersList, setOrdersList] = useState([]);

  // Date Selection State
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

  useEffect(() => {
    const fetchReportsAndOrders = async () => {
      setLoading(true);
      try {
        // Format dates for Laravel
        const formattedMonth = String(selectedMonth).padStart(2, "0");
        const queryDate = `${selectedYear}-${formattedMonth}-01`;

        // Calculate the last day of the selected month for the table fetch
        const lastDayOfMonth = new Date(
          selectedYear,
          selectedMonth,
          0,
        ).getDate();
        const endDate = `${selectedYear}-${formattedMonth}-${lastDayOfMonth}`;

        // 2. ADDED: Fetch BOTH the summary stats and the detailed order list at the same time!
        // ✅ NEW REACT CODE (Add "admin/" and use singular "order"):
        const [summaryRes, ordersRes] = await Promise.all([
          request(`admin/sales-summary?date=${queryDate}`, "get"),
          request(
            `admin/order?start_date=${queryDate}&end_date=${endDate}`,
            "get",
          ),
        ]);

        // --- Handle Summary Data (Charts & Cards) ---
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

        // --- Handle Orders Data (Table) ---
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

  // Custom Chart Tooltip
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
    <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen font-sans">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <TrendingUp className="text-blue-600 size-8" />
            Financial Reports
          </h1>
          <p className="text-slate-500 mt-2">
            Track your revenue, analyze sales trends, and view detailed records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm font-medium cursor-pointer"
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
            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm font-medium cursor-pointer"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-blue-600 animate-pulse font-medium">
          Crunching the numbers...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <DollarSign className="size-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Revenue (
                  {months.find((m) => m.value === selectedMonth)?.label})
                </p>
                <h2 className="text-3xl font-black text-slate-900">
                  ${parseFloat(thisMonth.total).toFixed(2)}
                </h2>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <ShoppingBag className="size-7 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Orders ({months.find((m) => m.value === selectedMonth)?.label}
                  )
                </p>
                <h2 className="text-3xl font-black text-slate-900">
                  {thisMonth.orders}
                </h2>
              </div>
            </div>
          </div>

          {/* Main Bar Chart */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <CalendarDays className="size-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">
                Yearly Revenue Overview ({selectedYear})
              </h3>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="title"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f1f5f9" }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. ADDED: Order Detail Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-2">
              <ReceiptText className="size-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">
                Order Records for{" "}
                {months.find((m) => m.value === selectedMonth)?.label}{" "}
                {selectedYear}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order No</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Pay Method</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                    <th className="px-6 py-4 font-medium text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ordersList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-slate-500 italic"
                      >
                        No orders found for this month.
                      </td>
                    </tr>
                  ) : (
                    ordersList.map((order) => (
                      <tr
                        key={order._id || order.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-medium text-slate-900">
                          {order.order_no}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {order.customer_name}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 uppercase text-xs font-bold tracking-wider">
                          {order.payment_method || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                              order.status === "approved"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "rejected"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.status
                              ? order.status.toUpperCase()
                              : "PENDING"}
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
