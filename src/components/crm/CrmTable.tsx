import { Plus, Pencil, Trash2 } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRowClick?: (row: T) => void;
}

export default function CrmTable<T extends { id: string }>({
  title, columns, data, loading, onAdd, onEdit, onDelete, onRowClick,
}: Props<T>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl md:text-2xl">{title}</h1>
          <p className="text-[11px] text-muted-foreground/60 mt-1">{data.length} records</p>
        </div>
        {onAdd && (
          <button onClick={onAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.2em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.45)] transition-all duration-500">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        )}
      </div>

      <div className="rounded-xl border border-border/20 overflow-hidden bg-card/50">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border border-primary/30 border-t-primary/80 rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground/40 text-[13px] font-extralight">
            No records yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20">
                  {columns.map(col => (
                    <th key={col.key} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">
                      {col.label}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="text-right px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light w-24">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id} onClick={() => onRowClick?.(row)} className={`border-b border-border/10 hover:bg-secondary/30 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}>
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-[12px] text-foreground/70 font-light">
                        {col.render ? col.render(row) : (row as any)[col.key] ?? "—"}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onEdit && (
                            <button onClick={() => onEdit(row)}
                              className="p-1.5 text-foreground/30 hover:text-primary transition-colors rounded">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => onDelete(row)}
                              className="p-1.5 text-foreground/30 hover:text-destructive transition-colors rounded">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
