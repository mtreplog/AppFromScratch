import type { Cr1d7_healthmetrics } from '../generated/models/Cr1d7_healthmetricsModel';
import { Cr1d7_healthmetricsService } from '../generated/services/Cr1d7_healthmetricsService';

/**
 * Maps Dataverse HealthMetrics to Dashboard UI Models
 */

export interface OuraMetricData {
  sleepScore: number;
  readinessScore: number;
  activityScore: number;
  lastUpdated: Date;
}

export interface NutritionMetricData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: Date;
}

export interface QuickHealthMetric {
  heartRate: number;
  steps: number;
  stressLevel: string;
  hrv: number;
  meditationMinutes: number;
}

/**
 * Data service to fetch and transform Dataverse data
 */
export class HealthDataService {
  /**
   * Fetch today's health metrics from Dataverse
   */
  static async fetchTodayMetrics(): Promise<Cr1d7_healthmetrics | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Fetch all metrics and filter for today
      const result = await Cr1d7_healthmetricsService.getAll({
        select: [
          'cr1d7_date',
          'cr1d7_sleepscore',
          'cr1d7_readinessscore',
          'cr1d7_calorie',
          'cr1d7_protein',
          'cr1d7_carbs',
          'cr1d7_fat',
          'cr1d7_hrv',
          'cr1d7_meditationminutes',
          'cr1d7_metricname',
        ],
        top: 10,
      });

      if (result.data && result.data.length > 0) {
        // Find today's record or return most recent
        const todayData = result.data.find((metric) => {
          if (!metric.cr1d7_date) return false;
          const metricDate = new Date(metric.cr1d7_date);
          return metricDate >= today && metricDate < tomorrow;
        });

        return todayData || result.data[0];
      }

      return null;
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return null;
    }
  }

  /**
   * Transform Dataverse record to Oura metrics format
   */
  static transformToOuraMetrics(record: Cr1d7_healthmetrics): OuraMetricData {
    return {
      sleepScore: parseInt(record.cr1d7_sleepscore || '0', 10),
      readinessScore: parseInt(record.cr1d7_readinessscore || '0', 10),
      activityScore: Math.round(Math.random() * 100), // Placeholder for activity score
      lastUpdated: record.cr1d7_date ? new Date(record.cr1d7_date) : new Date(),
    };
  }

  /**
   * Transform Dataverse record to Nutrition metrics format
   */
  static transformToNutritionMetrics(record: Cr1d7_healthmetrics): NutritionMetricData {
    return {
      calories: parseInt(record.cr1d7_calorie || '0', 10),
      protein: parseInt(record.cr1d7_protein || '0', 10),
      carbs: parseInt(record.cr1d7_carbs || '0', 10),
      fats: parseInt(record.cr1d7_fat || '0', 10),
      date: record.cr1d7_date ? new Date(record.cr1d7_date) : new Date(),
    };
  }

  /**
   * Transform Dataverse record to Quick Health Metrics format
   */
  static transformToQuickMetrics(record: Cr1d7_healthmetrics): QuickHealthMetric {
    const heartRate = Math.round(Math.random() * 30) + 60; // 60-90 bpm
    const steps = Math.round(Math.random() * 10000);
    const stress = 'Normal';
    const hrv = parseInt(record.cr1d7_hrv || '0', 10);
    const meditation = parseInt(record.cr1d7_meditationminutes || '0', 10);

    return {
      heartRate,
      steps,
      stressLevel: stress,
      hrv,
      meditationMinutes: meditation,
    };
  }

  /**
   * Fetch all historical metrics for charting
   */
  static async fetchHistoricalMetrics(days: number = 7): Promise<Cr1d7_healthmetrics[]> {
    try {
      const result = await Cr1d7_healthmetricsService.getAll({
        select: [
          'cr1d7_date',
          'cr1d7_calorie',
          'cr1d7_sleepscore',
          'cr1d7_readinessscore',
        ],
        top: days,
      });

      return result.data || [];
    } catch (error) {
      console.error('Error fetching historical metrics:', error);
      return [];
    }
  }

  /**
   * Create a new health metric record
   */
  static async createMetric(
    data: Omit<Cr1d7_healthmetrics, 'cr1d7_healthmetricid'>
  ): Promise<Cr1d7_healthmetrics | null> {
    try {
      const result = await Cr1d7_healthmetricsService.create(data);
      return result.data || null;
    } catch (error) {
      console.error('Error creating health metric:', error);
      return null;
    }
  }

  /**
   * Update an existing metric record
   */
  static async updateMetric(
    id: string,
    updates: Partial<Cr1d7_healthmetrics>
  ): Promise<Cr1d7_healthmetrics | null> {
    try {
      const result = await Cr1d7_healthmetricsService.update(id, updates);
      return result.data || null;
    } catch (error) {
      console.error('Error updating health metric:', error);
      return null;
    }
  }
}
