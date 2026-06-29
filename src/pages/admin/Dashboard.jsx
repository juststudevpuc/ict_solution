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
  Filter
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
  const fetchingData = async (start, end, graphRefDate, currentStatus, role) => {
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
      if (productRes) setProduct(productRes.total || productRes.data?.length || 0);
      if (userRes) setUserCount(userRes.total || userRes.data?.length || 0);
      if (orderRes) {
        const orderData = Array.isArray(orderRes.data) ? orderRes.data : orderRes.data?.data || [];
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
          start = d; end = d; refDate = d;
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
    { value: 1, label: "Jan" }, { value: 2, label: "Feb" }, { value: 3, label: "Mar" },
    { value: 4, label: "Apr" }, { value: 5, label: "May" }, { value: 6, label: "Jun" },
    { value: 7, label: "Jul" }, { value: 8, label: "Aug" }, { value: 9, label: "Sep" },
    { value: 10, label: "Oct" }, { value: 11, label: "Nov" }, { value: 12, label: "Dec" },
  ];
  const daysInMonth = filterYear && filterMonth ? new Date(filterYear, filterMonth, 0).getDate() : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Dynamic Table Headers (Hides money columns for Staff)
  const tbl_head = isAdmin 
    ? ["No", "Order No", "Customer", "Date", "Products", "Qty", "Total", "Status", "Paid", "Method"]
    : ["No", "Order No", "Customer", "Date", "Products", "Qty", "Status"];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overview Dashboard</h1>
        <p className="text-slate-500 mt-1 font-medium">Here is what is happening with your store.</p>
      </div>

      {/* METRICS GRID (Adapts columns based on role) */}
      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        
        {isAdmin && (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Revenue</h3>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                <DollarSign className="size-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{loading ? "..." : `$${parseFloat(revenue).toFixed(2)}`}</p>
            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="size-3" />
              {filterMonth ? `Month of ${months.find(m => m.value == filterMonth)?.label}` : "Filtered Revenue"}
            </p>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filtered Orders</h3>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
              <ShoppingCart className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{loading ? "..." : totalOrders}</p>
          <p className="text-xs text-blue-600 font-bold mt-2 flex items-center gap-1">
            <Filter className="size-3" /> Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Customers</h3>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
              <Users className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{loading ? "..." : userCount}</p>
          <p className="text-xs text-slate-400 font-medium mt-2">Registered accounts</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Products</h3>
            <div className="p-2 bg-orange-50 rounded-xl text-orange-600 border border-orange-100">
              <Package className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{loading ? "..." : product}</p>
          <p className="text-xs text-slate-400 font-medium mt-2">Available in inventory</p>
        </div>
      </div>

      {/* GRAPH SECTION (Admin Only) */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="size-5 text-blue-600" />
            Sales Performance
          </h3>
          <Graph selectedDate={graphDate} />
        </div>
      )}

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ReceiptText className="size-5 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <select className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer outline-none pl-3 pr-6 py-1" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center pl-3 pr-1 text-slate-400">
                <Calendar className="size-4" />
              </div>
              <select className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none pl-1 pr-4 py-1" value={filterYear} onChange={(e) => { setFilterYear(e.target.value); if (filterDay === "29" && filterMonth === "2") setFilterDay(""); }}>
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <div className="w-px h-4 bg-slate-200"></div>
              <select className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none pl-3 pr-4 py-1 disabled:opacity-50" value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setFilterDay(""); }} disabled={!filterYear}>
                <option value="">All Months</option>
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              <div className="w-px h-4 bg-slate-200"></div>
              <select className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none pl-3 pr-4 py-1 disabled:opacity-50" value={filterDay} onChange={(e) => setFilterDay(e.target.value)} disabled={!filterMonth}>
                <option value="">All Days</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {(filterYear !== currentYear || filterMonth !== currentMonth || filterDay !== currentDay || status !== "approved") && (
              <Button onClick={() => { setFilterYear(currentYear); setFilterMonth(currentMonth); setFilterDay(currentDay); setStatus("approved"); }} variant="destructive" className="text-xs font-bold shadow-sm rounded-xl px-4">
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="w-full text-sm text-left">
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                {tbl_head?.map((item, index) => (
                  <TableHead key={index} className="py-5 px-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider whitespace-nowrap align-middle">
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-slate-50">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={tbl_head.length}>
                    <div className="flex justify-center py-12 text-blue-600">
                      <Spinner className="size-8 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : order?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tbl_head.length} className="text-center py-12 text-slate-400 font-medium text-sm">
                    No orders found. Try changing your filters.
                  </TableCell>
                </TableRow>
              ) : (
                order?.map((item, index) => {
                  const productNames = item?.order_details?.map((d) => d.product?.name).join(", ");
                  const totalQty = item?.order_details?.reduce((acc, curr) => acc + Number(curr.qty || 0), 0);
                  const paid = Number(item?.total_paid) || 0;
                  const total = Number(item?.total_amount) || 0;

                  return (
                    <TableRow key={item?.id || index} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="py-4 pl-6 font-medium text-slate-400 w-12 align-middle">{index + 1}</TableCell>
                      <TableCell className="py-4 px-4 font-bold text-blue-600 font-mono align-middle">{item?.order_no}</TableCell>
                      <TableCell className="py-4 px-4 font-bold text-slate-900 align-middle">{item?.customer_name || "Guest"}</TableCell>
                      <TableCell className="py-4 px-4 text-slate-500 font-medium text-xs whitespace-nowrap align-middle">{formatDate(item?.created_at)}</TableCell>
                      <TableCell className="py-4 px-4 max-w-[200px] truncate text-slate-500 font-medium align-middle" title={productNames}>{productNames || "—"}</TableCell>
                      <TableCell className="py-4 px-4 font-bold text-slate-700 align-middle">{totalQty || 0}</TableCell>
                      
                      {isAdmin && (
                        <TableCell className="py-4 px-4 font-black text-slate-900 align-middle">${total.toFixed(2)}</TableCell>
                      )}

                      <TableCell className="py-4 px-4 align-middle">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${item.status === "approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                          {item.status ? item.status : "PENDING"}
                        </span>
                      </TableCell>

                      {isAdmin && (
                        <>
                          <TableCell className={`py-4 px-4 font-bold align-middle ${paid >= total ? "text-emerald-600" : "text-amber-500"}`}>${paid.toFixed(2)}</TableCell>
                          <TableCell className="py-4 pr-6 text-xs uppercase font-bold tracking-wider text-slate-400 align-middle">{item?.payment_method || "-"}</TableCell>
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