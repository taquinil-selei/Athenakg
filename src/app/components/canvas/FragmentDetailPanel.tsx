import { useState } from "react";
import { X, Edit, Save, Link as LinkIcon, Sparkles } from "lucide-react";
import { Node } from "reactflow";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ElasticObject, Fragment } from "../../types";

interface FragmentDetailPanelProps {
  nodeId: string;
  nodes: Node[];
  onClose: () => void;
  onUpdateNode: (node: Node) => void;
}

export function FragmentDetailPanel({
  nodeId,
  nodes,
  onClose,
  onUpdateNode,
}: FragmentDetailPanelProps) {
  const node = nodes.find((n) => n.id === nodeId);
  const elasticObject: ElasticObject | undefined = node?.data?.elasticObject;

  const [editingFragmentId, setEditingFragmentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedLabel, setEditedLabel] = useState("");

  if (!node || !elasticObject) {
    return null;
  }

  const startEdit = (fragment: Fragment) => {
    setEditingFragmentId(fragment.id);
    setEditedContent(fragment.content);
    setEditedLabel(fragment.label);
  };

  const saveEdit = (fragmentId: string) => {
    const updatedFragments = elasticObject.fragments.map((f) =>
      f.id === fragmentId
        ? { ...f, content: editedContent, label: editedLabel }
        : f
    );

    const updatedElasticObject = {
      ...elasticObject,
      fragments: updatedFragments,
      updatedAt: new Date().toISOString(),
    };

    onUpdateNode({
      ...node,
      data: { elasticObject: updatedElasticObject },
    });

    setEditingFragmentId(null);
  };

  const cancelEdit = () => {
    setEditingFragmentId(null);
    setEditedContent("");
    setEditedLabel("");
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[480px] bg-[#1a1a1a] border-l border-[#2a2a2a] shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#2a2a2a] bg-gradient-to-r from-[#1a1a1a] to-[#222222]">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium text-zinc-100 truncate">
              {elasticObject.name}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {elasticObject.fragments.length} fragments • {elasticObject.type}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-[#2a2a2a] flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Raw Input Section */}
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Raw Input
            </h3>
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3">
              {elasticObject.inputs.map((input) => (
                <div key={input.id}>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                    <Badge variant="outline" className="text-[10px] border-[#2a2a2a] bg-transparent">
                      {input.type}
                    </Badge>
                    <span className="font-mono">
                      {new Date(input.uploadedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 font-mono">{input.name}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-[#2a2a2a]" />

          {/* Fragments Section */}
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">
              Fragments ({elasticObject.fragments.length})
            </h3>
            <div className="space-y-3">
              {elasticObject.fragments.length === 0 ? (
                <div className="text-sm text-zinc-600 italic text-center py-8">
                  No fragments available
                </div>
              ) : (
                elasticObject.fragments.map((fragment, idx) => (
                  <div
                    key={fragment.id}
                    className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-4 space-y-3"
                  >
                    {editingFragmentId === fragment.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-zinc-400">Label</Label>
                          <Input
                            value={editedLabel}
                            onChange={(e) => setEditedLabel(e.target.value)}
                            className="bg-[#1a1a1a] border-[#2a2a2a] text-zinc-100 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-zinc-400">Content</Label>
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={4}
                            className="bg-[#1a1a1a] border-[#2a2a2a] text-zinc-100 text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit(fragment.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            className="flex-1 border-[#2a2a2a]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                              F{idx + 1}
                            </span>
                            <span className="text-sm font-medium text-zinc-200">
                              {fragment.label}
                            </span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(fragment)}
                            className="h-6 w-6 text-zinc-500 hover:text-emerald-500"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>

                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {fragment.content}
                        </p>

                        {/* Metadata */}
                        <div className="space-y-2 pt-2 border-t border-[#2a2a2a]">
                          {fragment.confidence !== undefined && (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs text-zinc-600">Confidence</span>
                              <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                                <div className="flex-1 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                                    style={{
                                      width: `${fragment.confidence * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-500 font-mono w-10 text-right">
                                  {(fragment.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs text-zinc-600">Type</span>
                            <Badge variant="outline" className="text-[10px] border-[#2a2a2a] bg-transparent">
                              {fragment.type}
                            </Badge>
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs text-zinc-600">Source</span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] border-[#2a2a2a] ${
                                fragment.source === "ai"
                                  ? "text-blue-400 border-blue-500/30"
                                  : "text-purple-400 border-purple-500/30"
                              }`}
                            >
                              {fragment.source}
                            </Badge>
                          </div>

                          {fragment.explanation && (
                            <div className="mt-2 p-2 bg-[#1a1a1a] rounded text-xs text-zinc-500 italic">
                              {fragment.explanation}
                            </div>
                          )}

                          {fragment.linkedTo.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2a2a2a]">
                              <LinkIcon className="h-3 w-3 text-emerald-500" />
                              <span className="text-xs text-emerald-500">
                                {fragment.linkedTo.length} link
                                {fragment.linkedTo.length !== 1 && "s"}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
