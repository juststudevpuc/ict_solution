"use client";

import * as React from "react";
import { GalleryVerticalEnd, PanelLeftClose, ShieldCheck } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({ teams }) {
  const { state } = useSidebar();
  const activeTeam = teams?.[0];

  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between px-3 py-4 transition-all duration-300">
          {/* 1. Brand Logo & Name */}
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Change bg-sidebar-primary to bg-yellow-500 */}
            <div className="flex size-9 items-center justify-center rounded-xl bg-yellow-500 text-white shadow-md shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            {state === "expanded" && (
              <div className="flex flex-col truncate animate-in fade-in duration-500">
                <span className="font-bold text-lg text-yellow-400 tracking-tight text-sidebar-foreground leading-tight">
                  {activeTeam.name}
                </span>
                <span className="text-[11px] font-medium tracking-wider text-sidebar-foreground/60 uppercase">
                  {activeTeam.plan}
                </span>
              </div>
            )}
          </div>

          {/* 2. The Close / Collapse Button */}
          {/* {state === "expanded" && (
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-2 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="size-5" />
            </button>
          )} */}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
