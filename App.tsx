import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import MetricsBanner from './components/MetricsBanner';
import AssessmentForm from './components/AssessmentForm';
import DiffViewer from './components/DiffViewer';
import { TEMPLATES } from './constants';

const App: React.FC = () => {
  // State for the selected template. Default to the first one.
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);

  // Memoize the selected template lookup
  const currentTemplate = useMemo(() => {
    return TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  }, [selectedTemplateId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Configuration & Header */}
      <Header 
        templates={TEMPLATES} 
        selectedId={selectedTemplateId} 
        onSelect={setSelectedTemplateId} 
      />

      <main className="flex-grow pb-12">
        {/* 2. Metrics Display */}
        <MetricsBanner metrics={currentTemplate.metrics} />

        {/* 3. Assessment Questionnaire */}
        <AssessmentForm />

        {/* 4. The Diff View (Main Feature) */}
        <DiffViewer 
          rows={currentTemplate.diffRows} 
          filename={currentTemplate.filename}
          tips={currentTemplate.tips}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Cloud Architecture Tools. Mock data for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;