import { supabase } from "../../lib/supabase";
import Link from "next/link";

export const revalidate = 30;

const CATEGORIES = ["UNILORIN News","Admissions","Post-UTME","Results","Exams","NELFUND","Scholarships","Student Union","Campus Life","General News"];

export const metadata = { title: "Latest News — ENERGIZE UNILORITE" };

export default async function FeedPage({ searchParams }) {
  const cat = searchParams?.cat || "All";

  let query = supabase.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false });
  if (cat !== "All") query = query.eq("category", cat);
  const { data: posts } = await query;

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-xl font-black text-neutral-900 mb-3">Latest News</h1>
      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
        <CatLink label="All" active={cat === "All"} />
        {CATEGORIES.map((c) => <CatLink key={c} label={c} active={cat === c} />)}
      </div>
      <div className="grid grid-cols-1 gap-3 mt-2">
        {(posts || []).length === 0 ? <p className="text-sm text-neutral-400 py-10 text-center">No articles in this category yet.</p> : posts.map((p) => (
          <Link key={p.id} href={`/article/${p.slug}`} className="block bg-white rounded-2xl border border-neutral-200 p-4">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">{p.category}</span>
            <p className="font-bold text-[15px] text-neutral-900 leading-snug mt-1">{p.title}</p>
            {p.summary && <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{p.summary}</p>}
            <p className="text-[11px] text-neutral-500 mt-1.5">{p.author} · {new Date(p.published_at || p.created_at).toLocaleDateString("en-NG")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CatLink({ label, active }) {
  const href = `/feed?cat=${encodeURIComponent(label)}`;
  return (
    <a href={href} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${active ? "bg-black text-white border-transparent" : "text-neutral-700 border-neutral-200 bg-white"}`}>
      {label}
    </a>
  );
}
