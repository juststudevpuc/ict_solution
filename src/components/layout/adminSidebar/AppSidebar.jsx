import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  History,
  LucideLayoutDashboard,
  Mail,
  PackageCheck,
  PersonStandingIcon,
  Settings2,
  Warehouse,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { request } from "@/utils/request/request"; // Adjust path if needed

// 1. We keep the base list here, but remove the hardcoded user
const BASE_NAV_MAIN = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LucideLayoutDashboard },
  { title: "Product", url: "/admin/productPage", icon: Box },
  { title: "Order", url: "/admin/orderPage", icon: PackageCheck },
  { title: "Request Checkout", url: "/admin/request_order", icon: Mail },
  { title: "Inventory", url: "/admin/inventory", icon: Warehouse },
  { title: "Staff", url: "/admin/staff_management", icon: PersonStandingIcon },
  { title: "Transaction History", url: "/admin/transaction_history", icon: History },
  { title: "Setting", url: "/admin/setting", icon: Settings2 },
];

export function AppSidebar({ ...props }) {
  // 2. State to hold the dynamically filtered links and user info
  const [navItems, setNavItems] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    name: "Loading...",
    email: "",
    role: "staff",
    avatar: "/avatars/shadcn.jpg",
  });

  useEffect(() => {
    const loadSidebar = async () => {
      // A. Extract Real User from Redux Persist
      const persistString = localStorage.getItem("persist:root");
      let role = "staff";
      
      if (persistString) {
        try {
          const parsedRoot = JSON.parse(persistString);
          if (parsedRoot.user) {
            const userObj = JSON.parse(parsedRoot.user);
            role = userObj?.role?.toLowerCase() || "staff";
            
            // Update the UI with their actual name and email
            setCurrentUser({
              name: userObj.name || "User",
              email: userObj.email || "",
              role: role,
              avatar: "/avatars/shadcn.jpg", 
            });
          }
        } catch (e) {
          console.error("Failed to parse Redux Persist data for Sidebar:", e);
        }
      }

      // B. Fetch Permissions from Database (if they are not an Admin)
      let matrix = [];
      if (role !== "admin") {
        try {
          const res = await request("permissions", "get");
          matrix = res?.data || res || [];
        } catch (error) {
          console.error("Sidebar failed to load permissions:", error);
        }
      }

      // C. Filter the Sidebar Links
      const filteredLinks = BASE_NAV_MAIN.filter((item) => {
        // Extract the key from the URL (e.g., "/admin/productPage" -> "productPage")
        const key = item.url.split("/").pop();

        // Rule 1: Dashboard is always visible to everyone
        if (key === "dashboard") return true;

        // Rule 2: Settings is strictly Admin only
        if (key === "setting") return role === "admin";

        // Rule 3: Super Admins see everything else
        if (role === "admin") return true;

        // Rule 4: Check the database rules for Staff
        if (Array.isArray(matrix)) {
          const moduleRule = matrix.find((m) => m.key === key);
          return moduleRule && moduleRule[role] === true;
        }

        return false; // Hide by default if something breaks
      });

      setNavItems(filteredLinks);
    };

    loadSidebar();
  }, []);

  // Update the top logo text dynamically based on role
  const dynamicTeams = [
    { name: currentUser.role === "admin" ? "Admin" : "Staff", plan: "ICT Solution" }
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dynamicTeams} />
      </SidebarHeader>

      <SidebarContent>
        {/* Render the dynamically filtered links instead of the hardcoded ones */}
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        {/* Render the actual logged-in user instead of hardcoded 'Admin' */}
        <NavUser user={currentUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}