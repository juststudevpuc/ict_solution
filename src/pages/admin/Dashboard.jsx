import { formatDate } from "@/utils/helper/format";
import { request } from "@/utils/request/request";
import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  ReceiptText,
  Calendar,
  Filter,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Graph from "./Graph";

export default function Dashboard() {
  // --- 1. STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("staff"); // Defaults to lowest privilege

  const [product, setProduct] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [order, setOrder] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  // --- 2. DATE & FILTER CONFIGURATION ---
  const todayDate = new Date();
  const currentYear = todayDate.getFullYear().toString();
  const currentMonth = (todayDate.getMonth() + 1).toString();
  const currentDay = todayDate.getDate().toString();

  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterDay, setFilterDay] = useState(currentDay);
  const [status, setStatus] = useState("approved");
  const [graphDate, setGraphDate] = useState("");

  const isAdmin = userRole === "admin";

  // --- 3. AUTHENTICATION (Extract Role) ---
  useEffect(() => {
    const persistString = localStorage.getItem("persist:root");
    if (persistString) {
      try {
        const parsedRoot = JSON.parse(persistString);
        if (parsedRoot.user) {
          const userObj = JSON.parse(parsedRoot.user);
          setUserRole(userObj?.role?.toLowerCase() || "staff");
        }
      } catch (error) {
        console.error("Failed to parse role:", error);
      }
    }
  }, []);

  // --- 4. DATA FETCHING (Role-Protected) ---
  const fetchingData = async (
    start,
    end,
    graphRefDate,
    currentStatus,
    role,
  ) => {
    setLoading(true);
    setGraphDate(graphRefDate);

    try {
      let orderUrl = "admin/order?";
      let params = [];
      if (start) params.push(`start_date=${start}`);
      if (end) params.push(`end_date=${end}`);
      if (currentStatus) params.push(`status=${currentStatus}`);
      orderUrl += params.join("&");

      // Core API calls for everyone
      const apiCalls = [
        request("admin/product", "get"),
        request("admin/user", "get"),
        request(orderUrl, "get"),
      ];

      // Sensitive API call (Only pushed to the queue if Admin)
      if (role === "admin") {
        let salesUrl = "admin/sales-summary";
        if (graphRefDate) salesUrl += `?date=${graphRefDate}`;
        apiCalls.push(request(salesUrl, "get"));
      }

      const results = await Promise.all(apiCalls);

      const productRes = results[0];
      const userRes = results[1];
      const orderRes = results[2];
      const salesRes = results[3]; // Undefined for staff

      // Populate State
      if (productRes)
        setProduct(productRes.total || productRes.data?.length || 0);
      if (userRes) setUserCount(userRes.total || userRes.data?.length || 0);
      if (orderRes) {
        const orderData = Array.isArray(orderRes.data)
          ? orderRes.data
          : orderRes.data?.data || [];
        setOrder(orderData);
        setTotalOrders(orderRes?.total || orderData.length || 0);
      }

      if (salesRes && role === "admin") {
        setRevenue(salesRes?.sale_this_month?.total || salesRes?.total || 0);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 5. FILTER WATCHER ---
  useEffect(() => {
    let start = "";
    let end = "";
    let refDate = "";

    if (filterYear) {
      if (filterMonth) {
        if (filterDay) {
          const d = `${filterYear}-${String(filterMonth).padStart(2, "0")}-${String(filterDay).padStart(2, "0")}`;
          start = d;
          end = d;
          refDate = d;
        } else {
          start = `${filterYear}-${String(filterMonth).padStart(2, "0")}-01`;
          const lastDay = new Date(filterYear, filterMonth, 0).getDate();
          end = `${filterYear}-${String(filterMonth).padStart(2, "0")}-${lastDay}`;
          refDate = start;
        }
      } else {
        start = `${filterYear}-01-01`;
        end = `${filterYear}-12-31`;
        refDate = start;
      }
    }

    fetchingData(start, end, refDate, status, userRole);
  }, [filterYear, filterMonth, filterDay, status, userRole]);

  // --- 6. UI HELPERS ---
  const years = Array.from({ length: 5 }, (_, i) => parseInt(currentYear) - i);
  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];
  const daysInMonth =
    filterYear && filterMonth
      ? new Date(filterYear, filterMonth, 0).getDate()
      : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Dynamic Table Headers (Hides money columns for Staff)
  const tbl_head = isAdmin
    ? [
        "No",
        "Order No",
        "Customer",
        "Date",
        "Products",
        "Qty",
        "Total",
        "Status",
        "Paid",
        "Method",
      ]
    : ["No", "Order No", "Customer", "Date", "Products", "Qty", "Status"];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-[#050B14] min-h-screen transition-colors duration-300">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
          Overview Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium transition-colors">
          Here is what is happening with your store.
        </p>
      </div>

      {/* METRICS GRID */}
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      >
        {isAdmin && (
          <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-none dark:hover:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Revenue
              </h3>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 transition-colors">
                <DollarSign className="size-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {loading ? "..." : `$${parseFloat(revenue).toFixed(2)}`}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-3 flex items-center gap-1.5">
              <TrendingUp className="size-3.5" />
              {filterMonth
                ? `Month of ${months.find((m) => m.value == filterMonth)?.label}`
                : "Filtered Revenue"}
            </p>
          </div>
        )}

        <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-none dark:hover:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Filtered Orders
            </h3>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 transition-colors">
              <ShoppingCart className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {loading ? "..." : totalOrders}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-3 flex items-center gap-1.5">
            <Filter className="size-3.5" /> Status:{" "}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
        </div>

        <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-none dark:hover:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Customers
            </h3>
            <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 transition-colors">
              <Users className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {loading ? "..." : userCount}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-3">
            Registered accounts
          </p>
        </div>

        <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-none dark:hover:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Products
            </h3>
            <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20 transition-colors">
              <Package className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {loading ? "..." : product}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-3">
            Available in inventory
          </p>
        </div>
      </div>

      {/* GRAPH SECTION (Admin Only) */}
      {isAdmin && (
        <div className="bg-white dark:bg-slate-900/60 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
            <TrendingUp className="size-6 text-blue-600 dark:text-blue-500" />
            Sales Performance
          </h3>
          <div className="dark:opacity-90 transition-opacity">
            <Graph selectedDate={graphDate} />
          </div>
        </div>
      )}

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        {/* Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-5 bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <ReceiptText className="size-5 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Transactions
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <select
                className="bg-transparent dark:bg-slate-900 border-none text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer outline-none pl-3 pr-6 py-1.5"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Date Filters */}
            <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <div className="flex items-center pl-3 pr-1 text-slate-400 dark:text-slate-500">
                <Calendar className="size-4" />
              </div>
              <select
                className="bg-transparent dark:bg-slate-900 border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none pl-1 pr-4 py-1.5"
                value={filterYear}
                onChange={(e) => {
                  setFilterYear(e.target.value);
                  if (filterDay === "29" && filterMonth === "2")
                    setFilterDay("");
                }}
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>
              <select
                className="bg-transparent dark:bg-slate-900 border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none pl-3 pr-4 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                value={filterMonth}
                onChange={(e) => {
                  setFilterMonth(e.target.value);
                  setFilterDay("");
                }}
                disabled={!filterYear}
              >
                <option value="">All Months</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <div className="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>
              <select
                className="bg-transparent dark:bg-slate-900 border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none pl-3 pr-4 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                disabled={!filterMonth}
              >
                <option value="">All Days</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            {(filterYear !== currentYear ||
              filterMonth !== currentMonth ||
              filterDay !== currentDay ||
              status !== "approved") && (
              <Button
                onClick={() => {
                  setFilterYear(currentYear);
                  setFilterMonth(currentMonth);
                  setFilterDay(currentDay);
                  setStatus("approved");
                }}
                variant="destructive"
                className="text-xs font-bold shadow-sm rounded-xl px-5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-all border-none"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="w-full text-sm text-left">
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                {tbl_head?.map((item, index) => (
                  <TableHead
                    key={index}
                    className="py-5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap align-middle"
                  >
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={tbl_head.length}>
                    <div className="flex justify-center py-16 text-blue-600 dark:text-blue-500">
                      <Spinner className="size-8 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : order?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={tbl_head.length}
                    className="text-center py-16 text-slate-400 dark:text-slate-500 font-medium text-sm"
                  >
                    No orders found. Try changing your filters.
                  </TableCell>
                </TableRow>
              ) : (
                order?.map((item, index) => {
                  const productNames = item?.order_details
                    ?.map((d) => d.product?.name)
                    .join(", ");
                  const totalQty = item?.order_details?.reduce(
                    (acc, curr) => acc + Number(curr.qty || 0),
                    0,
                  );
                  const paid = Number(item?.total_paid) || 0;
                  const total = Number(item?.total_amount) || 0;

                  return (
                    <TableRow
                      key={item?.id || index}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <TableCell className="py-5 pl-6 font-medium text-slate-400 dark:text-slate-500 w-12 align-middle">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-5 px-4 font-bold text-blue-600 dark:text-blue-400 font-mono align-middle">
                        {item?.order_no}
                      </TableCell>
                      <TableCell className="py-5 px-4 font-bold text-slate-900 dark:text-white align-middle">
                        {item?.customer_name || "Guest"}
                      </TableCell>
                      <TableCell className="py-5 px-4 text-slate-500 dark:text-slate-400 font-medium text-xs whitespace-nowrap align-middle">
                        {formatDate(item?.created_at)}
                      </TableCell>
                      <TableCell
                        className="py-5 px-4 max-w-[200px] truncate text-slate-500 dark:text-slate-400 font-medium align-middle"
                        title={productNames}
                      >
                        {productNames || "—"}
                      </TableCell>
                      <TableCell className="py-5 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                        {totalQty || 0}
                      </TableCell>

                      {isAdmin && (
                        <TableCell className="py-5 px-4 font-black text-slate-900 dark:text-white align-middle">
                          ${total.toFixed(2)}
                        </TableCell>
                      )}

                      <TableCell className="py-5 px-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border ${
                            item.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                          }`}
                        >
                          {item.status ? item.status : "PENDING"}
                        </span>
                      </TableCell>

                      {isAdmin && (
                        <>
                          <TableCell
                            className={`py-5 px-4 font-bold align-middle ${paid >= total ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500 dark:text-amber-400"}`}
                          >
                            ${paid.toFixed(2)}
                          </TableCell>
                          <TableCell className="py-5 pr-6 text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 align-middle">
                            {item?.payment_method || "-"}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
