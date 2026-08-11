import { supabase } from "../lib/supabase";
import Link from "next/link";

export const revalidate = 30;

export const metadata = {
  title: "ENERGIZE UNILORITE — Your Campus. Your Updates. Your Wave.",
  description: "Fast, organized news and updates for University of Ilorin (UNILORIN) students: admissions, Post-UTME, results, NELFUND, scholarships and campus life.",
};

export default async function HomePage() {
  const base = supabase.from("posts").select("*").eq("status", "published");

  const [{ data: breakingList }, { data: featuredList }, { data: latest }, { data: trending }] = await Promise.all([
    base.eq("breaking_news", true).order("published_at", { ascending: false }).limit(1),
    supabase.from("posts").select("*").eq("status", "published").eq("featured", true).order("published_at", { ascending: false }).limit(1),
    supabase.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false }).range(0, 7),
    supabase.from("posts").select("*").eq("status", "published").order("view_count", { ascending: false }).limit(4),
  ]);

  const breaking = breakingList?.[0];
  const featured = featuredList?.[0] || latest?.[0];
  const restOfLatest = (latest || []).filter((p) => p.id !== featured?.id);

  return (
    <div className="pb-8">
      {breaking && (
        <div className="bg-black px-4 py-2.5">
          <Link href={`/article/${breaking.slug}`} className="flex items-center gap-2">
            <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-red-500">Breaking</span>
            <span className="text-white text-xs font-semibold truncate">{breaking.title}</span>
          </Link>
        </div>
      )}

      <div className="px-4 pt-4">
        {featured && (
          <Link href={`/article/${featured.slug}`} className="block mb-6 rounded-2xl overflow-hidden border border-neutral-200 bg-white">
            {featured.featured_image ? (
              <img src={featured.featured_image} alt={featured.title} className="w-full h-44 object-cover" />
            ) : (
              <div className="w-full h-44 bg-gradient-to-br from-neutral-900 to-neutral-700" />
            )}
            <div className="p-4">
              <span className="text-[11px] font-bold uppercase text-brandDark">{featured.category}</span>
              <h1 className="text-lg font-black text-neutral-900 leading-snug mt-1">{featured.title}</h1>
              {featured.summary && <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">{featured.summary}</p>}
              <p className="text-[11px] text-neutral-400 mt-2">{fmtDate(featured.published_at || featured.created_at)}</p>
            </div>
          </Link>
        )}

        <SectionHeader title="Latest Updates" href="/feed" />
        <div className="grid grid-cols-1 gap-3 mb-8">
          {restOfLatest.length === 0 ? <Empty /> : restOfLatest.map((p) => <ArticleCard key={p.id} post={p} />)}
        </div>

        <SectionHeader title="Categories" href="/feed" />
        <div className="grid grid-cols-2 gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/feed?cat=${encodeURIComponent(c)}`} className="px-3 py-3 rounded-xl bg-white border border-neutral-200 text-center text-xs font-bold text-neutral-700">
              {c}
            </Link>
          ))}
        </div>

        {trending && trending.length > 0 && (
          <>
            <SectionHeader title="Trending News" />
            <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 px-4 mb-8">
              {trending.map((p, i) => (
                <Link key={p.id} href={`/article/${p.slug}`} className="flex items-center gap-3 py-3">
                  <span className="text-lg font-black text-neutral-200 w-5">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{p.title}</p>
                    <p className="text-[11px] text-neutral-400">{p.view_count || 0} views</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <NewsletterForm />
      </div>
    </div>
  );
}

const CATEGORIES = ["UNILORIN News","Admissions","Post-UTME","Results","Exams","NELFUND","Scholarships","Student Union","Campus Life","General News"];

function SectionHeader({ title, href }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[15px] font-black text-neutral-900">{title}</h2>
      {href && <Link href={href} className="text-xs font-bold text-brandDark">View all</Link>}
    </div>
  );
}

function ArticleCard({ post }) {
  return (
    <Link href={`/article/${post.slug}`} className="flex gap-3 bg-white rounded-2xl border border-neutral-200 p-3">
      {post.featured_image ? (
        <img src={post.featured_image} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
      ) : (
        <div className="w-20 h-20 rounded-xl shrink-0 bg-gradient-to-br from-brand to-brandDark" />
      )}
      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase text-neutral-400">{post.category}</span>
        <p className="font-bold text-sm text-neutral-900 leading-snug line-clamp-2">{post.title}</p>
        <p className="text-[11px] text-neutral-400 mt-1">{fmtDate(post.published_at || post.created_at)}</p>
      </div>
    </Link>
  );
}

function NewsletterForm() {
  return (
    <div className="rounded-2xl p-5 bg-black text-white">
      <p className="font-black text-sm mb-1">Get updates in your inbox</p>
      <p className="text-xs text-white/60 mb-3">Subscribe for breaking UNILORIN news, results and Post-UTME alerts.</p>
      <form action="/api/subscribe" method="post" className="flex gap-2">
        <input name="email" type="email" required placeholder="you@example.com" className="flex-1 px-3 py-2.5 rounded-xl text-neutral-900 text-sm outline-none" />
        <button className="px-4 rounded-xl bg-brand font-bold text-sm">Subscribe</button>
      </form>
    </div>
  );
}

function Empty() { return <p className="text-sm text-neutral-400 py-6 text-center">No articles published yet.</p>; }
function fmtDate(iso) { return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }); }
