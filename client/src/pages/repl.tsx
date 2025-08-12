import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "@/components/code-editor";
import OutputPanel from "@/components/output-panel";
import MobileRepl from "@/components/mobile-repl";
import { Button } from "@/components/ui/button";
import { Trash2, Settings, Play } from "lucide-react";
import type { Session, Execution } from "@shared/schema";

export default function ReplPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [code, setCode] = useState("# Welcome to Python REPL\n# Type your Python code and press Ctrl+Enter to execute\n\nprint('Hello, World!')");
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Create session on mount
  const { mutate: createSession, isPending: isCreatingSession } = useMutation({
    mutationFn: async (): Promise<Session> => {
      const res = await apiRequest("POST", "/api/sessions");
      return res.json();
    },
    onSuccess: (session) => {
      setSessionId(session.id);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create session",
      });
    },
  });

  // Fetch executions for current session
  const { data: executions = [], isLoading: isLoadingExecutions, refetch: refetchExecutions } = useQuery({
    queryKey: ["/api/sessions", sessionId, "executions"],
    enabled: !!sessionId,
  });

  // Execute code mutation
  const { mutate: executeCode, isPending: isExecuting } = useMutation({
    mutationFn: async (codeToExecute: string): Promise<Execution> => {
      const res = await apiRequest("POST", `/api/sessions/${sessionId}/execute`, {
        code: codeToExecute,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "executions"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to execute code",
      });
    },
  });

  const handleExecuteCode = () => {
    if (!sessionId || !code.trim()) return;
    executeCode(code);
  };

  const handleClearHistory = () => {
    // Create a new session to clear history
    createSession();
  };

  useEffect(() => {
    createSession();
  }, []);

  if (isMobile) {
    return (
      <MobileRepl
        code={code}
        onCodeChange={setCode}
        executions={executions}
        isExecuting={isExecuting}
        onExecute={handleExecuteCode}
        isLoading={isLoadingExecutions}
      />
    );
  }

  return (
    <div className="h-screen bg-[var(--editor-bg)] text-[var(--editor-text)] overflow-hidden">
      {/* Header */}
      <header className="bg-[var(--editor-surface)] border-b border-[var(--editor-border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-[var(--python-blue)] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">Py</span>
            </div>
            <h1 className="text-lg font-semibold">Python REPL</h1>
          </div>
          <div className="text-sm text-gray-400">Interactive Python Environment</div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              isExecuting ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <span>{isExecuting ? 'Executing...' : 'Ready'}</span>
          </div>
          
          <Button
            variant="secondary" 
            size="sm"
            onClick={handleClearHistory}
            disabled={isCreatingSession}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
          
          <Button variant="secondary" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-full" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Code Editor */}
        <div className="flex-1 flex flex-col border-r border-[var(--editor-border)]">
          <CodeEditor
            code={code}
            onChange={setCode}
            onExecute={handleExecuteCode}
            isExecuting={isExecuting}
          />
        </div>

        {/* Output Panel */}
        <div className="w-1/2">
          <OutputPanel
            executions={executions}
            isLoading={isLoadingExecutions}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
}
