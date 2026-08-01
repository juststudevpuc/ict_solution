import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Trash2, X, UploadCloud, CheckCircle2 } from "lucide-react";

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
import CartCard from "./CartCard";
import RemarkInput from "@/components/cards/RemarkInput";
import InvoiceCard from "./InvoiceCard";

export default function CheckoutCard({ formData }) {
  const [qrCurrency, setQrCurrency] = useState("USD");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  
  // Refs
  const ref = useRef();
  const isCheckoutCompleteRef = useRef(false); // 🔥 NEW: Tracks if we should clear the cart after printing

  const data = useSelector((state) => state.cart);
  const [paid_amount, setPaidAmount] = useState("");
  const [payment_method, setPaymentMethod] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

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

  useEffect(() => {
    if (total > 0) setPaidAmount(total.toFixed(2));
    else setPaidAmount("");
  }, [total]);

  // 🔥 NEW: Cleanup function to run ONLY after the print dialog closes
  const clearFormAndCart = () => {
    setPaidAmount("");
    setRemark("");
    setPaymentMethod("");
    setReceiptFile(null);
    setReceiptPreview(null);
    setIsDialogOpen(false);
    dispatch(clearAllCart());
    dispatch(setRefresh(true));
  };

  // 🔥 UPDATED: Print function now listens for when the print dialog closes
  const onPrint = useReactToPrint({ 
    contentRef: ref,
    onAfterPrint: () => {
      // If they just paid, clear the cart. If they just clicked "Print Invoice" manually, do nothing!
      if (isCheckoutCompleteRef.current) {
        clearFormAndCart();
        isCheckoutCompleteRef.current = false; // Reset the tracker
      }
    }
  });

  const onClearAll = () => {
    dispatch(clearAllCart());
    dispatch(setRefresh(true));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const onCheckout = async () => {
    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("phone", formData?.phone || "");
      payload.append("address", formData?.address || "");
      payload.append("total_amount", Number(total));
      payload.append("total_paid", Number(paid_amount) || 0);
      payload.append("remark", remark || "");
      payload.append("payment_method", payment_method);

      if (receiptFile) {
        payload.append("payment_slip", receiptFile);
      }

      data.forEach((item, index) => {
        const price = Number(item?.price || 0);
        const qty = Number(item?.qty || 0);
        const discount = Number(item?.discount || 0);
        const itemTotal = price * qty - ((price * discount) / 100) * qty;

        payload.append(`detail[${index}][product_id]`, item?._id || item?.id);
        payload.append(`detail[${index}][price]`, price);
        payload.append(`detail[${index}][qty]`, qty);
        payload.append(`detail[${index}][discount]`, discount);
        payload.append(`detail[${index}][total]`, itemTotal);
      });

      await request("order", "post", payload);

      // 🔥 UPDATED FLOW: Success -> Auto Print -> Clear Cart (Handled by onAfterPrint)
      setIsDialogOpen(false); // Close the payment modal immediately
      alert("Order successfully placed!");
      
      isCheckoutCompleteRef.current = true; // Tell the printer to clear the cart when done
      onPrint(); // Trigger the auto-print!

    } catch (error) {
      console.error("Checkout Process Error:", error);
      alert(error?.message || "Failed to process checkout. Check network log.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl border border-slate-100 dark:border-slate-800">
          <Spinner className="size-10 text-blue-600 dark:text-blue-500" />
          <p className="font-bold text-slate-800 dark:text-slate-100">Processing Order...</p>
        </div>
      </div>
    );

  return (
    <Card className="max-w-lg mx-auto p-6 bg-white dark:bg-slate-900 shadow-xl rounded-3xl border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <CardHeader className="px-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Checkout
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Confirm your payment and order details
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearAll}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </CardHeader>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {data.length > 0 ? (
          data.map((item) => <CartCard key={item.id || item._id} data={item} />)
        ) : (
          <p className="text-center py-10 text-slate-400 dark:text-slate-500">Your cart is empty</p>
        )}
      </div>

      <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl mb-6 border border-slate-100 dark:border-slate-700/50 shadow-inner transition-colors">
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Items:</span>{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">{totalItem}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Original:</span> <span>${totalOriginal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Discount:</span>{" "}
          <span className="text-red-500 dark:text-red-400">-${totalDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-3 mt-2 text-slate-900 dark:text-white transition-colors">
          <span>Final Total:</span> <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Input
          value={paid_amount}
          onChange={(e) => setPaidAmount(e.target.value)}
          placeholder="Paid Amount"
          className="rounded-xl h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
        />
        <Select value={payment_method} onValueChange={setPaymentMethod}>
          <SelectTrigger className="rounded-xl h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <SelectItem value="aba">ABA Bank</SelectItem>
            <SelectItem value="wing">Wing Money</SelectItem>
            <SelectItem value="acleda">ACLEDA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RemarkInput />

      <div className="flex gap-3">
        {/* 🔥 Manual Print Invoice Button (Prints immediately, doesn't clear cart) */}
        <Button
          variant="outline"
          className="w-1/3 h-12 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          onClick={() => {
            isCheckoutCompleteRef.current = false; // Ensure cart doesn't clear
            onPrint();
          }}
          disabled={data.length === 0}
        >
          Print Invoice
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handlePayClick}
              className="w-2/3 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-colors"
              disabled={data.length === 0 || !payment_method}
            >
              Pay Now
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md w-[95vw] rounded-3xl border-none p-0 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden max-h-[90vh] transition-colors duration-300">
            <DialogHeader className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white text-center shrink-0">
              <DialogTitle className="text-2xl font-black flex items-center justify-center gap-2">
                Secure Checkout 🔒
              </DialogTitle>
              <DialogDescription className="text-blue-100 font-medium mt-1 text-base">
                Total Amount Due:{" "}
                <span className="text-white font-bold text-xl ml-1">
                  ${total.toFixed(2)}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center space-y-8 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
              
              <div className="w-full flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-sm">
                  Step 1: Scan & Pay
                </div>

                <div className="flex p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-full mb-6 w-full max-w-[240px] shadow-inner border border-slate-200/50 dark:border-slate-700/50 transition-colors">
                  <button
                    type="button"
                    onClick={() => setQrCurrency("USD")}
                    className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ease-in-out ${
                      qrCurrency === "USD"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrCurrency("KHR")}
                    className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ease-in-out ${
                      qrCurrency === "KHR"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    KHR (៛)
                  </button>
                </div>

                <div className="relative w-full aspect-square max-w-[320px] bg-white dark:bg-slate-800 rounded-3xl border-4 border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center overflow-hidden p-2 transition-colors">
                  <img
                    src={
                      qrCurrency === "USD"
                        ? "/img/qrcode/qr-dolla.jpg"
                        : "/img/qrcode/qr-khmer.jpg"
                    }
                    alt={`KHQR ${qrCurrency}`}
                    key={qrCurrency}
                    className="w-full h-full object-cover scale-125 rounded-2xl animate-in fade-in duration-300"
                  />
                </div>

                <div className="mt-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 rounded-2xl p-4 w-full max-w-[280px] text-center shadow-sm transition-colors">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                    Please transfer exactly
                    <br />
                    <strong className="text-2xl font-black text-amber-900 dark:text-amber-300 mt-1 block">
                      {qrCurrency === "USD"
                        ? `$${Number(paid_amount || 0).toFixed(2)}`
                        : `៛${(Number(paid_amount || 0) * 4100).toLocaleString()}`}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="w-full border-t-2 border-dashed border-slate-200 dark:border-slate-700 transition-colors"></div>

              <div className="w-full flex flex-col items-center">
                <div className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-sm">
                  Step 2: Upload Proof
                </div>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">
                  Attach your bank receipt screenshot here
                </p>

                <div className="w-full">
                  {!receiptPreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 dark:border-blue-700/50 bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-100 dark:hover:bg-blue-500/10 rounded-3xl cursor-pointer transition-all hover:scale-[1.02]">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-blue-500">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3 transition-colors">
                          <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                          Tap to choose image
                        </p>
                        <p className="text-xs text-blue-400 dark:text-blue-500/70 mt-1">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-48 rounded-3xl overflow-hidden group border-4 border-emerald-100 dark:border-emerald-900/30 shadow-md">
                      <img
                        src={receiptPreview}
                        alt="Receipt Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <label className="text-white text-sm font-bold cursor-pointer bg-white/20 px-4 py-2 rounded-full hover:bg-white/40 transition-colors">
                          Change Receipt
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 transition-colors">
              <Button
                className="w-full py-7 text-lg font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:shadow-none"
                disabled={!receiptFile}
                onClick={onCheckout}
              >
                {receiptFile ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : null}
                {receiptFile
                  ? "Complete Order"
                  : "Upload Receipt to Finish"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="hidden">
        <InvoiceCard ref={ref} paidAmount={paid_amount} />
      </div>
    </Card>
  );
}