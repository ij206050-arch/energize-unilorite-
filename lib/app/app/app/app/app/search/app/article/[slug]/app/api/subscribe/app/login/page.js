"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { setError(signInError.message); setLoading(false); return; }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    setLoading(false);
    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="px-4 pt-10 max-w-sm mx-auto">
      <h1 className="text-xl font-black text-neutral-900 mb-1">Log in</h1>
      <p className="text-xs text-neutral-500 mb-6">Students and admins both sign in here — you'll land on the right dashboard automatically.</p>
      {error && <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none" />
        <button disabled={loading} className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm disabled:opacity-60">
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>
      <p className="text-xs text-neutral-500 mt-4">
        No account? <a href="/register" className="font-bold text-brandDark">Register</a>
      </p>
    </div>
  );
}
