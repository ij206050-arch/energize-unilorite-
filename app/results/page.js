import { supabase } from "../../lib/supabase";

export const revalidate = 30;

export default async function ResultsPage({ searchParams }) {
  const q = searchParams?.q || "";
  let query = supabase.from("result_updates").select("*").order("created_at", { ascending: false });
  if (q) query = query.ilike("course_code", `%${q}%`);
  const { data: results } = await query;

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-xl font-black text-neutral-900 mb-1">Result Updates</h1>
      <p className="text-xs text-neutral-500 mb-3">Announcements only — not an official result printout.</p>
      <form action="/results" method="get" className="mb-4">
        <input name="q" defaultValue={q} placeholder="Search by course code…" className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 text-sm outline-none" />
      </form>
      <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 px-4">
        {(results || []).length === 0 ? <p className="text-sm text-neutral-400 py-10 text-center">No matching result updates.</p> : results.map((r) => (
          <div key={r.id} className="flex gap-3 py-3">
            <div className="shrink-0 w-14 h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold text-white bg-black">{r.course_code}</div>
            <div>
              <p className="font-semibold text-sm text-neutral-900">{r.title}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">{r.session} · {r.semester}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
