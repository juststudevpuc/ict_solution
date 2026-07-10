import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  ShieldCheck,
  ShoppingBag,
  Building2,
  Briefcase,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { request } from "@/utils/request/request";
import { Spinner } from "@/components/ui/spinner";

const UserProfile = () => {
  // 1. Redux Setup
  const dispatch = useDispatch();

  // 2. All States inside the component
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    company_name: "",
    company_industry: "", 
  });

  const [order, setOrder] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // <--- State is safely inside
  const [imageFile, setImageFile] = useState(null); // Holds the actual file to send to Laravel
  const [imagePreview, setImagePreview] = useState(null); // Holds the preview to show the user

  // 3. Fetch Data
  const fetchingData = async () => {
    setLoading(true);

    try {
      // const orderRes = await request("order?status=approved || pending || reject", "get");
      const orderRes = await request("order", "get");
      if (orderRes) {
        setOrder(orderRes.data || orderRes);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }

    try {
      const res = await request("me", "get");
      if (res?.user) {
        console.log("Company info:", res.user)
        setMe(res.user);
        setFormData((prev) => ({
          ...prev,
          name: res.user.name || "",
          email: res.user.email || "",
          phone: res.user.phone || "",
          address: res.user.address || "",
          company_name: res.user.company_name || "",
          company_industry: res.user.company_industry || "",
        }));
        if (res.user.avatar) setImagePreview(res.user.avatar);
      }
    } catch (error) {
      console.log("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  // 4. Form Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // PACKAGING DATA FOR FILE UPLOAD
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("phone", formData.phone);
    submitData.append("address", formData.address);
    submitData.append("company_name", formData.company_name);
    submitData.append("company_industry", formData.company_industry);

    if (formData.newPassword) {
      submitData.append("currentPassword", formData.currentPassword);
      submitData.append("newPassword", formData.newPassword);
    }

    // If they picked a new image, add it to the package!
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      // Send the FormData. Your request.js will handle the headers automatically!
      const res = await request("user/update", "post", submitData);

      if (res?.error) {
        alert(res.message);
        setIsSaving(false);
        return;
      }

      if (res?.user) {
        alert("Profile updated successfully!");
        dispatch(setUser(res.user));
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
        setImageFile(null); // Clear the temp file
        fetchingData();
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Something went wrong updating your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const tbl_head = [
    "Order No",
    "Status",
    "Product",
    "Date",
    "Qty",
    "Total",
    "Paid",
    "PayWay",
    "Duration Month",
    "Remark",
    "Payment Process",
    "Action",
  ];

  const handleRequestRefund = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to request a refund for this order?",
      )
    )
      return;
    console.log("Attempting refund for ID:", orderId); // Check your Browser Console (F12)
    if (!orderId) return alert("Error: Order ID is missing!");

    try {
      const res = await request(`order/${orderId}/request-refund`, "post");
      alert(res.message);
      fetchingData(); // Refresh the table to show updated status
    } catch (error) {
      alert("Failed to request refund.");
    }
  };

  // 5. Render
  return (
    <div className="w-full max-w-6xl mx-auto p-6 mt-10 md:p-10 space-y-10">
      {/* ===== PAGE HEADER ===== */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">
          My Profile
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your account settings and view your order history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* ===== LEFT COLUMN: AVATAR & QUICK INFO ===== */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative">
                {/* 🔥 FIXED: Now checks for me?.avatar (matching backend) or me?.image
                 */}
                {imagePreview || me?.avatar || me?.image ? (
                  <img
                    src={
                      imagePreview ||
                      `http://54.179.48.141${me?.avatar || me?.image}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file); // Save file for the API
                    setImagePreview(URL.createObjectURL(file)); // Show preview instantly
                  }
                }}
              />

              {/* The clickable button that triggers th e hidden input */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </label>
            </div>
            {imageFile && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="mb-4 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm px-5 py-2 rounded-full font-bold transition-all shadow-sm disabled:opacity-50 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Picture"
                )}
              </button>
            )}

            <h2 className="text-xl font-bold text-slate-900">
              {me?.name || "Loading..."}
            </h2>
            <p className="text-sm text-slate-500 mb-4">{me?.email}</p>

            <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Customer Account
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Account
              Security
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your account is secured. We recommend updating your password every
              90 days to keep your data safe.
            </p>
          </div>
        </div>

        {/* ===== RIGHT COLUMN: EDIT FORM ===== */}
        <div className="md:col-span-8">
          <form
            onSubmit={handleSave}
            className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
          >
            {/* --- 1. PERSONAL INFORMATION --- */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-slate-600">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      className="pl-9"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone" className="text-slate-600">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      name="phone"
                      className="pl-9"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor="email" className="text-slate-600">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="pl-9 bg-slate-50 text-slate-500"
                      value={formData.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor="address" className="text-slate-600">
                    Full Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Textarea
                      id="address"
                      name="address"
                      className="pl-9 min-h-[100px]"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- 2. BUSINESS INFORMATION (NEW) --- */}
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="company_name" className="text-slate-600">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="company_name"
                      name="company_name"
                      className="pl-9"
                      placeholder="e.g. Acme Corp"
                      value={formData.company_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="company_industry" className="text-slate-600">
                    Industry
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="company_industry"
                      name="company_industry"
                      className="pl-9"
                      placeholder="e.g. Retail, Technology"
                      value={formData.company_industry}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- 3. CHANGE PASSWORD --- */}
            <div className="p-6 md:p-8 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                Change Password
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currentPassword" className="text-slate-600">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="newPassword" className="text-slate-600">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Create a new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* --- 4. SUBMIT BUTTONS --- */}
            <div className="p-6 md:p-8 border-t border-slate-200 flex justify-end gap-4 bg-white">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== BOTTOM SECTION: ORDER HISTORY ===== */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-6 h-6 text-slate-900" />
          <h2 className="text-2xl font-bold text-slate-900">History</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-white border-2 border-indigo-100 rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <Table className="w-full text-sm text-left">
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-slate-100">
                    {tbl_head?.map((item, index) => (
                      <TableHead
                        key={index}
                        className="py-5 px-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider whitespace-nowrap align-middle"
                      >
                        {item}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-50">
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={tbl_head.length || 12}
                        className="h-40 align-middle"
                      >
                        <div className="flex flex-col items-center justify-center h-full text-blue-600 gap-4">
                          <Spinner className="size-8 animate-spin" />
                          <span className="text-sm font-medium text-slate-500">
                            Loading data...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : order?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={tbl_head.length || 12}
                        className="text-center py-12 text-slate-400 font-medium text-sm align-middle"
                      >
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    order?.map((item, index) => {
                      // Data Calculations
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
                        total > 0 ? ((paid / total) * 100).toFixed(0) : "0";
                      const isFullyPaid = paid >= total;

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
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          {/* 1. Order Number */}
                          <TableCell className="px-4 py-4 whitespace-nowrap align-middle">
                            <span className="font-bold text-blue-600 font-mono">
                              {item?.order_no || `#${item?.id}`}
                            </span>
                          </TableCell>

                          {/* 2. Status Badge */}
                          <TableCell className="px-4 py-4 whitespace-nowrap align-middle">
                            <span
                              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                                item.status === "approved"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : item.status === "rejected"
                                    ? "bg-red-50 text-red-600 border-red-100"
                                    : "bg-amber-50 text-amber-600 border-amber-100"
                              }`}
                            >
                              {item.status ? item.status : "Pending"}
                            </span>
                          </TableCell>

                          {/* 3. Products List */}
                          <TableCell
                            className="px-4 py-4 max-w-[200px] truncate text-slate-900 font-bold align-middle"
                            title={productNames}
                          >
                            {productNames || (
                              <span className="text-slate-400 font-medium">
                                —
                              </span>
                            )}
                          </TableCell>

                          {/* 4. Date */}
                          <TableCell className="px-4 py-4 whitespace-nowrap text-slate-500 font-medium text-xs align-middle">
                            {item?.created_at
                              ? new Date(item.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </TableCell>

                          {/* 5. Total Qty */}
                          <TableCell className="px-4 py-4 text-center whitespace-nowrap align-middle">
                            <span className="font-bold text-slate-700">
                              {totalQty || 0}
                            </span>
                          </TableCell>

                          {/* 6. Total Amount */}
                          <TableCell className="px-4 py-4 whitespace-nowrap font-black text-slate-900 align-middle">
                            ${total.toFixed(2)}
                          </TableCell>

                          {/* 7. Paid Amount */}
                          <TableCell
                            className={`px-4 py-4 whitespace-nowrap font-bold align-middle ${
                              isFullyPaid
                                ? "text-emerald-600"
                                : "text-amber-500"
                            }`}
                          >
                            ${paid.toFixed(2)}
                          </TableCell>

                          {/* 8. Payment Method */}
                          <TableCell className="px-4 py-4 whitespace-nowrap align-middle">
                            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                              {item?.payment_method || "—"}
                            </span>
                          </TableCell>

                          {/* 9. Timeline */}
                          <TableCell className="min-w-[140px] px-4 py-4 align-middle">
                            {item.status === "approved" ? (
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                    {daysLeftText}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500">
                                    {timePercent.toFixed(0)}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                  <div
                                    className="h-full rounded-full transition-all duration-1000 bg-blue-500"
                                    style={{ width: `${timePercent}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium italic">
                                {daysLeftText}
                              </span>
                            )}
                          </TableCell>

                          {/* 10. Remark */}
                          <TableCell
                            className="px-4 py-4 text-slate-500 max-w-[150px] truncate font-medium text-sm align-middle"
                            title={item?.remark}
                          >
                            {item?.remark || "—"}
                          </TableCell>

                          {/* 11. Progress Bar */}
                          <TableCell className="px-4 py-4 min-w-[160px] align-middle">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider ${
                                    isFullyPaid
                                      ? "text-emerald-600"
                                      : "text-amber-500"
                                  }`}
                                >
                                  {isFullyPaid ? "Completed" : "In Progress"}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500">
                                  {percentage}%
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                                <div
                                  className={`h-full transition-all duration-1000 ${
                                    isFullyPaid
                                      ? "bg-emerald-500"
                                      : "bg-blue-500"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>

                          {/* 12. Actions */}
                          <TableCell className="px-4 py-4 whitespace-nowrap align-middle">
                            {item.status === "approved" ? (
                              <Button
                                onClick={() => handleRequestRefund(item.id)}
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm"
                              >
                                Request Refund
                              </Button>
                            ) : item.status === "refund_requested" ? (
                              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                                Pending Review
                              </span>
                            ) : item.status === "refunded" ? (
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                Refunded
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-slate-300">
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
