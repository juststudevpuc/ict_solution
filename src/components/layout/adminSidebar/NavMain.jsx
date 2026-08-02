"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom" 

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({ items }) {
  const location = useLocation();

  return (
    <SidebarGroup className="px-3">
      <SidebarGroupLabel className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1.5"> 
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          
          // Check if parent OR any of its children are the current active route
          const isMainActive = location.pathname === item.url;
          const isChildActive = hasSubItems && item.items.some(sub => location.pathname === sub.url);
          const isExpanded = isMainActive || isChildActive || item.isActive;

          if (hasSubItems) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isExpanded}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      className={`w-full rounded-[0.5rem] transition-all duration-200 ${
                        isExpanded 
                          ? "bg-slate-800/60 font-semibold text-white" 
                          : "text-slate-200 hover:bg-slate-800/50 hover:text-white"
                      }`}
                    >
                      {item.icon && <item.icon className="w-5 h-5 mr-2 opacity-80" />}
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 opacity-50" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub className="mt-1 ml-4 border-l border-slate-700 pl-2 space-y-1">
                      {item.items.map((subItem) => {
                        const isSubActive = location.pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link 
                                to={subItem.url}
                                className={`w-full rounded-[0.5rem] px-3 py-2 transition-all duration-200 ${
                                  isSubActive 
                                    ? "bg-blue-500/20 text-blue-400 font-medium" 
                                    : "text-slate-200 hover:text-white hover:bg-slate-800/50"
                                }`}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild
                className={`w-full rounded-[0.5rem] transition-all duration-200 ${
                  isMainActive 
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 font-semibold" 
                    : "text-slate-200 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Link to={item.url} className="flex items-center">
                  {item.icon && <item.icon className="w-5 h-5 mr-2 opacity-90" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}