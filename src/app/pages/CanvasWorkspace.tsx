import { useState, useCallback, useRef, DragEvent } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { ElasticObjectNode } from "../components/canvas/ElasticObjectNode";
import { InputPanel } from "../components/canvas/InputPanel";
import { FragmentDetailPanel } from "../components/canvas/FragmentDetailPanel";
import { toast } from "sonner";
import { Upload, FileText, Image as ImageIcon, Table, Sparkles } from "lucide-react";
import { ElasticObject } from "../types";

const nodeTypes = {
  elasticObject: ElasticObjectNode,
};

export function CanvasWorkspace() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showInputPanel, setShowInputPanel] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const files = Array.from(event.dataTransfer.files);
      if (files.length === 0) return;

      files.forEach((file) => {
        processFile(file, event.clientX, event.clientY);
      });
    },
    []
  );

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const processFile = async (file: File, x: number, y: number) => {
    const fileType = detectFileType(file);
    
    toast.promise(
      simulateProcessing(file, fileType),
      {
        loading: `Processing ${file.name}...`,
        success: (elasticObject) => {
          createElasticObjectNode(elasticObject, x, y);
          return `${file.name} processed successfully`;
        },
        error: "Failed to process file",
      }
    );
  };

  const detectFileType = (file: File): "table" | "text" | "image" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.includes("csv") || file.type.includes("excel") || file.type.includes("spreadsheet")) {
      return "table";
    }
    return "text";
  };

  const simulateProcessing = async (
    file: File,
    type: "table" | "text" | "image"
  ): Promise<ElasticObject> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const baseObject: ElasticObject = {
      id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type,
      status: "complete",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inputs: [
        {
          id: `input-${Date.now()}`,
          type: "file",
          name: file.name,
          content: file.name,
          uploadedAt: new Date().toISOString(),
        },
      ],
      fragments: [],
      linkedObjects: [],
    };

    // Generate mock fragments based on type
    if (type === "table") {
      baseObject.fragments = [
        {
          id: `frag-${Date.now()}-1`,
          label: "ID Column",
          type: "field",
          content: "Integer primary key (1-100)",
          source: "ai",
          confidence: 0.95,
          explanation: "Detected as unique identifier column",
          linkedTo: [],
          metadata: { dataType: "integer", nullable: "false" },
          evidenceSource: "Column header and data pattern analysis",
        },
        {
          id: `frag-${Date.now()}-2`,
          label: "Name Column",
          type: "field",
          content: "Text field with customer names",
          source: "ai",
          confidence: 0.92,
          explanation: "Contains alphabetic strings",
          linkedTo: [],
          metadata: { dataType: "varchar", maxLength: "255" },
          evidenceSource: "Data type inference",
        },
        {
          id: `frag-${Date.now()}-3`,
          label: "Amount Column",
          type: "field",
          content: "Decimal values (currency)",
          source: "ai",
          confidence: 0.88,
          explanation: "Numeric values with 2 decimal places",
          linkedTo: [],
          metadata: { dataType: "decimal", precision: "10,2" },
          evidenceSource: "Pattern matching",
        },
        {
          id: `frag-${Date.now()}-4`,
          label: "Date Column",
          type: "field",
          content: "ISO date format (YYYY-MM-DD)",
          source: "ai",
          confidence: 0.97,
          explanation: "Standard date format detected",
          linkedTo: [],
          metadata: { dataType: "date", format: "ISO8601" },
          evidenceSource: "Format validation",
        },
      ];
    } else if (type === "text") {
      baseObject.fragments = [
        {
          id: `frag-${Date.now()}-1`,
          label: "Introduction",
          type: "paragraph",
          content: "Opening section providing context and overview",
          source: "ai",
          confidence: 0.91,
          explanation: "Identified as introductory paragraph",
          linkedTo: [],
          metadata: { section: "intro", wordCount: "120" },
          evidenceSource: "Structural analysis",
        },
        {
          id: `frag-${Date.now()}-2`,
          label: "Key Concept: Data Flow",
          type: "element",
          content: "Description of how data moves through the system",
          source: "ai",
          confidence: 0.89,
          explanation: "Core concept extracted from content",
          linkedTo: [],
          metadata: { importance: "high", references: "3" },
          evidenceSource: "Semantic analysis",
        },
        {
          id: `frag-${Date.now()}-3`,
          label: "Requirements Section",
          type: "paragraph",
          content: "List of system requirements and prerequisites",
          source: "ai",
          confidence: 0.93,
          explanation: "Structured list of requirements",
          linkedTo: [],
          metadata: { section: "requirements", items: "7" },
          evidenceSource: "Document structure",
        },
      ];
    } else if (type === "image") {
      baseObject.fragments = [
        {
          id: `frag-${Date.now()}-1`,
          label: "Visual Element",
          type: "element",
          content: "Diagram or illustration detected",
          source: "ai",
          confidence: 0.85,
          explanation: "Image contains structured visual information",
          linkedTo: [],
          metadata: { format: "diagram", elements: "5" },
          evidenceSource: "Computer vision analysis",
        },
      ];
    }

    return baseObject;
  };

  const createElasticObjectNode = (
    elasticObject: ElasticObject,
    x: number,
    y: number
  ) => {
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    const position = {
      x: x - (bounds?.left || 0) - 200,
      y: y - (bounds?.top || 0) - 100,
    };

    const newNode: Node = {
      id: elasticObject.id,
      type: "elasticObject",
      position,
      data: { elasticObject },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const handleTextInput = (text: string, sourceName: string) => {
    const mockFile = new File([text], sourceName, { type: "text/plain" });
    processFile(mockFile, window.innerWidth / 2, window.innerHeight / 2);
  };

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const createSampleData = () => {
    const sampleText = `# Sample Document

## Introduction
This document provides an overview of the system requirements and key concepts for a data flow management system.

## Key Concept: Data Flow
Data flow management involves the movement of data through various stages of a system, ensuring that data is processed and stored efficiently.

## Requirements Section
1. **Data Storage**: The system should support various data storage solutions.
2. **Data Processing**: Efficient data processing algorithms are required.
3. **Security**: Data security measures must be in place to protect sensitive information.
4. **Scalability**: The system should be scalable to handle increasing data volumes.
5. **User Interface**: A user-friendly interface is essential for ease of use.
6. **Integration**: The system should integrate with existing tools and platforms.
7. **Performance**: High performance is crucial for real-time data processing.

## Conclusion
This document outlines the essential requirements and concepts for a robust data flow management system.`;

    const mockFile = new File([sampleText], "sample_document.txt", { type: "text/plain" });
    processFile(mockFile, window.innerWidth / 2, window.innerHeight / 2);
  };

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] overflow-hidden">
      <div
        ref={reactFlowWrapper}
        className="w-full h-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0a0a0a]"
        >
          <Background
            color="#1a1a1a"
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1}
          />
          <Controls className="bg-[#1a1a1a] border-[#2a2a2a]" />
          <MiniMap
            className="bg-[#1a1a1a] border border-[#2a2a2a]"
            nodeColor="#2a2a2a"
            maskColor="rgba(0, 0, 0, 0.7)"
          />
          
          <Panel position="top-left" className="m-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500/50 animate-pulse" />
                <span className="text-sm text-zinc-400 font-mono">ATHENA KNOWLEDGE GRAPH</span>
              </div>
              
              <button
                onClick={() => setShowInputPanel(!showInputPanel)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333333] text-zinc-300 rounded transition-colors text-sm"
              >
                <Upload className="h-4 w-4" />
                Add Input
              </button>
              
              <button
                onClick={createSampleData}
                className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded transition-colors text-sm"
              >
                <Sparkles className="h-4 w-4" />
                Load Example
              </button>
              
              <div className="text-xs text-zinc-500 pt-2 border-t border-[#2a2a2a] space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span>Text Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Table className="h-3 w-3" />
                  <span>Data Tables</span>
                </div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-3 w-3" />
                  <span>Screenshots</span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel position="top-center" className="m-4">
            <div className="bg-[#1a1a1a]/90 border border-emerald-500/20 rounded-lg px-4 py-2">
              <p className="text-xs text-zinc-400">
                Drag & drop files or use <kbd className="px-1.5 py-0.5 bg-[#2a2a2a] rounded text-emerald-400 mx-1">Add Input</kbd> to create elastic objects
              </p>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {showInputPanel && (
        <InputPanel
          onClose={() => setShowInputPanel(false)}
          onTextSubmit={handleTextInput}
          onFileUpload={(file) => processFile(file, window.innerWidth / 2, window.innerHeight / 2)}
        />
      )}

      {selectedNode && (
        <FragmentDetailPanel
          nodeId={selectedNode}
          nodes={nodes}
          onClose={() => setSelectedNode(null)}
          onUpdateNode={(updatedNode) => {
            setNodes((nds) =>
              nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
            );
          }}
        />
      )}
    </div>
  );
}