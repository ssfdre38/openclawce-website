import { useState } from 'react';
import { Cpu, Layers, Globe, Image, Zap, Settings, Copy, Check } from 'lucide-react';
import { VerticalTabs, type VerticalTab } from '@/components/ui/overlay/VerticalTabs';

interface TabContent {
  title: string;
  content: string;
}

const tabContent: Record<string, TabContent> = {
  providers: {
    title: 'Multi-Provider Configuration',
    content:
      "Use OpenAI, Anthropic, Google Gemini, or Ollama - all from one config. Switch providers on the fly or use automatic routing based on task complexity.",
  },
  ollama: {
    title: 'Free Local AI with Ollama',
    content:
      'Run powerful AI models locally with zero API costs. Privacy-first, offline-capable, and perfect for development or sensitive data.',
  },
  mcp: {
    title: 'MCP Server Integration + Custom Servers',
    content:
      'Connect to GitHub, filesystem, databases with standard MCP servers. OpenClaw CE includes custom Discord MCP server with emoji/sticker tools - more coming soon!',
  },
  browser: {
    title: 'Built-in Web Browsing',
    content:
      "Access real-time information from the web with built-in browser relay. Fetches pages, parses content, and stays current.",
  },
  images: {
    title: 'Image Generation',
    content:
      'Generate and edit images with Stable Diffusion and SDXL. Text-to-image and image-to-image, all running locally.',
  },
  routing: {
    title: 'Smart Model Routing',
    content:
      'Automatically route simple queries to fast models and complex tasks to powerful models. Save money while maintaining quality.',
  },
};

const codeExamples: Record<
  string,
  { code: string; filename: string; lang: 'yaml' | 'bash' | 'typescript' }
> = {
  providers: {
    lang: 'yaml',
    code: `# ~/.openclaw/config.yaml
providers:
  # OpenAI - Best for coding
  - name: openai
    type: openai
    api_key: sk-your-key-here
    models:
      - gpt-4-turbo-preview
      - gpt-3.5-turbo

  # Anthropic - Best for writing
  - name: anthropic
    type: anthropic
    api_key: sk-ant-your-key-here
    models:
      - claude-3-5-sonnet-20241022
      - claude-3-haiku-20240307

  # Ollama - Free local models
  - name: ollama
    type: ollama
    endpoint: http://localhost:11434
    models:
      - llama3.2:latest
      - qwen2.5-coder:7b

default_provider: ollama
default_model: llama3.2:latest`,
    filename: '~/.openclaw/config.yaml',
  },
  ollama: {
    lang: 'bash',
    code: `# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull your first model (4.7GB)
ollama pull llama3.2

# Or get the coding specialist (4.7GB)
ollama pull qwen2.5-coder:7b

# Start using it
./openclaw chat --model ollama:llama3.2:latest

# List all available models
ollama list

# Models are cached locally at ~/.ollama/models
# No internet needed after download!`,
    filename: 'terminal',
  },
  mcp: {
    lang: 'yaml',
    code: `# ~/.openclaw/config.yaml
mcp_servers:
  # OpenClaw CE - Custom Discord MCP Server
  discord:
    command: node
    args:
      - "/path/to/openclaw-mcp-servers/discord/dist/index.js"
    env:
      DISCORD_TOKEN: your_bot_token_here
      DISCORD_GUILD_IDS: "123456789,987654321"  # comma-separated
  
  # GitHub integration
  github:
    command: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-github"
    env:
      GITHUB_TOKEN: ghp_your_token_here

  # Filesystem access
  filesystem:
    command: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/home/user/projects"

# Now ask: "List Discord emojis" or "Search for fire emoji"`,
    filename: '~/.openclaw/config.yaml',
  },
  browser: {
    lang: 'yaml',
    code: `# ~/.openclaw/config.yaml
browser_relay:
  enabled: true
  endpoint: http://localhost:8080
  timeout: 30  # seconds
  max_retries: 3
  max_content_length: 50000  # characters

# Start the relay
# ./openclaw relay start

# Now you can ask:
# "What's on the Python.org homepage?"
# "Search for the latest React features"
# "Compare pricing on these two websites"

# The AI fetches and reads web pages in real-time`,
    filename: '~/.openclaw/config.yaml',
  },
  images: {
    lang: 'yaml',
    code: `# ~/.openclaw/config.yaml
image_generation:
  enabled: true
  endpoint: http://localhost:7860
  default_model: sd15  # or sdxl
  default_steps: 20
  default_size: 512  # or 1024 for SDXL

# Models available:
# - SD 1.5 (fast): ~5-10 min on CPU, good quality
# - SDXL (best): ~15-25 min on CPU, excellent quality

# Usage:
# "Generate an image of a sunset over mountains"
# "Create a 1024x1024 photorealistic portrait with SDXL"
# "Edit this image to make the sky purple"`,
    filename: '~/.openclaw/config.yaml',
  },
  routing: {
    lang: 'yaml',
    code: `# ~/.openclaw/config.yaml
routing:
  enabled: true
  mode: complexity  # auto-select based on query complexity

  tiers:
    # Fast tier - simple questions (0-3 complexity)
    - name: fast
      complexity_max: 3
      models:
        - ollama:phi3:latest        # Free, local
        - gpt-3.5-turbo             # $0.0005/1K tokens

    # Balanced tier - moderate tasks (4-7 complexity)
    - name: balanced
      complexity_max: 7
      models:
        - ollama:llama3.2:latest    # Free, local
        - claude-3-haiku-20240307   # $0.0025/1K tokens

    # Powerful tier - complex reasoning (8-10 complexity)
    - name: powerful
      complexity_max: 10
      models:
        - claude-3-5-sonnet-20241022  # Best quality
        - gpt-4-turbo-preview         # OpenAI flagship

# Saves money by using cheaper models for simple tasks!`,
    filename: '~/.openclaw/config.yaml',
  },
};

