'use client';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200/60 bg-white/50 px-10 py-8 dark:border-zinc-800/60 dark:bg-zinc-950/50">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} LibraSys. Modern Library Management System.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">Privacy Policy</a>
          <a href="#" className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">Terms of Service</a>
          <a href="#" className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}
