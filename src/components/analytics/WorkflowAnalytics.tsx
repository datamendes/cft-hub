import { Clock, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AdvancedChart } from './AdvancedChart';
import { type AnalyticsData } from '@/hooks/use-analytics';

interface WorkflowAnalyticsProps {
  data: AnalyticsData['workflows'];
}

export function WorkflowAnalytics({ data }: WorkflowAnalyticsProps) {
  const completionRate = ((data.completed / data.total) * 100).toFixed(1);
  const activeRate = ((data.active / data.total) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.total}</p>
                <p className="text-sm text-muted-foreground">Total Workflows</p>
              </div>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {activeRate}%
                  </Badge>
                </div>
              </div>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {completionRate}%
                  </Badge>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.efficiency}%</p>
                <p className="text-sm text-muted-foreground">Efficiency Score</p>
                <Progress value={data.efficiency} className="h-1 mt-2" />
              </div>
              <AlertTriangle className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Completion Trend</CardTitle>
            <CardDescription>
              Daily workflow completions vs new starts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedChart
              data={data.completionTrend}
              type="line"
              xAxisKey="date"
              yAxisKeys={['completed', 'started']}
              colors={['#10b981', '#3b82f6']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Bottlenecks</CardTitle>
            <CardDescription>
              Steps with highest average processing time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedChart
              data={data.bottlenecks}
              type="bar"
              xAxisKey="step"
              yAxisKeys={['avgTime']}
              colors={['#ef4444']}
            />
          </CardContent>
        </Card>
      </div>

      {/* Bottleneck Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Bottleneck Analysis</CardTitle>
          <CardDescription>
            Detailed analysis of workflow bottlenecks and improvement opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.bottlenecks.map((bottleneck, index) => (
              <div key={bottleneck.step} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{bottleneck.step}</h4>
                    <p className="text-sm text-muted-foreground">
                      Affects {bottleneck.count} workflows
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{bottleneck.avgTime}d</p>
                  <p className="text-xs text-muted-foreground">avg time</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{data.avgCompletionTime}d</p>
              <p className="text-sm text-muted-foreground">days to complete</p>
              <div className="mt-2">
                <Badge variant="outline" className="text-green-600">
                  15% faster than last month
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workflow Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{data.efficiency}%</p>
              <p className="text-sm text-muted-foreground">efficiency score</p>
              <Progress value={data.efficiency} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
              <p className="text-sm text-muted-foreground">completion rate</p>
              <div className="mt-2">
                <Badge variant="outline" className="text-green-600">
                  +2.3% this month
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}