"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const CATEGORIES = ["UNILORIN News","Admissions","Post-UTME","Results","Exams","NELFUND","Scholarships","Student Union","Campus Life","General News"];

function slugify(title) {
  return title.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) + "-" + Math.random().toString(36).slice(2, 6);
}

export default function ArticleForm({ initial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial || {
    title: "", summary: "", content: "", category: CATEGORIES[0],
    author: "Editorial Desk", featured_image: "", featured: false,
    breaking_news: false, status: "draft",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const uploadImage = async (file) => {
    setUploading(true); setError("");
    const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error: upErr } = await supabase.storage.from("article-images").upload(path, file);
    if (upErr) { setError(`Image upload failed: ${upErr.message}. Make sure the "article-images" storage bucket exists and is public.`); setUploading(false); return; }
    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    update("featured_image", data.publicUrl);
    setUploading(false);
  };

  const save = async (publish) => {
    if (!form.title || !form.content) { setError("Title and content are required."); return; }
    setSaving(true); setError("");
    const payload = {
      title: form.title, summary: form.summary, content: form.content,
      category: form.category, author: form.author, featured_image: form.featured_image || null,
      featured: form.featured, breaking_news: form.breaking_news,
      status: publish ? "published" : "draft",
      updated_at: new Date().toISOString(),
    };
    if (publish && form.status !== "published") payload.published_at = new Date().toISOString();

    let error2;
    if (initial?.id) {
      ({ error: error2 } = await supabase.from("posts").update(payload).eq("id", initial.id));
    } else {
      payload.slug = slugify(form.title);
      if (publish) payload.published_at = new Date().toISOString();
      ({ error: error2 } = await supabase.from("posts").insert(payload));
    }
    setSaving(false);
    if (error2) { setError(error2.message); return; }
    router.push("/admin");
  };

  return (
    <div className="px-4 pt-6 pb-10">
      <h1 className="text-xl font-black text-neutral-900 mb-4">{initial ? "Edit Article" : "Create Article"}</h1>
      {error && <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">{error}</p>}
      <div className="space-y-3">
        <Field label="Headline" value={form.title} onChange={(v) => update("title", v)} />
        <Field label="Short summary" value={form.summary} onChange={(v) => update("summary", v)} />
        <div>
          <label className="text-xs font-bold text-neutral-600">Full article content</label>
          <textarea value={form.content} onChange={(e) => update("content", e.target.value)} rows={8} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-neutral-600">Category</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Field label="Author" value={form.author} onChange={(v) => update("author", v)} />
        </div>
        <div>
          <label className="text-xs font-bold text-neutral-600">Featured image</label>
          <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0])} className="w-full mt-1 text-xs" />
          {uploading && <p className="text-xs text-neutral-400 mt-1">Uploading…</p>}
          {form.featured_image && <img src={form.featured_image} alt="" className="w-full h-32 object-cover rounded-xl mt-2" />}
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
            <input type="checkbox" checked={form.breaking_news} onChange={(e) => update("breaking_news", e.target.checked)} /> Breaking news
          </label>
        </div>
        <div className="flex gap-2 pt-2">
          <button disabled={saving} onClick={() => save(false)} className="flex-1 py-3 rounded-xl border border-neutral-200 font-bold text-sm disabled:opacity-60">
            Save Draft
          </button>
          <button disabled={saving} onClick={() => save(true)} className="flex-1 py-3 rounded-xl bg-brand text-white font-bold text-sm disabled:opacity-60">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-neutral-600">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none" />
    </div>
  );
}
