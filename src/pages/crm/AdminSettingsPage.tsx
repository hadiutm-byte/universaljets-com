import { Shield, Database, Bell, Globe, Key } from "lucide-react";

const AdminSettingsPage = () => {
  const settings = [
    { icon: Shield, label: "Role Management", desc: "Manage user roles and permissions", href: "/crm/admin/users" },
    { icon: Database, label: "Database", desc: "View and manage CRM data structure", href: "#" },
    { icon: Bell, label: "Notifications", desc: "Configure alerts and reminders", href: "#" },
    { icon: Globe, label: "API Configuration", desc: "Manage API integrations and keys", href: "#" },
    { icon: Key, label: "Security", desc: "Authentication and access settings", href: "#" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl md:text-2xl">Admin Settings</h1>
        <p className="text-[11px] text-muted-foreground/60 mt-1">System configuration and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.map((s) => (
          <a key={s.label} href={s.href} className="rounded-xl border border-border/20 bg-card/50 p-5 hover:bg-secondary/30 transition-all duration-300 group">
            <s.icon className="w-5 h-5 text-gold/50 mb-3 group-hover:text-gold/80 transition-colors" strokeWidth={1.5} />
            <p className="text-sm font-display font-medium mb-1">{s.label}</p>
            <p className="text-[11px] text-foreground/30 font-extralight">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
