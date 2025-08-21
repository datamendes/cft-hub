import { useState, useCallback } from 'react';

export interface AnalyticsData {
  documents: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    avgProcessingTime: number;
    uploadTrend: Array<{ date: string; count: number }>;
    categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
    statusOverTime: Array<{ date: string; pending: number; approved: number; rejected: number }>;
  };
  proposals: {
    total: number;
    submitted: number;
    approved: number;
    rejected: number;
    avgApprovalTime: number;
    submissionTrend: Array<{ date: string; count: number }>;
    approvalRate: number;
    typeDistribution: Array<{ type: string; count: number; percentage: number }>;
  };
  meetings: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
    avgDuration: number;
    attendanceRate: number;
    meetingTrend: Array<{ date: string; count: number }>;
    effectivenessScore: number;
  };
  workflows: {
    total: number;
    active: number;
    completed: number;
    avgCompletionTime: number;
    bottlenecks: Array<{ step: string; avgTime: number; count: number }>;
    completionTrend: Array<{ date: string; completed: number; started: number }>;
    efficiency: number;
  };
  performance: {
    userActivity: Array<{ user: string; actions: number; lastActive: string }>;
    systemLoad: Array<{ timestamp: string; cpu: number; memory: number; requests: number }>;
    errorRate: number;
    uptime: number;
  };
}

export interface ReportConfig {
  title: string;
  description: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  filters: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    enabled: boolean;
  };
}

export interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  category: 'documents' | 'proposals' | 'meetings' | 'workflows' | 'performance';
  type: 'count' | 'percentage' | 'duration' | 'rate';
  formula?: string;
}

