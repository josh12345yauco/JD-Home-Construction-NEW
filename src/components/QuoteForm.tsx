import React, { useState, useRef, useCallback } from 'react';
import { CheckCircle, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB — direct upload to Supabase (no Vercel limit)

interface UploadedFile {
  file: File;
  preview: string;
  url?: string;
  uploading: boolean;
  error?: string;
}

function isVideo(name: string) {
  return /\.(mp4|webm|mov)$/i.test(name);
}

export default function QuoteForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', zipCode: '',
    projectType: '', timeline: '', budgetRange: '', projectDetails: '',
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file: File, idx: number) => {
    try {
      // Get signed URL (no file in request — bypasses Vercel 4.5MB limit)
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type || undefined, size: file.size }),
      });
      const urlJson = await urlRes.json();
      if (!urlRes.ok || !urlJson.signedUrl || !urlJson.publicUrl) {
        setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, error: urlJson.error || 'Could not get upload URL', uploading: false } : f));
        return;
      }
      // Upload file directly to Supabase (client → Supabase, not through Vercel)
      const putRes = await fetch(urlJson.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
      });
      if (!putRes.ok) {
        setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, error: 'Upload failed', uploading: false } : f));
        return;
      }
      setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, url: urlJson.publicUrl, uploading: false } : f));
    } catch {
      setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, error: 'Network error', uploading: false } : f));
    }
  }, []);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i];
      const preview = URL.createObjectURL(file);
      if (file.size > MAX_FILE_SIZE) {
        newFiles.push({ file, preview, uploading: false, error: 'File too large — max 50 MB per file.' });
        continue;
      }
      newFiles.push({ file, preview, uploading: true });
    }
    setFiles((prev) => {
      const startIdx = prev.length;
      newFiles.forEach((f, i) => { if (!f.error) uploadFile(f.file, startIdx + i); });
      return [...prev, ...newFiles];
    });
  }, [uploadFile]);

  const removeFile = (idx: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    setError('');

    const photoUrls = files.filter((f) => f.url).map((f) => f.url!);

    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photoUrls }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setStatus('error');
        return;
      }
      setStatus('success');
      setForm({ name: '', email: '', phone: '', zipCode: '', projectType: '', timeline: '', budgetRange: '', projectDetails: '' });
      setFiles([]);
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="font-heading text-2xl text-secondary mb-2">Thank you!</h3>
        <p className="font-paragraph text-foreground/80">We've received your request and will get back to you within 1 business day.</p>
        <Button type="button" onClick={() => setStatus('idle')} className="mt-6 bg-primary hover:bg-primary/90 text-white font-heading rounded-lg">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-heading text-secondary mb-2">Name *</label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your full name" className="h-12 rounded-lg border-medium-grey/30" required />
        </div>
        <div>
          <label className="block font-heading text-secondary mb-2">Email *</label>
          <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="your@email.com" className="h-12 rounded-lg border-medium-grey/30" required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-heading text-secondary mb-2">Phone *</label>
          <Input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="(555) 123-4567" className="h-12 rounded-lg border-medium-grey/30" required />
        </div>
        <div>
          <label className="block font-heading text-secondary mb-2">Zip Code *</label>
          <Input value={form.zipCode} onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))}
            placeholder="07090" className="h-12 rounded-lg border-medium-grey/30" required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-heading text-secondary mb-2">Project Type *</label>
          <Select required value={form.projectType} onValueChange={(v) => setForm((f) => ({ ...f, projectType: v }))}>
            <SelectTrigger className="h-12 rounded-lg border-medium-grey/30"><SelectValue placeholder="Select project type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kitchen">Kitchen Remodel</SelectItem>
              <SelectItem value="bathroom">Bathroom Remodel</SelectItem>
              <SelectItem value="addition">Home Addition</SelectItem>
              <SelectItem value="deck">Deck/Outdoor Living</SelectItem>
              <SelectItem value="roofing">Roofing &amp; Siding</SelectItem>
              <SelectItem value="flooring">Flooring &amp; Carpentry</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block font-heading text-secondary mb-2">Timeline *</label>
          <Select required value={form.timeline} onValueChange={(v) => setForm((f) => ({ ...f, timeline: v }))}>
            <SelectTrigger className="h-12 rounded-lg border-medium-grey/30"><SelectValue placeholder="When to start?" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="asap">As soon as possible</SelectItem>
              <SelectItem value="1-3">1-3 months</SelectItem>
              <SelectItem value="3-6">3-6 months</SelectItem>
              <SelectItem value="6+">6+ months</SelectItem>
              <SelectItem value="planning">Just planning</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block font-heading text-secondary mb-2">Budget Range *</label>
        <Select required value={form.budgetRange} onValueChange={(v) => setForm((f) => ({ ...f, budgetRange: v }))}>
          <SelectTrigger className="h-12 rounded-lg border-medium-grey/30"><SelectValue placeholder="Select budget range" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="under-10k">Under $10,000</SelectItem>
            <SelectItem value="10-25k">$10,000 - $25,000</SelectItem>
            <SelectItem value="25-50k">$25,000 - $50,000</SelectItem>
            <SelectItem value="50-100k">$50,000 - $100,000</SelectItem>
            <SelectItem value="100k+">$100,000+</SelectItem>
            <SelectItem value="not-sure">Not sure yet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block font-heading text-secondary mb-2">Project Details *</label>
        <Textarea value={form.projectDetails} onChange={(e) => setForm((f) => ({ ...f, projectDetails: e.target.value }))}
          placeholder="Tell us about your project, what you're looking to accomplish, any specific requirements..."
          rows={6} className="rounded-lg border-medium-grey/30" required />
      </div>

      {/* File Upload */}
      <div>
        <label className="block font-heading text-secondary mb-2">Photos &amp; Videos (Optional)</label>
        <div
          ref={dropZoneRef}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-medium-grey/30 hover:border-primary/50'
          }`}
        >
          <Upload className="w-8 h-8 text-primary/60 mx-auto mb-2" />
          <p className="font-paragraph text-foreground mb-1">Drop photos or videos here, or click to browse</p>
          <p className="font-paragraph text-sm text-foreground/50">JPG, PNG, WebP, GIF, MP4, MOV — up to 50 MB each</p>
          <input ref={fileInputRef} type="file" accept={ACCEPT} multiple className="hidden"
            onChange={(e) => { if (e.target.files?.length) { addFiles(e.target.files); e.target.value = ''; } }} />
        </div>

        {/* Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {files.map((f, idx) => (
              <div key={idx} className="relative group w-24 h-20 rounded-lg overflow-hidden border border-medium-grey/20 bg-light-grey">
                {isVideo(f.file.name) ? (
                  <video src={f.preview} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                )}
                {f.uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {f.error && (
                  <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold px-1 text-center">Error</span>
                  </div>
                )}
                {f.url && (
                  <div className="absolute bottom-0.5 right-0.5">
                    <CheckCircle className="w-4 h-4 text-green-500 drop-shadow" />
                  </div>
                )}
                <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {status === 'error' && error && (
        <p className="text-red-600 font-paragraph text-sm">{error}</p>
      )}

      <Button type="submit" size="lg" disabled={submitting || files.some((f) => f.uploading)}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base h-14 rounded-lg">
        {submitting ? 'Sending...' : files.some((f) => f.uploading) ? 'Uploading files...' : 'Request My Quote'}
      </Button>

      <a href="tel:267-804-4120" className="md:hidden block">
        <Button type="button" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading text-base h-14 rounded-lg">
          Call Now
        </Button>
      </a>

      <p className="text-center font-paragraph text-sm text-foreground/70">
        * Required fields. We reply within 1 business day.
      </p>
    </form>
  );
}
