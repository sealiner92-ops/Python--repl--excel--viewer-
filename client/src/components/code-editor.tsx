import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Save, Indent } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export default function CodeEditor({ code, onChange, onExecute, isExecuting }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  const updateLineNumbers = (text: string) => {
    const lines = text.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
  };

  useEffect(() => {
    updateLineNumbers(code);
  }, [code]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      onExecute();
    }
    
    // Handle tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        textarea.setSelectionRange(start + 4, start + 4);
      }, 0);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    onChange(newCode);
  };

  const highlightSyntax = (text: string) => {
    // Basic Python syntax highlighting
    return text
      .replace(/(\b(?:def|class|if|else|elif|for|while|try|except|finally|with|import|from|return|yield|break|continue|pass|lambda|and|or|not|in|is|True|False|None)\b)/g, '<span class="editor-keyword">$1</span>')
      .replace(/(#.*$)/gm, '<span class="editor-comment">$1</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="editor-string">$1$2$1</span>')
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="editor-number">$1</span>');
  };

  return (
    <>
      {/* Editor Header */}
      <div className="bg-[var(--editor-surface)] px-4 py-2 border-b border-[var(--editor-border)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-400 rounded flex items-center justify-center">
            <span className="text-white text-xs">{'</>'}</span>
          </div>
          <span className="text-sm font-medium">Code Editor</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Indent className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Code Input Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex font-mono text-sm">
          {/* Line Numbers */}
          <div className="w-12 bg-[var(--editor-surface)] text-gray-500 select-none pr-4 text-right py-4 border-r border-[var(--editor-border)]">
            {lineNumbers.map((num) => (
              <div key={num} className="leading-6">
                {num}
              </div>
            ))}
          </div>
          
          {/* Code Content */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 w-full h-full p-4 bg-transparent text-[var(--editor-text)] resize-none outline-none font-mono text-sm leading-6 z-10"
              style={{ 
                background: 'transparent',
                color: 'var(--editor-text)',
                caretColor: 'var(--editor-text)'
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              data-gramm="false"
            />
            {/* Syntax highlighting overlay */}
            <div 
              className="absolute inset-0 p-4 font-mono text-sm leading-6 pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
              dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }}
              style={{ 
                color: 'transparent',
                background: 'transparent'
              }}
            />
          </div>
        </div>

        {/* Execution Button */}
        <Button
          onClick={onExecute}
          disabled={isExecuting}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full shadow-lg bg-[var(--python-blue)] hover:bg-blue-600 transition-all transform hover:scale-105"
          size="sm"
        >
          <Play className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Status Bar */}
      <div className="bg-[var(--editor-surface)] px-4 py-2 border-t border-[var(--editor-border)] flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Python 3.11.0</span>
          <span>Line {lineNumbers.length}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={isExecuting ? 'text-yellow-400' : 'text-green-400'}>
            {isExecuting ? 'Executing...' : 'Ready'}
          </span>
          <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">Ctrl+Enter</kbd>
          <span>to run</span>
        </div>
      </div>
    </>
  );
}
