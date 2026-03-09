import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 max-w-md transition-all">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
          This trip is private. Only the <span className="text-blue-500 font-bold">creator</span> and <span className="text-blue-500 font-bold">collaborators</span> can view these details.
        </p>
        <Link
          href="/"
          className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl text-xs uppercase tracking-widest"
        >
          Back to My Trips
        </Link>
      </div>
    </div>
  );
}