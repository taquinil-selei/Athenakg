export type ObjectType = "document" | "table" | "schema" | "text" | "image";
export type FragmentType = "field" | "paragraph" | "attribute" | "element";
export type AnalysisSource = "ai" | "manual";
export type MappingStatus = "confirmed" | "suggested" | "conflict" | "unmatched";

export interface ElasticObject {
  id: string;
  name: string;
  type: ObjectType;
  status: "active" | "analyzing" | "complete" | "error";
  createdAt: string;
  updatedAt: string;
  inputs: Input[];
  fragments: Fragment[];
  linkedObjects: string[];
}

export interface Input {
  id: string;
  type: "file" | "text" | "url";
  name: string;
  content: string;
  uploadedAt: string;
}

export interface Fragment {
  id: string;
  label: string;
  type: FragmentType;
  content: string;
  source: AnalysisSource;
  confidence?: number;
  explanation?: string;
  linkedTo: string[];
  metadata: Record<string, string>;
  evidenceSource: string;
}

export interface Mapping {
  id: string;
  fromFragmentId: string;
  toFragmentId: string;
  status: MappingStatus;
  confidence?: number;
  explanation?: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  type: "create" | "analysis" | "version" | "change";
  timestamp: string;
  description: string;
  reason?: string;
  changes?: {
    added: string[];
    removed: string[];
    renamed: Array<{ from: string; to: string }>;
  };
}
