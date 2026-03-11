'use client';

export default function Navbar({ title = "Dashboard" }) {
  return (
    <nav className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-200/60 bg-white/80 px-10 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80">
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h2>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 px-3 py-1.5 dark:border-zinc-800/50 dark:bg-zinc-900/50">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">API Connected</span>
        </div>

        <button className="relative rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950"></span>
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-900 shadow-inner dark:bg-zinc-900 dark:text-zinc-50">
          JS
        </div>
      </div>
    </nav>
  );
}
