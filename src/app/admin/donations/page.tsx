import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarChart3, HeartHandshake, Percent, Plus, Trash2 } from "lucide-react";

export default async function AdminDonationsPage() {
  const { supabase, user } = await requireAdmin();

  // Stats
  const { data: paidDonations } = await supabase
    .from("donations")
    .select("amount, created_at")
    .order("created_at", { ascending: false });

  const totalRaised = (paidDonations || []).reduce((sum, d: any) => sum + Number(d.amount || 0), 0);
  const donationCount = (paidDonations || []).length;

  // Recent list
  const { data: recent } = await supabase
    .from("donations")
    .select("id, donor_name, amount, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  // Allocation + Updates
  const { data: allocation } = await supabase
    .from("donation_allocation")
    .select("category, percent, active, updated_at")
    .order("percent", { ascending: false });

  const { data: updates } = await supabase
    .from("donation_updates")
    .select("id, title, category, amount_spent, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  async function addUpdate(formData: FormData) {
    "use server";
    const { supabase, user } = await requireAdmin();
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "General").trim();
    const amount_spent = Number(formData.get("amount_spent") || 0);

    if (!title) throw new Error("Title is required");

    const { error } = await supabase.from("donation_updates").insert({
      title,
      description: description || null,
      category,
      amount_spent: Number.isFinite(amount_spent) ? amount_spent : 0,
      created_by: user.id,
    });

    if (error) throw new Error(error.message);
    redirect("/admin/donations");
  }

  async function deleteUpdate(formData: FormData) {
    "use server";
    const { supabase } = await requireAdmin();
    const id = String(formData.get("id") || "");
    if (!id) return;

    const { error } = await supabase.from("donation_updates").delete().eq("id", id);
    if (error) throw new Error(error.message);
    redirect("/admin/donations");
  }

  async function saveAllocation(formData: FormData) {
    "use server";
    const { supabase } = await requireAdmin();

    // Expect fields: percent_<category>
    const { data: rows } = await supabase.from("donation_allocation").select("category");
    const cats = (rows || []).map((r: any) => String(r.category));

    const updates = cats.map((cat) => {
      const key = `percent_${cat}`;
      const val = Number(formData.get(key));
      return { category: cat, percent: Number.isFinite(val) ? val : 0, updated_at: new Date().toISOString() };
    });

    // Optional: you may want to validate sum == 100
    const sum = updates.reduce((s, r) => s + r.percent, 0);
    if (sum !== 100) {
      throw new Error(`Allocation must sum to 100 (currently ${sum}).`);
    }

    const { error } = await supabase.from("donation_allocation").upsert(updates, { onConflict: "category" });
    if (error) throw new Error(error.message);

    redirect("/admin/donations");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-2">Donations & Impact</h1>
        <p className="text-slate-600 mt-1 max-w-2xl">
          Track donations, update how funds were used, and keep your public numbers honest.
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-slate-900 text-yellow-500 flex items-center justify-center">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Raised</p>
                <p className="text-2xl font-black text-slate-900">E{totalRaised.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-slate-900 text-yellow-500 flex items-center justify-center">
                <HeartHandshake size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Donations</p>
                <p className="text-2xl font-black text-slate-900">{donationCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-slate-900 text-yellow-500 flex items-center justify-center">
                <Percent size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Allocation Rule</p>
                <p className="text-sm font-black text-slate-900">Must sum to 100%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="mt-8 rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Recent Donations
          </div>
          <div className="divide-y divide-slate-100">
            {(recent || []).map((d: any) => (
              <div key={d.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <p className="font-black text-slate-900">{d.donor_name || "Anonymous"}</p>
                  <p className="text-xs font-bold text-slate-500">
                    {new Date(d.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="font-black text-emerald-600">E{Number(d.amount || 0).toFixed(2)}</p>
              </div>
            ))}
            {(!recent || recent.length === 0) && (
              <div className="px-5 py-10 text-center text-slate-600 font-bold">
                No donations recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Allocation editor */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Allocation Bars (Public)</h2>
          <p className="text-sm text-slate-600 mt-1">These percentages drive the “Resource Allocation” section on /donate.</p>

          <form action={saveAllocation} className="mt-6 space-y-4">
            {(allocation || []).map((a: any) => (
              <div key={a.category} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 font-black text-slate-900">{a.category}</div>
                <div className="md:col-span-3">
                  <input
                    name={`percent_${a.category}`}
                    defaultValue={a.percent}
                    type="number"
                    min={0}
                    max={100}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-yellow-500"
                  />
                </div>
                <div className="md:col-span-4 text-xs font-bold text-slate-500">
                  Updated {new Date(a.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}

            <button className="mt-3 rounded-2xl bg-yellow-500 px-6 py-3 font-black text-slate-900 hover:bg-yellow-400 transition">
              Save Allocation
            </button>
          </form>
        </div>

        {/* Impact updates */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Post an Impact Update</h2>
            <p className="text-sm text-slate-600 mt-1">Explain what donations funded — this builds trust.</p>

            <form action={addUpdate} className="mt-6 space-y-3">
              <input
                name="title"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-yellow-500"
                placeholder="Title (e.g., January Certifications Sponsored)"
                required
              />
              <input
                name="category"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-yellow-500"
                placeholder="Category (e.g., Training / Infrastructure)"
              />
              <input
                name="amount_spent"
                type="number"
                min={0}
                step="0.01"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-yellow-500"
                placeholder="Amount spent (E)"
              />
              <textarea
                name="description"
                className="w-full min-h-[110px] rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-yellow-500"
                placeholder="What was done with the funds?"
              />

              <button className="rounded-2xl bg-slate-900 px-6 py-3 font-black text-white hover:bg-slate-800 transition inline-flex items-center gap-2">
                <Plus size={18} /> Publish Update
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Impact Updates</h2>
            <div className="mt-4 space-y-3">
              {(updates || []).map((u: any) => (
                <div key={u.id} className="rounded-2xl border border-slate-200 p-4 hover:shadow-sm transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">{u.title}</p>
                      <p className="text-xs font-bold text-slate-500">
                        {u.category} • {new Date(u.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-black text-emerald-600 mt-1">
                        E{Number(u.amount_spent || 0).toFixed(2)} spent
                      </p>
                    </div>

                    <form action={deleteUpdate}>
                      <input type="hidden" name="id" value={u.id} />
                      <button className="rounded-2xl border border-slate-200 px-4 py-2 font-black text-slate-700 hover:border-red-300 hover:text-red-600 transition inline-flex items-center gap-2">
                        <Trash2 size={16} /> Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}

              {(!updates || updates.length === 0) && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600 font-bold">
                  No impact updates yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
