import { motion } from "motion/react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gray-800/50 rounded animate-pulse ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
