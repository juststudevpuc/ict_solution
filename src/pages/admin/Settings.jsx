import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save, ShieldCheck } from "lucide-react";
import { request } from "@/utils/request/request"; // Adjust path if needed
import { toast } from "sonner";

export default function Settings() {
  //   const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Start with an empty array! It will fill up dynamically.
  const [matrix, setMatrix] = useState([]);

  // 1. DYNAMIC FETCH: Load from MongoDB
  const fetchSettings = async () => {
    try {
      const res = await request("permissions", "get");
      if (res) {
        // Handle Laravel's standard data wrapping if needed (res.data vs res)
        setMatrix(res.data || res);
      }
    } catch (error) {
      console.error("Failed to load permission matrix:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 2. Handle visual toggle switch
  const handleToggle = (idToToggle, role) => {
    setMatrix((prevMatrix) =>
      prevMatrix.map((item) => {
        // Look for either _id or id
        const currentItemId = item._id || item.id;

        return currentItemId === idToToggle
          ? { ...item, [role]: !item[role] }
          : item;
      }),
    );
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Map the matrix state to match the exact Postman payload that worked!
      const payload = {
        matrix: matrix.map((item) => ({
          // Send whichever one exists back to Laravel
          _id: item._id || item.id,
          staff: item.staff,
          user: item.user,
        })),
      };

      // Send the POST request to your working API
      const res = await request("permissions/update-matrix", "post", payload);

      if (res) {
        toast.success("Settings Updated", {
          description:
            "Feature permissions have been successfully saved to the database.",
        });
      }
    } catch (error) {
      console.error("Failed to save permissions:", error);
      toast.error("Error Saving", {
        description: "Something went wrong while saving.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
              <ShieldCheck className="text-blue-600 dark:text-blue-400 size-6" />
            </div>
            System Control Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            As Super Admin, you can globally enable or disable dashboard
            features for specific roles.
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={loading}
          className="gap-2 bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-sm transition-all h-11 px-6 disabled:opacity-70"
        >
          <Save className="size-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* SETTINGS TABLE */}
      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="w-full text-sm text-left">
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50">
                <TableHead className="py-5 px-6 font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap">
                  Feature Module
                </TableHead>
                <TableHead className="py-5 px-6 text-center font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap w-48">
                  Staff Access
                </TableHead>
                <TableHead className="py-5 px-6 text-center font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider whitespace-nowrap w-48">
                  User Access
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {matrix && matrix.length > 0 ? (
                matrix.map((row) => (
                  <TableRow
                    key={row._id || row.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <TableCell className="py-5 px-6 font-bold text-slate-900 dark:text-white align-middle">
                      {row.module_name}
                    </TableCell>

                    <TableCell className="py-5 px-6 align-middle">
                      <div className="flex justify-center items-center">
                        <Switch
                          checked={row.staff}
                          onCheckedChange={() =>
                            handleToggle(row._id || row.id, "staff")
                          }
                          className="transition-colors duration-300 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-700"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="py-5 px-6 align-middle">
                      <div className="flex justify-center items-center">
                        <Switch
                          checked={row.user}
                          onCheckedChange={() =>
                            handleToggle(row._id || row.id, "user")
                          }
                          className="transition-colors duration-300 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-700"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium text-sm align-middle"
                  >
                    Loading permissions...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
