import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Box,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PackageCheck,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

// Import your custom sub-components

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProject";
import { NavUser } from "./NavUser";

// Sample data localized to the component or moved to a config file
const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [{ name: "Admin ",  plan: "ICT Solution " }],
  navMain: [
    {
      title: "Product",
      url: "/admin/productPage",
      icon: Box,
    },
    {
      title: "Order",
      url: "/admin/orderPage",
      icon: PackageCheck,

      // items: [
      //   { title: "Genesis", url: "#" },
      //   { title: "Explorer", url: "#" },
      //   { title: "Quantum", url: "#" },
      // ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      // items: [
      //   { title: "Introduction", url: "#" },
      //   { title: "Get Started", url: "#" },
      //   { title: "Tutorials", url: "#" },
      //   { title: "Changelog", url: "#" },
      // ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     { title: "General", url: "#" },
    //     { title: "Team", url: "#" },
    //     { title: "Billing", url: "#" },
    //     { title: "Limits", url: "#" },
    //   ],
    // },
  ],
  // projects: [
  //   { name: "Product", url: "/admin/productPage", icon: Frame },
  //   { name: "Order Page", url: "/admin/orderPage", icon: PieChart },
  //   { name: "Travel", url: "#", icon: Map },
  // ],
};

/**
 * AppSidebar Component
 * @param {Object} props - Inherits all props from the shadcn Sidebar component
 */
export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        {/* <NavProjects projects={sidebarData.projects} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
