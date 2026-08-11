"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email, password: form.password,
    });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, name: form.name, role: "student" });
    }
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="px-4 pt-10 max-w-sm mx-auto">
      <h1 className="text-xl font-black text-neutral-900 mb-1">Create account</h1>
      <p className="text-xs text-neutral-500 mb-6">For students. Admin accounts are created directly in Supabase.</p>
      {error && <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none" />
        <input required type="password" minLength={6} placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none" />
        <button disabled={loading} className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm disabled:opacity-60">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-xs text-neutral-500 mt-4">
        Already have an account? <a href="/login" className="font-bold text-brandDark">Log in</a>
      </p>
    </div>
  );
}
