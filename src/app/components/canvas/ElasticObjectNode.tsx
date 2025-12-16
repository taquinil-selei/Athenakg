import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { ElasticObject } from "../../types";
import { FileText, Table, Image, ChevronRight, Activity } from "lucide-react";
import { Badge } from "../ui/badge";

interface ElasticObjectNodeData {
  elasticObject: ElasticObject;
}

export const ElasticObjectNode = memo(({ data }: NodeProps<ElasticObjectNodeData>) => {
  const { elasticObject } = data;

  const getIcon = () => {
    switch (elasticObject.type) {
      case "table":
        return <Table className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (elasticObject.type) {
      case "table":
        return "border-blue-500/50 bg-blue-500/5";
      case "image":
        return "border-purple-500/50 bg-purple-500/5";
      case "text":
        return "border-emerald-500/50 bg-emerald-500/5";
      default:
        return "border-zinc-500/50 bg-zinc-500/5";
    }
  };

  const getStatusColor = () => {
    switch (elasticObject.status) {
      case "analyzing":
        return "text-yellow-400";
      case "complete":
        return "text-emerald-400";
      case "error":
        return "text-red-400";
      default:
        return "text-zinc-400";
    }
  };

  return (
    <div className="group relative">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-emerald-500/50" />
      
      <div className={`min-w-[320px] bg-[#1a1a1a] border-2 ${getTypeColor()} rounded-lg shadow-xl transition-all duration-200 hover:shadow-2xl hover:scale-[1.02]`}>
        {/* Header */}
        <div className="p-3 border-b border-[#2a2a2a] bg-gradient-to-r from-[#1a1a1a] to-[#222222]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <div className="mt-0.5 text-zinc-400">{getIcon()}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-zinc-100 truncate">
                  {elasticObject.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500 font-mono">
                    {elasticObject.type.toUpperCase()}
                  </span>
                  <span className="text-zinc-700">•</span>
                  <span className={`text-xs flex items-center gap-1 ${getStatusColor()}`}>
                    {elasticObject.status === "analyzing" && (
                      <Activity className="h-3 w-3 animate-pulse" />
                    )}
                    {elasticObject.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fragments */}
        <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
          {elasticObject.fragments.length === 0 ? (
            <div className="text-xs text-zinc-600 italic text-center py-4">
              No fragments yet
            </div>
          ) : (
            elasticObject.fragments.map((fragment, idx) => (
              <div
                key={fragment.id}
                className="group/fragment bg-[#0f0f0f] border border-[#2a2a2a] rounded p-2 hover:border-emerald-500/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400">
                        F{idx + 1}
                      </span>
                      <span className="text-xs text-zinc-300 truncate">
                        {fragment.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      {fragment.content}
                    </p>
                    {fragment.confidence !== undefined && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all"
                            style={{ width: `${fragment.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono">
                          {(fragment.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-3 w-3 text-zinc-600 group-hover/fragment:text-emerald-500 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-[#2a2a2a] bg-[#151515]">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Badge variant="outline" className="text-[10px] border-[#2a2a2a] text-zinc-500 bg-transparent">
                {elasticObject.fragments.length} fragments
              </Badge>
              {elasticObject.linkedObjects.length > 0 && (
                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500 bg-transparent">
                  {elasticObject.linkedObjects.length} links
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">
              {new Date(elasticObject.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-emerald-500/50" />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/0 via-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none blur-xl" />
    </div>
  );
});

ElasticObjectNode.displayName = "ElasticObjectNode";
