import React, { useEffect, useRef } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar"; // Added SidebarTrigger!
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
import { Bell } from "lucide-react"; // Added for a clean notification bell

window.Pusher = Pusher;

export default function AdminLayout() {
  const user = useSelector((state) => state.user);
  const alertAudioRef = useRef(new Audio("/audio/alert.mp3"));

  useEffect(() => {
    const echo = new Echo({
      broadcaster: "reverb",
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT,
      wssPort: import.meta.env.VITE_REVERB_PORT,
      forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
      enabledTransports: ["ws", "wss"],
    });

    echo.channel("admin-notifications").listen("OrderAlert", (e) => {
      console.log("🔥 NEW ORDER RECEIVED VIA WEBSOCKET:", e);

      alertAudioRef.current.currentTime = 0;
      alertAudioRef.current.play().catch((err) => {
        console.log("Audio blocked by browser:", err);
        toast.error("Click anywhere on the dashboard to enable order sounds!");
      });

      toast.success(`New Order Received!`, {
        description: `${e.customer_name} just placed an order for $${e.total_amount}.`,
        duration: 8000,
      });
    });

    return () => {
      echo.leaveChannel("admin-notifications");
    };
  }, []);

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

        {/* Added a subtle background pattern or slight off-white tone */}
        <SidebarInset className="bg-background/50 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
          {/* MODERN HEADER: 
              - Increased blur and opacity for a true 'glass' feel
              - Added a subtle bottom border shadow
          */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/70 backdrop-blur-xl px-4 sm:px-6 transition-all shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 w-full">
              <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg" />

              <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

              {/* Breadcrumb section now looks like a 'Path' indicator */}
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
                      {/* Dynamically, this could reflect the current page name */}
                      Dashboard
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="ml-auto flex items-center gap-2">
                {/* Notification Bell with a softer modern look */}
                <button className="relative p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground rounded-xl transition-all active:scale-95">
                  <Bell className="size-5" />
                  <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-background"></span>
                </button>
              </div>
            </div>
          </header>

          {/* MODERN MAIN CONTENT: 
              - Used a slightly tighter container
              - Added a very subtle top margin for a 'floating' feel
          */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
              {/* Optional: Add a subtle 'Glass' Card wrapper for all children */}
              <div className="bg-background/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm w-full">
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
