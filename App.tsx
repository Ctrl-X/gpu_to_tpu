import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import MetricsBanner from './components/MetricsBanner';
import AssessmentForm from './components/AssessmentForm';
import DiffViewer from './components/DiffViewer';
import { TEMPLATES } from './constants';
import { generateDiffRows } from './utils/diffGenerator';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  // State for the selected template. Default to the first one.
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);

  // Memoize the selected template lookup
  const currentTemplate = useMemo(() => {
    return TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  }, [selectedTemplateId]);

  // State for Editable Code
  const [gpuCode, setGpuCode] = useState(currentTemplate.gpuCode);
  const [tpuCode, setTpuCode] = useState(currentTemplate.tpuCode);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset local state when template changes
  useEffect(() => {
    setGpuCode(currentTemplate.gpuCode);
    setTpuCode(currentTemplate.tpuCode);
    setIsEditing(false);
  }, [currentTemplate]);

  // Calculate diff rows dynamically based on current code state
  const diffRows = useMemo(() => {
    return generateDiffRows(gpuCode, tpuCode);
  }, [gpuCode, tpuCode]);

  const handleGenerate = async () => {
    const apiKey = import.meta.env.API_KEY;
    if (!apiKey) {
      alert("API Key not found. Please ensure the API_KEY environment variable is set.");
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        You are an expert AI engineer specializing in migrating GPU workloads (PyTorch, TensorFlow) to Google Cloud TPU.
        
        Convert the following ${currentTemplate.language} code, which is designed for GPU, to run optimally on Google Cloud TPU.
        Use the appropriate library (e.g., torch_xla for PyTorch or tf.distribute.TPUStrategy for TensorFlow).
        
        Rules:
        1. Return ONLY the raw code. Do not include markdown formatting like \`\`\`python.
        2. Do not include explanations.
        3. Keep the code structure similar where possible to facilitate a diff view.

        GPU Code:
        ${gpuCode}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const generatedCode = response.text;

      if (generatedCode) {
        // Clean up any potential markdown fences if the model ignores the rule
        const cleanCode = generatedCode.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
        setTpuCode(cleanCode);
        setIsEditing(false); // Switch back to diff view to show the result
      }
    } catch (error) {
      console.error("Error generating TPU code:", error);
      alert("Failed to generate TPU code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
          rows={diffRows}
          filename={currentTemplate.filename}
          tips={currentTemplate.tips}
          gpuCode={gpuCode}
          onGpuCodeChange={setGpuCode}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
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