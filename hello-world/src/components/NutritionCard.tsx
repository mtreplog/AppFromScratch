import React, { type ReactNode } from 'react';
import { Apple, Flame } from 'lucide-react';
import { GlassCard } from './GlassCard';
import type { Cr1d7_healthmetrics } from '../generated/models/Cr1d7_healthmetricsModel';
import { HealthDataService } from '../services/HealthDataService';

interface NutritionMetric {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
  icon: ReactNode;
}

interface NutritionCardProps {
  data?: Cr1d7_healthmetrics;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ data }) => {
  // Transform Dataverse data to display metrics
  const transformedData = data ? HealthDataService.transformToNutritionMetrics(data) : null;

  const metrics: NutritionMetric[] = [
    {
      label: 'Calories',
      current: transformedData?.calories || 1850,
      goal: 2200,
      unit: 'kcal',
      color: 'from-orange-400 to-red-500',
      icon: <Flame className="w-5 h-5" />,
    },
    {
      label: 'Protein',
      current: transformedData?.protein || 125,
      goal: 160,
      unit: 'g',
      color: 'from-red-400 to-pink-500',
      icon: <Apple className="w-5 h-5" />,
    },
    {
      label: 'Carbs',
      current: transformedData?.carbs || 245,
      goal: 275,
      unit: 'g',
      color: 'from-amber-400 to-orange-500',
      icon: <Apple className="w-5 h-5" />,
    },
    {
      label: 'Fats',
      current: transformedData?.fats || 65,
      goal: 73,
      unit: 'g',
      color: 'from-yellow-400 to-amber-500',
      icon: <Apple className="w-5 h-5" />,
    },
  ];

  return (
    <GlassCard animated className="p-8 col-span-1 lg:col-span-2 animate-slide-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-gradient-to-br from-pink-400 to-red-500 bg-opacity-20">
          <Apple className="w-6 h-6 text-pink-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Nutrition Today</h2>
      </div>

      <div className="space-y-6">
        {metrics.map((metric, idx) => {
          const percentage = (metric.current / metric.goal) * 100;
          return (
            <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-10`}>
                    <span className={`text-white opacity-70`}>{metric.icon}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{metric.label}</p>
                    <p className="text-xs text-gray-500">{metric.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{metric.current}</p>
                  <p className="text-xs text-gray-400">/ {metric.goal}</p>
                </div>
              </div>

              <div className="relative h-3 bg-gray-700 bg-opacity-40 rounded-full overflow-hidden backdrop-blur">
                <div
                  className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    boxShadow: `0 0 20px rgba(255, 100, 50, 0.4)`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round(percentage)}% •{' '}
                {metric.goal - metric.current > 0
                  ? `${Math.round(metric.goal - metric.current)} ${metric.unit} remaining`
                  : `${Math.round(metric.current - metric.goal)} ${metric.unit} over`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-white border-opacity-10 grid grid-cols-2 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">Water Intake</p>
          <p className="metric-value bg-gradient-to-r from-blue-300 to-cyan-300">2.1L</p>
          <p className="text-xs text-gray-500 mt-1">/ 3L goal</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">Meals Today</p>
          <p className="metric-value bg-gradient-to-r from-orange-300 to-red-300">3</p>
          <p className="text-xs text-gray-500 mt-1">Breakfast, Lunch, Dinner</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default NutritionCard;
