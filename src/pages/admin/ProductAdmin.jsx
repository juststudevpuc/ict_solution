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
    formData.append("qty", form?.qty);
    formData.append("price", form?.price);
    formData.append("discount", form?.discount);
    formData.append("status", form?.status ? 1 : 0);

    if (form?.image instanceof File) {
      formData.append("image", form?.image);
    }

    try {
      if (isEdit) {
        formData.append("_method", "put");
        const res = await request(`product/${form?.id}`, "post", formData);
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
            placeholder="Search Product"
          />
          <Button
            onClick={async () => {
              setLoading(true);
              const res = await request(`product/search/?q=${query}`, "get");
              if (res) {
                console.log("Response Product : ", res);
                setProduct(res?.data);
                setLoading(false);
              }
            }}
          >
            <Search />
          </Button>
          <Button
            onClick={() => {
              fetchingData();
              setQuery("");
            }}
          >
            <SearchSlash />
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button>
              <Plus />
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
                    <Input
                      value={form?.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Description"
                      required
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
                  {/* <div className="flex flex-col gap-3 w-full">
                    <Label>Quantity</Label>
                    <Input
                      type={"number"}
                      value={form?.qty}
                      onChange={(e) =>
                        setForm({ ...form, qty: e.target.value })
                      }
                      placeholder="Quantity"
                      required
                    />
                  </div> */}
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
                  {/* <div className="flex flex-col gap-3 w-full">
                    <Label>Discount</Label>
                    <Input
                      type={"number"}
                      value={form?.discount}
                      onChange={(e) =>
                        setForm({ ...form, discount: e.target.value })
                      }
                      placeholder="Discount"
                      required
                    />
                  </div> */}
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
                  {form?.image && (
                    <div className="w-28 h-28 rounded-xl overflow-hidden">
                      <img
                        className="w-full h-full"
                        src={
                          form?.image instanceof File
                            ? URL.createObjectURL(form?.image)
                            : form?.image_url
                        }
                        alt={`picture : ${form?.name}`}
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
                          id: "",
                          name: "",
                          description: "",
                          category_id: "",
                          // qty: 0,
                          price: 0,
                          // discount: 0,
                          image: null,
                          status: true,
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

        <Table>
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
                    <TableCell>{item?.description}</TableCell>
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