// Simple syntax highlighter for YAML and bash
function highlightCode(code: string, lang: string): React.ReactNode[] {
  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let keyIndex = 0;

    const addToken = (text: string, className?: string) => {
      if (text) {
        tokens.push(
          <span key={`${lineIndex}-${keyIndex++}`} className={className}>
            {text}
          </span>
        );
      }
    };

    // Process the line
    while (remaining.length > 0) {
      let matched = false;

      // Comments (# for YAML/bash)
      const commentMatch = remaining.match(/^(#.*)/);
      if (commentMatch) {
        addToken(commentMatch[0], 'text-foreground-muted italic');
        remaining = remaining.slice(commentMatch[0].length);
        matched = true;
        continue;
      }

      // Strings (single, double quotes)
      const stringMatch = remaining.match(/^(['"])(?:(?!\1)[^\\]|\\.)*\1/);
      if (stringMatch) {
        addToken(stringMatch[0], 'text-green-600 dark:text-green-400');
        remaining = remaining.slice(stringMatch[0].length);
        matched = true;
        continue;
      }

      // YAML keys (word followed by colon)
      const yamlKeyMatch = remaining.match(/^([\w_-]+)(:)/);
      if (yamlKeyMatch && lang === 'yaml') {
        addToken(yamlKeyMatch[1], 'text-blue-600 dark:text-blue-400 font-semibold');
        addToken(yamlKeyMatch[2], 'text-foreground-secondary');
        remaining = remaining.slice(yamlKeyMatch[0].length);
        matched = true;
        continue;
      }

      // Bash commands (at start or after &&, ||, |, ;)
      const bashCmdMatch = remaining.match(/^(ollama|curl|npx|git|cd|chmod|mkdir|rm|ls|cat|echo|export)(\s)/);
      if (bashCmdMatch && lang === 'bash') {
        addToken(bashCmdMatch[1], 'text-purple-600 dark:text-purple-400 font-semibold');
        addToken(bashCmdMatch[2], 'text-foreground-secondary');
        remaining = remaining.slice(bashCmdMatch[0].length);
        matched = true;
        continue;
      }

      // URLs and paths
      const urlMatch = remaining.match(/^(https?:\/\/[^\s]+|\/[^\s]*|~\/[^\s]*)/);
      if (urlMatch) {
        addToken(urlMatch[0], 'text-cyan-600 dark:text-cyan-400');
        remaining = remaining.slice(urlMatch[0].length);
        matched = true;
        continue;
      }

      // Numbers
      const numberMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numberMatch) {
        addToken(numberMatch[0], 'text-orange-700 dark:text-orange-300');
        remaining = remaining.slice(numberMatch[0].length);
        matched = true;
        continue;
      }

      // Boolean/null values
      const boolMatch = remaining.match(/^(true|false|null|yes|no)\b/);
      if (boolMatch) {
        addToken(boolMatch[0], 'text-orange-700 dark:text-orange-300 font-semibold');
        remaining = remaining.slice(boolMatch[0].length);
        matched = true;
        continue;
      }

      // Default: single character
      if (!matched) {
        addToken(remaining[0], 'text-foreground-secondary');
        remaining = remaining.slice(1);
      }
    }

    return tokens.length > 0 ? tokens : [<span key={lineIndex}> </span>];
  });
}

function CodeBlock({ code, filename, lang }: { code: string; filename: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const highlightedLines = highlightCode(code.trim(), lang);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group border-border bg-background-secondary relative w-full overflow-hidden rounded-md border font-mono text-xs shadow-sm">
      {/* Header */}
      <div className="border-border bg-background flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="bg-border-strong h-2 w-2 rounded-full" />
            <div className="bg-border-strong h-2 w-2 rounded-full" />
            <div className="bg-border-strong h-2 w-2 rounded-full" />
          </div>
          <span className="text-foreground-muted font-sans text-[10px] font-medium">
            {filename}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-foreground-muted hover:bg-secondary hover:text-foreground flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-600" strokeWidth={2} />
              <span className="text-green-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" strokeWidth={2} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="bg-background overflow-x-auto p-3">
        <pre className="flex flex-col leading-5">
          {highlightedLines.map((lineTokens, i) => (
            <div key={i} className="table-row">
              <span className="text-foreground-subtle table-cell w-6 pr-3 text-right text-[10px] select-none">
                {i + 1}
              </span>
              <span className="table-cell whitespace-pre">{lineTokens}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// Tab definitions with icons for VerticalTabs
const tabs: VerticalTab[] = [
  { id: 'providers', label: 'Multi-Provider', description: 'OpenAI, Claude, Ollama, Gemini', icon: Cpu },
  { id: 'ollama', label: 'Ollama (Local AI)', description: 'Free, offline-capable', icon: Settings },
  { id: 'mcp', label: 'MCP Servers', description: 'GitHub, filesystem, tools', icon: Layers },
  { id: 'browser', label: 'Web Browsing', description: 'Real-time information', icon: Globe },
  { id: 'images', label: 'Image Generation', description: 'SD + SDXL support', icon: Image },
  { id: 'routing', label: 'Smart Routing', description: 'Complexity-based selection', icon: Zap },
];

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState('providers');

  return (
    <section id="features" className="bg-background relative overflow-hidden py-[var(--space-section)]">
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-[var(--space-section-header)]">
          <h2 className="font-display text-foreground text-3xl font-bold md:text-4xl">
            Configure once.
            <br />
            <span className="text-brand-500">Use everywhere.</span>
          </h2>
          <p className="text-foreground-muted mt-4 max-w-2xl text-lg">
            Simple YAML configuration gives you access to multiple AI providers, powerful tools, and advanced features.
          </p>
        </div>

        {/* Vertical Tabs */}
        <VerticalTabs tabs={tabs} value={activeTab} onChange={setActiveTab} mobileVariant="sheet">
          {tabs.map((tab) => (
            <div key={tab.id} data-tab-content={tab.id}>
              <div className="mb-[var(--space-heading-gap)]">
                <h3 className="text-foreground text-xl font-bold">{tabContent[tab.id].title}</h3>
                <p className="text-foreground-muted mt-2">{tabContent[tab.id].content}</p>
              </div>
              <CodeBlock
                code={codeExamples[tab.id].code}
                filename={codeExamples[tab.id].filename}
                lang={codeExamples[tab.id].lang}
              />
            </div>
          ))}
        </VerticalTabs>
      </div>
    </section>
  );
}

export default FeatureTabs;
