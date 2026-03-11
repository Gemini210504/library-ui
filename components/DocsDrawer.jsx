"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Book, Users, Search, ShieldCheck, Zap } from "lucide-react";

export default function DocsDrawer({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative h-full w-full max-w-lg border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                    LibSys Docs
                  </h2>
                  <p className="text-xs font-medium text-zinc-500">
                    System Version 1.0.4
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="h-[calc(100vh-100px)] overflow-y-auto p-8">
              <div className="space-y-10">
                {/* Getting Started */}
                <section>
                  <div className="mb-4 flex items-center gap-2 text-indigo-500">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">
                      Getting Started
                    </span>
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Welcome to LibSys
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                    LibSys is a high-performance library management system
                    designed for speed and ease of use. Manage your entire
                    collection, track membership, and monitor borrowing cycles
                    from one centralized command center.
                  </p>
                </section>

                {/* Managing Books */}
                <section className="rounded-[2rem] bg-zinc-50 p-6 dark:bg-zinc-900/50">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50">
                      <Book className="h-5 w-5" />
                    </div>
                    <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-100">
                      Managing Books
                    </h3>
                  </div>
                  <ul className="space-y-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
                      Click &quot;Add New Book&quot; to populate your collection
                      with ISBN validation.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
                      Use the action buttons in the table to edit details or
                      remove books.
                    </li>
                  </ul>
                </section>

                {/* Member Management */}
                <section className="rounded-[2rem] bg-zinc-50 p-6 dark:bg-zinc-900/50">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50">
                      <Users className="h-5 w-5" />
                    </div>
                    <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-100">
                      Member Portal
                    </h3>
                  </div>
                  <p className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Track your library community with ease. Each member profile
                    includes contact info and registration status.
                  </p>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Pro Tip
                    </p>
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      You can search members by phone number or email for quick
                      identification.
                    </p>
                  </div>
                </section>

                {/* Search & Navigation */}
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <Search className="h-5 w-5 text-zinc-400" />
                    <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-100">
                      Optimized Navigation
                    </h3>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Our system uses URL-based state management. This means you
                    can bookmark specific search queries or pages of results and
                    return to them later. The global search bar is debounced to
                    ensure fluid performance while typing.
                  </p>
                </section>
              </div>

              {/* Footer Info */}
              <div className="mt-16 border-t border-zinc-100 pt-8 dark:border-zinc-900">
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                  Designed & Engineered by Antigravity
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
