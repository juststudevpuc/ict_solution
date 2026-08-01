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
  ArrowUpRight,
  AlertTriangle, // 🔥 ADDED THIS
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
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("staff");

  const [product, setProduct] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [order, setOrder] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const todayDate = new Date();
  const currentYear = todayDate.getFullYear().toString();
  const currentMonth = (todayDate.getMonth() + 1).toString();
  const currentDay = todayDate.getDate().toString();

  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterDay, setFilterDay] = useState(currentDay);
  const [status, setStatus] = useState("approved");
  const [graphDate, setGraphDate] = useState("");

  const [lowStockItems, setLowStockItems] = useState([]);

  const isAdmin = userRole === "admin";

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

      const apiCalls = [
        request("admin/product", "get"),
        request("admin/user", "get"),
        request(orderUrl, "get"),
      ];

      if (role === "admin") {
        let salesUrl = "admin/sales-summary";
        if (graphRefDate) salesUrl += `?date=${graphRefDate}`;
        apiCalls.push(request(salesUrl, "get"));
      }

      const results = await Promise.all(apiCalls);

      const productRes = results[0];
      const userRes = results[1];
      const orderRes = results[2];
      const salesRes = results[3];

      if (productRes)
        setProduct(productRes.total || productRes.data?.length || 0);

      // 🔥 NEW: Extract product array and find low stock!
      const allProducts = Array.isArray(productRes.data)
        ? productRes.data
        : productRes.data?.data || productRes || [];

      // Filter any product with stock less than 5
      // Filter any product with stock less than 5
      const lowStock = allProducts.filter((p) => {
        if (!p) return false;

        // 1. Safely grab the category to ignore software
        let categoryName = "";
        if (typeof p.category === "string") {
          categoryName = p.category;
        } else if (p.category && p.category.name) {
          categoryName = p.category.name;
        } else if (typeof p.type === "string") {
          categoryName = p.type;
        }

        const itemCategory = categoryName.toLowerCase();
        const isDigitalService =
          itemCategory === "software" ||
          itemCategory === "service" ||
          itemCategory === "digital";

        if (isDigitalService) return false;

        // 2. Safely find the stock number no matter where Laravel hid it
        let currentStock = 0;

        if (p.current_stock !== undefined) {
          currentStock = Number(p.current_stock);
        } else if (p.stock_left !== undefined) {
          currentStock = Number(p.stock_left);
        } else if (p.qty !== undefined) {
          currentStock = Number(p.qty);
        } else if (Array.isArray(p.inventories) && p.inventories.length > 0) {
          // 🔥 EXPERT FIX: If Laravel sends the ledger array, grab the latest stock_left
          const latestRecord = p.inventories[p.inventories.length - 1];
          currentStock = Number(latestRecord.stock_left || latestRecord.qty || 0);
        } else if (Array.isArray(p.inventory) && p.inventory.length > 0) {
          const latestRecord = p.inventory[p.inventory.length - 1];
          currentStock = Number(latestRecord.stock_left || latestRecord.qty || 0);
        }

        return currentStock < 5;
      });

      setLowStockItems(lowStock);
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
      {/* 🔥 UPDATED: Top Header with Global Filters */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
            Overview Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium transition-colors">
            Here is what is happening with your store.
          </p>
        </div>

        {/* Global Date Filter Pill */}
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center pl-3 pr-2 text-slate-400 dark:text-slate-500">
            <Calendar className="size-4" />
          </div>

          <select
            className="bg-transparent dark:bg-slate-900 border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none pl-2 pr-6 py-1.5 cursor-pointer"
            value={filterYear}
            onChange={(e) => {
              setFilterYear(e.target.value);
              if (filterDay === "29" && filterMonth === "2") setFilterDay("");
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
            className="bg-transparent dark:bg-slate-900 border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none pl-4 pr-6 py-1.5 cursor-pointer disabled:opacity-30"
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
            className="bg-transparent dark:bg-slate-900 border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none pl-4 pr-6 py-1.5 cursor-pointer disabled:opacity-30"
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

          {(filterYear !== currentYear ||
            filterMonth !== currentMonth ||
            filterDay !== currentDay) && (
            <Button
              onClick={() => {
                setFilterYear(currentYear);
                setFilterMonth(currentMonth);
                setFilterDay(currentDay);
              }}
              variant="ghost"
              className="text-xs font-bold rounded-xl px-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all ml-2"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* 🔥 UPDATED: METRICS GRID WITH TREND BADGES */}
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      >
        {isAdmin && (
          <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Revenue
              </h3>
              <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/10 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                <DollarSign className="size-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {loading ? "..." : `$${parseFloat(revenue).toFixed(2)}`}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                <ArrowUpRight className="size-3" /> +12.5%
              </span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                vs last month
              </span>
            </div>
          </div>
        )}

        <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Orders
            </h3>
            <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/10 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm">
              <ShoppingCart className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {loading ? "..." : totalOrders}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-500/20">
              <Filter className="size-3" />{" "}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Current filter
            </span>
          </div>
        </div>

        <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Customers
            </h3>
            <div className="p-2.5 bg-gradient-to-br from-purple-100 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/10 rounded-xl text-purple-600 dark:text-purple-400 shadow-sm">
              <Users className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {loading ? "..." : userCount}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400 px-2 py-0.5 rounded-full text-xs font-bold border border-purple-100 dark:border-purple-500/20">
              <ArrowUpRight className="size-3" /> +4.2%
            </span>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              New accounts
            </span>
          </div>
        </div>

        <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Inventory
            </h3>
            <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/10 rounded-xl text-orange-600 dark:text-orange-400 shadow-sm">
              <Package className="size-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {loading ? "..." : product}
          </p>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-4">
            Active products listed
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

      {/* 🔥 NEW: LOW STOCK ALERTS WIDGET (Only shows if there is low stock) */}
      {isAdmin && lowStockItems.length > 0 && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-6 rounded-[2rem] shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-red-100 dark:bg-red-500/20 rounded-xl text-red-600 dark:text-red-400 animate-pulse border border-red-200 dark:border-red-500/30">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-900 dark:text-red-400 tracking-tight">
                Low Stock Alerts
              </h3>
              <p className="text-sm font-medium text-red-700/70 dark:text-red-400/70 mt-0.5">
                {lowStockItems.length}{" "}
                {lowStockItems.length === 1
                  ? "product requires"
                  : "products require"}{" "}
                restocking immediately.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {lowStockItems.map((item, idx) => {
              const currentStock =
                item.qty !== undefined ? item.qty : item.stock_left || 0;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-red-100 dark:border-red-500/30 flex justify-between items-center shadow-sm"
                >
                  <div className="truncate pr-3">
                    <p className="font-bold text-slate-900 dark:text-white truncate text-sm">
                      {item.name || "Unknown Product"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      Item #{item.id || item._id?.slice(-6)}
                    </p>
                  </div>
                  <div className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-xl font-black text-lg border border-red-200 dark:border-red-500/20 shrink-0">
                    {currentStock}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RECENT ORDERS TABLE */}
      {/* ... your existing table code ... */}

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        {/* Table Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <ReceiptText className="size-5 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Transactions
            </h3>
          </div>

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
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="w-full text-sm text-left">
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                {tbl_head?.map((item, index) => (
                  <TableHead
                    key={index}
                    className="py-4 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap align-middle"
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
                      <TableCell className="py-4 pl-6 font-medium text-slate-400 dark:text-slate-500 w-12 align-middle">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-4 px-4 font-bold text-blue-600 dark:text-blue-400 font-mono align-middle">
                        {item?.order_no}
                      </TableCell>
                      <TableCell className="py-4 px-4 font-bold text-slate-900 dark:text-white align-middle">
                        {item?.customer_name || "Guest"}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium text-xs whitespace-nowrap align-middle">
                        {formatDate(item?.created_at)}
                      </TableCell>
                      <TableCell
                        className="py-4 px-4 max-w-[200px] truncate text-slate-500 dark:text-slate-400 font-medium align-middle"
                        title={productNames}
                      >
                        {productNames || "—"}
                      </TableCell>
                      <TableCell className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300 align-middle">
                        {totalQty || 0}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="py-4 px-4 font-black text-slate-900 dark:text-white align-middle">
                          ${total.toFixed(2)}
                        </TableCell>
                      )}
                      <TableCell className="py-4 px-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border ${item.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"}`}
                        >
                          {item.status ? item.status : "PENDING"}
                        </span>
                      </TableCell>
                      {isAdmin && (
                        <>
                          <TableCell
                            className={`py-4 px-4 font-bold align-middle ${paid >= total ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500 dark:text-amber-400"}`}
                          >
                            ${paid.toFixed(2)}
                          </TableCell>
                          <TableCell className="py-4 pr-6 text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 align-middle">
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
