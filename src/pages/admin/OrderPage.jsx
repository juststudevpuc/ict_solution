import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/helper/format";
import { request } from "@/utils/request/request";
import {
  CheckCircle,
  Edit,
  Image,
  Plus,
  Search,
  SearchSlash,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";

export default function OrderPage() {
  const [product, setProduct] = useState([]);
  const [order, SetOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [query, setQuery] = useState("");
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveData, setApproveData] = useState(null);
  const [customDuration, setCustomDuration] = useState(30);
  // const navigate = useNavigate();
  // const { user } = useAuth();
  const [form, setForm] = useState({
    total_amount: 0,
    total_paid: "",
    remark: "",
    payment_method: "Cash", // Defaulting to Cash, but could be "Bakong" or "Card"
    detail: [], // This will hold your array of purchased products
  });

  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request("product", "get");
      // Add ?status=approved to the URL!
      // const order = await request("order?status=approved", "get");
      const order = await request("order?status=approved", "get");

      if (res) {
        console.log("Response Product : ", res);
        setProduct(res?.data || res); // Safe fallback
        setForm({ id: "", name: "", description: "", status: true });
      }
      if (order) {
        console.log("Order :", order);
        // ✅ FIXED: Fallback to 'order' if 'order.data' doesn't exist
        // Also ensure this is lowercase 'setOrder' (matching your useState)
        SetOrder(order?.data || order);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // ✅ Moved this to a finally block so it always turns off the spinner!
      setLoading(false);
    }
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
    "Paid",
    "PayWay",
    "Status",
    "duration_months", // Add this
    "approved_at", // Add this
    "deadline_at",
    "Note",
    "Method",
    "Action",
  ];

  // 1. THE CLEAN ONSUBMIT FUNCTION
  const onSubmit = async (e) => {
    e.preventDefault();

    // If there are no products in detail, we create a dummy one
    // so Laravel validation passes and stock logic doesn't crash.
    const manualDetail =
      form?.detail?.length > 0
        ? form.detail
        : [
            {
              product_id: "manual_entry", // Or a specific ID for 'Service Fee'
              price: Number(form?.total_amount),
              qty: 1,
              discount: 0,
              total: Number(form?.total_amount),
            },
          ];

    const payload = {
      total_amount: Number(form?.total_amount) || 0,
      total_paid: Number(form?.total_paid) || 0,
      remark: form?.remark || "",
      payment_method: form?.payment_method || "Cash",
      detail: manualDetail, // Use the manual item if the array is empty
    };

    try {
      let res;
      if (isEdit) {
        res = await request(`admin/order/${form?.id}`, "put", payload);
      } else {
        res = await request("admin/order", "post", payload);
      }

      if (res) {
        fetchingData();
        setIsOpen(false);
        setIsEdit(false);
        setForm({
          id: "",
          total_amount: 0,
          total_paid: "",
          remark: "",
          payment_method: "Cash",
          detail: [],
        });
      }
    } catch (error) {
      console.log("Error saving order: ", error);
    }
  };

  const onEdit = (itemEdit) => {
    console.log("Item Edit", itemEdit);
    setIsOpen(true);
    setIsEdit(true);
    setForm(itemEdit);

    const mappedDetails =
      itemEdit?.order_details?.map((d) => {
        return {
          product_id: d.product_id,
          name: d.product?.name || "Unknown item",
          price: Number(d.price || 0),
          qty: Number(d.qty || 1),
          discount: Number(d.discount || 0),
          total: Number(d.price || 0) * Number(d.qty || 1),
        };
      }) || [];

    setForm({
      id: itemEdit?.id,
      customer_name: itemEdit?.customer_name || "",
      phone: itemEdit?.phone || "",
      total_amount: Number(itemEdit?.total_amount || 0),
      total_paid: Number(itemEdit?.total_paid || 0),
      payment_method: itemEdit?.payment_method || "",
      remark: itemEdit?.remark || "",

      // THIS IS THE CRUCIAL PART!
      // This feeds the existing products into your UI list
      detail: mappedDetails,
    });
  };

  const onDelete = async (itemDelete) => {
    console.log("Item Delete", itemDelete);

    // Pop the SweetAlert instead of opening the old Dialog
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${itemDelete.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // Tailwind red-500
      cancelButtonColor: "#64748b", // Tailwind slate-500
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // If the user clicks the confirm button...
      if (result.isConfirmed) {
        try {
          const res = await request(`admin/order/${itemDelete.id}`, "delete");

          if (res) {
            console.log("Deleted Product : ", res);
            fetchingData(); // Refresh your table data

            // Show a quick success message!
            Swal.fire({
              title: "Deleted!",
              text: `${itemDelete.order} has been deleted.`,
              icon: "success",
              timer: 1500, // Auto closes after 1.5s
              showConfirmButton: false,
            });
          }
        } catch (error) {
          console.log(error);
          Swal.fire("Error!", "Failed to delete the order.", "error");
        }
      }
    });
  };
  const handleApprove = async () => {
    try {
      // Send the custom duration to Laravel
      const res = await request(
        `admin/order/${approveData.id}/approve`,
        "patch",
        {
          duration_days: customDuration,
        },
      );

      if (res) {
        fetchingData(); // Refresh the table
        setIsApproveOpen(false); // Close the popup
        setApproveData(null);
      }
    } catch (error) {
      console.log("Error approving order: ", error);
    }
  };
  // form product
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);

  const addProductToDetail = () => {
    // 1. Find the full product object from your 'product' array
    const p = product.find((item) => item.id === selectedProduct);

    if (!p) {
      alert("Please select a product first");
      return;
    }

    const itemPrice = Number(p.price);
    const itemTotal = itemPrice * selectedQty;

    // 2. Create the new detail entry
    const newDetail = {
      product_id: p.id,
      name: p.name,
      price: itemPrice,
      qty: selectedQty,
      discount: 0, // Default for manual entry
      total: itemTotal,
    };

    // 3. Update the form state
    const updatedDetails = [...(form.detail || []), newDetail];
    const newTotalAmount = updatedDetails.reduce(
      (acc, curr) => acc + curr.total,
      0,
    );

    setForm({
      ...form,
      detail: updatedDetails,
      total_amount: newTotalAmount,
      total_paid: newTotalAmount, // Default to full payment
    });

    // Reset selection inputs
    setSelectedProduct("");
    setSelectedQty(1);
  };

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 gap-4">
        {/* LEFT SIDE: Search Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);

              // 🔥 ADDED THIS: If the user deletes all text, reload defaults immediately
              if (value.trim() === "") {
                fetchingData();
              }
            }}
            placeholder="Search order..."
            className="max-w-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-md shadow-sm transition-colors"
          />
          <Button
            onClick={async () => {
              // 🔥 ADDED THIS: If the search box is empty when clicked, reload defaults and stop!
              if (query.trim() === "") {
                fetchingData();
                return;
              }

              setLoading(true);
              try {
                const res = await request(
                  `admin/order/search/?q=${query}`,
                  "get",
                );
                if (res) {
                  const allSearchResults = res?.data || [];

                  // Keeps your status filtering perfectly!
                  const filteredResults = allSearchResults.filter(
                    (item) => item.status === status,
                  );

                  SetOrder(filteredResults);
                }
              } catch (error) {
                console.error("Search failed", error);
              } finally {
                setLoading(false);
              }
            }}
            className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-md shadow-sm transition-colors"
          >
            Search
          </Button>
          <Button
            onClick={() => {
              fetchingData();
              setQuery("");
            }}
            variant="outline"
            className="border-rose-200 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:border-rose-500/20 rounded-md shadow-sm transition-colors px-3"
          >
            <SearchSlash className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="flex justify-end">
              <Button
                variant="primary"
                className={
                  "bg-blue-500 text-white hover:bg-blue-700 flex justify-end"
                }
              >
                <Plus />
                Add Order
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Update Order" : "Create Manual Order"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                {/* --- SECTION 1: PRODUCT SELECTION --- */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors">
                  <Label className="mb-2 block text-blue-600 dark:text-blue-400 font-bold">
                    Select Products
                  </Label>
                  <div className="flex flex-row gap-2">
                    <div className="flex-1">
                      <Select
                        value={selectedProduct}
                        onValueChange={setSelectedProduct}
                      >
                        <SelectTrigger className="dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-colors">
                          <SelectValue placeholder="Search product..." />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                          {product?.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.id}
                              className="dark:text-slate-200 focus:dark:bg-slate-700 focus:dark:text-white"
                            >
                              {p.name} (${p.price})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      className="w-20 dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-colors"
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(Number(e.target.value))}
                      min="1"
                    />
                    <Button
                      type="button"
                      onClick={addProductToDetail}
                      variant="secondary"
                      className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white transition-colors"
                    >
                      Add
                    </Button>
                  </div>

                  {/* List of items added to this manual order */}
                  <div className="mt-4 space-y-2">
                    {form.detail?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm bg-white dark:bg-slate-900/60 p-2 rounded border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
                      >
                        <span className="dark:text-slate-200">
                          {item.name}{" "}
                          <span className="text-slate-400 dark:text-slate-500">
                            x{item.qty}
                          </span>
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          ${item.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- SECTION 2: TOTALS (READ ONLY) --- */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">
                      Total Amount ($)
                    </Label>
                    <Input
                      type="number"
                      value={form?.total_amount}
                      readOnly
                      className="bg-slate-100 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white font-bold cursor-not-allowed transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">
                      Total Paid ($)
                    </Label>
                    <Input
                      type="number"
                      value={form?.total_paid}
                      onChange={(e) =>
                        setForm({ ...form, total_paid: Number(e.target.value) })
                      }
                      placeholder="0.00"
                      required
                      className="dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                {/* --- SECTION 3: METADATA --- */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">
                      Payment Method
                    </Label>
                    <Select
                      value={form?.payment_method}
                      onValueChange={(val) =>
                        setForm({ ...form, payment_method: val })
                      }
                    >
                      <SelectTrigger className="dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-colors">
                        <SelectValue placeholder="Select Method" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectItem
                          value="Cash"
                          className="dark:text-slate-200 focus:dark:bg-slate-700 focus:dark:text-white"
                        >
                          Cash
                        </SelectItem>
                        <SelectItem
                          value="Bakong"
                          className="dark:text-slate-200 focus:dark:bg-slate-700 focus:dark:text-white"
                        >
                          Bakong KHQR
                        </SelectItem>
                        <SelectItem
                          value="Card"
                          className="dark:text-slate-200 focus:dark:bg-slate-700 focus:dark:text-white"
                        >
                          Card
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">Remark</Label>
                    <Input
                      value={form?.remark}
                      onChange={(e) =>
                        setForm({ ...form, remark: e.target.value })
                      }
                      placeholder="Note..."
                      className="dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                {/* --- BUTTONS --- */}
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEdit(false);

                      setSelectedProduct("");
                      setSelectedQty(1);

                      setForm({
                        id: "",
                        customer_name: "",
                        phone: "",
                        detail: [],
                        total_amount: 0,
                        total_paid: 0,
                        payment_method: "Cash",
                        remark: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.detail?.length === 0}
                    className="disabled:dark:opacity-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 transition-colors"
                  >
                    {isEdit ? "Update Order" : "Save Order"}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Do you want to delete {deleteData?.customer_name}?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setDeleteData(null);
                  setIsDelete(false);
                }}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const res = await request(
                      `admin/order/${deleteData?.id}`,
                      "delete",
                    );
                    if (res) {
                      console.log("Deleted Order : ", res);
                      fetchingData();
                      setDeleteData(null);
                      setIsDelete(false);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                variant={"destructive"}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- APPROVE ORDER DIALOG --- */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Order: {approveData?.order_no}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                How many days will this service take?
              </Label>
              {/* 🔥 FIXED: Wrapped in Math.max to prevent 0 or negative numbers */}
              <Input
                type="number"
                value={customDuration}
                onChange={(e) =>
                  setCustomDuration(Math.max(1, Number(e.target.value)))
                }
                min="1"
                className="font-bold text-lg"
              />
              <p className="text-xs text-slate-500">
                The deadline will be calculated from today automatically.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm & Start Timer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full min-w-0 border rounded-3xl bg-card shadow-sm overflow-hidden">
        <div className="w-full min-w-0 border border-slate-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="w-full overflow-x-auto custom-scrollbar bg-white dark:bg-slate-900 rounded-3xl transition-colors duration-300">
            <Table className="w-full min-w-[800px] text-sm text-left">
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
                  {tbl_head?.map((item, index) => (
                    <TableHead
                      key={index}
                      className="py-5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap"
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
                      <div className="flex justify-center py-16">
                        <Spinner className="size-8 text-blue-600 dark:text-blue-500 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : order?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tbl_head.length}
                      className="text-center py-16 text-slate-400 dark:text-slate-500 font-medium text-sm"
                    >
                      No orders found.
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

                    // --- TIMELINE MATH ---
                    let daysLeftText = "Pending Approval";
                    let timePercent = 0;

                    if (item.status === "approved") {
                      if (item.approved_at && item.deadline_at) {
                        const start = new Date(item.approved_at).getTime();
                        const end = new Date(item.deadline_at).getTime();
                        const now = new Date().getTime();

                        if (now >= end) {
                          daysLeftText = "Completed";
                          timePercent = 100;
                        } else {
                          const totalDuration = end - start;
                          const elapsed = now - start;
                          timePercent = Math.max(
                            0,
                            Math.min(100, (elapsed / totalDuration) * 100),
                          );

                          const daysLeft = Math.ceil(
                            (end - now) / (1000 * 60 * 60 * 24),
                          );
                          daysLeftText = `${daysLeft} days left`;
                        }
                      } else {
                        daysLeftText = "Approved (No Timeline)";
                        timePercent = 100;
                      }
                    } else if (item.status === "rejected") {
                      daysLeftText = "Cancelled";
                    }

                    return (
                      <TableRow
                        key={item?.id || index}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        <TableCell className="font-medium text-slate-400 dark:text-slate-500 pl-6">
                          {index + 1}
                        </TableCell>

                        <TableCell className="font-bold text-slate-900 dark:text-white">
                          {item?.order_no}
                        </TableCell>

                        <TableCell className="font-medium text-slate-500 dark:text-slate-400 text-xs">
                          {formatDate(item?.created_at)}
                        </TableCell>

                        <TableCell className="font-medium text-slate-500 dark:text-slate-400 text-xs">
                          {formatDate(item?.updated_at)}
                        </TableCell>

                        <TableCell className="font-medium text-slate-600 dark:text-slate-300">
                          {item?.customer_name || "Guest"}
                        </TableCell>

                        <TableCell className="font-medium text-slate-500 dark:text-slate-400 text-xs">
                          {item?.phone || "N/A"}
                        </TableCell>

                        <TableCell
                          className="max-w-[200px] truncate text-slate-500 dark:text-slate-400 font-medium"
                          title={productNames}
                        >
                          {productNames || "—"}
                        </TableCell>

                        <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                          {totalQty || 0}
                        </TableCell>

                        <TableCell className="font-bold text-slate-900 dark:text-white">
                          ${total.toFixed(2)}
                        </TableCell>

                        <TableCell
                          className={`font-bold ${
                            paid >= total
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-500 dark:text-amber-400"
                          }`}
                        >
                          ${paid.toFixed(2)}
                        </TableCell>

                        <TableCell className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                          {item?.payment_method || "-"}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold border transition-colors ${
                              item.status === "approved"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                : item.status === "rejected"
                                  ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                                  : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                            }`}
                          >
                            {item.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : "Pending"}
                          </span>
                        </TableCell>

                        {/* TIMELINE COLUMN */}
                        <TableCell className="min-w-[140px]">
                          {item.status === "approved" ? (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                  {daysLeftText}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                  {timePercent.toFixed(0)}%
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-200/50 dark:border-slate-700/50">
                                <div
                                  className="h-full rounded-full transition-all duration-1000 bg-blue-500"
                                  style={{ width: `${timePercent}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">
                              {daysLeftText}
                            </span>
                          )}
                        </TableCell>

                        {/* DATES */}
                        <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.approved_at ? (
                            <span className="font-medium text-xs">
                              {formatDate(item.approved_at)}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">
                              —
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.deadline_at ? (
                            <span className="font-semibold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-500/20">
                              {formatDate(item.deadline_at)}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">
                              —
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-slate-500 dark:text-slate-400 font-medium max-w-[150px] truncate">
                          {item?.remark || "-"}
                        </TableCell>

                        {/* PAYMENT PROGRESS */}
                        <TableCell>
                          <div className="flex flex-col gap-1.5 min-w-[120px]">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  paid >= total
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-amber-500 dark:text-amber-400"
                                }`}
                              >
                                {paid >= total ? "Paid" : "Pending"}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                {percentage}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                              <div
                                className={`h-full transition-all duration-1000 ${
                                  paid >= total
                                    ? "bg-emerald-500"
                                    : "bg-blue-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        {/* ACTION BUTTONS */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.status !== "approved" && (
                              <Button
                                onClick={() => {
                                  setApproveData(item);
                                  setIsApproveOpen(true);
                                }}
                                variant="outline"
                                size="icon"
                                className="size-9 rounded-xl border-emerald-200 text-emerald-600 bg-white hover:bg-emerald-50 hover:border-emerald-300 dark:bg-transparent dark:border-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/10 dark:hover:border-emerald-500/30 transition-colors shadow-sm"
                              >
                                <CheckCircle className="size-4" />
                              </Button>
                            )}

                            <Button
                              onClick={() => onEdit(item)}
                              variant="outline"
                              size="icon"
                              className="size-9 rounded-xl border-slate-200 text-slate-500 bg-white hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 dark:bg-transparent dark:border-slate-700 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 dark:hover:border-blue-500/30 transition-colors shadow-sm"
                            >
                              <Edit className="size-4" />
                            </Button>

                            <Button
                              onClick={() => onDelete(item)}
                              variant="destructive"
                              size="icon"
                              className="size-9 rounded-xl shadow-sm shadow-red-200 dark:shadow-none dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 dark:hover:text-red-300 transition-colors"
                            >
                              <Trash className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
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
  );
}
