import React from 'react';
import { Gauge, CircleDollarSign, Hammer } from 'lucide-react';
import { WorkloadMetrics } from '../types';

interface MetricsBannerProps {
  metrics: WorkloadMetrics;
}

const MetricsBanner: React.FC<MetricsBannerProps> = ({ metrics }) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        
        {/* Throughput */}
        <div className="p-4 flex items-center justify-center sm:justify-start gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Gauge className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Throughput</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm text-gray-500 line-through decoration-red-400">{metrics.throughputGpu}</span>
              <span className="text-lg font-bold text-green-600">{metrics.throughputTpu}</span>
            </div>
            <p className="text-xs text-gray-400">(GPU vs TPU)</p>
          </div>
        </div>

        {/* Cost */}
        <div className="p-4 flex items-center justify-center sm:justify-start gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CircleDollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Cost</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm text-gray-500 line-through decoration-red-400">{metrics.costGpu}</span>
              <span className="text-lg font-bold text-green-600">{metrics.costTpu}</span>
            </div>
            <p className="text-xs text-gray-400">(On-demand Pricing)</p>
          </div>
        </div>

        {/* Effort */}
        <div className="p-4 flex items-center justify-center sm:justify-start gap-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <Hammer className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Migration Effort</p>
            <p className={`text-lg font-bold mt-1 ${
              metrics.effort === 'Low' ? 'text-green-600' : metrics.effort === 'Medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.effort}
            </p>
            <p className="text-xs text-gray-400">Code changes required</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetricsBanner;