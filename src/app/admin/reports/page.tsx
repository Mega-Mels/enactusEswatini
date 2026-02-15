import { requireAdmin } from "@/lib/auth";
import { BarChart3, Briefcase, GraduationCap, FileCheck2, HeartHandshake } from "lucide-react";

function groupByDay(rows: { created_at: string; amount?: number }[], days: number) {
  const now = new Date();
  const map = new Map<string, number>();

  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, 0);
  }

  rows.forEach((r) => {
    const key = new Date(r.created_at).toISOString().slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) || 0) + Number(r.amount || 1));
  });

  // oldest -> newest
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default async function AdminReportsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: jobs }, { data: courses }, { data: applications }, { data: donations }] =
    await Promise.all([
      supabase.from("jobs").select("id,is_active,created_at"),
      supabase.from("courses").select("id,is_active,created_at"),
      supabase.from("applications").select("id,created_at"),
      supabase.from("donations").select("id,amount,created_at"),
    ]);

  const activeJobs = (jobs || []).filter((j: any) => j.is_active).length;
  const activeCourses = (courses || []).filter((c: any) => c.is_active).length;

  const totalDonations = (donations || []).reduce((s: number, d: any) => s + Number(d.amount || 0), 0);

  const donationBars = groupByDay(
    (donations || []).map((d: any) => ({ created_at: d.created_at, amount: Number(d.amount || 0) })),
    14
  );

  const max = Math.max(1, ...donationBars.map(([, v]) => v));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-2">Reports</h1>
        <p className="text-slate-600 mt-1">Real numbers from your database — no fake charts.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-5">
          <Stat icon={<Briefcase size={18} />} label="Active Jobs" value={activeJobs} />
          <Stat icon={<GraduationCap size={18} />} label="Active Courses" value={activeCourses} />
          <Stat icon={<FileCheck2 size={18} />} label="Applications" value={(applications || []).length} />
          <Stat icon={<HeartHandshake size={18} />} label="Total Donations" value={`E${totalDonations.toFixed(2)}`} />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-slate-900 text-yellow-500 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Donations (Last 14 days)</p>
              <p className="font-black text-slate-900">Daily totals</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-14 gap-2 items-end">
            {donationBars.map(([day, value]) => {
              const h = Math.max(6, Math.round((value / max) * 120));
              return (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-xl bg-yellow-500"
                    style={{ height: `${h}px` }}
                    title={`${day}: E${value.toFixed(2)}`}
                  />
                  <span className="text-[9px] font-black text-slate-400">{day.slice(8, 10)}</span>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs font-bold text-slate-500">
            Tip: hover bars for exact totals.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-slate-900 text-yellow-500 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
          <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
