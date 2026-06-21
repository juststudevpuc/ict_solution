import React, { useState, useEffect } from "react";
import { request } from "@/utils/request/request";
import { CreditCard, Search, ArrowRightLeft } from "lucide-react";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await request("order", "get");
      if (res && res.data) {
        setTransactions(res.data);
      }
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (orderId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this refund?`))
      return;

    try {
      // Send the request to our new Laravel route
      await request(`admin/order/${orderId}/process-refund`, "post", { action });

      // Refresh the table to show the new status
      fetchTransactions();
    } catch (error) {
      console.error("Refund processing failed", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Simple frontend filter for the ledger
  const filteredTransactions = transactions.filter(
    (t) =>
      t.order_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="text-blue-600 size-6" />
            Transaction Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor all incoming payments, methods, and financial statuses.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm"
            placeholder="Search TXN or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">TXN ID (Order)</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Payment Method</th>
                <th className="px-6 py-4 font-medium text-right">
                  Total Amount
                </th>
                <th className="px-6 py-4 font-medium text-right">
                  Amount Paid
                </th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Loading ledger...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const isPaid =
                    parseFloat(txn.total_paid) >= parseFloat(txn.total_amount);

                  return (
                    <tr
                      key={txn.id}
                      className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {txn.order_no}
                      </td>
                      <td className="px-6 py-4">{txn.customer_name}</td>
                      <td className="px-6 py-4">
                        {new Date(txn.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="size-4 text-slate-400" />
                          <span className="capitalize">
                            {txn.payment_method || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        ${parseFloat(txn.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-blue-600">
                        ${parseFloat(txn.total_paid).toFixed(2)}
                      </td>
                      {/* Replace the old Status <td> with this new one: */}
                      <td className="px-6 py-4 text-center">
                        {txn.status === "refund_requested" ? (
                          <div className="flex flex-col gap-2 items-center">
                            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-100 text-amber-700 animate-pulse">
                              REFUND REQUESTED
                            </span>
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => handleRefund(txn.id, "approve")}
                                className="text-xs bg-emerald-500 text-white px-2 py-1 rounded hover:bg-emerald-600 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRefund(txn.id, "reject")}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ) : txn.status === "refunded" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-slate-200 text-slate-700">
                            REFUNDED
                          </span>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {isPaid ? "PAID" : "PENDING"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
