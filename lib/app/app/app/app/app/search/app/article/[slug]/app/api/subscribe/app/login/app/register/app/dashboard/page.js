"use client";
import { useRequireAuth } from "../../lib/useRequireAuth";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, profile, loading } = useRequireAuth();
  const router = useRouter();

  if (loading) return <div className="px-4 pt-10 text-center text-sm text-neutral-400">Loading…</div>;

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="px-4 pt-6 pb-6">
      <div className="rounded-2xl p-5 mb-6 bg-black text-white">
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg bg-brand mb-3">
          {profile?.name?.[0]?.toUpperCase() || "S"}
        </div>
        <p className="font-bold text-[15px]">{profile?.name}</p>
        <p className="text-xs text-white/60">{user?.email}</p>
      </div>
      {profile?.role === "admin" && (
        <a href="/admin" className="block w-full text-center py-3 rounded-xl bg-brand text-white font-bold text-sm mb-3">Go to Admin Dashboard</a>
      )}
      <button onClick={logout} className="w-full py-3 rounded-xl border border-red-200 text-red-600 font-bold text-sm">Log out</button>
    </div>
  );
}
