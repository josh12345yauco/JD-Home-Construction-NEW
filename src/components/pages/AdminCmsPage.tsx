import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { Trash2 } from 'lucide-react';

type Collection = 'services' | 'projects' | 'faqs';

interface CmsItem {
  _id: string;
  [key: string]: unknown;
}

type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'image' | 'gallery';
interface Field { key: string; label: string; type: FieldType; w?: string }

const FIELDS: Record<Collection, Field[]> = {
  services: [
    { key: 'serviceName', label: 'Service Name', type: 'text', w: 'min-w-[180px]' },
    { key: 'serviceImage', label: 'Image', type: 'image', w: 'min-w-[80px] w-[80px]' },
    { key: 'shortDescription', label: 'Short Desc', type: 'textarea', w: 'min-w-[200px]' },
    { key: 'detailedDescription', label: 'Detailed Desc', type: 'textarea', w: 'min-w-[260px]' },
    { key: 'processSteps', label: 'Process Steps', type: 'textarea', w: 'min-w-[220px]' },
    { key: 'benefits', label: 'Benefits', type: 'textarea', w: 'min-w-[220px]' },
    { key: 'timelineEstimate', label: 'Timeline', type: 'text', w: 'min-w-[120px]' },
    { key: 'displayOrder', label: '#', type: 'number', w: 'min-w-[50px] w-[50px]' },
  ],
  projects: [
    { key: 'projectTitle', label: 'Project Title', type: 'text', w: 'min-w-[200px]' },
    { key: 'category', label: 'Category', type: 'text', w: 'min-w-[120px]' },
    { key: 'location', label: 'Location', type: 'text', w: 'min-w-[140px]' },
    { key: 'scopeOfWork', label: 'Scope of Work', type: 'textarea', w: 'min-w-[220px]' },
    { key: 'projectDescription', label: 'Description', type: 'textarea', w: 'min-w-[260px]' },
    { key: 'beforeImage', label: 'Before', type: 'image', w: 'min-w-[80px] w-[80px]' },
    { key: 'afterImage', label: 'After', type: 'image', w: 'min-w-[80px] w-[80px]' },
    { key: 'mediaGallery', label: 'Gallery', type: 'gallery', w: 'min-w-[140px]' },
    { key: 'displayOrder', label: '#', type: 'number', w: 'min-w-[50px] w-[50px]' },
  ],
  faqs: [
    { key: 'question', label: 'Question', type: 'text', w: 'min-w-[240px]' },
    { key: 'answer', label: 'Answer', type: 'textarea', w: 'min-w-[360px]' },
    { key: 'category', label: 'Category', type: 'text', w: 'min-w-[120px]' },
    { key: 'isFeatured', label: 'Featured', type: 'checkbox', w: 'min-w-[70px] w-[70px]' },
    { key: 'displayOrder', label: '#', type: 'number', w: 'min-w-[50px] w-[50px]' },
  ],
};

const LABELS: Record<Collection, string> = { services: 'Service', projects: 'Project', faqs: 'FAQ' };

const ACCEPT_MEDIA = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime';

function isVideo(url: string) { return /\.(mp4|webm|mov)$/i.test(url); }

/* ── Tiny cell-level components ──────────────────────────────── */

function CellImage({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (res.ok && json.urls?.[0]) onChange(json.urls[0]);
    } catch {/**/}
    setUploading(false);
  };
  return (
    <div className="flex items-center gap-1.5 group/img">
      <div onClick={() => ref.current?.click()}
        className="w-12 h-9 rounded border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 transition shrink-0">
        {uploading ? (
          <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        ) : value ? (
          isVideo(value) ? <video src={value} className="w-full h-full object-cover" muted /> : <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-300 text-xs">+</span>
        )}
      </div>
      {value && (
        <button type="button" onClick={() => onChange('')}
          className="text-red-400 hover:text-red-600 text-[10px] opacity-0 group-hover/img:opacity-100 transition">✕</button>
      )}
      <input ref={ref} type="file" accept={ACCEPT_MEDIA} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
    </div>
  );
}

