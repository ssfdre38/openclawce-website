import { useEffect, useState, useRef } from 'react';

type LineType =
  | 'command'
  | 'intro'
  | 'prompt-label'
  | 'prompt-input'
  | 'prompt-hint'
  | 'select-label'
  | 'select-option'
  | 'select-option-active'
  | 'select-hint'
  | 'spinner'
  | 'success'
  | 'note-header'
  | 'note-content'
  | 'outro';

interface ScriptLine {
  text: string;
  delay: number;
  type: LineType;
}

// Replicate installing OpenClaw Community Edition
const script: ScriptLine[] = [
  // Initial command with correct repo
  { text: '$ git clone -b discord-fix https://github.com/ssfdre38/openclaw-community-edition.git', delay: 1200, type: 'command' },
  { text: 'Cloning into \'openclaw-community-edition\'...', delay: 300, type: 'success' },
  { text: 'Receiving objects: 100%', delay: 400, type: 'success' },
  { text: '', delay: 200, type: 'command' },

  { text: '$ cd openclaw-community-edition', delay: 600, type: 'command' },
  { text: '', delay: 200, type: 'command' },

  // Intro banner
  { text: '┌  OpenClaw Community Edition', delay: 400, type: 'intro' },
  { text: '│', delay: 100, type: 'prompt-label' },

  // Build the application
  { text: '◇  Installing dependencies...', delay: 400, type: 'select-label' },
  { text: '│', delay: 200, type: 'prompt-label' },
  
  { text: '$ npm install', delay: 800, type: 'command' },
  { text: '◐  Installing packages...', delay: 400, type: 'spinner' },
  { text: '✔  Dependencies installed successfully', delay: 300, type: 'success' },
  { text: '│', delay: 200, type: 'prompt-label' },

  // Configuration prompt
  { text: '◇  Which AI provider would you like to use?', delay: 400, type: 'select-label' },
  { text: '│  ○ OpenAI (GPT-4, GPT-3.5)', delay: 300, type: 'select-option' },
  { text: '│  ○ Anthropic (Claude)', delay: 250, type: 'select-option' },
  { text: '│  ● Ollama (Free, Local)', delay: 600, type: 'select-option-active' },
  { text: '│', delay: 200, type: 'prompt-label' },

  // Model selection
  { text: '◇  Which Ollama model?', delay: 400, type: 'select-label' },
  { text: '│  ● llama3.2 · Fast and capable', delay: 500, type: 'select-option-active' },
  { text: '│', delay: 200, type: 'prompt-label' },

  // Additional features
  { text: '◇  Enable additional features?', delay: 400, type: 'select-label' },
  { text: '│  ● MCP Servers · GitHub, filesystem tools', delay: 400, type: 'select-option-active' },
  { text: '│  ● Browser Relay · Web browsing', delay: 350, type: 'select-option-active' },
  { text: '│  ● Image Generation · SD + SDXL', delay: 350, type: 'select-option-active' },
  { text: '│', delay: 300, type: 'prompt-label' },

  // Setup progress
  { text: '◐  Downloading Ollama models...', delay: 400, type: 'spinner' },
  { text: '✔  Downloaded llama3.2 (4.7GB)', delay: 300, type: 'success' },
  { text: '◐  Configuring MCP servers...', delay: 300, type: 'spinner' },
  { text: '✔  MCP servers ready', delay: 250, type: 'success' },
  { text: '◐  Starting browser relay...', delay: 300, type: 'spinner' },
  { text: '✔  Browser relay on port 8080', delay: 250, type: 'success' },
  { text: '│', delay: 200, type: 'prompt-label' },

  // Next steps note
  { text: '◇  Next steps ─────────────────────╮', delay: 300, type: 'note-header' },
  { text: '│                                  │', delay: 50, type: 'note-content' },
  { text: '│  ./openclaw chat                 │', delay: 100, type: 'note-content' },
  { text: '│  ./openclaw-ui    # Desktop app  │', delay: 100, type: 'note-content' },
  { text: '│                                  │', delay: 50, type: 'note-content' },
  { text: '├──────────────────────────────────╯', delay: 200, type: 'note-content' },
  { text: '│', delay: 100, type: 'prompt-label' },

  // Outro
  { text: '└  Your AI assistant is ready! 🚀', delay: 0, type: 'outro' },
];

