import React, { useEffect, useRef } from 'react';
import { FileCode, Lightbulb, Edit3, Wand2, Loader2, Save } from 'lucide-react';
import { DiffRow, DiffType, DiffLine } from '../types';

interface DiffViewerProps {
  rows: DiffRow[];
  filename: string;
  tips: string[];
  gpuCode: string;
  onGpuCodeChange: (code: string) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

// Helper to determine background color based on diff type
const getBgColor = (type: DiffType) => {
  switch (type) {
    case 'added': return 'bg-green-50';
    case 'removed': return 'bg-red-50';
    case 'unchanged': return 'bg-white';
    default: return 'bg-gray-100/50'; // empty
  }
};

const LineNumber = ({ num }: { num: number | null }) => (
  <div className="w-10 pr-3 text-right text-gray-400 select-none text-xs leading-6 font-mono border-r border-gray-200 flex-shrink-0">
    {num || ''}
  </div>
);

const CodeContent = ({ content, type }: { content: string; type: DiffType }) => (
  <div className={`flex-1 pl-4 pr-2 font-mono text-xs leading-6 whitespace-pre ${type === 'added' ? 'text-green-900' : type === 'removed' ? 'text-red-900' : 'text-gray-800'}`}>
    {type === 'empty' ? '\u00A0' : content}
  </div>
);

const DiffSideRow: React.FC<{ line: DiffLine }> = ({ line }) => (
  <div className={`flex min-w-max ${getBgColor(line.type)}`}>
    <LineNumber num={line.lineNumber} />
    <CodeContent content={line.content} type={line.type} />
  </div>
);

const DiffViewer: React.FC<DiffViewerProps> = ({
  rows, filename, tips,
  gpuCode, onGpuCodeChange,
  isEditing, onToggleEdit,
  onGenerate, isGenerating
}) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [gpuCode, isEditing]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-12">

      {/* Pro Tips Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-800 mb-1">Useful content for upgrading</h3>
            <ul className="list-disc list-inside space-y-1">
              {tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-amber-700">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* File Header */}
      <div className="flex items-center justify-between bg-white border border-gray-200 border-b-0 rounded-t-lg p-3">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{filename}</span>
          <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            MODIFIED
          </span>
        </div>
        <div className="flex gap-2">
          <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded border border-gray-300">
            Split
          </button>
          <button className="text-xs bg-white text-gray-400 px-3 py-1 rounded border border-gray-200 cursor-not-allowed">
            Unified
          </button>
        </div>
      </div>

      {/* Diff View Split Container */}
      <div className="border border-gray-200 rounded-b-lg overflow-hidden bg-white shadow-sm flex flex-row min-h-[500px]">

        {/* Left Column (GPU) */}
        <div className="w-1/2 flex flex-col min-w-0 border-r border-gray-200 relative">
          <div className="p-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="uppercase tracking-wider">GPU Implementation</span>
            <button
              onClick={onToggleEdit}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors ${isEditing ? 'bg-blue-100 text-blue-700' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {isEditing ? (
                <>
                  <Save className="h-3 w-3" /> Done
                </>
              ) : (
                <>
                  <Edit3 className="h-3 w-3" /> Edit Code
                </>
              )}
            </button>
          </div>
          <div className="flex-grow overflow-auto bg-white">
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={gpuCode}
                onChange={(e) => onGpuCodeChange(e.target.value)}
                className="w-full h-full p-4 font-mono text-xs leading-6 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-google-blue bg-white text-gray-800"
                spellCheck={false}
              />
            ) : (
              <div className="overflow-x-auto">
                {rows.map((row, idx) => (
                  <DiffSideRow key={`left-${idx}`} line={row.left} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (TPU) */}
        <div className="w-1/2 flex flex-col min-w-0 bg-gray-50/30">
          <div className="p-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="uppercase tracking-wider">TPU Implementation</span>
            {isEditing && (
              <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold text-white bg-google-blue hover:bg-google-blueHover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {isGenerating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Wand2 className="h-3 w-3" />
                )}
                Generate TPU Code
              </button>
            )}
          </div>
          <div className="flex-grow overflow-auto">
            {isEditing ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 text-google-blue animate-spin" />
                    <p className="text-sm font-medium text-gray-600">Analyzing GPU code...</p>
                  </div>
                ) : (
                  <>
                    <Wand2 className="h-12 w-12 mb-3 text-gray-200" />
                    <p className="text-sm">Edit the GPU code on the left, then click <span className="font-bold text-gray-600">Generate TPU Code</span> to see the migration.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto bg-white min-h-full">
                {rows.map((row, idx) => (
                  <DiffSideRow key={`right-${idx}`} line={row.right} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DiffViewer;