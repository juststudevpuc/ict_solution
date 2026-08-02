import {
  Dialog,
  DialogContent,
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
import { Button } from "@/components/ui/button"; // Standardized to your UI button
import { 
  Menu, 
  Plus, 
  EditIcon, 
  TrashIcon, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 🔥 NEW: Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [form, setForm] = useState({
    id: "",
    product_id: "",
    type: "in",
    remark: "",
    qty: 0,
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.qty) <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    try {
      let response;
      if (form?.id) {
        response = await request(`admin/inventory/${form.id}`, "put", form);
      } else {
        response = await request("admin/inventory", "post", form);
      }

      if (response) {
        // 🔥 Smart Cleanup: Close modal, reset form, show success toast!
        setIsOpen(false);
        setForm({ id: "", product_id: "", type: "in", remark: "", qty: 0 });
        fetchingData();

        Swal.fire({
          title: form.id ? "Updated!" : "Saved!",
          text: response.message || "Inventory updated successfully.",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
          background: "#1e293b",
          color: "#fff",
        });
      }
    } catch (error) {
      console.error("Failed to submit manual adjustment:", error);
      // 🔥 NEW: Show exact backend errors (like "Not enough stock!")
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to save the record.",
        icon: "error",
        background: "#0f172a",
        color: "#f8fafc",
      });
    }
  };

  const onEdit = (itemEdit) => {
    setIsOpen(true);
    setForm({
      id: itemEdit._id || itemEdit.id,
      product_id: itemEdit?.product_id || "",
      type: itemEdit?.type?.toLowerCase() || "in",
      qty: itemEdit?.qty || 0,
      remark: itemEdit?.remark || "",
    });
  };

  const onDelete = (itemDelete) => {
    Swal.fire({
      title: "Delete Inventory Record?",
      text: "Are you sure you want to delete this? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", 
      cancelButtonColor: "#334155",  
      confirmButtonText: "Yes, delete it!",
      background: "#0f172a", 
      color: "#f8fafc",      
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const idToDelete = itemDelete._id || itemDelete.id;
          await request(`admin/inventory/${idToDelete}`, "delete");

          Swal.fire({
            title: "Deleted!",
            text: "The inventory record has been removed.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: "#0f172a",
            color: "#f8fafc",
          });

          fetchingData();
        } catch (error) {
          console.error("Failed to delete item:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the record.",
            icon: "error",
            background: "#0f172a",
            color: "#f8fafc",
          });
        }
      }
    });
  };

  const fetchingData = async () => {
    setLoading(true);
    try {
      // 🔥 NEW: Attach currentPage to URL for pagination
      const inv = await request(`admin/inventory?page=${currentPage}`, "get");
      const res = await request("admin/product", "get");

      if (inv) {
        const data = inv?.data;
        setInventory(data?.data || []);
        
        // Grab pagination details from Laravel
        setLastPage(data?.last_page || 1);
        setTotalRecords(data?.total || 0);
      }
      if (res) {
        setProducts(res?.data?.data || res?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: Refetch when currentPage changes
  useEffect(() => {
    fetchingData();
  }, [currentPage]);

  const tbl_head = [
    "No",
    "Product",
    "Type",
    "Quantity",
    "Stock Left",
    "Reference",
    "Remark",
    "Created At",
    "Action",
  ];

  return (
    <div className="">
      <div className="">
        {/* --- HEADER & MODAL TRIGGER --- */}
        <div className="flex justify-between py-3">
          <h1 className="text-2xl font-bold">Inventory</h1>
          <div className="">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
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

              <DialogContent className="sm:max-w-md rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-0 overflow-hidden">
                <div className="bg-blue-950 p-6">
                  <DialogTitle className="text-lg font-bold text-white">
                    {form?.id ? "Update Record" : "Add New Record"}
                  </DialogTitle>
                </div>

                <div className="p-6">
                  <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product</label>
                      <select
                        required
                        className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={form.product_id}
                        onChange={(e) =>
                          setForm({ ...form, product_id: e.target.value })
                        }
                      >
                        <option value="" disabled>Select a product...</option>
                        {products?.map((product) => (
                          <option key={product.id || product._id} value={product.id || product._id}>
                            {product?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Type</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value })
                        }
                      >
                        <option value="in">IN (Add Stock)</option>
                        <option value="out">OUT (Remove Stock)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Quantity</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={form.qty === 0 ? "" : form.qty}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({
                            ...form,
                            qty: val === "" ? 0 : Number(val),
                          });
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Remark</label>
                      <input
                        type="text"
                        required
                        placeholder="Reason for adjustment..."
                        className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={form.remark}
                        onChange={(e) =>
                          setForm({ ...form, remark: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg font-medium"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 text-white hover:bg-blue-500 h-10 px-4 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200"
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

        {/* --- INVENTORY TABLE --- */}
        <div className="w-full flex flex-col overflow-hidden bg-white dark:bg-slate-900/60 rounded-[0.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <Table className="w-full min-w-[800px] text-sm text-left">
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50">
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

              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={tbl_head.length}>
                      <div className="flex w-full items-center justify-center py-12">
                        <Spinner className="size-8 text-blue-600 dark:text-blue-500 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : inventory?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tbl_head.length}
                      className="text-center py-10 text-slate-400 dark:text-slate-500 font-medium text-sm"
                    >
                      No inventory records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {inventory?.map((item, index) => (
                      <TableRow
                        key={item?._id || item?.id || index}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <TableCell className="font-medium text-slate-400 dark:text-slate-500 pl-6">
                          {/* Calculate absolute index across pages */}
                          {(currentPage - 1) * 10 + index + 1}
                        </TableCell>

                        <TableCell className="font-bold text-slate-900 dark:text-white">
                          {item?.product?.name || "Unknown Product"}
                        </TableCell>

                        <TableCell>
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            item?.type === 'in' 
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                          }`}>
                            {item?.type || "—"}
                          </span>
                        </TableCell>

                        <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                          {item?.type === 'in' ? '+' : '-'}{item?.qty || 0}
                        </TableCell>

                        <TableCell className="font-black text-blue-600 dark:text-blue-400">
                          {item?.stock_left || 0}
                        </TableCell>

                        <TableCell className="font-medium text-slate-400 dark:text-slate-500 text-xs font-mono uppercase">
                          {item?.reference_id || "—"}
                        </TableCell>

                        <TableCell
                          className="font-medium text-slate-500 dark:text-slate-400 max-w-[150px] truncate"
                          title={item?.remark}
                        >
                          {item?.remark || "—"}
                        </TableCell>

                        <TableCell className="font-medium text-slate-500 dark:text-slate-400 text-xs">
                          {formatDate(item?.created_at)}
                        </TableCell>

                        <TableCell className="py-4 pr-6 align-middle text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-9 rounded-xl border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm ml-auto flex items-center justify-center"
                              >
                                <Menu className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-40 p-2 rounded-2xl shadow-xl border-slate-100 dark:border-slate-800 dark:bg-slate-900"
                            >
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  onClick={() => onEdit(item)}
                                  className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-medium transition-colors"
                                >
                                  <EditIcon className="size-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1.5 bg-slate-100 dark:bg-slate-800" />

                                <DropdownMenuItem
                                  onClick={() => onDelete(item)}
                                  className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-colors"
                                >
                                  <TrashIcon className="size-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* 🔥 NEW: PAGINATION FOOTER */}
          {totalRecords > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Showing page <span className="font-bold text-slate-700 dark:text-slate-300">{currentPage}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{lastPage}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-700 dark:text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                  disabled={currentPage === lastPage || loading}
                  className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-700 dark:text-slate-300"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}