import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Briefcase, GraduationCap, HeartHandshake, BarChart3, ArrowRight } from "lucide-react";

const tiles = [
  {
    title: "Manage Opportunities",
    desc: "Create, edit, and publish job opportunities.",
    href: "/admin/opportunities",
    icon: Briefcase,
  },
  {
    title: "Manage Courses",
    desc: "Update learning resources and course listings.",
    href: "/admin/courses",
    icon: GraduationCap,
  },
  {
    title: "Donations & Impact",
    desc: "Track donations, post updates, and manage impact reporting.",
    href: "/admin/donations",
    icon: HeartHandshake,
  },
  {
    title: "Reports",
    desc: "View platform stats and performance summaries.",
    href: "/admin/reports",
    icon: BarChart3,
  },
];

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Admin
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Manage opportunities, courses, and donations. This area is restricted to administrators.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.title}
                href={t.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <Icon size={20} />
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-slate-300 group-hover:text-yellow-500 transition-colors"
                  />
                </div>

                <div className="mt-4">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {t.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {t.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
            Next steps
          </h3>
          <p className="mt-2 text-slate-700 font-semibold">
            You mentioned donations reporting, real graphs, and admin updates for how funds were used.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            The next best build is <span className="font-bold">/admin/donations</span> to post “impact updates” and drive real dashboard numbers.
          </p>
        </div>
      </div>
    </div>
  );
}
