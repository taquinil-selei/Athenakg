import { useParams, Link } from "react-router";
import { mockObjects, mockMappings } from "../data/mockData";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle, Link as LinkIcon } from "lucide-react";
import { Fragment } from "../types";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion } from "motion/react";

export default function MappingWorkspace() {
  const { fromId, toId } = useParams<{ fromId: string; toId: string }>();
  const fromObject = mockObjects.find((obj) => obj.id === fromId);
  const toObject = mockObjects.find((obj) => obj.id === toId);

  const [mappings, setMappings] = useState(mockMappings);

  if (!fromObject || !toObject) {
    return (
      <div className="p-8">
        <div className="text-center py-16">
          <p className="text-gray-500">Objects not found</p>
          <Link to="/" className="text-cyan-400 text-sm mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getMappingStatus = (fragmentId: string) => {
    return mappings.find(
      (m) => m.fromFragmentId === fragmentId || m.toFragmentId === fragmentId
    );
  };

  const handleDrop = (fromFragId: string, toFragId: string) => {
    const existing = mappings.find(
      (m) => m.fromFragmentId === fromFragId && m.toFragmentId === toFragId
    );
    if (existing) return;

    setMappings([
      ...mappings,
      {
        id: `map_${Date.now()}`,
        fromFragmentId: fromFragId,
        toFragmentId: toFragId,
        status: "suggested",
        confidence: 0.85,
        explanation: "User-created mapping",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl tracking-tight">Mapping Workspace</h1>
          <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm transition-colors">
            Finalize Mapping
          </button>
        </div>

        {/* Object Headers */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-[#161b22] border border-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1 font-mono">Source</div>
            <div className="text-sm text-gray-100">{fromObject.name}</div>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1 font-mono">Target</div>
            <div className="text-sm text-gray-100">{toObject.name}</div>
          </div>
        </div>
      </div>

      {/* Mapping Grid */}
      <div className="flex-1 grid grid-cols-[1fr,400px,1fr] gap-6 overflow-hidden">
        {/* Left: Source Fragments */}
        <div className="bg-[#161b22] border border-gray-800 rounded-lg p-4 overflow-y-auto">
          <h3 className="text-sm text-gray-400 mb-4 font-mono">
            Source Fragments ({fromObject.fragments.length})
          </h3>
          <div className="space-y-2">
            {fromObject.fragments.map((fragment) => (
              <DraggableFragment
                key={fragment.id}
                fragment={fragment}
                mapping={getMappingStatus(fragment.id)}
              />
            ))}
          </div>
        </div>

        {/* Center: Mapping Suggestions */}
        <div className="bg-[#161b22] border border-cyan-500/30 rounded-lg p-4 overflow-y-auto">
          <h3 className="text-sm text-cyan-400 mb-4 font-mono flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Mappings ({mappings.length})
          </h3>
          <div className="space-y-3">
            {mappings.map((mapping) => {
              const fromFrag = fromObject.fragments.find(
                (f) => f.id === mapping.fromFragmentId
              );
              const toFrag = toObject.fragments.find(
                (f) => f.id === mapping.toFragmentId
              );

              if (!fromFrag || !toFrag) return null;

              return (
                <motion.div
                  key={mapping.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`border rounded-lg p-3 ${
                    mapping.status === "confirmed"
                      ? "bg-green-500/5 border-green-500/30"
                      : mapping.status === "conflict"
                      ? "bg-red-500/5 border-red-500/30"
                      : "bg-cyan-500/5 border-cyan-500/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {mapping.status === "confirmed" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : mapping.status === "conflict" ? (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                    )}
                    <span className="text-xs font-mono text-gray-400">
                      {mapping.status}
                    </span>
                    {mapping.confidence && (
                      <span className="text-xs font-mono text-gray-500 ml-auto">
                        {Math.round(mapping.confidence * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs">
                      <div className="text-gray-500 mb-1">Source:</div>
                      <div className="font-mono text-gray-300 truncate">
                        {fromFrag.label}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-3 h-3 text-gray-600" />
                    </div>
                    <div className="text-xs">
                      <div className="text-gray-500 mb-1">Target:</div>
                      <div className="font-mono text-gray-300 truncate">
                        {toFrag.label}
                      </div>
                    </div>
                  </div>

                  {mapping.explanation && (
                    <div className="mt-2 pt-2 border-t border-gray-800 text-xs text-gray-500">
                      {mapping.explanation}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Target Fragments */}
        <div className="bg-[#161b22] border border-gray-800 rounded-lg p-4 overflow-y-auto">
          <h3 className="text-sm text-gray-400 mb-4 font-mono">
            Target Fragments ({toObject.fragments.length})
          </h3>
          <div className="space-y-2">
            {toObject.fragments.map((fragment) => (
              <DroppableFragment
                key={fragment.id}
                fragment={fragment}
                mapping={getMappingStatus(fragment.id)}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Draggable Fragment Component
function DraggableFragment({ fragment, mapping }: { fragment: Fragment; mapping?: any }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "fragment",
    item: { id: fragment.id, label: fragment.label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-[#0d1117] border rounded p-3 cursor-move transition-all ${
        isDragging
          ? "opacity-50 border-cyan-500"
          : mapping
          ? "border-cyan-500/50"
          : "border-gray-800 hover:border-gray-700"
      }`}
    >
      <div className="text-xs font-mono text-gray-100 mb-1">{fragment.label}</div>
      <div className="text-xs text-gray-500 line-clamp-1">{fragment.content}</div>
    </div>
  );
}

// Droppable Fragment Component
function DroppableFragment({
  fragment,
  mapping,
  onDrop,
}: {
  fragment: Fragment;
  mapping?: any;
  onDrop: (from: string, to: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "fragment",
    drop: (item: { id: string; label: string }) => {
      onDrop(item.id, fragment.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`bg-[#0d1117] border rounded p-3 transition-all ${
        isOver
          ? "border-cyan-500 bg-cyan-500/10"
          : mapping
          ? "border-cyan-500/50"
          : "border-gray-800 hover:border-gray-700"
      }`}
    >
      <div className="text-xs font-mono text-gray-100 mb-1">{fragment.label}</div>
      <div className="text-xs text-gray-500 line-clamp-1">{fragment.content}</div>
    </div>
  );
}
