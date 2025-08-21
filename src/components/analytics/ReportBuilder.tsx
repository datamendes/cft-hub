import { useState } from 'react';
import { Plus, Save, Download, Calendar, Filter, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useAnalytics, type ReportConfig } from '@/hooks/use-analytics';
import { toast } from '@/hooks/use-toast';

const availableMetrics = [
  { id: 'document-total', name: 'Total Documents', category: 'Documents' },
  { id: 'document-approval-rate', name: 'Document Approval Rate', category: 'Documents' },
  { id: 'document-processing-time', name: 'Processing Time', category: 'Documents' },
  { id: 'proposal-total', name: 'Total Proposals', category: 'Proposals' },
  { id: 'proposal-success-rate', name: 'Proposal Success Rate', category: 'Proposals' },
  { id: 'workflow-efficiency', name: 'Workflow Efficiency', category: 'Workflows' },
  { id: 'meeting-attendance', name: 'Meeting Attendance', category: 'Meetings' },
  { id: 'user-activity', name: 'User Activity', category: 'Performance' },
  { id: 'system-uptime', name: 'System Uptime', category: 'Performance' },
];

const reportTemplates = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level overview for leadership',
    metrics: ['document-total', 'proposal-success-rate', 'workflow-efficiency', 'system-uptime'],
  },
  {
    id: 'operational-report',
    name: 'Operational Report',
    description: 'Detailed operational metrics',
    metrics: ['document-approval-rate', 'document-processing-time', 'meeting-attendance', 'user-activity'],
  },
  {
    id: 'performance-review',
    name: 'Performance Review',
    description: 'Comprehensive performance analysis',
    metrics: ['workflow-efficiency', 'proposal-success-rate', 'document-approval-rate', 'meeting-attendance'],
  },
];

export function ReportBuilder() {
  const { generateReport, isLoading } = useAnalytics();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [savedReports, setSavedReports] = useState<ReportConfig[]>([]);
  const [currentReport, setCurrentReport] = useState<Partial<ReportConfig>>({
    title: '',
    description: '',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    metrics: [],
    filters: {},
    format: 'pdf',
  });

  const handleCreateReport = async () => {
    if (!currentReport.title || currentReport.metrics?.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a title and select at least one metric.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const reportConfig: ReportConfig = {
        title: currentReport.title || '',
        description: currentReport.description || '',
        dateRange: currentReport.dateRange || {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
        },
        metrics: currentReport.metrics || [],
        filters: currentReport.filters || {},
        format: currentReport.format || 'pdf',
      };

      await generateReport(reportConfig);
      setSavedReports(prev => [...prev, reportConfig]);
      setShowCreateDialog(false);
      setCurrentReport({
        title: '',
        description: '',
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
        },
        metrics: [],
        filters: {},
        format: 'pdf',
      });

      toast({
        title: 'Report Generated',
        description: 'Your report has been generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleTemplateSelect = (template: typeof reportTemplates[0]) => {
    setCurrentReport(prev => ({
      ...prev,
      title: template.name,
      description: template.description,
      metrics: template.metrics,
    }));
  };

  const handleMetricToggle = (metricId: string, checked: boolean) => {
    setCurrentReport(prev => ({
      ...prev,
      metrics: checked
        ? [...(prev.metrics || []), metricId]
        : (prev.metrics || []).filter(id => id !== metricId),
    }));
  };

  const groupedMetrics = availableMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, typeof availableMetrics>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Report Builder</h3>
          <p className="text-sm text-muted-foreground">
            Create custom reports with your selected metrics and filters
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTemplates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Includes:</p>
                <div className="flex flex-wrap gap-1">
                  {template.metrics.slice(0, 3).map((metricId) => {
                    const metric = availableMetrics.find(m => m.id === metricId);
                    return (
                      <Badge key={metricId} variant="secondary" className="text-xs">
                        {metric?.name}
                      </Badge>
                    );
                  })}
                  {template.metrics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.metrics.length - 3} more
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleTemplateSelect(template)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Saved Reports */}
      {savedReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Reports</CardTitle>
            <CardDescription>
              Your previously generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {report.metrics.length} metrics
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {report.format.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Report Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom Report</DialogTitle>
            <DialogDescription>
              Configure your report with custom metrics, filters, and formatting options.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={currentReport.title}
                  onChange={(e) => setCurrentReport(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Monthly Performance Report"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select
                  value={currentReport.format}
                  onValueChange={(value: 'pdf' | 'excel' | 'csv') =>
                    setCurrentReport(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentReport.description}
                onChange={(e) => setCurrentReport(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose and scope of this report..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange
                date={currentReport.dateRange ? {
                  from: currentReport.dateRange.start,
                  to: currentReport.dateRange.end
                } : undefined}
                onDateChange={(range) =>
                  setCurrentReport(prev => ({ 
                    ...prev, 
                    dateRange: range ? { start: range.from, end: range.to } : undefined 
                  }))
                }
              />
            </div>

            <div className="space-y-4">
              <Label>Select Metrics</Label>
              {Object.entries(groupedMetrics).map(([category, metrics]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric.id}
                          checked={currentReport.metrics?.includes(metric.id)}
                          onCheckedChange={(checked) =>
                            handleMetricToggle(metric.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={metric.id} className="text-sm">
                          {metric.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}