import React, { useMemo } from 'react';

interface Props {
  content?: string;
  className?: string;
}

interface Block {
  id: string;
  type: 'h2' | 'h3' | 'list' | 'p';
  text?: string;
  items?: string[];
}

/**
 * Parses inline formatting such as **bold** and plain text safely into React elements
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return null;
  // Match bold **content** or markdown links [text](url)
  const tokens = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 hover:text-emerald-900 underline font-semibold transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return token;
  });
}

export const MarkdownContent: React.FC<Props> = ({ content = '', className = '' }) => {
  const blocks = useMemo(() => {
    if (!content) return [];

    // 1. Normalize escaped newlines and linebreaks
    let text = content
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n');

    // 2. Separate headings that have immediate paragraph text following a colon:
    // e.g. "## Understanding the Strategy: State DA and DR Hikes..." -> "## Understanding the Strategy:\n\nState DA..."
    text = text.replace(/^(#{2,3}\s+[^:\n]+:)\s+([^\n]+)/gm, '$1\n\n$2');

    // 3. Process lines and group into structured blocks
    const lines = text.split('\n');
    const result: Block[] = [];
    let currentParagraph: string[] = [];
    let currentList: string[] = [];
    let blockCounter = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const pText = currentParagraph.join(' ').trim();
        if (pText) {
          result.push({
            id: `p-${blockCounter++}`,
            type: 'p',
            text: pText,
          });
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        result.push({
          id: `list-${blockCounter++}`,
          type: 'list',
          items: [...currentList],
        });
        currentList = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed) {
        flushParagraph();
        flushList();
        continue;
      }

      // Check Heading 3: ### Heading
      if (trimmed.startsWith('### ')) {
        flushParagraph();
        flushList();
        result.push({
          id: `h3-${blockCounter++}`,
          type: 'h3',
          text: trimmed.replace(/^###\s+/, '').trim(),
        });
        continue;
      }

      // Check Heading 2: ## Heading
      if (trimmed.startsWith('## ')) {
        flushParagraph();
        flushList();
        result.push({
          id: `h2-${blockCounter++}`,
          type: 'h2',
          text: trimmed.replace(/^##\s+/, '').trim(),
        });
        continue;
      }

      // Check Bullet item: - Item or * Item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph();
        const itemText = trimmed.replace(/^[-*]\s+/, '').trim();
        if (itemText) {
          currentList.push(itemText);
        }
        continue;
      }

      // Regular text block: accumulate into paragraph
      flushList();
      currentParagraph.push(trimmed);
    }

    flushParagraph();
    flushList();

    return result;
  }, [content]);

  if (!content || blocks.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 text-slate-700 ${className}`}>
      {blocks.map((block) => {
        switch (block.type) {
          case 'h2':
            return (
              <div key={block.id} className="pt-6 pb-2 first:pt-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-1.5 h-6 bg-emerald-600 rounded-full inline-block shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight leading-snug">
                    {renderInline(block.text || '')}
                  </h2>
                </div>
                <div className="h-px bg-slate-100 w-full" />
              </div>
            );

          case 'h3':
            return (
              <div key={block.id} className="pt-4 pb-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display tracking-tight">
                    {renderInline(block.text || '')}
                  </h3>
                </div>
              </div>
            );

          case 'list':
            return (
              <ul key={block.id} className="my-4 space-y-2.5 pl-2 sm:pl-3">
                {block.items?.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm sm:text-base text-slate-700 leading-relaxed"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0 shadow-2xs" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'p':
          default:
            return (
              <p
                key={block.id}
                className="text-base sm:text-lg leading-relaxed text-slate-700 mb-4"
              >
                {renderInline(block.text || '')}
              </p>
            );
        }
      })}
    </div>
  );
};
