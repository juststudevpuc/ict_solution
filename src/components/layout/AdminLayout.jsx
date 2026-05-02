import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./adminSidebar/AppSidebar";
import { Separator } from "../ui/separator";
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

export default function AdminLayout() {
  const user = useSelector((state) => state.user);

  // 1. If they are NOT logged in at all -> Send to Admin Login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. If they ARE logged in, but they are a normal user -> Kick to Homepage
  if (user?.role?.toLowerCase() !== "admin") {
    // This instantly redirects them to your front-end MainLayout
    return <Navigate to="/" replace />; 
  }

  // 3. If they pass both checks, let them in!
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50">
        
        {/* Professional Sticky Header */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-md px-6 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 w-full">
            <SidebarTrigger className="-ml-1 text-slate-500 hover:text-[#006039] transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-200" />
            
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink 
                    href="/admin" 
                    className="text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-slate-300" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-900 font-semibold text-sm">
                    Management
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-4">
               {/* Space for Notification or Profile icons */}
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex flex-1 flex-col p-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

      </SidebarInset>
    </SidebarProvider>
  );
}