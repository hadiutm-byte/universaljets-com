import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import CrmTable from "@/components/crm/CrmTable";
import ClientForm from "@/components/crm/ClientForm";
import { toast } from "sonner";

const ClientsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this client?")) return;
    const { error } = await supabase.from("clients").delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); fetch(); }
  };

  return (
    <>
      <CrmTable
        title="Clients"
        columns={[
          { key: "full_name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "company", label: "Company" },
          { key: "created_at", label: "Created", render: (r: any) => new Date(r.created_at).toLocaleDateString() },
        ]}
        data={data}
        loading={loading}
        onAdd={() => { setEditing(null); setFormOpen(true); }}
        onEdit={(r) => { setEditing(r); setFormOpen(true); }}
        onDelete={handleDelete}
      />
      <ClientForm open={formOpen} onOpenChange={setFormOpen} onSuccess={fetch} initial={editing} />
    </>
  );
};

export default ClientsPage;