function CellGallery({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const upload = async (files: FileList) => {
    setUploading(true);
    try {
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) fd.append('file', files[i]);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (res.ok && json.urls) onChange([...value, ...json.urls]);
    } catch {/**/}
    setUploading(false);
  };
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {value.map((url, i) => (
        <div key={i} className="relative group/g w-9 h-7 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
          {isVideo(url) ? <video src={url} className="w-full h-full object-cover" muted /> : <img src={url} alt="" className="w-full h-full object-cover" />}
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="absolute inset-0 bg-red-600/70 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover/g:opacity-100 transition">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
        className="w-9 h-7 rounded border border-dashed border-gray-300 hover:border-primary/50 flex items-center justify-center text-gray-400 hover:text-primary text-xs transition shrink-0">
        {uploading ? <span className="w-3 h-3 border-2 border-gray-300 border-t-primary rounded-full animate-spin" /> : '+'}
      </button>
      <input ref={ref} type="file" accept={ACCEPT_MEDIA} multiple className="hidden" onChange={(e) => { if (e.target.files?.length) upload(e.target.files); }} />
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */

interface AdminCmsPageProps { authToken: string; collection: Collection }

export default function AdminCmsPage({ authToken, collection }: AdminCmsPageProps) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState<Record<string, CmsItem>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<CmsItem | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/${collection}?limit=100`);
      const data = await res.json();
      setItems(data.items || []);
      setDirty({}); setMsg({});
    } catch {/**/}
    setLoading(false);
  }, [collection]);

  useEffect(() => { fetchItems(); setAdding(false); setNewItem(null); setEditingCell(null); }, [fetchItems]);

  const getItem = (item: CmsItem) => dirty[item._id] || item;

  const updateField = (id: string, item: CmsItem, key: string, value: unknown) => {
    const current = dirty[id] || item;
    setDirty((p) => ({ ...p, [id]: { ...current, [key]: value } }));
  };

  const handleSave = async (item: CmsItem) => {
    const data = getItem(item);
    setSaving((p) => ({ ...p, [item._id]: true }));
    setMsg((p) => ({ ...p, [item._id]: '' }));
    try {
      const res = await fetch(`/api/cms/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setMsg((p) => ({ ...p, [item._id]: json.error || 'Save failed' })); }
      else {
        setMsg((p) => ({ ...p, [item._id]: 'Saved!' }));
        setDirty((p) => { const n = { ...p }; delete n[item._id]; return n; });
        setTimeout(() => setMsg((p) => ({ ...p, [item._id]: '' })), 2000);
        fetchItems();
      }
    } catch { setMsg((p) => ({ ...p, [item._id]: 'Network error' })); }
    setSaving((p) => ({ ...p, [item._id]: false }));
  };

  const handleSaveNew = async () => {
    if (!newItem) return;
    setSaving((p) => ({ ...p, __new: true }));
    try {
      const res = await fetch(`/api/cms/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(newItem),
      });
      if (res.ok) { setAdding(false); setNewItem(null); fetchItems(); }
    } catch {/**/}
    setSaving((p) => ({ ...p, __new: false }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item permanently?')) return;
    await fetch(`/api/cms/${collection}?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${authToken}` } });
    fetchItems();
  };

  const startNew = () => {
    const item: CmsItem = { _id: '' };
    FIELDS[collection].forEach((f) => {
      if (f.type === 'checkbox') item[f.key] = false;
      else if (f.type === 'number') item[f.key] = 0;
      else if (f.type === 'gallery') item[f.key] = [];
      else item[f.key] = '';
    });
    setNewItem(item);
    setAdding(true);
  };

  const fields = FIELDS[collection];
  const label = LABELS[collection];

  const cellKey = (id: string, key: string) => `${id}::${key}`;

  const renderCell = (f: Field, item: CmsItem, id: string, onChange: (key: string, val: unknown) => void) => {
    const val = item[f.key];
    if (f.type === 'image') return <CellImage value={String(val ?? '')} onChange={(v) => onChange(f.key, v)} />;
    if (f.type === 'gallery') return <CellGallery value={Array.isArray(val) ? val as string[] : []} onChange={(v) => onChange(f.key, v)} />;
    if (f.type === 'checkbox') return (
      <input type="checkbox" checked={!!val} onChange={(e) => onChange(f.key, e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer" />
    );
    if (f.type === 'number') return (
      <input type="number" value={String(val ?? 0)} onChange={(e) => onChange(f.key, parseInt(e.target.value) || 0)}
        className="w-full bg-transparent border-0 p-0 text-sm text-gray-800 focus:ring-0 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
    );
    const strVal = String(val ?? '');
    const ck = cellKey(id, f.key);
    const isEditing = editingCell === ck;

    if (f.type === 'textarea') {
      if (!isEditing) {
        return (
          <div className="text-sm text-gray-700 line-clamp-2 cursor-text min-h-[1.5em] hover:bg-blue-50/40 rounded px-1 -mx-1 transition"
            onClick={() => setEditingCell(ck)}>
            {strVal || <span className="text-gray-300 italic">click to edit</span>}
          </div>
        );
      }
      return (
        <textarea value={strVal} onChange={(e) => onChange(f.key, e.target.value)} rows={3} autoFocus
          onBlur={() => setEditingCell(null)}
          className="w-full bg-white border border-primary/30 rounded p-1.5 text-sm text-gray-800 focus:ring-1 focus:ring-primary/30 outline-none resize-y shadow-sm" />
      );
    }

    return (
      <input type="text" value={strVal} onChange={(e) => onChange(f.key, e.target.value)}
        className="w-full bg-transparent border-0 p-0 text-sm text-gray-800 focus:ring-0 outline-none placeholder:text-gray-300"
        placeholder="—" />
    );
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{label}s</h2>
          <p className="text-xs text-gray-500 mt-0.5">{items.length} items &middot; Click cells to edit</p>
        </div>
        <button onClick={startNew} className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition flex items-center gap-1.5">
          <span className="text-lg leading-none">+</span> Add Item
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-gray-400 py-12"><div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" /> Loading...</div>
      )}

      {!loading && items.length === 0 && !adding && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 font-medium">No {label.toLowerCase()}s yet</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Add Item&quot; to create one.</p>
        </div>
      )}

      {/* New item form (card above table) */}
      {adding && newItem && (
        <div className="bg-white rounded-xl border-2 border-primary/30 shadow-lg p-5 mb-4 max-w-2xl">
          <h3 className="font-bold text-gray-900 text-sm mb-3">New {label}</h3>
          <div className="grid gap-3">
            {fields.map((f) => {
              const val = newItem[f.key];
              return (
                <div key={f.key}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{f.label}</label>
                  {f.type === 'image' ? <CellImage value={String(val ?? '')} onChange={(v) => setNewItem({ ...newItem, [f.key]: v })} />
                  : f.type === 'gallery' ? <CellGallery value={Array.isArray(val) ? val as string[] : []} onChange={(v) => setNewItem({ ...newItem, [f.key]: v })} />
                  : f.type === 'checkbox' ? <input type="checkbox" checked={!!val} onChange={(e) => setNewItem({ ...newItem, [f.key]: e.target.checked })} className="w-4 h-4 rounded border-gray-300" />
                  : f.type === 'textarea' ? <textarea value={String(val ?? '')} onChange={(e) => setNewItem({ ...newItem, [f.key]: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary/30 outline-none" />
                  : f.type === 'number' ? <input type="number" value={String(val ?? 0)} onChange={(e) => setNewItem({ ...newItem, [f.key]: parseInt(e.target.value) || 0 })} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none" />
                  : <input type="text" value={String(val ?? '')} onChange={(e) => setNewItem({ ...newItem, [f.key]: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none" />}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button onClick={handleSaveNew} disabled={saving.__new} className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50">
              {saving.__new ? 'Saving...' : 'Create'}
            </button>
            <button onClick={() => { setAdding(false); setNewItem(null); }} className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Spreadsheet table */}
      {!loading && items.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[40px] text-center">#</th>
                  {fields.map((f) => (
                    <th key={f.key} className={`px-3 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider ${f.w || ''}`}>
                      {f.label}
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[100px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const current = getItem(item);
                  const isDirty = !!dirty[item._id];
                  const itemMsg = msg[item._id];
                  const isSaving = saving[item._id];

                  return (
                    <Fragment key={item._id}>
                      <tr className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${isDirty ? 'bg-primary/[0.03]' : ''}`}>
                        <td className="px-3 py-2 text-center text-xs text-gray-400 font-mono">{idx + 1}</td>
                        {fields.map((f) => (
                          <td key={f.key} className={`px-3 py-2 align-top ${f.w || ''}`}>
                            {renderCell(f, current, item._id, (k, v) => updateField(item._id, item, k, v))}
                          </td>
                        ))}
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {itemMsg && (
                              <span className={`text-[10px] font-semibold mr-1 ${itemMsg === 'Saved!' ? 'text-green-600' : 'text-red-500'}`}>{itemMsg}</span>
                            )}
                            {isDirty && (
                              <button onClick={() => handleSave(item)} disabled={isSaving}
                                className="px-2 py-1 bg-primary text-white rounded text-[10px] font-bold disabled:opacity-50 hover:bg-primary/90 transition">
                                {isSaving ? '...' : 'Save'}
                              </button>
                            )}
                            <button onClick={() => handleDelete(item._id)}
                              className="px-1.5 py-1 text-gray-300 hover:text-red-600 text-xs transition" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
