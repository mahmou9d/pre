"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";


interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const AdminHeader = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  return (
    <header className="h-20 bg-[#1a1d29] border-b border-white/5 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 max-w-2xl">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-xl hover:bg-white/5 shrink-0 flex md:hidden"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-gray-400" />
          ) : (
            <Menu className="w-5 h-5 text-gray-400" />
          )}
        </motion.button>
      </div>
      <Link
        href="/"
        className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        الصفحة الرئيسية
      </Link>
      <div className="flex items-center gap-3 hidden md:flex" />
    </header>
  );
};
