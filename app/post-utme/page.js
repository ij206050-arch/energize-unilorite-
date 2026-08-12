import { supabase } from "../../lib/supabase";

export const revalidate = 30;
export const metadata = { title: "2026/2027 Post-UTME — ENERGIZE UNILORITE" };

const SECTIONS = ["Important Dates","Requirements","Application Information","Screening Information","Examination Schedule","FAQ"];

export default async function PostUtmePage() {
  const { data: items } = await supabase.from("post_utme").select("*").order("created_at", { ascending: false });

  return (
    <div className="px-4 pt-4 pb-8">
      <div className="rounded-2xl p-5 mb-5 bg-black">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">UNILORIN</span>
        <h1 className="text-xl font-black text-white mt-1">2026/2027 Post-UTME</h1>
        <p className="text-xs text-white/60 mt-1">Always confirm against the official admissions portal.</p>
      </div>
      {SECTIONS.map((sec) => {
        const entries = (items || []).filter((i) => i.section === sec);
        if (entries.length === 0) return null;
        return (
          <div key={sec} className="mb-5">
            <h2 className="text-[15px] font-black text-neutral-900 mb-3">{sec}</h2>
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e.id} className="bg-white rounded-2xl border border-neutral-200 p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="font-bold text-sm text-neutral-900">{e.title}</p>
                    {e.is_demo && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">Demo</span>}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{e.body}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
