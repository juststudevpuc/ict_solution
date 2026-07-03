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
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAllCart } from "@/store/cartSlice";
import { clearToken } from "@/store/tokenSlice";
import { logout } from "@/store/userSlice";

export function NavUser({ user }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // 1. Clear Redux Auth & Cart
    dispatch(logout());
    dispatch(clearToken());
    dispatch(clearAllCart()); // <-- Kills the cart in Redux memory

    // 2. Kill the browser storage completely
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root"); // <-- Default redux-persist key (if you use it)

    // Optional: If you explicitly exported your persistor, run this:
    // persistor.purge();

    // 3. Redirect
    Navigate("/", { replace: true });
  };

  const { isMobile, state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Added transition and updated hover state to use our new blue-900 accent */}
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent hover:bg-sidebar-accent/80 transition-all duration-200 rounded-xl mb-2"
            >
              <div className="">
                <Avatar className="h-8 w-8 rounded-lg border border-sidebar-border shadow-sm">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  {/* Changed to yellow background with dark text */}
                  <AvatarFallback className="rounded-lg bg-yellow-600 text-white font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Only show text if sidebar is fully expanded */}
              {state === "expanded" && (
                <div className="grid flex-1 text-left text-sm leading-tight text-sidebar-foreground">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user.email}
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 leading-tight">
                  <span className="truncate font-bold">{user.name}</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-sidebar-border" />

            <DropdownMenuItem className="py-2.5 cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent focus:bg-sidebar-accent">
              <ShieldCheck className="mr-3 size-4 text-sidebar-primary" />
              <span className="font-medium">Admin Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-sidebar-border" />

            <DropdownMenuItem className="py-2.5 cursor-pointer text-destructive focus:bg-destructive/10 transition-colors">
              <LogOut className="mr-3 size-4" />
              <span onClick={handleLogout} className="text-red-600 font-medium">
                Log out
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
