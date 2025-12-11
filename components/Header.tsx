import React from 'react';
import { Layers } from 'lucide-react';
import { Template } from '../types';

interface HeaderProps {
  templates: Template[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ templates, selectedId, onSelect }) => {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Layers className="h-6 w-6 text-google-blue" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                GPU to TPU <span className="text-google-blue">Migration Assistant</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">Cloud Architecture Tools</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="template-select" className="text-sm font-medium text-gray-700 hidden sm:block">
              Workload Template:
            </label>
            <div className="relative">
              <select
                id="template-select"
                value={selectedId}
                onChange={(e) => onSelect(e.target.value)}
                className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm rounded-md border shadow-sm bg-white"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-google-blue hover:bg-google-blueHover text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors duration-150">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;