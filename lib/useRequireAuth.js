"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

export function useRequireAuth(requireRole) {
  const router = useRouter();
  const [state, setState] = useState({ user: null, profile: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (cancelled) return;
      if (requireRole && profile?.role !== requireRole) {
        router.replace("/dashboard");
        return;
      }
      setState({ user: session.user, profile, loading: false });
    })();
    return () => { cancelled = true; };
  }, [requireRole, router]);

  return state;
}
