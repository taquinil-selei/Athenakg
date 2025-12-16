import { Link, useLocation } from "react-router";
import { Database, GitBranch, Home, Layers, ArrowRight } from "lucide-react";
import { mockObjects } from "../data/mockData";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Database, label: "Objects", path: "/" },
    { icon: GitBranch, label: "Mappings", path: "/" },
    { icon: Layers, label: "Fragments", path: "/" },
  ];

  return (
    <aside className="w-64 bg-[#0d1117] border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-mono text-lg">Α</span>
          </div>
          <div>
            <h1 className="text-xl tracking-tight">Athena</h1>
            <p className="text-xs text-gray-500 font-mono">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1 mb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-800">
          <div className="text-xs text-gray-600 font-mono mb-3 uppercase">
            Quick Actions
          </div>
          <Link
            to={`/mapping/${mockObjects[0].id}/${mockObjects[1].id}`}
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <ArrowRight className="w-3 h-3" />
            View Sample Mapping
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-600 font-mono space-y-1">
          <div className="flex justify-between">
            <span>Objects:</span>
            <span className="text-cyan-400">4</span>
          </div>
          <div className="flex justify-between">
            <span>Fragments:</span>
            <span className="text-cyan-400">7</span>
          </div>
          <div className="flex justify-between">
            <span>Mappings:</span>
            <span className="text-cyan-400">2</span>
          </div>
        </div>
      </div>
    </aside>
  );
}