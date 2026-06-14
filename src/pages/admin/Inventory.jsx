import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/helper/format";
import { request } from "@/utils/request/request";
import { Button } from "@headlessui/react";
import { ArrowBigDown, Menu, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { ChevronDownIcon, EditIcon, TrashIcon } from "lucide-react";

import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavigationMenuList } from "@/components/ui/navigation-menu";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    id: "",
    product_id: "",
    type: "",
    remark: "",
    qty: 0,
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.qty) <= 0) {
      alert("Quantity must be greater than 0");
      return; // Stops the form from submitting
    }

    try {
      let response;
      if (form?.id) {
        response = await request(`inventory/${form.id}`, "put", form);
      } else {
        response = await request("inventory", "post", form);
      }

      if (response) {
        console.log(
          form.id ? "Update successfully" : "Submit successfully",
          response,
        );

        setForm({ id: "", product_id: "", type: "IN", remark: "", qty: 0 });
        fetchingData();
      }
    } catch (error) {
      console.error("Failed to submit manual adjustment:", error);
    }
  };
  const onEdit = (itemEdit) => {
    setIsOpen(true);
    setForm({
      id: itemEdit.id,
      product_id: itemEdit?.product_id || "",
      type: itemEdit?.type?.toLowerCase() || "in",
      qty: itemEdit?.qty || 0,
      remark: itemEdit?.remark || "",
    });
  };

  const onDelete = async (itemDelete) => {
    console.log("Item Delete", itemDelete);
    setDeleteData(itemDelete);
    setIsDelete(true);
  };

  const fetchingData = async () => {
    setLoading(true);
    try {
      const inv = await request("inventory", "get");
      const res = await request("product", "get");

      if (inv) {
        console.log("Response Product : ", inv);
        const items = inv?.data?.data || inv?.data || inv;
        setInventory(items);
      }
      if (res) {
        // Handles pagination just like your inventory table
        setProducts(res?.data?.data || res?.data || res);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
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
    "Product",
    "Type",
    "Quantity",
    "stock left",
    "Reference",
    "remark",
    "Create at",
    "Update at",
    "Action",
  ];
  return (
    <div className="">
      <div className="">
        {/* dialog */}
        <div className="flex justify-between py-3">
          <h1 className="text-2xl font-bold ">Inventory</h1>
          <div className="">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="primary"
                  className="bg-blue-600 text-white hover:bg-blue-500 h-10 px-4 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/30 active:scale-95 active:translate-y-0"
                  onClick={() =>
                    setForm({
                      id: "",
                      product_id: "",
                      type: "in",
                      remark: "",
                      qty: 0,
                    })
                  }
                >
                  <Plus className="size-4" />
                  <span>Add New</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md rounded-xl border-border/50 bg-background shadow-2xl p-0 overflow-hidden">
                <div className="bg-blue-950 p-6">
                  <DialogTitle className="text-lg font-bold text-white">
                    {form?.id ? "Update Record" : "Add New Record"}
                  </DialogTitle>
                </div>

                <div className="p-6">
                  <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Product</label>
                      <select
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        value={form.product_id}
                        onChange={(e) =>
                          setForm({ ...form, product_id: e.target.value })
                        }
                      >
                        {/* Default placeholder option */}
                        <option value="" disabled>
                          Select a software package...
                        </option>

                        {/* Loop through your products and create an option for each one */}
                        {products?.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Type</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value })
                        }
                      >
                        <option value="in">IN</option>
                        <option value="out">OUT</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Quantity</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        // 1. If it's exactly 0, show an empty box so it's easier to type into
                        value={form.qty === 0 ? "" : form.qty}
                        onChange={(e) => {
                          const val = e.target.value;
                          // 2. If they clear the box, set state to 0. Otherwise, convert to Number.
                          setForm({
                            ...form,
                            qty: val === "" ? 0 : Number(val),
                          });
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Remark</label>
                      <input
                        type="text"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        value={form.remark}
                        onChange={(e) =>
                          setForm({ ...form, remark: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border/50">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 text-white hover:bg-blue-500 h-10 px-4 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/30 active:scale-95 active:translate-y-0"
                      >
                        {form?.id ? "Update Record" : "Save Record"}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Dialog open={isDelete} onOpenChange={setIsDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Do you want to delete {deleteData?.customer_name}?
              </DialogTitle>
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
                        `inventory/${deleteData?.id}`,
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

        {/* table */}
        <div className="">
          <Table className="w-full border-collapse text-sm border border-border/50">
            <TableHeader className="">
              <TableRow className="bg-sky-900 hover:bg-sky-900">
                {tbl_head?.map((item, index) => (
                  <TableHead
                    key={index}
                    className="border border-border/50 px-4 h-12 text-white font-semibold uppercase text-xs tracking-wider"
                  >
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10">
                    <div className="flex w-full items-center justify-center">
                      <Spinner className="size-6 text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {inventory?.map((item, index) => (
                    <TableRow
                      key={item?.id || index}
                      className="hover:bg-gray-200 bg-gray-100 "
                    >
                      <TableCell className="border border-border/50  px-4 py-3">
                        {index + 1}
                      </TableCell>
                      <TableCell className="border border-border/50 px-4 py-3">
                        {item?.product?.name}
                      </TableCell>
                      <TableCell className="border border-border/50 px-4 py-3 uppercase font-medium">
                        {item?.type}
                      </TableCell>
                      <TableCell className="border border-border/50 px-4 py-3">
                        {item?.qty}
                      </TableCell>
                      <TableCell className="border border-border/50 px-4 py-3">
                        {item?.stock_left}
                      </TableCell>
                      <TableCell className="border border-border/50 px-4 py-3">
                        {item?.reference_id}
                      </TableCell>
                      <TableCell className="border border-border/50 px-4 py-3">
                        {item?.remark}
                      </TableCell>
                      <TableCell className="border border-border/50 px-4 py-3">
                        {formatDate(item?.created_at)}
                      </TableCell>
                      <TableCell className="border border-border/50 px-4 py-3">
                        {formatDate(item?.updated_at)}
                      </TableCell>
                      <TableCell>
                        <ButtonGroup>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 flex items-center justify-center ml-4"
                                >
                                  <div className="rounded-md bg-gray-600 p-1">
                                    <ArrowBigDown className="size-4 text-white" />
                                  </div>
                                </Button>
                              </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  onClick={() => onEdit(item)}
                                  className="cursor-pointer gap-2 hover:bg-blue-50 focus:bg-blue-50 text-blue-600 dark:text-blue-400"
                                >
                                  <EditIcon className="size-4" />
                                  Edit
                                </DropdownMenuItem>
                                {/* Delete Action (Styled with destructive red colors) */}
                                <DropdownMenuItem
                                  onClick={() => onDelete(item)}
                                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                >
                                  <TrashIcon className="mr-2 size-4" />
                                  Delete Record
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </ButtonGroup>
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
