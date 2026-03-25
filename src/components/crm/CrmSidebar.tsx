import {
  LayoutDashboard, Users, Target, Plane, FileText, ScrollText, Receipt,
  Map, LogOut, ChevronLeft, MessageSquare, Kanban, Shield, Settings,
  UserCheck, DollarSign, Briefcase, Gift, Activity, FolderOpen,
  ArrowDownLeft, ArrowUpRight, CreditCard, Landmark, TrendingUp,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  roles: AppRole[];
}

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/crm", icon: LayoutDashboard, roles: [] },
      { title: "Pipeline", url: "/crm/pipeline", icon: Kanban, roles: ["admin", "sales"] },
    ],
  },
  {
    label: "Sales / Charter",
    items: [
      { title: "Leads", url: "/crm/leads", icon: Target, roles: ["admin", "sales"] },
      { title: "Flight Requests", url: "/crm/requests", icon: Plane, roles: ["admin", "sales", "operations"] },
      { title: "Quotes", url: "/crm/quotes", icon: FileText, roles: ["admin", "sales", "finance"] },
      { title: "Clients", url: "/crm/clients", icon: Users, roles: ["admin", "sales", "account_management"] },
    ],
  },
  {
    label: "Account Mgmt",
    items: [
      { title: "Client Portfolio", url: "/crm/account-mgmt", icon: UserCheck, roles: ["admin", "account_management"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Trips", url: "/crm/trips", icon: Map, roles: ["admin", "operations"] },
      { title: "Contracts", url: "/crm/contracts", icon: ScrollText, roles: ["admin", "operations"] },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Overview", url: "/crm/finance", icon: DollarSign, roles: ["admin", "finance"] },
      { title: "Invoices", url: "/crm/invoices", icon: Receipt, roles: ["admin", "finance"] },
      { title: "Receivables", url: "/crm/finance/receivables", icon: ArrowDownLeft, roles: ["admin", "finance"] },
      { title: "Payables", url: "/crm/finance/payables", icon: ArrowUpRight, roles: ["admin", "finance"] },
      { title: "Payments", url: "/crm/finance/payments", icon: CreditCard, roles: ["admin", "finance"] },
      { title: "Credits", url: "/crm/finance/credits", icon: FileText, roles: ["admin", "finance"] },
      { title: "Bank", url: "/crm/finance/bank", icon: Landmark, roles: ["admin", "finance"] },
      { title: "Statements", url: "/crm/finance/statements", icon: TrendingUp, roles: ["admin", "finance"] },
    ],
  },
  {
    label: "Membership",
    items: [
      { title: "Applications", url: "/crm/membership", icon: Briefcase, roles: ["admin", "account_management", "sales"] },
      { title: "Referrals", url: "/crm/referrals", icon: Gift, roles: ["admin", "account_management", "sales"] },
      { title: "Outreach", url: "/crm/outreach", icon: MessageSquare, roles: ["admin", "sales"] },
    ],
  },
  {
    label: "HR",
    items: [
      { title: "Staff Directory", url: "/crm/hr", icon: Users, roles: ["admin", "hr"] },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "User Management", url: "/crm/admin/users", icon: Shield, roles: ["admin"] },
      { title: "Activity Log", url: "/crm/activity", icon: Activity, roles: ["admin"] },
      { title: "Settings", url: "/crm/admin/settings", icon: Settings, roles: ["admin"] },
    ],
  },
];

export function CrmSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { roles, signOut } = useAuth();

  const canSee = (item: NavItem) => {
    if (item.roles.length === 0) return true;
    return item.roles.some(r => roles.includes(r));
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/30">
      <SidebarContent className="bg-card">
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

        {sections.map(section => {
          const visible = section.items.filter(canSee);
          if (visible.length === 0) return null;
          return (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground/40 font-light px-4">
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visible.map((item) => (
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
          );
        })}
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
