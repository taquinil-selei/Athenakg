import { Fragment as FragmentType } from "../types";
import { Bot, User, Link, CheckCircle2, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

interface FragmentListProps {
  fragments: FragmentType[];
  onSelect?: (fragment: FragmentType) => void;
  selectedId?: string;
}

export default function FragmentList({
  fragments,
  onSelect,
  selectedId,
}: FragmentListProps) {
  const getFragmentIcon = (type: FragmentType["type"]) => {
    switch (type) {
      case "field":
        return "F";
      case "paragraph":
        return "P";
      case "attribute":
        return "A";
      case "element":
        return "E";
    }
  };

  return (
    <div className="space-y-2">
      {fragments.map((fragment, index) => (
        <motion.div
          key={fragment.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect?.(fragment)}
          className={`bg-[#161b22] border rounded-lg p-3 transition-all duration-200 ${
            selectedId === fragment.id
              ? "border-cyan-500 bg-cyan-500/5"
              : "border-gray-800 hover:border-gray-700"
          } ${onSelect ? "cursor-pointer" : ""}`}
        >
          <div className="flex items-start gap-3">
            {/* Type Badge */}
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center flex-shrink-0 font-mono text-xs text-gray-400">
              {getFragmentIcon(fragment.type)}
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm text-gray-100 font-mono truncate">
                  {fragment.label}
                </h4>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {fragment.source === "ai" ? (
                    <Bot className="w-3 h-3 text-purple-400" />
                  ) : (
                    <User className="w-3 h-3 text-cyan-400" />
                  )}
                  {fragment.linkedTo.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Link className="w-3 h-3" />
                      {fragment.linkedTo.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Preview */}
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                {fragment.content}
              </p>

              {/* AI Confidence & Explanation */}
              {fragment.source === "ai" && fragment.confidence !== undefined && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                        style={{ width: `${fragment.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-500">
                      {Math.round(fragment.confidence * 100)}%
                    </span>
                  </div>
                  {fragment.explanation && (
                    <div className="flex items-start gap-1 text-xs text-gray-500">
                      <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0 text-purple-400" />
                      <span className="line-clamp-1">{fragment.explanation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Fragment Indicator */}
              {fragment.source === "manual" && (
                <div className="flex items-center gap-1 text-xs text-cyan-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Manual verification</span>
                </div>
              )}

              {/* Evidence Source */}
              <div className="mt-2 text-xs text-gray-600 font-mono border-l-2 border-gray-800 pl-2">
                {fragment.evidenceSource}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {fragments.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No fragments found
        </div>
      )}
    </div>
  );
}
