import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Briefcase, Plus, Search, CheckCircle2, XCircle, Pencil } from "lucide-react";

type Props = {
  searchParams?: { q?: string; status?: string };
};

function badge(isActive: boolean) {
  return isActive ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
      <CheckCircle2 size={14} /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
      <XCircle size={14} /> Draft
    </span>
  );
}

export default async function AdminOpportunities({ searchParams }: Props) {
  const { supabase } = await requireAdmin();

  const q = (searchParams?.q || "").trim();
  const status = (searchParams?.status || "all").trim(); // all | active | draft

  let query = supabase
    .from("jobs")
    .select("id,title,company,is_active,updated_at,created_at")
    .order("updated_at", { ascending: false });

  if (q) {
    // Search title/company (simple, works well enough)
    query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%`);
  }
  if (status === "active") query = query.eq("is_active", true);
  if (status === "draft") query = query.eq("is_active", false);

  const { data, error } = await query;

  if (error) return <div className="p-8">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Admin</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Opportunities</h1>
              <p className="text-slate-600 mt-1">
                Create, publish, and manage job opportunities shown to users.
              </p>
            </div>

            <Link
              href="/admin/opportunities/new"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-white font-black text-sm hover:bg-slate-800 transition"
            >
              <Plus size={18} />
              New Opportunity
            </Link>
          </div>
        </div>

        {/* Filters */}
        <form className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search title or company…"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-yellow-500"
            />
          </div>

          <select
            name="status"
            defaultValue={status}
            className="px-4 py-3 rounded-2xl border border-slate-200 bg-white font-black text-sm text-slate-700 outline-none focus:border-yellow-500"
          >
            <option value="all">All</option>
            <option value="active">Active (Published)</option>
            <option value="draft">Draft (Hidden)</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-yellow-500 px-5 py-3 font-black text-slate-900 hover:bg-yellow-400 transition"
          >
            Apply
          </button>
          <Link
            href="/admin/opportunities"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 hover:border-yellow-400 transition text-center"
          >
            Reset
          </Link>
        </form>

        {/* List */}
        <div className="mt-6 rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-white">
            <div className="grid grid-cols-12 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="col-span-5">Role</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {(data || []).map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-12 px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition"
              >
                <div className="col-span-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-slate-900 text-yellow-500 flex items-center justify-center">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 leading-tight">{row.title}</p>
                      <p className="text-xs font-bold text-slate-500">
                        Updated {new Date(row.updated_at || row.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-3 flex items-center">
                  <p className="font-bold text-slate-700">{row.company}</p>
                </div>

                <div className="col-span-2 flex items-center">{badge(!!row.is_active)}</div>

                <div className="col-span-2 flex items-center justify-end">
                  <Link
                    href={`/admin/opportunities/${row.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:border-yellow-400 transition"
                  >
                    <Pencil size={16} /> Edit
                  </Link>
                </div>
              </div>
            ))}

            {(!data || data.length === 0) && (
              <div className="p-10 text-center">
                <p className="text-slate-900 font-black text-lg">No opportunities found.</p>
                <p className="text-slate-600 font-medium mt-1">
                  Create your first listing to make the platform feel alive.
                </p>
                <Link
                  href="/admin/opportunities/new"
                  className="inline-flex items-center gap-2 mt-6 rounded-full bg-slate-900 px-6 py-3 text-white font-black hover:bg-slate-800 transition"
                >
                  <Plus size={18} /> New Opportunity
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
