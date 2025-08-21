import { useState } from 'react';
import { Calendar, Download, Filter, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAnalytics } from '@/hooks/use-analytics';
import { AdvancedChart } from './AdvancedChart';
import { MetricsGrid } from './MetricsGrid';
import { ReportBuilder } from './ReportBuilder';
import { WorkflowAnalytics } from './WorkflowAnalytics';

export function AnalyticsDashboard() {
  const { data, isLoading, fetchAnalytics, exportData } = useAnalytics();
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeView, setActiveView] = useState('overview');

  const handleExport = async (format: 'csv' | 'excel' | 'json') => {
    try {
      await exportData(format);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined) => {
    if (range?.from && range?.to) {
      const dateRange = { start: range.from, end: range.to };
      setDateRange(range);
      fetchAnalytics(dateRange);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={handleDateRangeChange}
          />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.documents.total}</p>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.proposals.total}</p>
                <p className="text-sm text-muted-foreground">Active Proposals</p>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.workflows.active}</p>
                <p className="text-sm text-muted-foreground">Active Workflows</p>
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.proposals.approvalRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MetricsGrid data={data} isLoading={isLoading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Document Processing Trend
                </CardTitle>
                <CardDescription>
                  Daily document uploads and processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedChart
                  data={data.documents.statusOverTime}
                  type="line"
                  xAxisKey="date"
                  yAxisKeys={['pending', 'approved', 'rejected']}
                  colors={['#f59e0b', '#10b981', '#ef4444']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Document Categories
                </CardTitle>
                <CardDescription>
                  Distribution of document types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedChart
                  data={data.documents.categoryDistribution}
                  type="pie"
                  xAxisKey="category"
                  yAxisKeys={['count']}
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload Trend</CardTitle>
                <CardDescription>
                  Daily document uploads over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedChart
                  data={data.documents.uploadTrend}
                  type="area"
                  xAxisKey="date"
                  yAxisKeys={['count']}
                  colors={['#3b82f6']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
                <CardDescription>
                  Current document processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Pending', value: data.documents.pending, color: 'bg-yellow-500' },
                    { label: 'Approved', value: data.documents.approved, color: 'bg-green-500' },
                    { label: 'Rejected', value: data.documents.rejected, color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                        <Badge variant="outline">
                          {((item.value / data.documents.total) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>
                Document processing performance by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedChart
                data={data.documents.categoryDistribution}
                type="bar"
                xAxisKey="category"
                yAxisKeys={['count']}
                colors={['#3b82f6']}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proposal Submission Trend</CardTitle>
                <CardDescription>
                  Daily proposal submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedChart
                  data={data.proposals.submissionTrend}
                  type="line"
                  xAxisKey="date"
                  yAxisKeys={['count']}
                  colors={['#10b981']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proposal Types</CardTitle>
                <CardDescription>
                  Distribution by proposal type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedChart
                  data={data.proposals.typeDistribution}
                  type="doughnut"
                  xAxisKey="type"
                  yAxisKeys={['count']}
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Approval Metrics</CardTitle>
              <CardDescription>
                Proposal approval statistics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{data.proposals.approvalRate}%</p>
                  <p className="text-sm text-muted-foreground">Approval Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{data.proposals.avgApprovalTime}d</p>
                  <p className="text-sm text-muted-foreground">Avg Approval Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{data.proposals.submitted}</p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <WorkflowAnalytics data={data.workflows} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}