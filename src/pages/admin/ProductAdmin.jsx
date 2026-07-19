import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
// import { configs } from "@/utils/config/configs";
import { formatDate } from "@/utils/helper/format";
import { request } from "@/utils/request/request";
import { Edit, Image, Plus, Search, SearchSlash, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";

export default function ProductAdmin() {
  const [product, setProduct] = useState([]);
  // const [user, setUser] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [query, setQuery] = useState("");
  // const navigate = useNavigate();
  // const { user } = useAuth();
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    category_id: "",
    qty: 0,
    price: 0,
    discount: 0,
    image: null,
    status: true,
  });

  const fetchingData = async () => {
    setLoading(true);
    try {
      // Ensure this matches your Laravel admin route prefix if needed!
      const res = await request("admin/product", "get");
      const categoryRes = await request("category", "get");

      if (categoryRes) {
        setCategory(categoryRes?.data);
      }

      if (res) {
        setProduct(res?.data);
        // Clean up the reset form to match your full schema
        setForm({
          id: "",
          name: "",
          description: "",
          category_id: "",
          qty: 0,
          price: 0,
          discount: 0,
          image: null,
          status: true,
        });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const tbl_head = [
    "No",
    "Name",
    "Description",
    "Category",
    // "Quantity",
    "Price",
    // "discount",
    "Image",
    "Status",
    "Created at",
    "Updated at",
    "Action",
  ];

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form?.name);
    formData.append("description", form?.description);
    formData.append("category_id", form?.category_id);
    formData.append("qty", form?.qty || 0);
    formData.append("price", form?.price);
    formData.append("discount", form?.discount);
    formData.append("status", form?.status ? 1 : 0);

    if (form?.image instanceof File) {
      formData.append("image", form?.image);
    }

    try {
      if (isEdit) {
        formData.append("_method", "put");
        const res = await request(
          `admin/product/${form?.id}`,
          "post",
          formData,
        );
        if (res) {
          console.log("Updated Product : ", res);
          fetchingData();
        }
        setIsEdit(false);
      } else {
        const res = await request("admin/product", "post", formData);
        if (res) {
          console.log("Created Product : ", res);
          fetchingData();
        }
      }
    } catch (error) {
      console.log(error);
    }

    console.log("Form Data : ", form);
    setIsOpen(false);

    setForm({
      id: "",
      name: "",
      description: "",
      category_id: "",
      price: 0,
      discount: 0,
      image: null,
      status: true,
    });
  };

  const onEdit = (itemEdit) => {
    console.log("Item Edit", itemEdit);
    setIsOpen(true);
    setIsEdit(true);
    setForm(itemEdit);

    setForm({
      id: itemEdit?.id,
      name: itemEdit?.name || "",
      description: itemEdit?.description || "",
      category_id: itemEdit?.category_id || "",
      qty: itemEdit?.qty || 0,
      price: itemEdit?.price || 0,
      discount: itemEdit?.discount || 0,
      // Force status to be a strict boolean (true/false) for your UI
      status: itemEdit?.status == 1 || itemEdit?.status === true,
      // Keep image null so we don't crash your file input with a URL string!
      image: null,
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
          const res = await request(`admin/product/${itemDelete.id}`, "delete");

          if (res) {
            console.log("Deleted Product : ", res);
            fetchingData(); // Refresh your table data

            // Show a quick success message!
            Swal.fire({
              title: "Deleted!",
              text: `${itemDelete.name} has been deleted.`,
              icon: "success",
              timer: 1500, // Auto closes after 1.5s
              showConfirmButton: false,
            });
          }
        } catch (error) {
          console.log(error);
          Swal.fire("Error!", "Failed to delete the product.", "error");
        }
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* ===== LEFT: HEADING & SEARCH ===== */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mr-2">
            Products
          </h1>
          <div className="flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="max-w-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl transition-colors"
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
                    SetOrder(res?.data || []);
                  }
                } catch (error) {
                  console.error("Search failed", error);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl px-5 transition-all"
            >
              {loading ? (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
            {query && (
              <Button
                onClick={() => {
                  fetchingData();
                  setQuery("");
                }}
                variant="destructive"
                className="rounded-xl px-3 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border-none shadow-none"
              >
                <SearchSlash className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* ===== RIGHT: ADD BUTTON & MODAL ===== */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-500 font-bold rounded-xl shadow-sm shadow-blue-200 dark:shadow-none gap-2 transition-all w-full sm:w-auto">
              <Plus className="size-4" />
              Add New Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-5xl w-[95vw] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xl sm:rounded-2xl p-0 flex flex-col max-h-[90vh] overflow-hidden transition-colors duration-300">
            {/* HEADER */}
            <div className="px-6 md:px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 shrink-0 transition-colors">
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isEdit ? "Update Product" : "Create New Product"}
              </DialogTitle>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                Fill in the details below to{" "}
                {isEdit ? "update this" : "add a new"} product in your
                inventory.
              </p>
            </div>

            {/* FORM BODY */}
            <form
              onSubmit={onSubmit}
              className="flex flex-col overflow-hidden min-h-0"
            >
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Name */}
                  <div className="col-span-1 md:col-span-2 space-y-2.5">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                      Product Name
                    </Label>
                    <Input
                      value={form?.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. Premium Wireless Headphones"
                      required
                      className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 focus-visible:ring-blue-500 dark:text-white rounded-xl py-5 transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2.5">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                      Category
                    </Label>
                    <Select
                      value={form?.category_id}
                      onValueChange={(value) =>
                        setForm({ ...form, category_id: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl h-11 transition-colors">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
                        {category?.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item?.id}
                            className="font-medium dark:text-slate-200 focus:dark:bg-slate-700"
                          >
                            {item?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div className="space-y-2.5">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                      Price ($)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form?.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="0.00"
                      required
                      className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 focus-visible:ring-blue-500 dark:text-white rounded-xl py-5 transition-colors"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2.5">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                      Status
                    </Label>
                    <Select
                      value={String(form?.status)}
                      onValueChange={(value) =>
                        setForm({ ...form, status: Number(value) })
                      }
                    >
                      <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 focus:ring-blue-500 dark:text-white rounded-xl h-11 transition-colors">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
                        <SelectItem
                          value="1"
                          className="font-bold text-emerald-600 dark:text-emerald-400 focus:dark:bg-slate-700"
                        >
                          Active (Published)
                        </SelectItem>
                        <SelectItem
                          value="0"
                          className="font-medium text-slate-500 dark:text-slate-400 focus:dark:bg-slate-700"
                        >
                          Inactive (Draft)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2.5">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                      Product Image
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.files[0] })
                      }
                      className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 focus-visible:ring-blue-500 dark:text-slate-300 rounded-xl h-11 pt-2 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-500/20 dark:file:text-blue-400 dark:hover:file:bg-blue-500/30 cursor-pointer transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-1 md:col-span-2 space-y-2.5">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                      Description
                    </Label>
                    <Textarea
                      value={form?.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Enter detailed product description..."
                      required
                      className="min-h-[140px] bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 focus-visible:ring-blue-500 dark:text-white dark:placeholder:text-slate-500 rounded-xl resize-none leading-relaxed transition-colors"
                    />
                  </div>

                  {/* Image Preview */}
                  {(form?.image || form?.image_url) && (
                    <div className="col-span-1 md:col-span-2 p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl flex items-start gap-4 transition-colors">
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 bg-white dark:bg-slate-900">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            form?.image instanceof File
                              ? URL.createObjectURL(form?.image)
                              : form?.image_url
                          }
                          alt="Product preview"
                        />
                      </div>
                      <div className="flex flex-col justify-center h-full py-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                          Preview Image
                        </span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
                          {form?.image instanceof File
                            ? form?.image.name
                            : "Current Image"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER */}
              <div className="px-6 md:px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shrink-0 transition-colors">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setIsEdit(false);
                    setForm({
                      id: "",
                      name: "",
                      description: "",
                      category_id: "",
                      qty: 0,
                      price: 0,
                      discount: 0,
                      status: true,
                      image: null,
                    });
                  }}
                  type="button"
                  variant="outline"
                  className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm transition-all px-8"
                >
                  {isEdit ? "Update Product" : "Save Product"}
                </Button>
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
                      `admin/product/${deleteData?.id}`,
                      "delete",
                    );
                    if (res) {
                      console.log("Deleted Product : ", res);
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

      <div className="mt-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="w-full text-sm text-left">
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
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
                  <TableCell colSpan={13}>
                    <div className="flex justify-center py-16">
                      <Spinner className="size-8 text-blue-600 dark:text-blue-500 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : product?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={13}
                    className="text-center py-16 text-slate-400 dark:text-slate-500 font-medium text-sm"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {product?.map((item, index) => (
                    <TableRow
                      key={item.id || index}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* INDEX */}
                      <TableCell className="font-medium text-slate-400 dark:text-slate-500 pl-6">
                        {index + 1}
                      </TableCell>

                      {/* PRODUCT NAME */}
                      <TableCell className="font-bold text-slate-900 dark:text-white">
                        {item?.name}
                      </TableCell>

                      {/* DESCRIPTION WITH MODAL */}
                      <TableCell className="max-w-[250px]">
                        {!item?.description ? (
                          <span className="text-slate-400 dark:text-slate-600 font-medium">
                            —
                          </span>
                        ) : item.description.length <= 40 ? (
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {item.description}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate">
                              {item.description.substring(0, 40)}...
                            </span>

                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline shrink-0 transition-colors">
                                  View Details
                                </button>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-md rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-2xl bg-white dark:bg-slate-900 transition-colors duration-300">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {item?.name
                                      ? `${item.name} Details`
                                      : "Description"}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="mt-2 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors">
                                  <DialogDescription className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
                                    {item.description}
                                  </DialogDescription>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </TableCell>

                      {/* CATEGORY */}
                      <TableCell className="font-medium text-slate-600 dark:text-slate-300">
                        {item?.category?.name || "—"}
                      </TableCell>

                      {/* PRICE */}
                      <TableCell className="font-bold text-slate-900 dark:text-white">
                        ${Number(item?.price || 0).toFixed(2)}
                      </TableCell>

                      {/* IMAGE */}
                      <TableCell>
                        <div className="w-14 h-14 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden bg-slate-50 dark:bg-slate-800 shadow-sm flex items-center justify-center transition-colors">
                          {item?.image ? (
                            <img
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              src={item?.image_url}
                              alt={item?.name}
                            />
                          ) : (
                            <Image className="size-5 text-slate-300 dark:text-slate-600" />
                          )}
                        </div>
                      </TableCell>

                      {/* STATUS BADGE */}
                      <TableCell>
                        {item?.status ? (
                          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 border-none shadow-none font-bold px-3 py-1.5 transition-colors">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 border-none shadow-none font-bold px-3 py-1.5 transition-colors">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>

                      {/* CREATED DATE */}
                      <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-xs">
                        {formatDate(item?.created_at)}
                      </TableCell>

                      {/* UPDATED DATE */}
                      <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-xs">
                        {formatDate(item?.updated_at)}
                      </TableCell>

                      {/* ACTIONS (EDIT / DELETE) */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-9 rounded-xl border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/20 dark:hover:text-blue-400"
                            onClick={() => onEdit(item)}
                          >
                            <Edit className="size-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            className="size-9 rounded-xl shadow-sm shadow-red-200 transition-all dark:shadow-none dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/40 dark:hover:text-red-300"
                            onClick={() => onDelete(item)}
                          >
                            <Trash className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
