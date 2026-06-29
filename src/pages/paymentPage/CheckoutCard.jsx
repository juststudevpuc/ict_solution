import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Trash2, X, UploadCloud, CheckCircle2 } from "lucide-react"; // Added Icons

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
import InvoiceCard from "./InvoiceCard";
import CartCard from "./CartCard";
import RemarkInput from "@/components/cards/RemarkInput";

export default function CheckoutCard({ formData }) {
  // Add this near your other state variables
  const [qrCurrency, setQrCurrency] = useState("USD"); // Default to Dollar
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const ref = useRef();

  const data = useSelector((state) => state.cart);
  const [paid_amount, setPaidAmount] = useState("");
  const [payment_method, setPaymentMethod] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 🔥 NEW: State for Receipt Upload
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

  const onPrint = useReactToPrint({ contentRef: ref });

  const onClearAll = () => {
    dispatch(clearAllCart());
    dispatch(setRefresh(true));
  };

  // 🔥 NEW: Handle Image Selection
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
      // 🔥 NEW: We must use FormData to send Images to Laravel
      const payload = new FormData();

      // Append normal text fields
      payload.append("phone", formData?.phone || "");
      payload.append("address", formData?.address || "");
      payload.append("total_amount", Number(total));
      payload.append("total_paid", Number(paid_amount) || 0);
      payload.append("remark", remark || "");
      payload.append("payment_method", payment_method);

      // Append the image file if it exists
      if (receiptFile) {
        payload.append("payment_slip", receiptFile);
      }

      // Append array items correctly for Laravel Form Data
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

      // Send to API (Axios will automatically detect FormData and set multipart/form-data)
      await request("order", "post", payload);

      alert("Order successfully placed!");

      // Cleanup
      setPaidAmount("");
      setRemark("");
      setPaymentMethod("");
      setReceiptFile(null);
      setReceiptPreview(null);
      setIsDialogOpen(false);
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

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {data.length > 0 ? (
          data.map((item) => <CartCard key={item.id || item._id} data={item} />)
        ) : (
          <p className="text-center py-10 text-slate-400">Your cart is empty</p>
        )}
      </div>

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

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Input
          value={paid_amount}
          onChange={(e) => setPaidAmount(e.target.value)}
          placeholder="Paid Amount"
          className="rounded-xl h-11"
        />
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

          {/* 🔥 FIXED HEIGHT & FLEX: This allows the modal to be scrollable without breaking the screen */}
          <DialogContent className="sm:max-w-md w-[95vw] rounded-3xl border-none p-0 bg-white shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            {/* --- STICKY HEADER --- */}
            <DialogHeader className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center shrink-0">
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

            {/* --- SCROLLABLE BODY (Vertical Scroll) --- */}
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

              {/* 🔥 FIXED HEIGHT & FLEX: This allows the modal to be scrollable without breaking the screen */}
              <DialogContent className="sm:max-w-md w-[95vw] rounded-3xl border-none p-0 bg-white shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                {/* --- STICKY HEADER --- */}
                <DialogHeader className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center shrink-0">
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

                {/* --- SCROLLABLE BODY (Vertical Scroll) --- */}
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center space-y-8 bg-slate-50/50">
                  {/* STEP 1: SCAN */}
                  <div className="w-full flex flex-col items-center">
                    <div className="bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-sm">
                      Step 1: Scan & Pay
                    </div>

                    {/* Modern Pill Toggle */}
                    <div className="flex p-1 bg-slate-200/60 rounded-full mb-6 w-full max-w-[240px] shadow-inner border border-slate-200/50">
                      <button
                        type="button"
                        onClick={() => setQrCurrency("USD")}
                        className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ease-in-out ${
                          qrCurrency === "USD"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrCurrency("KHR")}
                        className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ease-in-out ${
                          qrCurrency === "KHR"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        KHR (៛)
                      </button>
                    </div>

                   {/* 🔥 CHANGED: Added scale-125 and object-cover to crop out the white space */}
                    <div className="relative w-full aspect-square max-w-[320px] bg-white rounded-3xl border-4 border-slate-100 shadow-sm flex items-center justify-center overflow-hidden p-2">
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

                    {/* Friendly Helper Alert */}
                    <div className="mt-6 bg-amber-50 border border-amber-200/60 rounded-2xl p-4 w-full max-w-[280px] text-center shadow-sm">
                      <p className="text-sm font-medium text-amber-800">
                        Please transfer exactly
                        <br />
                        <strong className="text-2xl font-black text-amber-900 mt-1 block">
                          {qrCurrency === "USD"
                            ? `$${Number(paid_amount || 0).toFixed(2)}`
                            : `៛${(Number(paid_amount || 0) * 4100).toLocaleString()}`}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="w-full border-t-2 border-dashed border-slate-200"></div>

                  {/* STEP 2: UPLOAD */}
                  <div className="w-full flex flex-col items-center">
                    <div className="bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-sm">
                      Step 2: Upload Proof
                    </div>

                    <p className="text-sm font-medium text-slate-500 mb-4 text-center">
                      Attach your bank receipt screenshot here
                    </p>

                    <div className="w-full">
                      {!receiptPreview ? (
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-100 rounded-3xl cursor-pointer transition-all hover:scale-[1.02]">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-blue-500">
                            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                              <UploadCloud className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm font-bold text-blue-700">
                              Tap to choose image
                            </p>
                            <p className="text-xs text-blue-400 mt-1">
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
                        <div className="relative w-full h-48 rounded-3xl overflow-hidden group border-4 border-emerald-100 shadow-md">
                          <img
                            src={receiptPreview}
                            alt="Receipt Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
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

                {/* --- STICKY FOOTER --- */}
                <div className="p-5 border-t border-slate-100 bg-white shrink-0">
                  <Button
                    className="w-full py-7 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
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

            {/* --- STICKY FOOTER --- */}
            <div className="p-5 border-t border-slate-100 bg-white shrink-0">
              <Button
                className="w-full py-7 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                disabled={!receiptFile}
                onClick={onCheckout}
              >
                {receiptFile ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : null}
                {receiptFile ? "Complete Order" : "Upload Receipt to Finish"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="hidden">
        <InvoiceCard ref={ref} />
      </div>
    </Card>
  );
}
