"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles, Layout, Zap } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-indigo-500/40 selection:text-white overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
            x: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px]"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-10 py-8 flex justify-between items-center backdrop-blur-md bg-black/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter">LIBRASYS</span>
        </div>
        <Link href="/dashboard">
          <button className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold text-sm">
            Admin Portal
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-48 pb-32 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl mb-10"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Next-Gen Management System
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-[7.5rem] font-black tracking-tighter leading-[0.9] mb-8"
          >
            MANAGE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400">
              LEGACY.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-zinc-500 text-xl font-medium leading-relaxed mb-12"
          >
            The ultimate companion for modern libraries. Effortlessly track books, 
            members, and borrowing cycles with an interface designed for the future.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white text-black rounded-[2rem] font-black text-lg flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
              >
                Launch Dashboard <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-zinc-900 border border-zinc-800 rounded-[2rem] font-black text-lg text-white hover:bg-zinc-800 transition-all"
            >
              Explore Features
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48"
        >
          <FeatureCard
            icon={<Layout className="text-white" />}
            title="Sleek Dashboard"
            desc="A centralized command center for your entire library ecosystem, optimized for performance."
          />
          <FeatureCard
            icon={<Zap className="text-white" />}
            title="Real-time Inventory"
            desc="Instant updates on book availability, ISBN validation, and seamless collection management."
          />
          <FeatureCard
            icon={<UserGroup className="text-white" />}
            title="Member Portal"
            desc="Comprehensive member profiles with registration workflows and borrowing history tracking."
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 text-center text-zinc-600 text-sm">
        <p>© {new Date().getFullYear()} LibraSys. Engineered for Excellence.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10 }}
      className="p-10 rounded-[3rem] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-2xl relative group transition-all hover:bg-zinc-900/60 hover:border-zinc-700/50"
    >
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-5 h-5 text-zinc-600" />
      </div>
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-white transition-colors group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-md leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

// Simple lucide-react replacements since we might not have all icons
function UserGroup(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
