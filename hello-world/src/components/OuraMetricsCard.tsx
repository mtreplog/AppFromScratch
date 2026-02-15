import React, { type ReactNode } from 'react';
import { Activity, Moon, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';
import type { Cr1d7_healthmetrics } from '../generated/models/Cr1d7_healthmetricsModel';
import { HealthDataService } from '../services/HealthDataService';

interface OuraMetric {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
}

interface OuraMetricsCardProps {
  data?: Cr1d7_healthmetrics;
}

const OuraMetricsCard: React.FC<OuraMetricsCardProps> = ({ data }) => {
  // Transform Dataverse data to display metrics
  const transformedData = data ? HealthDataService.transformToOuraMetrics(data) : null;

  const metrics: OuraMetric[] = [
    {
      label: 'Sleep Score',
      value: transformedData?.sleepScore || 87,
      icon: <Moon className="w-8 h-8" />,
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'Readiness',
      value: transformedData?.readinessScore || 92,
      icon: <Zap className="w-8 h-8" />,
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      label: 'Activity',
      value: transformedData?.activityScore || 78,
      icon: <Activity className="w-8 h-8" />,
      color: 'from-green-400 to-green-600',
    },
  ];

  return (
    <GlassCard animated className="p-8 col-span-1 lg:col-span-2 animate-slide-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 bg-opacity-20">
          <Activity className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Oura Metrics</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="group relative"
            style={{
              animation: `slide-in 0.5s ease-out ${idx * 0.1}s both`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 rounded-2xl blur transition-opacity duration-500" />
            <div
              className={`
                relative glass-card p-6 h-36 flex flex-col justify-between
                transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl
                bg-gradient-to-br ${metric.color} bg-opacity-5
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm font-medium">{metric.label}</span>
                <div className="text-white opacity-60 group-hover:opacity-100 transition-opacity">
                  {metric.icon}
                </div>
              </div>

              <div className="flex items-end gap-2">
                <span className="metric-value bg-gradient-to-r from-white to-gray-300">
                  {metric.value}
                </span>
                <span className="text-gray-500 mb-2">/100</span>
              </div>

              <div className="h-1 bg-gray-600 bg-opacity-30 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white border-opacity-10">
        <p className="text-sm text-gray-400">
          Last updated: Today at 6:30 AM • Connected to Oura Ring
        </p>
      </div>
    </GlassCard>
  );
};

export default OuraMetricsCard;
