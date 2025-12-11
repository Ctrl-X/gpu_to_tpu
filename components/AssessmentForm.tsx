import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ClipboardCheck } from 'lucide-react';

const AssessmentForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-800">Workload Assessment</span>
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </button>

        {isOpen && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Type</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm rounded-md border">
                <option>Computer Vision (CV)</option>
                <option>Large Language Model (LLM)</option>
                <option>Natural Language Processing (NLP)</option>
                <option>Recommendation System</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Framework</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm rounded-md border">
                <option>PyTorch</option>
                <option>TensorFlow / Keras</option>
                <option>JAX / Flax</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Motivation</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm rounded-md border">
                <option>Cost Reduction</option>
                <option>Training Speed / Throughput</option>
                <option>Scalability (Pod Slice)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Ops?</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-google-blue focus:border-google-blue sm:text-sm rounded-md border">
                <option>None (Standard Layers)</option>
                <option>Some Custom CUDA Kernels</option>
                <option>Heavily Customized</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentForm;