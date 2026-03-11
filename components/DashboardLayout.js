"use client";

import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastProvider } from "./ToastProvider";

export default function DashboardLayout({ children, title }) {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-black">
        <Sidebar />
        <div className="ml-72 flex flex-1 flex-col overflow-hidden">
          {/* <Navbar title={title} /> */}
          <main className="flex-1  p-10">{children}</main>
          {/* <Footer /> */}
        </div>
      </div>
    </ToastProvider>
  );
}
