import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Download, CheckSquare, Square } from "lucide-react";

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
  onBulkAction?: (ids: string[], action: string) => void;
  bulkActions?: { label: string; value: string }[];
  filterBar?: React.ReactNode;
}

export default function CrmTable<T extends { id: string }>({
  title, columns, data, loading, onAdd, onEdit, onDelete, onRowClick, onBulkAction, bulkActions, filterBar,
}: Props<T>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allSelected = data.length > 0 && selected.size === data.length;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(data.map(r => r.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const exportCsv = useCallback(() => {
    const rows = selected.size > 0 ? data.filter(r => selected.has(r.id)) : data;
    const headers = columns.map(c => c.label);
    const csvRows = [headers.join(",")];
    rows.forEach(row => {
      const vals = columns.map(c => {
        const val = (row as any)[c.key];
        if (val === null || val === undefined) return "";
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      });
      csvRows.push(vals.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, selected, columns, title]);

  const hasBulk = bulkActions && bulkActions.length > 0 && onBulkAction;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-xl md:text-2xl">{title}</h1>
          <p className="text-[11px] text-muted-foreground/60 mt-1">{data.length} records{selected.size > 0 ? ` · ${selected.size} selected` : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          {data.length > 0 && (
            <button onClick={exportCsv} className="flex items-center gap-1.5 px-3 py-2 text-[9px] tracking-wider uppercase bg-secondary/50 hover:bg-secondary rounded-lg border border-border/20 transition-all text-muted-foreground/60 hover:text-foreground">
              <Download className="w-3 h-3" /> CSV
            </button>
          )}
          {onAdd && (
            <button onClick={onAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.2em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.45)] transition-all duration-500">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      {filterBar && <div className="mb-4">{filterBar}</div>}

      {/* Bulk Actions */}
      {hasBulk && selected.size > 0 && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
          <span className="text-[10px] text-primary font-medium">{selected.size} selected</span>
          {bulkActions!.map(action => (
            <button key={action.value} onClick={() => { onBulkAction!(Array.from(selected), action.value); setSelected(new Set()); }}
              className="px-3 py-1.5 text-[9px] tracking-wider uppercase bg-secondary/50 hover:bg-secondary rounded border border-border/20 transition-all">
              {action.label}
            </button>
          ))}
        </div>
      )}

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
                  {(hasBulk || data.length > 0) && (
                    <th className="w-10 px-3 py-3">
                      <button onClick={toggleAll} className="text-muted-foreground/40 hover:text-foreground transition-colors">
                        {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                      </button>
                    </th>
                  )}
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
                  <tr key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-border/10 hover:bg-secondary/30 transition-colors ${onRowClick ? "cursor-pointer" : ""} ${selected.has(row.id) ? "bg-primary/5" : ""}`}>
                    <td className="w-10 px-3 py-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleOne(row.id)} className="text-muted-foreground/40 hover:text-foreground transition-colors">
                        {selected.has(row.id) ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />}
                      </button>
                    </td>
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-[12px] text-foreground/70 font-light">
                        {col.render ? col.render(row) : (row as any)[col.key] ?? "—"}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
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
