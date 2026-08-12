import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { data: post } = await supabase.from("posts").select("*").eq("slug", params.slug).single();
  if (!post) return {};
  return {
    title: `${post.title} — ENERGIZE UNILORITE`,
    description: post.summary || post.content.slice(0, 155),
    openGraph: {
      title: post.title,
      description: post.summary || post.content.slice(0, 155),
      images: post.featured_image ? [post.featured_image] : [],
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }) {
  const { data: post } = await supabase.from("posts").select("*").eq("slug", params.slug).eq("status", "published").single();
  if (!post) notFound();

  supabase.from("posts").update({ view_count: (post.view_count || 0) + 1 }).eq("id", post.id).then(() => {});

  const { data: related } = await supabase
    .from("posts").select("id, slug, title, category")
    .eq("category", post.category).eq("status", "published")
    .neq("id", post.id).limit(3);

  return (
    <div className="pb-10">
      {post.featured_image && (
        <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="px-4 pt-4">
        <Link href="/" className="text-xs font-bold text-neutral-500">&larr; Back to Latest News</Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase text-brandDark">{post.category}</span>
          {post.is_demo && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">Demo content</span>}
        </div>
        <h1 className="text-xl font-black tracking-tight text-neutral-900 leading-snug mt-1 mb-2">{post.title}</h1>
        <p className="text-xs text-neutral-500 mb-4 pb-4 border-b border-neutral-100">
          By {post.author} · {new Date(post.published_at || post.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })} · {post.view_count || 0} views
        </p>
        <p className="text-[15px] leading-relaxed text-neutral-800 whitespace-pre-line">{post.content}</p>

        <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-100">
          <ShareLinks title={post.title} />
        </div>

        {related && related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-black text-neutral-900 mb-3">Related Articles</h2>
            <div className="space-y-2">
              {related.map((r) => (
                <Link key={r.id} href={`/article/${r.slug}`} className="block bg-white rounded-xl border border-neutral-200 p-3">
                  <span className="text-[10px] font-bold uppercase text-neutral-400">{r.category}</span>
                  <p className="text-sm font-semibold text-neutral-900">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShareLinks({ title }) {
  const text = encodeURIComponent(title);
  return (
    <>
      <a className="flex-1 text-center py-2.5 rounded-xl bg-brand text-white text-sm font-bold" href={`https://wa.me/?text=${text}`} target="_blank" rel="noreferrer">WhatsApp</a>
      <a className="flex-1 text-center py-2.5 rounded-xl bg-black text-white text-sm font-bold" href={`https://twitter.com/intent/tweet?text=${text}`} target="_blank" rel="noreferrer">X / Twitter</a>
    </>
  );
}
