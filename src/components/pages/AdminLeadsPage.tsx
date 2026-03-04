import { useState, useEffect, lazy, Suspense, Fragment } from 'react';
import { Users, Wrench, FolderKanban, HelpCircle, LogOut, Inbox, Paperclip } from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

const AdminCmsPage = lazy(() => import('./AdminCmsPage'));

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  projectType: string;
  timeline: string;
  budgetRange: string;
  projectDetails: string;
  photoUrls?: string[];
  status: string;
  notes: string;
  createdAt: string;
}

const AUTH_STORAGE_KEY = 'admin_supabase_token';

type NavItem = 'leads' | 'services' | 'projects' | 'faqs';

const NAV: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  { id: 'leads', label: 'Leads', icon: <Users className="w-4 h-4" /> },
  { id: 'services', label: 'Services', icon: <Wrench className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
  { id: 'faqs', label: 'FAQs', icon: <HelpCircle className="w-4 h-4" /> },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem>('leads');
  const [expandedLead, setExpandedLead] = useState<number | null>(null);

  const fetchLeads = async (token: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { localStorage.removeItem(AUTH_STORAGE_KEY); setAuthToken(''); }
        setError(data.error || 'Failed to load leads');
        setLeads([]);
        return;
      }
      setLeads(data.leads || []);
    } catch {
      setError('Network error');
      setLeads([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
    if (stored) { setAuthToken(stored); fetchLeads(stored); } else { setLoading(false); }
  }, []);

  // Open specific lead from email link: /admin?lead=123
  useEffect(() => {
    if (typeof window === 'undefined' || leads.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const leadIdParam = params.get('lead');
    if (!leadIdParam) return;
    const id = Number(leadIdParam);
    if (!Number.isInteger(id)) return;
    const exists = leads.some((l) => l.id === id);
    if (exists) {
      setExpandedLead(id);
      // Clean URL so refresh doesn't re-expand
      const url = new URL(window.location.href);
      url.searchParams.delete('lead');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, [leads]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError('Enter your password'); return; }
    setLoginLoading(true);
    setError('');
    if (!email.trim()) {
      try {
        const res = await fetch('/api/leads', { headers: { Authorization: `Bearer ${password}` } });
        if (res.ok) { localStorage.setItem(AUTH_STORAGE_KEY, password); setAuthToken(password); fetchLeads(password); setLoginLoading(false); return; }
      } catch {/**/}
      setError('Invalid password');
      setLoginLoading(false);
      return;
    }
    try {
      const configRes = await fetch('/api/config');
      const config = await configRes.json();
      if (!configRes.ok || !config.supabaseUrl || !config.supabaseAnonKey) { setError('Supabase not configured.'); setLoginLoading(false); return; }
      const supabase = createSupabaseBrowser(config.supabaseUrl, config.supabaseAnonKey);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) { setError(signInError.message); setLoginLoading(false); return; }
      const token = data.session?.access_token;
      if (!token) { setError('Login failed'); setLoginLoading(false); return; }
      localStorage.setItem(AUTH_STORAGE_KEY, token);
      setAuthToken(token);
      fetchLeads(token);
    } catch (err) { setError(err instanceof Error ? err.message : 'Login failed'); }
    finally { setLoginLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem(AUTH_STORAGE_KEY); setAuthToken(''); setEmail(''); setPassword(''); setLeads([]); };

  const exportCsv = () => {
    if (leads.length === 0) return;
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Zip', 'Project Type', 'Timeline', 'Budget', 'Details', 'Status'];
    const rows = leads.map((l) => [l.createdAt, l.name, l.email, l.phone, l.zipCode, l.projectType, l.timeline, l.budgetRange, `"${(l.projectDetails || '').replace(/"/g, '""')}"`, l.status]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!authToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">JD</div>
            <div><h1 className="text-lg font-bold text-gray-900">JD Home Admin</h1><p className="text-xs text-gray-500">Dashboard login</p></div>
          </div>
          {error && <p className="text-red-600 text-sm mb-3 bg-red-50 rounded-lg p-2">{error}</p>}
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email (optional)</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="Leave blank for password login" autoComplete="email" />
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="Admin password" autoComplete="current-password" autoFocus />
          <button type="submit" disabled={loginLoading} className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50 transition">
            {loginLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-gray-900 text-white shrink-0">
        <div className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">JD</div>
              <span className="font-bold text-sm hidden sm:inline">JD Home Admin</span>
            </div>
            <nav className="flex items-center gap-1">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => setActiveNav(n.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    activeNav === n.id ? 'bg-white/15 text-white font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}>
                  {n.icon}
                  <span className="hidden md:inline">{n.label}</span>
                  {n.id === 'leads' && leads.length > 0 && (
                    <span className="bg-primary/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">{leads.length}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-xs transition">
            <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main content — full width */}
      <main className="flex-1 overflow-y-auto">
        {activeNav === 'leads' ? (
          <div className="p-4 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Leads &amp; Submissions</h2>
                <p className="text-xs text-gray-500 mt-0.5">{leads.length} total leads</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => fetchLeads(authToken)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition">Refresh</button>
                <button type="button" onClick={exportCsv} disabled={leads.length === 0}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-primary/90 transition">Export CSV</button>
              </div>
            </div>
            {error && <p className="text-red-600 mb-4 bg-red-50 rounded-lg p-3 text-sm">{error}</p>}
            {loading ? (
              <div className="flex items-center gap-3 text-gray-500 py-12"><div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" /> Loading...</div>
            ) : leads.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No leads yet</p>
                <p className="text-gray-400 text-sm mt-1">Submissions from the quote form will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50/80">
                        <th className="px-3 py-2.5 font-semibold text-gray-600 text-[10px] uppercase tracking-wide w-8"></th>
                        <th className="px-3 py-2.5 font-semibold text-gray-600 text-[10px] uppercase tracking-wide">Date</th>
                        <th className="px-3 py-2.5 font-semibold text-gray-600 text-[10px] uppercase tracking-wide">Name</th>
                        <th className="px-3 py-2.5 font-semibold text-gray-600 text-[10px] uppercase tracking-wide">Email</th>
                        <th className="px-3 py-2.5 font-semibold text-gray-600 text-[10px] uppercase tracking-wide">Phone</th>
                        <th className="px-3 py-2.5 font-semibold text-gray-600 text-[10px] uppercase tracking-wide">Project</th>
                        <th className="px-3 py-2.5 font-semibold text-gray-600 text-[10px] uppercase tracking-wide">Budget</th>
                        <th className="px-3 py-2.5 font-semibold text-gray-600 text-[10px] uppercase tracking-wide">Files</th>
                        <th className="px-3 py-2.5 font-semibold text-gray-600 text-[10px] uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leads.map((lead) => {
                        const photos = lead.photoUrls || [];
                        const isExpanded = expandedLead === lead.id;
                        return (
                          <Fragment key={lead.id}>
                            <tr onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                              className="hover:bg-blue-50/40 transition-colors cursor-pointer">
                              <td className="px-3 py-2.5 text-gray-400 text-xs">{isExpanded ? '▼' : '▶'}</td>
                              <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                              <td className="px-3 py-2.5 font-semibold text-gray-900">{lead.name}</td>
                              <td className="px-3 py-2.5 text-gray-600">{lead.email}</td>
                              <td className="px-3 py-2.5 text-gray-600">{lead.phone}</td>
                              <td className="px-3 py-2.5 text-gray-600">{lead.projectType}</td>
                              <td className="px-3 py-2.5 text-gray-600">{lead.budgetRange}</td>
                              <td className="px-3 py-2.5">
                                {photos.length > 0 ? (
                                  <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold">
                                    <Paperclip className="w-3 h-3" /> {photos.length}
                                  </span>
                                ) : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="px-3 py-2.5"><span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700">{lead.status}</span></td>
                            </tr>
                            {isExpanded && (
                              <tr>
                                <td colSpan={9} className="bg-gray-50 px-5 py-4">
                                  <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
                                    <div className="space-y-2.5">
                                      <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Zip Code</span><p className="text-sm text-gray-800">{lead.zipCode || '—'}</p></div>
                                      <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Timeline</span><p className="text-sm text-gray-800">{lead.timeline || '—'}</p></div>
                                      <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Project Details</span><p className="text-sm text-gray-800 whitespace-pre-wrap">{lead.projectDetails || '—'}</p></div>
                                      {lead.notes && <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Notes</span><p className="text-sm text-gray-800 whitespace-pre-wrap">{lead.notes}</p></div>}
                                    </div>
                                    {photos.length > 0 && (
                                      <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-2">Uploaded Files ({photos.length})</span>
                                        <div className="flex flex-wrap gap-2">
                                          {photos.map((url, pi) => (
                                            <a key={pi} href={url} target="_blank" rel="noopener noreferrer"
                                              className="block w-24 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white hover:ring-2 hover:ring-primary/40 transition">
                                              {/\.(mp4|webm|mov)$/i.test(url) ? <video src={url} className="w-full h-full object-cover" muted /> : <img src={url} alt="" className="w-full h-full object-cover" />}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Suspense fallback={<div className="p-6 text-gray-400">Loading CMS...</div>}>
            <AdminCmsPage authToken={authToken} collection={activeNav as 'services' | 'projects' | 'faqs'} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
