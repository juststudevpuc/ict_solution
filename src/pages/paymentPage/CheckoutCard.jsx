import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Trash2, X } from "lucide-react";

// Store & Utils
import { clearAllCart } from "@/store/cartSlice";
import { setRefresh } from "@/store/usersSlice";
import { request } from "@/utils/request/request";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import InvoiceCard from "./InvoiceCard";
import CartCard from "./CartCard";
import RemarkInput from "@/components/cards/RemarkInput";

export default function CheckoutCard({ formData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [user , setUser] = useState(null);
  const user = useSelector((state) => state.user);
  const ref = useRef();

  // State
  const data = useSelector((state) => state.cart);
  const [paid_amount, setPaidAmount] = useState("");
  const [payment_method, setPaymentMethod] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Totals Calculation
  const totalItem = data.reduce((acc, item) => acc + Number(item?.qty || 0), 0);
  const totalOriginal = data.reduce(
    (acc, item) => acc + Number(item?.qty || 0) * Number(item?.price || 0),
    0,
  );
  const totalDiscount = data.reduce(
    (acc, item) =>
      acc +
      ((Number(item?.price || 0) * Number(item?.discount || 0)) / 100) *
        Number(item?.qty || 0),
    0,
  );
  const total = totalOriginal - totalDiscount;

  // Auto-fill paid amount when total changes
  useEffect(() => {
    if (total > 0) setPaidAmount(total.toFixed(2));
    else setPaidAmount("");
  }, [total]);

  const onPrint = useReactToPrint({ contentRef: ref });

  const onClearAll = () => {
    dispatch(clearAllCart());
    dispatch(setRefresh(true));
  };

  const onCheckout = async () => {
    setLoading(true);

    // 1. Prepare Order Payload
    const payload = {
      ...formData, // <--- FIX 1: Merge the phone and address into the order!
      total_amount: Number(total),
      total_paid: Number(paid_amount) || 0,
      remark: remark || "",
      payment_method: payment_method,
      detail: data?.map((item) => {
        const price = Number(item?.price || 0);
        const qty = Number(item?.qty || 0);
        const discount = Number(item?.discount || 0);
        const itemTotal = price * qty - ((price * discount) / 100) * qty;

        return {
          product_id: item?._id || item?.id,
          price: price,
          qty: qty,
          discount: discount,
          total: itemTotal,
        };
      }),
    };

    try {
      // 2. Step 1: Create Order
      await request("order", "post", payload);

      // FIX 2: Removed the unused 'orderId' variable to clear the error!

      // 3. Cleanup & Success UI
      alert("Order successfully placed!");
      setPaidAmount("");
      setRemark("");
      setPaymentMethod("");
      setIsVerified(false);
      dispatch(clearAllCart());
      dispatch(setRefresh(true));
    } catch (error) {
      console.error("Checkout Process Error:", error);
      alert(error?.message || "Failed to process checkout. Check network log.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl">
          <Spinner className="size-10 text-blue-600" />
          <p className="font-bold text-slate-800">Processing Order...</p>
        </div>
      </div>
    );

  const handlePayClick = () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
  };
  return (
    <Card className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-3xl border-slate-100">
      <CardHeader className="px-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Checkout
            </CardTitle>
            <CardDescription>
              Confirm your payment and order details
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearAll}
            className="text-red-500 hover:bg-red-50 rounded-full"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </CardHeader>

      {/* Cart Items List */}
      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {data.length > 0 ? (
          data.map((item) => <CartCard key={item.id} data={item} />)
        ) : (
          <p className="text-center py-10 text-slate-400">Your cart is empty</p>
        )}
      </div>

      {/* Financial Summary */}
      <div className="space-y-2 bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100 shadow-inner">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Items:</span>{" "}
          <span className="font-semibold text-slate-900">{totalItem}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-500">
          <span>Original:</span> <span>${totalOriginal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-500">
          <span>Discount:</span>{" "}
          <span className="text-red-500">-${totalDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-3 mt-2 text-slate-900">
          <span>Final Total:</span> <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <Input
            value={paid_amount}
            onChange={(e) => setPaidAmount(e.target.value)}
            placeholder="Paid Amount"
            className="rounded-xl h-11"
          />
        </div>
        <Select value={payment_method} onValueChange={setPaymentMethod}>
          <SelectTrigger className="rounded-xl h-11">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aba">ABA Bank</SelectItem>
            <SelectItem value="wing">Wing Money</SelectItem>
            <SelectItem value="acleda">ACLEDA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RemarkInput />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="w-1/3 h-12 rounded-xl border-slate-200"
          onClick={onPrint}
        >
          Print Invoice
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handlePayClick}
              className="w-2/3 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-200"
              disabled={data.length === 0 || !payment_method}
            >
              Pay Now
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl border-none p-0 overflow-hidden bg-white shadow-2xl">
            <DialogHeader className="p-8 bg-slate-900 text-white text-center">
              <DialogTitle className="text-xl">KHQR Payment</DialogTitle>
              <DialogDescription className="text-blue-400 font-bold text-xl mt-2">
                Pay Amount: ${total.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="p-8 flex flex-col items-center">
              {/* QR Code with Crop/Zoom Effect */}
              <div className="w-full aspect-square max-w-[280px] bg-white rounded-3xl mb-8 border-4 border-slate-100 shadow-inner overflow-hidden">
                <img
                  src="img/qr-code.jpg"
                  alt="QR"
                  className="w-full h-full object-cover scale-125"
                />
              </div>

              {/* Verified Checkbox */}
              <label className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl w-full border border-blue-100 mb-8 cursor-pointer group transition-colors hover:bg-blue-50">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="mt-1 size-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-blue-900 font-medium leading-tight">
                  I have scanned and completed the bank transfer successfully.
                </span>
              </label>

              <Button
                className="w-full py-7 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-100"
                disabled={!isVerified}
                onClick={() => {
                  setIsDialogOpen(false);
                  onCheckout();
                }}
              >
                Complete Checkout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hidden Invoice Template for Printing */}
      <div className="hidden">
        <InvoiceCard ref={ref} />
      </div>
    </Card>
  );
}
