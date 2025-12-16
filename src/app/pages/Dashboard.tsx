import { Plus, Search, Filter } from "lucide-react";
import { mockObjects } from "../data/mockData";
import ObjectCard from "../components/ObjectCard";
import { useState } from "react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredObjects = mockObjects.filter((obj) =>
    obj.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl mb-1 tracking-tight">
              Knowledge Objects
            </h1>
            <p className="text-gray-500 text-sm">
              Elastic objects for analysis and mapping
            </p>
          </div>
          <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            New Object
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search objects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#161b22] border border-gray-800 rounded-lg text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <button className="px-4 py-2 bg-[#161b22] border border-gray-800 hover:border-gray-700 rounded-lg flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Objects", value: "4", color: "cyan" },
          { label: "Active", value: "1", color: "blue" },
          { label: "Analyzing", value: "1", color: "yellow" },
          { label: "Complete", value: "2", color: "green" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#161b22] border border-gray-800 rounded-lg p-4"
          >
            <div className="text-xs text-gray-500 mb-1 font-mono">
              {stat.label}
            </div>
            <div className={`text-2xl text-${stat.color}-400`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Objects Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredObjects.map((object) => (
          <ObjectCard key={object.id} object={object} />
        ))}
      </div>

      {filteredObjects.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No objects found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
