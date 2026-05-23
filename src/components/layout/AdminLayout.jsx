import React, { useEffect, useRef } from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
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

// WebSocket & Toast Imports
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { toast, Toaster } from "sonner";

window.Pusher = Pusher;

export default function AdminLayout() {
  const user = useSelector((state) => state.user);

  const alertAudioRef = useRef(new Audio("/audio/alert.mp3"));

  useEffect(() => {
    // 1. Configure the connection to your Laravel Reverb server
    const echo = new Echo({
      broadcaster: "reverb",
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT,
      wssPort: import.meta.env.VITE_REVERB_PORT,
      forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
      enabledTransports: ["ws", "wss"],
    });

    // 2. Listen to the channel we created in Laravel
    echo.channel("admin-notifications").listen("OrderAlert", (e) => {
      console.log("🔥 NEW ORDER RECEIVED VIA WEBSOCKET:", e);

      // 🔥 THE FIX: Play the pre-loaded audio!
      // Reset time to 0 just in case two orders come in fast
      alertAudioRef.current.currentTime = 0;
      alertAudioRef.current.play().catch((err) => {
        console.log("Audio blocked by browser:", err);
        toast.error("Click anywhere on the dashboard to enable order sounds!");
      });

      // 3. Pop up the beautiful toast notification!
      toast.success(`New Order Received!`, {
        description: `${e.customer_name} just placed an order for $${e.total_amount}.`,
        duration: 8000,
      });
    });

    // Cleanup the connection if the admin logs out
    return () => {
      echo.leaveChannel("admin-notifications");
    };
  }, []); // Run once when the layout loads

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
    <>
      {" "}
      {/* ✅ Wrapper fragment to hold both the Sidebar and the Toaster */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-slate-50/50 flex flex-col min-h-screen">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-md px-6 transition-all ease-linear">
            <div className="flex items-center gap-2 w-full">
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
                {/* Profile/Notification icons go here */}
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
      {/* ✅ Placed OUTSIDE the SidebarProvider so it perfectly overlays the screen */}
      <Toaster position="top-right" richColors />
    </>
  );
}
