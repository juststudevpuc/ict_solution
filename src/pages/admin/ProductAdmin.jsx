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
    setDeleteData(itemDelete);
    setIsDelete(true);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h1>Product</h1>
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
            className={"bg-gray-400 text-white hover:bg-gray-600"}
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
            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-md shadow-sm gap-2 transition-all">
              <Plus className="size-4" />
              Add New Product
            </Button>
          </DialogTrigger>

          {/* 🔥 CHANGED: sm:rounded-md for a sharp rectangle card */}
          <DialogContent className="max-w-5xl w-[95vw] bg-white border-slate-100 shadow-2xl sm:rounded-md p-0 flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* FIXED HEADER */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
              <DialogTitle className="text-xl font-bold text-slate-900">
                {isEdit ? "Update Product" : "Create New Product"}
              </DialogTitle>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Fill in the details below to {isEdit ? "update this" : "add a new"} product in your inventory.
              </p>
            </div>

            {/* Modal Form Container */}
            <form
              onSubmit={onSubmit}
              className="flex flex-col overflow-hidden min-h-0"
            >
              {/* SCROLLABLE BODY */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name (Full Width) */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label className="text-slate-700 font-bold text-sm">
                      Product Name
                    </Label>
                    {/* 🔥 CHANGED: rounded-md for rectangular inputs */}
                    <Input
                      value={form?.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. Premium Wireless Headphones"
                      required
                      className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-md py-5"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold text-sm">
                      Category
                    </Label>
                    <Select
                      value={form?.category_id}
                      onValueChange={(value) =>
                        setForm({ ...form, category_id: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-md h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-md border-slate-100 shadow-lg">
                        {category?.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item?.id}
                            className="font-medium"
                          >
                            {item?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold text-sm">
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
                      className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-md py-5"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold text-sm">
                      Status
                    </Label>
                    <Select
                      value={String(form?.status)}
                      onValueChange={(value) =>
                        setForm({ ...form, status: Number(value) })
                      }
                    >
                      <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-md h-11">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-md border-slate-100 shadow-lg">
                        <SelectItem
                          value="1"
                          className="font-medium text-emerald-600"
                        >
                          Active (Published)
                        </SelectItem>
                        <SelectItem
                          value="0"
                          className="font-medium text-slate-500"
                        >
                          Inactive (Draft)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold text-sm">
                      Product Image
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.files[0] })
                      }
                      className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-md h-11 file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>

                  {/* Description (Full Width) */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label className="text-slate-700 font-bold text-sm">
                      Description
                    </Label>
                    <Textarea
                      value={form?.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Enter detailed product description..."
                      required
                      className="min-h-[140px] bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-md resize-none leading-relaxed"
                    />
                  </div>

                  {/* Image Preview */}
                  {(form?.image || form?.image_url) && (
                    <div className="col-span-1 md:col-span-2 p-4 bg-slate-50 border border-slate-100 rounded-md flex items-start gap-4">
                      <div className="w-24 h-24 rounded-md overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white">
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
                      <div className="flex flex-col justify-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Preview Image
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {form?.image instanceof File
                            ? form?.image.name
                            : "Current Image"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FIXED FOOTER */}
              <div className="px-6 py-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
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
                  className="rounded-md border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all px-6"
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

      <div className="mt-7 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="w-full text-sm text-left">
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                {tbl_head?.map((item, index) => (
                  <TableHead
                    key={index}
                    className="py-5 px-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider whitespace-nowrap"
                  >
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-50">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13}>
                    <div className="flex justify-center py-12">
                      <Spinner className="size-8 text-blue-600 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : product?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={13}
                    className="text-center py-10 text-slate-400 font-medium text-sm"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {product?.map((item, index) => (
                    <TableRow
                      key={item.id || index}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-400 pl-6">
                        {index + 1}
                      </TableCell>

                      <TableCell className="font-bold text-slate-900">
                        {item?.name}
                      </TableCell>

                      <TableCell className="max-w-[250px]">
                        {!item?.description ? (
                          <span className="text-slate-400 font-medium">—</span>
                        ) : item.description.length <= 40 ? (
                          <span className="text-sm text-slate-500 font-medium">
                            {item.description}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 font-medium truncate">
                              {item.description.substring(0, 40)}...
                            </span>

                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline shrink-0 transition-colors">
                                  View Details
                                </button>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-md rounded-3xl border-none p-6 shadow-2xl bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold text-slate-900">
                                    {item?.name
                                      ? `${item.name} Details`
                                      : "Description"}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                  <DialogDescription className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                                    {item.description}
                                  </DialogDescription>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="font-medium text-slate-600">
                        {item?.category?.name || "—"}
                      </TableCell>

                      <TableCell className="font-bold text-slate-900">
                        ${Number(item?.price || 0).toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <div className="w-14 h-14 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 shadow-sm flex items-center justify-center">
                          {item?.image ? (
                            <img
                              className="w-full h-full object-cover"
                              src={item?.image_url}
                              alt={item?.name}
                            />
                          ) : (
                            <Image className="size-5 text-slate-300" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {item?.status ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none font-bold px-3 py-1">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none shadow-none font-bold px-3 py-1">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-slate-500 font-medium text-xs">
                        {formatDate(item?.created_at)}
                      </TableCell>

                      <TableCell className="text-slate-500 font-medium text-xs">
                        {formatDate(item?.updated_at)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-9 rounded-xl border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                            onClick={() => onEdit(item)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="size-9 rounded-xl shadow-sm shadow-red-200"
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
