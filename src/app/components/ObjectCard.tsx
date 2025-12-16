import { Link } from "react-router";
import { ElasticObject } from "../types";
import { Database, FileText, Table, Type, Image, Link as LinkIcon } from "lucide-react";
import { motion } from "motion/react";

interface ObjectCardProps {
  object: ElasticObject;
}

export default function ObjectCard({ object }: ObjectCardProps) {
  const getIcon = () => {
    switch (object.type) {
      case "schema":
        return Database;
      case "document":
        return FileText;
      case "table":
        return Table;
      case "text":
        return Type;
      case "image":
        return Image;
    }
  };

  const getStatusColor = () => {
    switch (object.status) {
      case "active":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "analyzing":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "complete":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "error":
        return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#161b22] border border-gray-800 rounded-lg hover:border-cyan-500/30 transition-all duration-200 group"
    >
      <Link to={`/object/${object.id}`} className="block p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm text-gray-100 group-hover:text-cyan-400 transition-colors truncate">
                {object.name}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded border font-mono whitespace-nowrap ${getStatusColor()}`}
              >
                {object.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
              <span>{object.type}</span>
              <span>•</span>
              <span>{object.fragments.length} fragments</span>
              {object.linkedObjects.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" />
                    {object.linkedObjects.length}
                  </span>
                </>
              )}
            </div>

            <div className="mt-2 text-xs text-gray-600 font-mono">
              {new Date(object.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
