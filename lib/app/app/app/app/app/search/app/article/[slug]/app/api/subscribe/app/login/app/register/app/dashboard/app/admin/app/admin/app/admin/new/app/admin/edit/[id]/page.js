"use client";
import { useEffect, useState } from "react";
import { useRequireAuth } from "../../../../lib/useRequireAuth";
import { supabase } from "../../../../lib/supabase";
import ArticleForm from "../../ArticleForm";

export default function EditArticlePage({ params }) {
  const { loading } = useRequireAuth("admin");
  const [post, setPost] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    (async () => {
      const { data } = await supabase.from("posts").select("*").eq("id", params.id).single();
      setPost(data);
      setFetching(false);
    })();
  }, [loading, params.id]);

  if (loading || fetching) return <div className="px-4 pt-10 text-center text-sm text-neutral-400">Loading…</div>;
  if (!post) return <div className="px-4 pt-10 text-center text-sm text-neutral-400">Article not found.</div>;
  return <ArticleForm initial={post} />;
}
