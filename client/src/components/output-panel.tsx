import { Button } from "@/components/ui/button";
import { Copy, Download, Eraser, Terminal, PlayCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Execution } from "@shared/schema";

interface OutputPanelProps {
  executions: Execution[];
  isLoading: boolean;
  onClearHistory: () => void;
}

export default function OutputPanel({ executions, isLoading, onClearHistory }: OutputPanelProps) {
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const quickActions = [
    "import math",
    "for i in range(10):",
    "def function():",
    "try:\n    pass\nexcept:",
  ];

  const copyOutput = () => {
    const output = executions
      .map((exec, i) => `# Execution ${i + 1}\n${exec.code}\n# Output:\n${exec.output || exec.error || 'No output'}`)
      .join('\n\n');
    navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    const output = executions
      .map((exec, i) => `# Execution ${i + 1} - ${formatTimestamp(exec.executedAt)}\n${exec.code}\n# Output:\n${exec.output || exec.error || 'No output'}`)
      .join('\n\n');
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python-repl-output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--editor-bg)]">
      {/* Output Header */}
      <div className="bg-[var(--editor-surface)] px-4 py-2 border-b border-[var(--editor-border)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">Output</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onClearHistory}>
            <Eraser className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={copyOutput}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadOutput}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-48 bg-[var(--editor-surface)]" />
                <Skeleton className="h-20 w-full bg-[var(--editor-surface)]" />
              </div>
            ))}
          </div>
        ) : executions.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No executions yet</p>
            <p className="text-sm">Run some Python code to see the output here</p>
          </div>
        ) : (
          executions.map((execution, index) => (
            <div key={execution.id} className="mb-4">
              <div className="text-gray-400 text-xs mb-1 flex items-center">
                {execution.isError ? (
                  <AlertCircle className="w-3 h-3 text-red-400 mr-1" />
                ) : (
                  <PlayCircle className="w-3 h-3 mr-1" />
                )}
                Execution #{index + 1} - {formatTimestamp(execution.executedAt)}
              </div>
              <div className={`bg-[var(--editor-surface)] rounded-lg p-3 border ${
                execution.isError ? 'border-red-500/30' : 'border-[var(--editor-border)]'
              }`}>
                <div className="text-gray-300 mb-2">
                  <span className="text-[var(--python-blue)]">In [{index + 1}]:</span>{' '}
                  <div className="mt-1 whitespace-pre-wrap break-words">{execution.code}</div>
                </div>
                {execution.output && (
                  <div className="text-white">
                    <span className="text-green-400">Out[{index + 1}]:</span>{' '}
                    <div className="mt-1 whitespace-pre-wrap break-words">{execution.output}</div>
                  </div>
                )}
                {execution.error && (
                  <div className="text-red-400">
                    <span className="text-red-500">Error:</span>{' '}
                    <div className="mt-1 whitespace-pre-wrap break-words text-sm">{execution.error}</div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--editor-surface)] border-t border-[var(--editor-border)] p-3">
        <div className="text-xs text-gray-400 mb-2">Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action}
              variant="secondary"
              size="sm"
              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 border-none"
            >
              {action.split('\n')[0]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
