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
import { configs } from "@/utils/config/configs";
import { formatDate } from "@/utils/helper/format";
import { request } from "@/utils/request/request";
import { Edit, Image, Plus, Search, SearchSlash, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
      const order = await request("order", "get");

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
    setDeleteData(itemDelete);
    setIsDelete(true);
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
      <div className="flex justify-between w-5xl items-center">
        <div className="flex items-center gap-3 mb-4">
          {/* <h1 className="text-xl font-bold">Order</h1> */}
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order "
            className="max-w-xs"
          />
          <Button
            onClick={async () => {
              setLoading(true);
              try {
                const res = await request(
                  `admin/order/search/?q=${query}`,
                  "get",
                );
                if (res) {
                  // ✅ FIXED: Changed setProduct to setOrder
                  SetOrder(res?.data || []);
                }
              } catch (error) {
                console.error("Search failed", error);
              } finally {
                // ✅ Moved to finally so the spinner always turns off!
                setLoading(false);
              }
            }}
            className={"bg-green-400 text-white hover:bg-green-600"}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              fetchingData();
              setQuery("");
            }}
            variant="destructive"
          >
            <SearchSlash className="w-4 h-4 text-red-500 transition-colors" />
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" className={"bg-blue-500 text-white hover:bg-blue-700"}>
              <Plus />
              Add Order
            </Button>
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
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Label className="mb-2 block text-blue-600 font-bold">
                    Select Products
                  </Label>
                  <div className="flex flex-row gap-2">
                    <div className="flex-1">
                      <Select
                        value={selectedProduct}
                        onValueChange={setSelectedProduct}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Search product..." />
                        </SelectTrigger>
                        <SelectContent>
                          {product?.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} (${p.price})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      className="w-20"
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(Number(e.target.value))}
                      min="1"
                    />
                    <Button
                      type="button"
                      onClick={addProductToDetail}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>

                  {/* List of items added to this manual order */}
                  <div className="mt-4 space-y-2">
                    {form.detail?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm bg-white p-2 rounded border shadow-sm"
                      >
                        <span>
                          {item.name}{" "}
                          <span className="text-slate-400">x{item.qty}</span>
                        </span>
                        <span className="font-bold text-blue-600">
                          ${item.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- SECTION 2: TOTALS (READ ONLY) --- */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Amount ($)</Label>
                    <Input
                      type="number"
                      value={form?.total_amount}
                      readOnly
                      className="bg-slate-100 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Paid ($)</Label>
                    <Input
                      type="number"
                      value={form?.total_paid}
                      onChange={(e) =>
                        setForm({ ...form, total_paid: Number(e.target.value) })
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* --- SECTION 3: METADATA --- */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={form?.payment_method}
                      onValueChange={(val) =>
                        setForm({ ...form, payment_method: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bakong">Bakong KHQR</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Remark</Label>
                    <Input
                      value={form?.remark}
                      onChange={(e) =>
                        setForm({ ...form, remark: e.target.value })
                      }
                      placeholder="Note..."
                    />
                  </div>
                </div>

                {/* --- BUTTONS --- */}
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEdit(false); // <--- Add this!

                      // Also a good idea to clear these if you have them!
                      setSelectedProduct("");
                      setSelectedQty(1);

                      setForm({
                        id: "",
                        customer_name: "", // Added missing fields so React doesn't complain
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
                  <Button type="submit" disabled={form.detail?.length === 0}>
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
            <DialogTitle>Do you want to delete {deleteData?.name}?</DialogTitle>
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
                      `order/${deleteData?.id}`,
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
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => onEdit(item)}
                            variant="outline"
                            size="icon"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            onClick={() => onDelete(item)}
                            variant="destructive"
                            size="icon"
                          >
                            <Trash className="w-4 h-4" />
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
