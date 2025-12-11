import React from 'react';
import { FileCode, Lightbulb } from 'lucide-react';
import { DiffRow, DiffType, DiffLine } from '../types';

interface DiffViewerProps {
  rows: DiffRow[];
  filename: string;
  tips: string[];
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

const DiffViewer: React.FC<DiffViewerProps> = ({ rows, filename, tips }) => {
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
      <div className="border border-gray-200 rounded-b-lg overflow-hidden bg-white shadow-sm flex flex-row">
        
        {/* Left Column (GPU) */}
        <div className="w-1/2 flex flex-col min-w-0 border-r border-gray-200">
           <div className="p-2 text-xs font-semibold text-gray-500 text-center uppercase tracking-wider bg-gray-50 border-b border-gray-200 flex-shrink-0">
             GPU Implementation
           </div>
           <div className="overflow-x-auto">
             <div>
               {rows.map((row, idx) => (
                 <DiffSideRow key={`left-${idx}`} line={row.left} />
               ))}
             </div>
           </div>
        </div>

        {/* Right Column (TPU) */}
        <div className="w-1/2 flex flex-col min-w-0">
           <div className="p-2 text-xs font-semibold text-gray-500 text-center uppercase tracking-wider bg-gray-50 border-b border-gray-200 flex-shrink-0">
             TPU Implementation
           </div>
           <div className="overflow-x-auto">
             <div>
               {rows.map((row, idx) => (
                 <DiffSideRow key={`right-${idx}`} line={row.right} />
               ))}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DiffViewer;