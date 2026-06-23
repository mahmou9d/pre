"use client";
import { motion } from "framer-motion";

const IsLoading = () => {
  return (
    <div className="fixed inset-0 bg-[#fafafa] z-[999] flex items-center justify-center">
      <motion.h2
        initial={{ opacity: 0.1, scale: 0.95 }}
        animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.95, 1, 0.95] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-[12vw] font-black uppercase  text-cream italic"
      ></motion.h2>
    </div>
  );
};

export default IsLoading;
