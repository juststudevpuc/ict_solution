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
import { configs } from "@/utils/config/configs";
import { formatDate } from "@/utils/helper/format";
import { request } from "@/utils/request/request";
import { Edit, Image, Plus, Search, SearchSlash, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    const res = await request("product", "get");
    const category = await request("category", "get");
    if (category) {
      setCategory(category?.data);
    }
    if (res) {
      console.log("Response Product : ", res);
      setProduct(res?.data);
      setForm({ id: "", name: "", description: "", status: true });
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
        const res = await request("product", "post", formData);
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
          <DialogTrigger>
            <Button variant="primary" className={"bg-blue-500 text-white hover:bg-blue-700"}>
              <Plus />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Update Product" : "Create Product"}
              </DialogTitle>
            </DialogHeader>
            <form action="" onSubmit={onSubmit}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-row gap-3">
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Name</Label>
                    <Input
                      value={form?.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Description</Label>
                    <Textarea
                      value={form?.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Enter description... (You can use Enters and bullet points here)"
                      required
                      className="min-h-[150px] leading-relaxed"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Price</Label>
                    <Input
                      type={"number"}
                      value={form?.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="Price"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Category</Label>
                    <Select
                      value={form?.category_id}
                      onValueChange={(value) =>
                        setForm({ ...form, category_id: value })
                      }
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Pls select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {category?.map((item, index) => (
                          <SelectItem key={index} value={item?.id}>
                            {item?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Status</Label>
                    <Select
                      value={String(form?.status)}
                      onValueChange={(value) =>
                        setForm({ ...form, status: Number(value) })
                      }
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Pls select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Label>Image</Label>
                  <Input
                    type={"file"}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.files[0] })
                    }
                    placeholder="Input image"
                  />
                </div>
                <div className="">
                  {/* ✅ FIXED: Show if there is a new image OR an existing image_url */}
                  {(form?.image || form?.image_url) && (
                    <div className="w-28 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <img
                        className="w-full h-full object-cover" // Added object-cover so it doesn't stretch weirdly
                        src={
                          form?.image instanceof File
                            ? URL.createObjectURL(form?.image)
                            : form?.image_url
                        }
                        alt={`picture : ${form?.name || "preview"}`}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        setForm({
                          id: itemEdit?.id,
                          name: itemEdit?.name || "",
                          description: itemEdit?.description || "",
                          category_id: itemEdit?.category_id || "",
                          qty: itemEdit?.qty || 0,
                          price: itemEdit?.price || 0,
                          discount: itemEdit?.discount || 0,
                          // Force status to be a strict boolean (true/false) for your UI
                          status:
                            itemEdit?.status == 1 || itemEdit?.status === true,
                          // Keep image null so we don't crash your file input with a URL string!
                          image: null,
                        });
                        setIsEdit(false);
                      }}
                      type="button"
                      variant={"outline"}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
                  </div>
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
                      `product/${deleteData?.id}`,
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

      <div className="mt-7">
        {/* <h1>{Product[0]?.name}</h1> */}

        <Table className={"border border-4"}>
          <TableHeader>
            <TableRow>
              {tbl_head?.map((item, index) => (
                <TableHead key={index}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colspan={13}>
                  <div className="flex justify-center mt-10">
                    <Spinner className={"size-7"} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {product?.map((item, index) => (
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell className="max-w-[250px]">
                      {!item?.description ? (
                        <span className="text-slate-500">-</span>
                      ) : item.description.length <= 40 ? (
                        <span className="text-sm text-slate-600">
                          {item.description}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Shows the first 40 characters and hides the rest */}
                          <span className="text-sm text-slate-600 truncate">
                            {item.description.substring(0, 40)}...
                          </span>

                          {/* The Pop-up Trigger */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="text-xs font-bold text-blue-600 hover:underline shrink-0">
                                View Details
                              </button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>
                                  {item?.name
                                    ? `${item.name} Details`
                                    : "Description Details"}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="mt-2">
                                {/* whitespace-pre-wrap guarantees your bullet points and "Enters" show up perfectly! */}
                                <DialogDescription className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                  {item.description}
                                </DialogDescription>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{item?.category?.name}</TableCell>
                    {/* <TableCell>{item?.qty}</TableCell> */}
                    <TableCell>${item?.price}</TableCell>
                    {/* <TableCell>{item?.discount}%</TableCell> */}
                    <TableCell>
                      {item?.image ? (
                        <div className="w-28 h-28 rounded-xl overflow-hidden">
                          <img
                            className="w-full h-full"
                            src={item?.image_url}
                            alt={`picture : ${item?.name}`}
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-28 rounded-xl overflow-hidden">
                          <div className="w-full h-full flex justify-center items-center bg-gray-300">
                            <Image />
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item?.status ? (
                        <Badge
                          className={"text-white bg-blue-700"}
                          variant={"Secondary"}
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge variant={"destructive"}>Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell> {formatDate(item?.created_at)}</TableCell>
                    <TableCell> {formatDate(item?.updated_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Button onClick={() => onEdit(item)}>
                          <Edit />
                        </Button>
                        <Button
                          onClick={() => onDelete(item)}
                          variant={"destructive"}
                        >
                          <Trash />
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
  );
}
