import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import { EditIcon, TrashIcon, PlusIcon, Menu } from "lucide-react";
import { request } from "@/utils/request/request";


export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  // The Dual-Mode Form State
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "", // Required for create, optional for update
    phone: "",
  });

  // 1. READ: Fetch all staff members
  const fetchingData = async () => {
    try {
      // 1. Fetch only the staff users
      const res = await request("staff", "get");
      
      if (res) {
        console.log("Response Staff : ", res);
        
        // 2. Set the staff data. 
        // Note: If your API returns {data: [...]}, use res?.data
        // If it returns the array directly, use res
        setStaff(res?.data || res); 
        
        // 3. Reset the form
        setForm({ id: "", name: "", email: "", password: "", phone: "" });
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      console.error("Error fetching staff:", );
      
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  // 2. CREATE / UPDATE: The Dual-Mode Submit
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (form.id) {
        // Update Mode (PUT)
        response = await request(`staff/${form.id}`, "put", form);
      } else {
        // Create Mode (POST)
        response = await request("staff", "post", form);
      }

      if (response) {
        setIsOpen(false);
        setForm({ id: "", name: "", email: "", password: "", phone: "" });
        fetchingData(); // Refresh the table
      }
    } catch (error) {
      console.error("Failed to save staff:", error);
    }
  };

  // 3. EDIT: Open modal with existing data
  const onEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      email: item.email,
      password: "", // Leave blank so we don't overwrite it unless they type a new one
      phone: item.phone || "",
    });
    setIsOpen(true);
  };

  // 4. DELETE: Open warning modal
  const onDelete = (item) => {
    setDeleteData(item);
    setIsDelete(true);
  };

  // 5. CONFIRM DELETE: Actually remove from database
  const handleConfirmDelete = async () => {
    try {
      const response = await request(`staff/${deleteData.id}`, "delete");
      if (response) {
        setIsDelete(false);
        setDeleteData(null);
        fetchingData(); // Refresh the table
      }
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
        <Button 
          onClick={() => {
            setForm({ id: "", name: "", email: "", password: "", phone: "" });
            setIsOpen(true);
          }} 
          className="gap-2 bg-blue-500" 
        >
          <PlusIcon className="size-4" />
          Add New Staff
        </Button>
      </div>

      {/* Staff Table */}
      <div className="w-full overflow-x-auto custom-scrollbar bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Table className="w-full min-w-[600px] text-sm text-left">
          
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-100">
              <TableHead className="py-5 pl-6 pr-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider whitespace-nowrap align-middle">
                Name
              </TableHead>
              <TableHead className="py-5 px-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider whitespace-nowrap align-middle">
                Email
              </TableHead>
              <TableHead className="py-5 px-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider whitespace-nowrap align-middle">
                Phone
              </TableHead>
              <TableHead className="py-5 pr-6 pl-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider whitespace-nowrap align-middle text-right w-24">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-50">
            {staff && staff.length > 0 ? (
              staff.map((item, index) => (
                <TableRow key={item.id || index} className="hover:bg-slate-50/50 transition-colors group">
                  
                  <TableCell className="py-4 pl-6 pr-4 font-bold text-slate-900 align-middle">
                    {item.name}
                  </TableCell>
                  
                  <TableCell className="py-4 px-4 font-medium text-slate-500 align-middle">
                    {item.email}
                  </TableCell>
                  
                  <TableCell className="py-4 px-4 font-medium text-slate-500 align-middle">
                    {item.phone || "N/A"}
                  </TableCell>
                  
                  {/* Actions Dropdown */}
                  <TableCell className="py-4 pr-6 pl-4 align-middle text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="size-9 rounded-xl border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm ml-auto flex items-center justify-center"
                        >
                          <Menu className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      
                      <DropdownMenuContent align="end" className="w-40 p-2 rounded-2xl shadow-xl border-slate-100">
                        <DropdownMenuGroup>
                          <DropdownMenuItem 
                            onClick={() => onEdit(item)} 
                            className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 focus:bg-blue-50 font-medium transition-colors"
                          >
                            <EditIcon className="size-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="my-1.5 bg-slate-100" />
                          
                          <DropdownMenuItem 
                            onClick={() => onDelete(item)} 
                            className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 font-medium transition-colors"
                          >
                            <TrashIcon className="size-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-400 font-medium text-sm align-middle">
                  No staff members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Staff Member" : "Add New Staff"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                required 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                required 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>{form.id ? "New Password (leave blank to keep current)" : "Password"}</Label>
              <Input 
                type="password" 
                required={!form.id} 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                placeholder={form.id ? "••••••••" : "Create a password"}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">{form.id ? "Update Staff" : "Save Staff"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground">
            This will permanently delete the staff member <strong>{deleteData?.name}</strong>. This action cannot be undone and they will lose access to the system.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Yes, Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}