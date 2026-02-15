import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { GraduationCap, Plus, Search, BadgeCheck, XCircle, Pencil } from "lucide-react";

type Props = {
  searchParams?: { q?: string; category?: string; active?: string; certified?: string };
};

function chip(text: string, tone: "slate" | "yellow" | "emerald" = "slate") {
  const map = {
    slate: "bg-slate-50 border-slate-200 text-slate-600",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${map[tone]}`}>
      {text}
    </span>
  );
}

export default async function AdminCoursesPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();

  const q = (searchParams?.q || "").trim();
  const category = (searchParams?.category || "").trim();
  const active = (searchParams?.active || "all").trim(); // all | active | inactive
  const certified = (searchParams?.certified || "all").trim(); // all | yes | no

  let query = supabase
    .from("courses")
    .select("id,title,category,is_certified,is_active,updated_at")
    .order("updated_at", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("category", category);
  if (active === "active") query = query.eq("is_active", true);
  if (active === "inactive") query = query.eq("is_active", false);
  if (certified === "yes") query = query.eq("is_certified", true);
  if (certified === "no") query = query.eq("is_certified", false);

  const { data, error } = await query;

  // For category filter dropdown:
  const { data: categories } = await supabase
    .from("courses")
    .select("category")
    .not("category", "is", null);

  const uniqueCategories = Array.from(new Set((categories || []).map((c) => c.category).filter(Boolean))).sort();

  if (error) return <div className="p-8">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Admin</p>
        <div className="flex items-end justify-between gap-4 flex-wrap mt-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Courses</h1>
            <p className="text-slate-600 mt-1">Manage learning resources and visibility.</p>
          </div>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-white font-black text-sm hover:bg-slate-800 transition"
          >
            <Plus size={18} />
            New Course
          </Link>
        </div>

        <form className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search course title…"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-yellow-500"
            />
          </div>

          <select
            name="category"
            defaultValue={category}
            className="md:col-span-3 px-4 py-3 rounded-2xl border border-slate-200 bg-white font-black text-sm text-slate-700 outline-none focus:border-yellow-500"
          >
            <option value="">All categories</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            name="active"
            defaultValue={active}
            className="md:col-span-2 px-4 py-3 rounded-2xl border border-slate-200 bg-white font-black text-sm text-slate-700 outline-none focus:border-yellow-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Hidden</option>
          </select>

          <select
            name="certified"
            defaultValue={certified}
            className="md:col-span-2 px-4 py-3 rounded-2xl border border-slate-200 bg-white font-black text-sm text-slate-700 outline-none focus:border-yellow-500"
          >
            <option value="all">Certified: All</option>
            <option value="yes">Certified: Yes</option>
            <option value="no">Certified: No</option>
          </select>

          <div className="md:col-span-12 flex gap-3">
            <button className="rounded-2xl bg-yellow-500 px-5 py-3 font-black text-slate-900 hover:bg-yellow-400 transition">
              Apply
            </button>
            <Link
              href="/admin/courses"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 hover:border-yellow-400 transition text-center"
            >
              Reset
            </Link>
          </div>
        </form>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(data || []).map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between gap-3">
                <div className="h-11 w-11 rounded-2xl bg-slate-900 text-yellow-500 flex items-center justify-center">
                  <GraduationCap size={18} />
                </div>
                <Link
                  href={`/admin/courses/${c.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:border-yellow-400 transition"
                >
                  <Pencil size={16} /> Edit
                </Link>
              </div>

              <h2 className="mt-4 font-black text-slate-900 tracking-tight">{c.title}</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {c.category ? chip(String(c.category), "slate") : chip("Uncategorized", "slate")}
                {c.is_certified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    <BadgeCheck size={14} /> Certified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <XCircle size={14} /> Not certified
                  </span>
                )}
                {c.is_active ? chip("Active", "yellow") : chip("Hidden", "slate")}
              </div>

              <p className="mt-3 text-xs font-bold text-slate-500">
                Updated {new Date(c.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}

          {(!data || data.length === 0) && (
            <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
              <p className="text-slate-900 font-black text-lg">No courses found.</p>
              <p className="text-slate-600 font-medium mt-1">Add a course to populate the Academy.</p>
              <Link
                href="/admin/courses/new"
                className="inline-flex items-center gap-2 mt-6 rounded-full bg-slate-900 px-6 py-3 text-white font-black hover:bg-slate-800 transition"
              >
                <Plus size={18} /> New Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
