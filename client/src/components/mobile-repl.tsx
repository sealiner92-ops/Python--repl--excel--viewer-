import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import type { Execution } from "@shared/schema";

interface MobileReplProps {
  code: string;
  onCodeChange: (code: string) => void;
  executions: Execution[];
  isExecuting: boolean;
  onExecute: () => void;
  isLoading: boolean;
}

export default function MobileRepl({ 
  code, 
  onCodeChange, 
  executions, 
  isExecuting, 
  onExecute,
  isLoading 
}: MobileReplProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor');

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-[var(--editor-bg)] text-[var(--editor-text)] flex flex-col">
      {/* Mobile Header */}
      <header className="bg-[var(--editor-surface)] border-b border-[var(--editor-border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-[var(--python-blue)] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">Py</span>
          </div>
          <h1 className="font-semibold">Python REPL</h1>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setActiveTab(activeTab === 'editor' ? 'output' : 'editor')}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </header>

      {/* Tab Buttons */}
      <div className="bg-[var(--editor-surface)] border-b border-[var(--editor-border)] flex">
        <button 
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'editor' 
              ? 'border-[var(--python-blue)] text-[var(--python-blue)]' 
              : 'border-transparent text-gray-400'
          }`}
          onClick={() => setActiveTab('editor')}
        >
          <span className="mr-2">{'</>'}</span>Editor
        </button>
        <button 
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'output' 
              ? 'border-[var(--python-blue)] text-[var(--python-blue)]' 
              : 'border-transparent text-gray-400'
          }`}
          onClick={() => setActiveTab('output')}
        >
          <span className="mr-2">▶</span>Output
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* Editor Tab */}
        <div className={`h-full ${activeTab === 'editor' ? 'block' : 'hidden'}`}>
          <div className="h-full p-4 font-mono text-sm overflow-auto">
            <textarea
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full h-full bg-transparent text-[var(--editor-text)] resize-none outline-none"
              placeholder="# Type your Python code here..."
              style={{ 
                background: 'transparent',
                color: 'var(--editor-text)',
                caretColor: 'var(--editor-text)'
              }}
              spellCheck={false}
            />
          </div>
          
          {/* Mobile Execute Button */}
          <Button
            onClick={onExecute}
            disabled={isExecuting}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-[var(--python-blue)] hover:bg-blue-600 z-10"
            size="sm"
          >
            <Play className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Output Tab */}
        <div className={`h-full overflow-auto p-4 font-mono text-sm ${activeTab === 'output' ? 'block' : 'hidden'}`}>
          {isLoading ? (
            <div className="text-center text-gray-500 mt-8">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--python-blue)] border-t-transparent rounded-full mx-auto mb-4" />
              <p>Loading...</p>
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg mb-2">No executions yet</p>
              <p className="text-sm">Switch to Editor tab and run some code</p>
            </div>
          ) : (
            executions.map((execution, index) => (
              <div key={execution.id} className="mb-4">
                <div className="text-gray-400 text-xs mb-1">
                  Execution #{index + 1} - {formatTimestamp(execution.executedAt)}
                </div>
                <div className={`bg-[var(--editor-surface)] rounded p-3 border ${
                  execution.isError ? 'border-red-500/30' : 'border-[var(--editor-border)]'
                }`}>
                  <div className="text-[var(--python-blue)] text-sm mb-2">
                    In [{index + 1}]:
                  </div>
                  <div className="text-gray-300 mb-2 text-sm whitespace-pre-wrap">
                    {execution.code}
                  </div>
                  {execution.output && (
                    <div className="text-white text-sm">
                      <div className="text-green-400 mb-1">Out[{index + 1}]:</div>
                      <div className="whitespace-pre-wrap">{execution.output}</div>
                    </div>
                  )}
                  {execution.error && (
                    <div className="text-red-400 text-sm">
                      <div className="text-red-500 mb-1">Error:</div>
                      <div className="whitespace-pre-wrap">{execution.error}</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
