import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./adminSidebar/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Toast Imports
import { toast, Toaster } from "sonner";
import { Bell } from "lucide-react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

// 🌙 IMPORT THE THEME TOGGLER

export default function AdminLayout() {
  const user = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!["admin", "staff"].includes(user?.role?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="bg-background/50 flex flex-col min-h-screen transition-all duration-300 ease-in-out min-w-0">
          
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/70 backdrop-blur-xl px-4 sm:px-6 transition-all shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 w-full">
              <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg" />

              <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden sm:block">
                    <BreadcrumbLink
                      href="/admin"
                      className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                      System
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-muted-foreground/30" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs uppercase tracking-wider font-bold text-foreground">
                      Dashboard
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* 🔥 RIGHT HEADER TOOLS */}
              <div className="ml-auto flex items-center gap-2 sm:gap-4">
                
                {/* 🌙 MAGIC UI THEME TOGGLER */}
                <div className="flex items-center justify-center scale-90 sm:scale-100">
                  <AnimatedThemeToggler />
                </div>

                {/* Subtle Divider between Toggler and Bell */}
                <div className="h-5 w-px bg-border/60 hidden sm:block"></div>

                <button className="relative p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground rounded-xl transition-all active:scale-95">
                  <Bell className="size-5" />
                  <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-background"></span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden flex flex-col">
            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700 min-w-0">
              <div className="bg-background/40 backdrop-blur-sm border border-border/50 rounded-3xl p-4 sm:p-6 shadow-sm w-full min-w-0 overflow-x-hidden">
                <Outlet />
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{ style: { borderRadius: "12px" } }}
      />
    </>
  );
}