export function TerminalDemo() {
  const [lines, setLines] = useState<{ text: string; type: LineType }[]>([]);
  const [_currentIndex, setCurrentIndex] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    const processLine = (index: number) => {
      if (index >= script.length) {
        // Restart after delay
        timeoutIds.push(
          setTimeout(() => {
            setLines([]);
            setCurrentIndex(0);
            setTypingText('');
            processLine(0);
          }, 6000)
        );
        return;
      }

      const line = script[index];

      // For command and input lines, type character by character
      if (line.type === 'command' || line.type === 'prompt-input') {
        setIsTyping(true);
        let charIdx = 0;

        const typeChar = () => {
          if (charIdx <= line.text.length) {
            setTypingText(line.text.slice(0, charIdx));
            charIdx++;
            timeoutIds.push(setTimeout(typeChar, 35));
          } else {
            setIsTyping(false);
            setLines(prev => [...prev, { text: line.text, type: line.type }]);
            setTypingText('');
            setCurrentIndex(index + 1);
            timeoutIds.push(setTimeout(() => processLine(index + 1), line.delay));
          }
        };
        typeChar();
      } else if (line.type === 'spinner') {
        // Show spinner briefly then replace with success
        setLines(prev => [...prev, { text: line.text, type: line.type }]);
        setCurrentIndex(index + 1);
        timeoutIds.push(setTimeout(() => {
          // Remove spinner line and add success
          setLines(prev => prev.slice(0, -1));
          processLine(index + 1);
        }, line.delay));
      } else {
        // Instant display for other lines
        setLines(prev => [...prev, { text: line.text, type: line.type }]);
        setCurrentIndex(index + 1);
        timeoutIds.push(setTimeout(() => processLine(index + 1), line.delay));
      }
    };

    processLine(0);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, typingText]);

  const getLineClass = (type: LineType): string => {
    switch (type) {
      case 'command':
        return 'text-on-invert';
      case 'intro':
        return 'text-cyan-400 font-bold';
      case 'prompt-label':
        return 'text-gray-300';
      case 'prompt-input':
        return 'text-on-invert';
      case 'prompt-hint':
        return 'text-gray-300';
      case 'select-label':
        return 'text-gray-300';
      case 'select-option':
        return 'text-gray-300';
      case 'select-option-active':
        return 'text-cyan-400';
      case 'select-hint':
        return 'text-gray-300';
      case 'spinner':
        return 'text-cyan-400 animate-pulse';
      case 'success':
        return 'text-green-400';
      case 'note-header':
        return 'text-gray-300';
      case 'note-content':
        return 'text-gray-300';
      case 'outro':
        return 'text-green-400 font-bold';
      default:
        return 'text-on-invert';
    }
  };

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-md border border-border-invert bg-surface-invert shadow-xl mx-auto lg:mx-0">
      {/* Window Chrome */}
      <div className="flex items-center gap-2 border-b border-border-invert bg-surface-invert-secondary px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
        <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
        <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
        <span className="ml-2 text-xs font-mono text-on-invert-muted">terminal</span>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="h-[380px] overflow-y-auto p-4 font-mono text-xs leading-5"
      >
        {lines.map((line, idx) => (
          <div key={idx} className={getLineClass(line.type)}>
            {line.text}
          </div>
        ))}
        {isTyping && (
          <div className="text-on-invert">
            {typingText}
            <span className="inline-block h-4 w-2 bg-on-invert animate-pulse align-middle ml-0.5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default TerminalDemo;
