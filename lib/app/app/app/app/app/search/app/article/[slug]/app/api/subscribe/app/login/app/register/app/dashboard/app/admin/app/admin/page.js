"use client";
import { useEffect, useState } from "react";
import { useRequireAuth } from "../../lib/useRequireAuth";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { profile, loading } = useRequireAuth("admin");
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, subscribers: 0 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    (async () => {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      setPosts(data || []);
      const { count: subCount } = await supabase.from("subscribers").select("*", { count: "exact", head: true });
      setStats({
        total: data?.length || 0,
        published: (data || []).filter((p) => p.status === "published").length,
        drafts: (data || []).filter((p) => p.status === "draft").length,
        subscribers: subCount || 0,
      });
    })();
  }, [loading]);

  const del = async (id) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    setBusy(true);
    await supabase.from("posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setBusy(false);
  };

  const toggle = async (id, field, value) => {
    await supabase.from("posts").update({ [field]: value }).eq("id", id);
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const logout = async () => { await supabase.auth.signOut(); router.push("/"); };

  if (loading) return <div className="px-4 pt-10 text-center text-sm text-neutral-400">Loading…</div>;

  return (
    <div className="px-4 pt-6 pb-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-black text-neutral-900">Admin Dashboard</h1>
        <button onClick={logout} className="text-xs font-bold text-red-600">Log out</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Stat label="Total articles" value={stats.total} />
        <Stat label="Published" value={stats.published} />
        <Stat label="Drafts" value={stats.drafts} />
        <Stat label="Subscribers" value={stats.subscribers} />
      </div>

      <a href="/admin/new" className="block w-full text-center py-3 rounded-xl bg-brand text-white font-bold text-sm mb-5">+ Create Article</a>

      <h2 className="text-sm font-black text-neutral-900 mb-2">All Articles</h2>
      <div className="space-y-2">
        {posts.length === 0 && <p className="text-sm text-neutral-400 py-6 text-center">No articles yet — create your first one.</p>}
        {posts.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-neutral-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>{p.status}</span>
              {p.featured && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">Featured</span>}
              {p.breaking_news && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700">Breaking</span>}
            </div>
            <p className="text-sm font-semibold text-neutral-900">{p.title}</p>
            <p className="text-[11px] text-neutral-400 mb-2">{p.category} · {p.view_count || 0} views</p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <a href={`/admin/edit/${p.id}`} className="px-2.5 py-1 rounded-lg bg-neutral-100 font-semibold">Edit</a>
              <button disabled={busy} onClick={() => toggle(p.id, "featured", !p.featured)} className="px-2.5 py-1 rounded-lg bg-neutral-100 font-semibold">{p.featured ? "Unfeature" : "Feature"}</button>
              <button disabled={busy} onClick={() => toggle(p.id, "breaking_news", !p.breaking_news)} className="px-2.5 py-1 rounded-lg bg-neutral-100 font-semibold">{p.breaking_news ? "Unmark Breaking" : "Mark Breaking"}</button>
              <button disabled={busy} onClick={() => toggle(p.id, "status", p.status === "published" ? "draft" : "published")} className="px-2.5 py-1 rounded-lg bg-neutral-100 font-semibold">{p.status === "published" ? "Unpublish" : "Publish"}</button>
              <button disabled={busy} onClick={() => del(p.id)} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 font-semibold">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-3">
      <p className="text-2xl font-black text-neutral-900">{value}</p>
      <p className="text-[11px] text-neutral-500 font-medium">{label}</p>
    </div>
  );
}
