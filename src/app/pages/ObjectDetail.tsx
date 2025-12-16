import { useParams, Link } from "react-router";
import { mockObjects, mockHistory } from "../data/mockData";
import { ArrowLeft, FileText, Link as LinkIcon, History, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import FragmentList from "../components/FragmentList";
import TimelineView from "../components/TimelineView";

export default function ObjectDetail() {
  const { id } = useParams<{ id: string }>();
  const object = mockObjects.find((obj) => obj.id === id);
  const history = id ? mockHistory[id] || [] : [];

  if (!object) {
    return (
      <div className="p-8">
        <div className="text-center py-16">
          <p className="text-gray-500">Object not found</p>
          <Link
            to="/"
            className="text-cyan-400 hover:text-cyan-300 text-sm mt-2 inline-block"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl mb-2 tracking-tight">{object.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-mono">
              <span className="text-cyan-400">{object.type}</span>
              <span>•</span>
              <span>{object.id}</span>
              <span>•</span>
              <span>Updated {new Date(object.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {object.linkedObjects.length > 0 && (
            <div className="px-4 py-2 bg-[#161b22] border border-cyan-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-cyan-400">
                <LinkIcon className="w-4 h-4" />
                <span>{object.linkedObjects.length} linked objects</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="inputs" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="inputs">
            <FileText className="w-4 h-4 mr-2" />
            Inputs
          </TabsTrigger>
          <TabsTrigger value="decomposition">
            <Eye className="w-4 h-4 mr-2" />
            Decomposition
          </TabsTrigger>
          <TabsTrigger value="fragments">
            Fragments ({object.fragments.length})
          </TabsTrigger>
          <TabsTrigger value="links">
            <LinkIcon className="w-4 h-4 mr-2" />
            Links
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inputs" className="mt-0">
          <div className="space-y-4">
            {object.inputs.map((input) => (
              <div
                key={input.id}
                className="bg-[#161b22] border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm text-gray-100 mb-1">{input.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">
                      {input.type} • {new Date(input.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="bg-[#0d1117] border border-gray-800 rounded p-3 font-mono text-xs text-gray-400 overflow-x-auto">
                  <pre>{input.content}</pre>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="decomposition" className="mt-0">
          <div className="bg-[#161b22] border border-gray-800 rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-sm text-gray-100 mb-2">Analysis Status</h3>
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded border text-xs font-mono ${
                    object.status === "complete"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : object.status === "analyzing"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}
                >
                  {object.status}
                </div>
                <span className="text-xs text-gray-500">
                  {object.fragments.length} fragments extracted
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0d1117] border border-gray-800 rounded p-4">
                <div className="text-xs text-gray-500 mb-2 font-mono">
                  AI Generated
                </div>
                <div className="text-2xl text-purple-400">
                  {object.fragments.filter((f) => f.source === "ai").length}
                </div>
              </div>
              <div className="bg-[#0d1117] border border-gray-800 rounded p-4">
                <div className="text-xs text-gray-500 mb-2 font-mono">
                  Manual
                </div>
                <div className="text-2xl text-cyan-400">
                  {object.fragments.filter((f) => f.source === "manual").length}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fragments" className="mt-0">
          <FragmentList fragments={object.fragments} />
        </TabsContent>

        <TabsContent value="links" className="mt-0">
          <div className="bg-[#161b22] border border-gray-800 rounded-lg p-6">
            {object.linkedObjects.length > 0 ? (
              <div className="space-y-3">
                {object.linkedObjects.map((linkedId) => {
                  const linkedObject = mockObjects.find((o) => o.id === linkedId);
                  return linkedObject ? (
                    <Link
                      key={linkedId}
                      to={`/object/${linkedId}`}
                      className="block p-3 bg-[#0d1117] border border-gray-800 rounded hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm text-gray-100 mb-1">
                            {linkedObject.name}
                          </h4>
                          <p className="text-xs text-gray-500 font-mono">
                            {linkedObject.type}
                          </p>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-gray-600 rotate-180" />
                      </div>
                    </Link>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No linked objects
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <TimelineView entries={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
