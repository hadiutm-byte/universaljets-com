import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { useAuth } from "@/hooks/useAuth";

const CrmLayout = () => {
  const { roles } = useAuth();

  const dept = roles.includes("admin") ? "Admin" :
    roles.includes("sales") ? "Sales" :
    roles.includes("operations") ? "Operations" :
    roles.includes("finance") ? "Finance" :
    roles.includes("account_management") ? "Account Management" : "Staff";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CrmSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/20 px-4 bg-card/50">
            <SidebarTrigger className="text-foreground/40 hover:text-foreground transition-colors" />
            <span className="ml-4 text-[10px] tracking-[0.3em] uppercase text-foreground/30 font-light">
              {dept} Console
            </span>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CrmLayout;
