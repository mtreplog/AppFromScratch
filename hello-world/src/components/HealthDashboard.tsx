import React, { useState, useEffect, type ReactNode } from 'react';
import { Calendar, Settings, Bell, Heart, AlertCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import OuraMetricsCard from './OuraMetricsCard';
import NutritionCard from './NutritionCard';
import { HealthDataService } from '../services/HealthDataService';
import type { Cr1d7_healthmetrics } from '../generated/models/Cr1d7_healthmetricsModel';

interface HealthMetric {
  label: string;
  value: string;
  change: string;
  icon: ReactNode;
  color: string;
}

const HealthDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<Cr1d7_healthmetrics | null>(null);
  const [quickMetrics, setQuickMetrics] = useState<HealthMetric[]>([]);

  // Fetch data from Dataverse on component mount
  useEffect(() => {
    const loadHealthData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await HealthDataService.fetchTodayMetrics();
        if (data) {
          setRawData(data);
          
          // Transform to quick metrics
          const metrics = HealthDataService.transformToQuickMetrics(data);
          setQuickMetrics([
            {
              label: 'Heart Rate',
              value: metrics.heartRate.toString(),
              change: '+3 bpm',
              icon: <Heart className="w-6 h-6" />,
              color: 'from-red-400 to-pink-500',
            },
            {
              label: 'Steps',
              value: metrics.steps.toLocaleString(),
              change: '+2,100',
              icon: <Heart className="w-6 h-6" />,
              color: 'from-green-400 to-emerald-500',
            },
            {
              label: 'Stress Level',
              value: metrics.stressLevel,
              change: '-15%',
              icon: <Heart className="w-6 h-6" />,
              color: 'from-blue-400 to-cyan-500',
            },
          ]);
        } else {
          setError('No health data found for today');
        }
      } catch (err) {
        console.error('Failed to load health data:', err);
        setError('Failed to load health data from Dataverse');
      } finally {
        setLoading(false);
      }
    };

    loadHealthData();
  }, []);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Health Dashboard
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            {rawData && (
              <p className="text-xs text-gray-500 mt-1">
                Data: {rawData.cr1d7_metricname} • Last updated: {rawData.cr1d7_date ? new Date(rawData.cr1d7_date).toLocaleTimeString() : 'N/A'}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button className="glass-card p-3 hover:bg-opacity-20 transition-all duration-300">
              <Bell className="w-6 h-6 text-white" />
            </button>
            <button className="glass-card p-3 hover:bg-opacity-20 transition-all duration-300">
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 backdrop-blur-[10px] bg-red-500 bg-opacity-10 rounded-3xl border border-red-500 border-opacity-20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-8 p-4 backdrop-blur-[10px] bg-blue-500 bg-opacity-10 rounded-3xl border border-blue-500 border-opacity-20 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
            <p className="text-blue-200 text-sm">Loading health metrics from Dataverse...</p>
          </div>
        )}

        {/* Quick Metrics */}
        {!loading && quickMetrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {quickMetrics.map((metric, idx) => (
              <GlassCard
                key={idx}
                animated
                className="p-6 animate-slide-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                    <span className="text-white opacity-80">{metric.icon}</span>
                  </div>
                  <span className="text-green-400 text-sm font-semibold">{metric.change}</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                <p className="metric-value bg-gradient-to-r from-white to-gray-200 inline-block">
                  {metric.value}
                </p>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Main Cards */}
        {!loading && rawData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <OuraMetricsCard data={rawData} />
            <NutritionCard data={rawData} />
          </div>
        )}

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <GlassCard animated className="p-8 col-span-1 lg:col-span-2 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-white mb-6">Weekly Activity</h3>
            <div className="flex items-end justify-between h-48 gap-2">
              {[65, 78, 92, 85, 95, 88, 72].map((height, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group cursor-pointer">
                  <div className="mb-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}%
                  </div>
                  <div className="w-full bg-gray-700 bg-opacity-40 rounded-t-lg overflow-hidden relative group">
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-blue-400 transition-all duration-300 group-hover:shadow-lg"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard animated className="p-8 col-span-1 lg:col-span-2 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold text-white mb-6">Health Tips</h3>
            <div className="space-y-4">
              {[
                { title: '💤 Sleep Better', desc: 'Maintain consistent sleep schedule' },
                { title: '🥗 Eat Well', desc: 'Increase protein intake to 160g' },
                { title: '🏃 Move More', desc: 'Aim for 10,000 steps daily' },
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="p-4 glass-card hover:bg-opacity-20 transition-all duration-300 cursor-pointer group"
                >
                  <p className="text-white font-semibold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                    {tip.title}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{tip.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white border-opacity-10 text-center text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>Health Dashboard • Real-time data sync • {currentTime}</p>
        </footer>
      </div>
    </div>
  );
};

export default HealthDashboard;
