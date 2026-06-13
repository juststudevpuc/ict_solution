import * as React from "react";
import {
  Box,
  LucideLayoutDashboard,
  Mail,
  PackageCheck,
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

const sidebarData = {
  user: {
    name: "Admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [{ name: "Admin", plan: "ICT Solution" }],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LucideLayoutDashboard,
    },
    {
      title: "Product",
      url: "/admin/productPage",
      icon: Box,
    },
    {
      title: "Order",
      url: "/admin/orderPage",
      icon: PackageCheck,
    },
    {
      title: "Request Checkout",
      url: "/admin/request_order",
      icon: Mail,
    },
    {
      title: "Inventory",
      url: "/admin/inventory",
      icon: Warehouse,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    // Change it back to this:
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
