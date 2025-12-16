import { HistoryEntry } from "../types";
import { GitBranch, Sparkles, GitCommit, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface TimelineViewProps {
  entries: HistoryEntry[];
}

export default function TimelineView({ entries }: TimelineViewProps) {
  const getIcon = (type: HistoryEntry["type"]) => {
    switch (type) {
      case "create":
        return Sparkles;
      case "analysis":
        return GitBranch;
      case "version":
        return GitCommit;
      case "change":
        return AlertCircle;
    }
  };

  const getIconColor = (type: HistoryEntry["type"]) => {
    switch (type) {
      case "create":
        return "text-green-400 bg-green-500/10";
      case "analysis":
        return "text-purple-400 bg-purple-500/10";
      case "version":
        return "text-blue-400 bg-blue-500/10";
      case "change":
        return "text-yellow-400 bg-yellow-500/10";
    }
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-lg p-6">
      {entries.length > 0 ? (
        <div className="space-y-6">
          {entries.map((entry, index) => {
            const Icon = getIcon(entry.type);
            const iconColor = getIconColor(entry.type);

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8"
              >
                {/* Timeline Line */}
                {index < entries.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-px bg-gray-800" />
                )}

                {/* Icon */}
                <div
                  className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${iconColor}`}
                >
                  <Icon className="w-3 h-3" />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <p className="text-sm text-gray-100">{entry.description}</p>
                    <span className="text-xs text-gray-600 font-mono whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {entry.reason && (
                    <div className="mt-2 p-2 bg-[#0d1117] border border-gray-800 rounded text-xs text-gray-400">
                      <span className="text-gray-600">Reason: </span>
                      {entry.reason}
                    </div>
                  )}

                  {entry.changes && (
                    <div className="mt-2 space-y-1 text-xs font-mono">
                      {entry.changes.added.length > 0 && (
                        <div className="text-green-400">
                          + {entry.changes.added.join(", ")}
                        </div>
                      )}
                      {entry.changes.removed.length > 0 && (
                        <div className="text-red-400">
                          - {entry.changes.removed.join(", ")}
                        </div>
                      )}
                      {entry.changes.renamed.length > 0 && (
                        <div className="text-yellow-400">
                          {entry.changes.renamed.map((r) => (
                            <div key={r.from}>
                              ~ {r.from} → {r.to}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No history entries
        </div>
      )}
    </div>
  );
}
