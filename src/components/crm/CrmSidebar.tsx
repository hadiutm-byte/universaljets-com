import {
  LayoutDashboard, Users, Target, Plane, FileText,
  ScrollText, Receipt, Map, LogOut, ChevronLeft, MessageSquare,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/crm", icon: LayoutDashboard },
  { title: "Clients", url: "/crm/clients", icon: Users },
  { title: "Leads", url: "/crm/leads", icon: Target },
  { title: "Flight Requests", url: "/crm/requests", icon: Plane },
  { title: "Quotes", url: "/crm/quotes", icon: FileText },
  { title: "Contracts", url: "/crm/contracts", icon: ScrollText },
  { title: "Invoices", url: "/crm/invoices", icon: Receipt },
  { title: "Trips", url: "/crm/trips", icon: Map },
];

export function CrmSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/30">
      <SidebarContent className="bg-card">
        {/* Brand */}
        <div className={`px-4 py-5 border-b border-border/20 ${collapsed ? "px-2" : ""}`}>
          <NavLink to="/" className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <span className="text-[10px] tracking-[0.3em] uppercase font-light">
                Universal <span className="text-primary font-normal">Jets</span>
              </span>
            )}
          </NavLink>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/60 font-light px-4">
            CRM
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/crm"}
                      className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-foreground/50 hover:text-foreground hover:bg-secondary/50 rounded-md transition-all duration-300"
                      activeClassName="bg-primary/10 text-primary border-l-2 border-primary"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-card border-t border-border/20 p-3">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 text-[11px] text-foreground/30 hover:text-destructive/70 transition-colors w-full rounded-md"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
