"use client";

import React from "react";
import { ChevronsUpDown, LogOut, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
// 🔥 UPGRADE 1: Import useNavigate instead of Navigate
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAllCart } from "@/store/cartSlice";
import { logout } from "@/store/userSlice";

export function NavUser({ user }) {
  const dispatch = useDispatch();
  // 🔥 UPGRADE 1: Initialize the navigate hook
  const navigate = useNavigate();
  const { isMobile, state } = useSidebar();

  const handleLogout = () => {
    // 1. Clear Redux Auth & Cart
    dispatch(logout());
    dispatch(clearAllCart());

    // 2. Kill the browser storage completely
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root");

    // 3. Redirect using the hook
    navigate("/", { replace: true });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent hover:bg-sidebar-accent/80 transition-all duration-200 rounded-xl mb-2"
            >
              <div className="">
                <Avatar className="h-8 w-8 rounded-lg border border-sidebar-border shadow-sm">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg bg-yellow-600 text-white font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
              </div>

              {state === "expanded" && (
                <div className="grid flex-1 text-left text-sm leading-tight text-sidebar-foreground">
                  <span className="truncate font-semibold">{user?.name || "Admin"}</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user?.email || "admin@system.com"}
                  </span>
                </div>
              )}

              {state === "expanded" && (
                <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/50" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border-sidebar-border bg-sidebar shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={10}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-2.5 text-left text-sm text-sidebar-foreground">
                <Avatar className="h-9 w-9 rounded-lg border border-sidebar-border">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 leading-tight">
                  <span className="truncate font-bold">{user?.name || "Admin"}</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user?.email || "admin@system.com"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-sidebar-border" />

            <DropdownMenuItem
              asChild
              className="py-2.5 cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent focus:bg-sidebar-accent"
            >
              <Link to="/admin/setting" className="flex items-center w-full">
                <ShieldCheck className="mr-3 size-4 text-sidebar-primary" />
                <span className="font-medium">Admin Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-sidebar-border" />

            {/* 🔥 UPGRADE 2 & 3: Moved onClick to the wrapper and added better hover colors */}
            <DropdownMenuItem 
              onClick={handleLogout}
              className="py-2.5 cursor-pointer text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 focus:text-red-700 transition-colors"
            >
              <LogOut className="mr-3 size-4" />
              <span className="font-medium">
                Log out
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}