const mockAnalyticsData: AnalyticsData = {
  documents: {
    total: 156,
    pending: 23,
    approved: 118,
    rejected: 15,
    avgProcessingTime: 2.4,
    uploadTrend: [
      { date: '2024-01-01', count: 12 },
      { date: '2024-01-02', count: 8 },
      { date: '2024-01-03', count: 15 },
      { date: '2024-01-04', count: 11 },
      { date: '2024-01-05', count: 18 },
      { date: '2024-01-06', count: 9 },
      { date: '2024-01-07', count: 14 },
    ],
    categoryDistribution: [
      { category: 'Clinical Protocol', count: 45, percentage: 28.8 },
      { category: 'Research Document', count: 38, percentage: 24.4 },
      { category: 'Policy Update', count: 31, percentage: 19.9 },
      { category: 'Training Material', count: 25, percentage: 16.0 },
      { category: 'Other', count: 17, percentage: 10.9 },
    ],
    statusOverTime: [
      { date: '2024-01-01', pending: 25, approved: 100, rejected: 12 },
      { date: '2024-01-02', pending: 28, approved: 105, rejected: 13 },
      { date: '2024-01-03', pending: 24, approved: 110, rejected: 14 },
      { date: '2024-01-04', pending: 22, approved: 115, rejected: 14 },
      { date: '2024-01-05', pending: 23, approved: 118, rejected: 15 },
    ],
  },
  proposals: {
    total: 47,
    submitted: 12,
    approved: 28,
    rejected: 7,
    avgApprovalTime: 5.2,
    submissionTrend: [
      { date: '2024-01-01', count: 3 },
      { date: '2024-01-02', count: 2 },
      { date: '2024-01-03', count: 4 },
      { date: '2024-01-04', count: 1 },
      { date: '2024-01-05', count: 2 },
      { date: '2024-01-06', count: 0 },
      { date: '2024-01-07', count: 3 },
    ],
    approvalRate: 74.5,
    typeDistribution: [
      { type: 'Emergency Protocol', count: 15, percentage: 31.9 },
      { type: 'Process Improvement', count: 12, percentage: 25.5 },
      { type: 'Policy Change', count: 10, percentage: 21.3 },
      { type: 'Training Program', count: 6, percentage: 12.8 },
      { type: 'Other', count: 4, percentage: 8.5 },
    ],
  },
  meetings: {
    total: 34,
    completed: 28,
    upcoming: 4,
    cancelled: 2,
    avgDuration: 1.5,
    attendanceRate: 87.3,
    meetingTrend: [
      { date: '2024-01-01', count: 2 },
      { date: '2024-01-02', count: 1 },
      { date: '2024-01-03', count: 3 },
      { date: '2024-01-04', count: 2 },
      { date: '2024-01-05', count: 1 },
      { date: '2024-01-06', count: 0 },
      { date: '2024-01-07', count: 2 },
    ],
    effectivenessScore: 8.4,
  },
  workflows: {
    total: 89,
    active: 12,
    completed: 74,
    avgCompletionTime: 3.8,
    bottlenecks: [
      { step: 'Technical Review', avgTime: 2.1, count: 23 },
      { step: 'Final Approval', avgTime: 1.8, count: 18 },
      { step: 'Initial Review', avgTime: 1.2, count: 15 },
      { step: 'Expert Consultation', avgTime: 2.5, count: 8 },
    ],
    completionTrend: [
      { date: '2024-01-01', completed: 5, started: 8 },
      { date: '2024-01-02', completed: 3, started: 6 },
      { date: '2024-01-03', completed: 7, started: 9 },
      { date: '2024-01-04', completed: 4, started: 7 },
      { date: '2024-01-05', completed: 6, started: 8 },
    ],
    efficiency: 83.1,
  },
  performance: {
    userActivity: [
      { user: 'Dr. Rodriguez', actions: 156, lastActive: '2024-01-07T14:30:00Z' },
      { user: 'Dr. Johnson', actions: 134, lastActive: '2024-01-07T13:45:00Z' },
      { user: 'Dr. Smith', actions: 98, lastActive: '2024-01-07T12:15:00Z' },
      { user: 'Dr. Wilson', actions: 87, lastActive: '2024-01-07T11:30:00Z' },
      { user: 'Dr. Brown', actions: 76, lastActive: '2024-01-07T10:45:00Z' },
    ],
    systemLoad: [
      { timestamp: '2024-01-07T10:00:00Z', cpu: 45, memory: 67, requests: 234 },
      { timestamp: '2024-01-07T11:00:00Z', cpu: 52, memory: 71, requests: 289 },
      { timestamp: '2024-01-07T12:00:00Z', cpu: 38, memory: 64, requests: 198 },
      { timestamp: '2024-01-07T13:00:00Z', cpu: 61, memory: 73, requests: 312 },
      { timestamp: '2024-01-07T14:00:00Z', cpu: 47, memory: 69, requests: 256 },
    ],
    errorRate: 0.8,
    uptime: 99.7,
  },
};

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = useCallback(async (dateRange?: { start: Date; end: Date }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, fetch data based on dateRange
      setData(mockAnalyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (config: ReportConfig) => {
    setIsLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, generate and download report
      const reportData = {
        ...config,
        generatedAt: new Date(),
        data: data,
      };
      
      console.log('Generated report:', reportData);
      return reportData;
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const exportData = useCallback(async (format: 'csv' | 'excel' | 'json', selection?: string[]) => {
    setIsLoading(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, format and download data
      console.log(`Exporting data as ${format}:`, selection || 'all data');
      
      // Create mock download
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const getMetricValue = useCallback((metricId: string, period?: string) => {
    // Calculate specific metric values
    switch (metricId) {
      case 'document-approval-rate':
        return ((data.documents.approved / data.documents.total) * 100).toFixed(1);
      case 'proposal-success-rate':
        return data.proposals.approvalRate.toFixed(1);
      case 'workflow-efficiency':
        return data.workflows.efficiency.toFixed(1);
      case 'meeting-attendance':
        return data.meetings.attendanceRate.toFixed(1);
      case 'avg-processing-time':
        return data.documents.avgProcessingTime.toFixed(1);
      default:
        return '0';
    }
  }, [data]);

  const getTrendData = useCallback((metric: string, period: string = '7d') => {
    // Return trend data for specific metrics
    switch (metric) {
      case 'documents':
        return data.documents.uploadTrend;
      case 'proposals':
        return data.proposals.submissionTrend;
      case 'meetings':
        return data.meetings.meetingTrend;
      case 'workflows':
        return data.workflows.completionTrend;
      default:
        return [];
    }
  }, [data]);

  return {
    data,
    isLoading,
    fetchAnalytics,
    generateReport,
    exportData,
    getMetricValue,
    getTrendData,
  };
}