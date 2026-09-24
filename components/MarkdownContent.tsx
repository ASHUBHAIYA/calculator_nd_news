import React, { useMemo } from 'react';
import { marked } from 'marked';

interface Props {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<Props> = ({ content, className = '' }) => {
  const html = useMemo(() => {
    try {
      // Configure marked options
      marked.setOptions({
        gfm: true,
        breaks: true,
      });
      return marked.parse(content || '') as string;
    } catch (e) {
      console.error('Error parsing markdown content:', e);
      return `<p>${content}</p>`;
    }
  }, [content]);

  return (
    <article
      className={`prose prose-slate max-w-none 
        prose-headings:font-display prose-headings:font-extrabold prose-headings:text-slate-900 prose-headings:tracking-tight
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2
        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
        prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2
        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base prose-p:mb-4
        prose-strong:font-bold prose-strong:text-slate-900
        prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 prose-ul:space-y-1.5 prose-li:text-slate-700
        prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-4 prose-ol:space-y-1.5 prose-li:text-slate-700
        prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-slate-800 prose-blockquote:my-6
        prose-table:w-full prose-table:my-6 prose-table:border-collapse prose-table:border prose-table:border-slate-200 prose-table:rounded-xl prose-table:overflow-hidden
        prose-th:bg-slate-100 prose-th:p-3 prose-th:text-xs prose-th:font-bold prose-th:text-slate-900 prose-th:border-b prose-th:border-slate-200 prose-th:text-left
        prose-td:p-3 prose-td:text-xs sm:prose-td:text-sm prose-td:text-slate-700 prose-td:border-b prose-td:border-slate-100
        prose-hr:my-8 prose-hr:border-slate-200
        prose-a:text-emerald-700 prose-a:underline hover:prose-a:text-emerald-800
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
