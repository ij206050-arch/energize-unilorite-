import { supabase } from "../lib/supabase";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const { data: posts } = await supabase.from("posts").select("slug, updated_at").eq("status", "published");

  const staticRoutes = ["", "/feed", "/results", "/post-utme", "/search"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  const articleRoutes = (posts || []).map((p) => ({
    url: `${base}/article/${p.slug}`,
    lastModified: p.updated_at,
  }));

  return [...staticRoutes, ...articleRoutes];
}
