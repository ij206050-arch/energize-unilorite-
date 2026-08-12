import { supabase } from "../../lib/supabase";
import Link from "next/link";

export const metadata = { title: "Search — ENERGIZE UNILORITE" };

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || "";
  let posts = [];
  if (q) {
    const { data } = await supabase
      .from("posts").select("*").eq("status", "published")
      .or(`title.ilike.%${q}%,content.ilike.%${q}%,category.ilike.%${q}%`)
      .order("published_at", { ascending: false });
    posts = data || [];
  }

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-xl font-black text-neutral-900 mb-3">Search</h1>
      <form action="/search" method="get" className="mb-4">
        <input name="q" defaultValue={q} autoFocus placeholder="Search headlines, keywords, categories…" className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 text-sm outline-none" />
      </form>
      {q && (
        <p className="text-xs text-neutral-500 mb-3">{posts.length} result{posts.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;</p>
      )}
      <div className="grid grid-cols-1 gap-3">
        {q && posts.length === 0 && <p className="text-sm text-neutral-400 py-10 text-center">No articles found.</p>}
        {posts.map((p) => (
          <Link key={p.id} href={`/article/${p.slug}`} className="block bg-white rounded-2xl border border-neutral-200 p-4">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">{p.category}</span>
            <p className="font-bold text-[15px] text-neutral-900 leading-snug mt-1">{p.title}</p>
            <p className="text-[11px] text-neutral-500 mt-1.5">{new Date(p.published_at || p.created_at).toLocaleDateString("en-NG")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
