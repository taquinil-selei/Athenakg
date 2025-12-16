import { useState, useRef } from "react";
import { X, Upload, Type, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface InputPanelProps {
  onClose: () => void;
  onTextSubmit: (text: string, sourceName: string) => void;
  onFileUpload: (file: File) => void;
}

export function InputPanel({ onClose, onTextSubmit, onFileUpload }: InputPanelProps) {
  const [text, setText] = useState("");
  const [sourceName, setSourceName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = () => {
    if (text.trim() && sourceName.trim()) {
      onTextSubmit(text, sourceName);
      setText("");
      setSourceName("");
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">Add Input</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Upload files or paste content to create elastic objects
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-[#2a2a2a]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#0f0f0f]">
              <TabsTrigger value="file" className="data-[state=active]:bg-[#2a2a2a]">
                <Upload className="h-4 w-4 mr-2" />
                File Upload
              </TabsTrigger>
              <TabsTrigger value="text" className="data-[state=active]:bg-[#2a2a2a]">
                <Type className="h-4 w-4 mr-2" />
                Text Input
              </TabsTrigger>
              <TabsTrigger value="screenshot" className="data-[state=active]:bg-[#2a2a2a]">
                <ImageIcon className="h-4 w-4 mr-2" />
                Screenshot
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4 mt-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#2a2a2a] rounded-lg p-12 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-[#0f0f0f] transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.gif"
                />
                <Upload className="h-12 w-12 mx-auto text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                <p className="mt-4 text-sm text-zinc-400">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Supported: Documents, Tables, Images
                </p>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="source-name" className="text-zinc-300">
                  Source Name
                </Label>
                <Input
                  id="source-name"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g., Confluence Page, Requirements Doc"
                  className="bg-[#0f0f0f] border-[#2a2a2a] text-zinc-100 placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-content" className="text-zinc-300">
                  Content
                </Label>
                <Textarea
                  id="text-content"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text content here..."
                  rows={10}
                  className="bg-[#0f0f0f] border-[#2a2a2a] text-zinc-100 placeholder:text-zinc-600 font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleTextSubmit}
                disabled={!text.trim() || !sourceName.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Process Text
              </Button>
            </TabsContent>

            <TabsContent value="screenshot" className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg p-12 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-zinc-600" />
                <p className="mt-4 text-sm text-zinc-400">
                  Screenshot support coming soon
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Use File Upload to add image files for now
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
