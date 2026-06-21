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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-blue-600 size-6" />
            System Control Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            As Super Admin, you can globally enable or disable dashboard
            features for specific roles.
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={loading}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Save className="size-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold text-foreground">
                Feature Module
              </TableHead>
              <TableHead className="text-center font-semibold text-foreground w-40">
                Staff Access
              </TableHead>
              <TableHead className="text-center font-semibold text-foreground w-40">
                User Access
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrix && matrix.length > 0 ? (
              matrix.map((row) => (
                <TableRow
                  key={row._id || row.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-base py-4">
                    {row.module_name}
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <Switch
                        checked={row.staff}
                        onCheckedChange={() =>
                          handleToggle(row._id || row.id, "staff")
                        }
                        className="transition-colors duration-300 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-300"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <Switch
                        checked={row.user}
                        // 3. Update the Toggle trigger
                        onCheckedChange={() =>
                          handleToggle(row._id || row.id, "user")
                        }
                        className="transition-colors duration-300 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-300"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-6 text-muted-foreground"
                >
                  Loading permissions...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
