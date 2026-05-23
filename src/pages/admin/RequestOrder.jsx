import {
  AlertCircle,
  CheckCheck,
  LoaderIcon,
  MailCheck,
  Package,
  PersonStanding,
  X,
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

export default function RequestOrder() {
  // 1. Setup the state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. The Fetch Function
  const fetchingData = async () => {
    setLoading(true);
    try {
      // Fetch all orders so we can calculate the metric cards
      const orderRes = await request("order", "get");
      if (orderRes) setOrders(orderRes?.data || orderRes);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Run on page load
  useEffect(() => {
    fetchingData();
  }, []);

  // 4. Calculate the Metric Cards automatically
  const totalRequests = orders?.length || 0;
  const approvedCount =
    orders?.filter((o) => o.status === "approved").length || 0;
  const rejectedCount =
    orders?.filter((o) => o.status === "rejected").length || 0;
  const pendingCount =
    orders?.filter((o) => o.status !== "approved" && o.status !== "rejected")
      .length || 0;

  // 5. Connect the Action Buttons
  const handleApprove = async (id) => {
    try {
      await request(`admin/order/${id}/approve`, "patch");
      fetchingData(); // Refresh instantly
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await request(`admin/order/${id}/reject`, "patch");
      fetchingData(); // Refresh instantly
    } catch (error) {
      console.error(error);
    }
  };

  const tbl_head = [
    "Order Info", // Combines NO and Date
    "Customer", // Combines Customer Name and Phone Number
    "Order Summary", // Combines Product Checkout and Remark
    "Financials", // Combines Total Price and Paid
    "Status", // The Pending/Paid Badge
    "Action", // Approve and Reject buttons
  ];

  return (
    <div className="">
      <div className="text-2xl font-bold">
        <h1>Request Orders</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4 py-7">
        {/* Top Row: Main Metrics */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <div className="flex h-32 flex-col justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Request Checkout
              </h3>
              {/* Orange Icon Box */}
              <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/20">
                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {loading ? "..." : totalRequests}
            </p>
          </div>

          <div className="flex h-32 flex-col justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Approve Checkout
              </h3>
              {/* Orange Icon Box */}
              <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/20">
                <CheckCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {loading ? "..." : approvedCount}
            </p>
          </div>

          <div className="flex h-32 flex-col justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Reject Checkout
              </h3>
              {/* Orange Icon Box */}
              <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/20">
                <X className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {loading ? "..." : rejectedCount}
            </p>
          </div>

          <div className="flex h-32 flex-col justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pending
              </h3>
              {/* Orange Icon Box */}
              <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/20">
                <LoaderIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <p className="text-3xl font-bold">
                  {loading ? "..." : pendingCount}
                </p>
              </div>
            </div>
            <p className="text-3xl font-bold">
              {/* {loading ? "..." : product?.length || 0} */}
            </p>
          </div>
        </div>

        <div className="py-10">
          <Table className="border bg-sky-900 ">
            <TableHeader>
              <TableRow>
                {tbl_head?.map((item, index) => (
                  <TableHead key={index} className={"text-slate-200"}>
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-slate-950">
              {/* Filter out approved/rejected so ONLY pending shows in the table */}
              {orders
                // ?.filter(
                //   (item) =>
                //     item.status !== "approved" && item.status !== "rejected",
                // )
                ?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <p className="font-medium">#{item.id}</p>
                    </TableCell>

                    <TableCell>
                      <p className="font-medium">
                        {item.customer_name || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.phone_number}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm">
                        {item.orderDetails?.length || 1} Items
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="font-medium">${item.total_amount}</p>
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

                    <TableCell>
                      {/* Check if the order is still pending. If yes, show buttons. If no, show a message. */}
                      {item.status !== "approved" &&
                      item.status !== "rejected" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 w-8 p-0 rounded-full"
                            onClick={() => handleApprove(item.id)}
                          >
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => handleReject(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs italic text-muted-foreground">
                          Processed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
