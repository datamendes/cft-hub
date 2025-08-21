import { TrendingUp, TrendingDown, Minus, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { type AnalyticsData } from '@/hooks/use-analytics';

interface MetricsGridProps {
  data: AnalyticsData;
  isLoading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  progress?: number;
}

function MetricCard({
  title,
  value,
  previousValue,
  description,
  icon: Icon,
  color,
  trend,
  trendValue,
  progress,
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {progress !== undefined && (
          <div className="mt-2">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsGrid({ data, isLoading }: MetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const approvalRate = ((data.documents.approved / data.documents.total) * 100).toFixed(1);
  const workflowEfficiency = data.workflows.efficiency.toFixed(1);
  const meetingEffectiveness = data.meetings.effectivenessScore.toFixed(1);

  const metrics = [
    {
      title: 'Document Approval Rate',
      value: `${approvalRate}%`,
      description: 'Documents approved this month',
      icon: CheckCircle,
      color: 'text-green-600',
      trend: 'up' as const,
      trendValue: '+5.2%',
      progress: parseFloat(approvalRate),
    },
    {
      title: 'Avg Processing Time',
      value: `${data.documents.avgProcessingTime}d`,
      description: 'Average document processing',
      icon: Clock,
      color: 'text-blue-600',
      trend: 'down' as const,
      trendValue: '-12%',
    },
    {
      title: 'Workflow Efficiency',
      value: `${workflowEfficiency}%`,
      description: 'Workflows completed on time',
      icon: TrendingUp,
      color: 'text-purple-600',
      trend: 'up' as const,
      trendValue: '+3.1%',
      progress: parseFloat(workflowEfficiency),
    },
    {
      title: 'Active Users',
      value: data.performance.userActivity.length,
      description: 'Users active this week',
      icon: Users,
      color: 'text-orange-600',
      trend: 'up' as const,
      trendValue: '+8%',
    },
    {
      title: 'Pending Reviews',
      value: data.documents.pending + data.proposals.submitted,
      description: 'Items awaiting review',
      icon: AlertCircle,
      color: 'text-yellow-600',
      trend: 'down' as const,
      trendValue: '-15%',
    },
    {
      title: 'Meeting Attendance',
      value: `${data.meetings.attendanceRate.toFixed(1)}%`,
      description: 'Average meeting attendance',
      icon: Users,
      color: 'text-green-600',
      trend: 'up' as const,
      trendValue: '+2.3%',
      progress: data.meetings.attendanceRate,
    },
    {
      title: 'System Uptime',
      value: `${data.performance.uptime}%`,
      description: 'System availability',
      icon: CheckCircle,
      color: 'text-green-600',
      trend: 'neutral' as const,
      trendValue: '0.1%',
      progress: data.performance.uptime,
    },
    {
      title: 'Error Rate',
      value: `${data.performance.errorRate}%`,
      description: 'System error rate',
      icon: AlertCircle,
      color: 'text-red-600',
      trend: 'down' as const,
      trendValue: '-0.2%',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Key Performance Indicators</h3>
        <Badge variant="outline" className="text-xs">
          Updated 5 minutes ago
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
}