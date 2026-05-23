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
      const orderRes = await request("order?status=approved", "get");
      if (orderRes) {
        setOrder(orderRes.data || orderRes);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }

    try {
      const res = await request("me", "get");
      if (res?.user) {
        setMe(res.user);
        setFormData((prev) => ({
          ...prev,
          name: res.user.name || "",
          email: res.user.email || "",
          phone: res.user.phone || "",
          address: res.user.address || "",
        }));
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
    "Product",
    "Date",
    "Qty",
    "Total",
    "Paid",
    "PayWay",
    "Remark",
    "Status",
  ];

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
                {/* Show the preview, or the database image, or the fallback icon */}
                {imagePreview || me?.image ? (
                  <img
                    // If they just picked a new image, show it. Otherwise, show the one from Laravel (add your backend URL if needed!)
                    src={imagePreview || `http://127.0.0.1:8000${me.image}`}
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

              {/* The clickable button that triggers the hidden input */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </label>
            </div>

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

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                {tbl_head?.map((item, index) => (
                  <TableHead key={index}>{item}</TableHead>
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
                    <TableRow
                      key={item?.id || index}
                      className="hover:bg-slate-50/50"
                    >
                      <TableCell className="font-semibold text-blue-600 py-4">
                        {item?.order_no || `#${item?.id}`}
                      </TableCell>

                      <TableCell
                        className="max-w-[200px] truncate text-slate-600"
                        title={productNames}
                      >
                        {productNames || "—"}
                      </TableCell>

                      <TableCell className="text-slate-600">
                        {item?.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "—"}
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
};

export default UserProfile;
