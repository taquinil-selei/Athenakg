import { Outlet } from "react-router";
import { useEffect } from "react";
import { Toaster } from "./components/ui/sonner";

export default function Root() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
}