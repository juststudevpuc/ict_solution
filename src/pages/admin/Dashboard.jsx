import { formatDate } from "@/utils/helper/format";
import { request } from "@/utils/request/request";
import {
  Calendar,
  CheckCircle,
  Clock,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterData from "@/components/cards/FilterData";
import Graph from "./Graph";

export default function Dashboard() {
  const [product, setProduct] = useState([]);
  const [order, setOrder] = useState([]); // Fixed camelCase
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [selectedDate, setSelectedDate] = useState("");
  const [status, setStatus] = useState("approved");

  const [appliedDate, setAppliedDate] = useState("");

  // Calculate Paid and Pending based on your exact table logic
  const paidOrders =
    order?.filter(
      (item) =>
        Number(item?.total_paid || 0) >= Number(item?.total_amount || 0),
    ).length || 0;
  const pendingOrders =
    order?.filter(
      (item) => Number(item?.total_paid || 0) < Number(item?.total_amount || 0),
    ).length || 0;

  const fetchingData = async (dateToFilter = "", statusParam = "") => {
    setLoading(true);

    // LOG 1: What filters did the UI send?
    console.log(
      "🔥 1. Filter Triggered - Date:",
      dateToFilter,
      "| Status:",
      statusParam,
    );

    try {
      const res = await request("product", "get");
      const userRes = await request("admin/user", "get");

      // BUILD THE URL: Handle date and status dynamically
      let orderUrl = "order";
      let queryParams = [];

      if (dateToFilter !== "") {
        queryParams.push(`start_date=${dateToFilter}&end_date=${dateToFilter}`);
      }

      if (statusParam !== "") {
        queryParams.push(`status=${statusParam}`);
      } else {
        queryParams.push(`status=approved`);
      }

      // If we have any filters, stick them to the end of the URL
      if (queryParams.length > 0) {
        orderUrl += "?" + queryParams.join("&");
      }

      // LOG 2: What is the exact URL hitting the Laravel API?
      console.log("🔥 2. Requesting URL:", orderUrl);

      const orderRes = await request(orderUrl, "get");

      // LOG 3: What did Laravel and MongoDB actually send back?
      console.log("🔥 3. Database Response:", orderRes);

      if (res) setProduct(res?.data || res);
      if (userRes) setUser(userRes?.total_users || 0);
      if (orderRes) setOrder(orderRes?.data || orderRes);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = () => {
    // Pass both the date state and the status state!
    fetchingData(selectedDate, status);

    setAppliedDate(selectedDate);
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const tbl_head = [
    "No",
    "Order No",
    "Paid Date",
    "Update Paid",
    "Customer", // Stored directly in 'orders' table
    "Phone", // Stored directly in 'orders' table
    "Products", // List of names from 'order_details'
    "Total Qty", // Sum of qty from 'order_details'
    "Total ($)",
    "Status",
    "Paid",
    "PayWay",
    "Note",
    "Method",
  ];

  return (
    <div className="p-4 pt-0 ">
      <div className="flex flex-1 flex-col gap-4">
        {/* Top Row: Main Metrics */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Order Metric Card */}
          <div className="flex h-32 flex-col justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Approve Orders 
              </h3>
              {/* Blue Icon Box */}
              <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/20">
                <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {loading ? "..." : order?.length || 0}
            </p>
          </div>

          {/* Product Metric Card */}
          <div className="flex h-32 flex-col justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Products
              </h3>
              {/* Orange Icon Box */}
              <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/20">
                <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {loading ? "..." : product?.length || 0}
            </p>
          </div>

          {/* User Metric Card */}
          <div className="flex h-32 flex-col justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Users
              </h3>
              {/* Green Icon Box */}
              <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/20">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {loading ? "..." : user?.length || 0}
            </p>
          </div>
        </div>

        {/* Bottom Row: Order Status Breakdown */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Paid Orders Card */}
          <div className="flex h-32 flex-col justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Paid Orders
              </h3>
              {/* Green Check Icon */}
              <div className="rounded-md bg-emerald-100 p-2 dark:bg-emerald-900/20">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">{loading ? "..." : paidOrders}</p>
          </div>

          {/* Pending Orders Card */}
          <div className="flex h-32 flex-col justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </h3>
              {/* Amber Clock Icon */}
              <div className="rounded-md bg-amber-100 p-2 dark:bg-amber-900/20">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {loading ? "..." : pendingOrders}
            </p>
          </div>
        </div>

        <div className="">
          <Graph selectedDate={appliedDate} />
        </div>
        {/* filter */}
        <div className="flex w-[30%] min-w-[300px] items-center gap-4">
          {/* 2. Filter Button */}
          <div className="flex items-center justify-end bg-card p-4 rounded-lg border shadow-sm">
            <FilterData
              date={selectedDate}
              setDate={setSelectedDate}
              onFilter={handleFilterClick}
              status={status} // <-- Pass the status state down
              setStatus={setStatus} // <-- Pass the setter down
            />
            {/* Optional: Add a clear button to reset the table */}
            {(selectedDate || status) && (
              <Button
                onClick={() => {
                  setSelectedDate("");
                  fetchingData("");
                }}
                className="ml-4 text-xs font-semibold text-white bg-red-800 hover:bg-red-500 hover:underline"
                variant="destructive"
              >
                Clear Filter
              </Button>
            )}
          </div>
        </div>

        <div className="w-5xl">
          <div className="w-full overflow-x-auto px-4 custom-scrollbar border border-border bg-card ">
            <Table className="w-full border-collapse text-sm">
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-white/5">
                  {tbl_head?.map((item, index) => (
                    <TableHead key={index} className="whitespace-nowrap">
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={tbl_head.length}>
                      <div className="flex justify-center py-10">
                        <Spinner className={"size-7"} />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  order?.map((item, index) => {
                    const productNames = item?.order_details
                      ?.map((d) => d.product?.name || "Unknown Item")
                      .join(", ");
                    const totalQty = item?.order_details?.reduce(
                      (acc, curr) => acc + Number(curr.qty || 0),
                      0,
                    );
                    const paid = Number(item?.total_paid) || 0;
                    const total = Number(item?.total_amount) || 0;
                    const percentage =
                      total > 0 ? ((paid / total) * 100).toFixed(2) : "0.00";

                    return (
                      <TableRow key={item?.id || index}>
                        <TableCell className="font-medium py-6 text-slate-500">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {item?.order_no}
                        </TableCell>
                        <TableCell>{formatDate(item?.created_at)}</TableCell>
                        <TableCell>{formatDate(item?.updated_at)}</TableCell>
                        <TableCell>{item?.customer_name || "Guest"}</TableCell>
                        <TableCell>{item?.phone || "N/A"}</TableCell>
                        <TableCell
                          className="max-w-[200px] truncate"
                          title={productNames}
                        >
                          {productNames || "—"}
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {totalQty || 0}
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">
                          ${total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              item.status === "approved"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                : item.status === "rejected"
                                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                            }`}
                          >
                            {item.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : "Pending"}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">
                          ${paid.toFixed(2)}
                        </TableCell>

                        <TableCell>{item?.payment_method || "-"}</TableCell>
                        <TableCell>{item?.remark || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2 min-w-[120px]">
                            <div className="flex items-center justify-between gap-2">
                              <Badge
                                className={`text-[10px] border-none px-2 py-0 h-5 text-white ${paid >= total ? "bg-green-600" : "bg-amber-500"}`}
                              >
                                {paid >= total ? "Paid" : "Pending"}
                              </Badge>
                              <span className="text-[10px] font-bold text-slate-600">
                                {percentage}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50">
                              <div
                                className={`h-full transition-all duration-1000 ${paid >= total ? "bg-green-500" : "bg-blue-500"}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* 2. FIXED FOOTER AREA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-t border-border rounded-b-xl bg-card">
            <span className="text-sm font-medium text-slate-500">
              Total:{" "}
              <span className="text-slate-900 dark:text-white font-bold">
                {order?.length}
              </span>{" "}
              records
            </span>

            <div className="flex items-center gap-1">
              {/* Always show page 1 */}
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                1
              </Button>

              {/* Only show page 2 if there are more than 10 records */}
              {order?.length > 10 && (
                <Button variant="outline" size="sm">
                  2
                </Button>
              )}

              {/* Only show page 3 if there are more than 20 records */}
              {order?.length > 20 && (
                <Button variant="outline" size="sm">
                  3
                </Button>
              )}

              {/* Show the next arrow if there are more than 10 records */}
              {order?.length > 10 && (
                <Button variant="outline" size="sm" className="px-2">
                  {">"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
