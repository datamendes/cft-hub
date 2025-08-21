import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Plus,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useWorkflow, type Workflow, type WorkflowStep } from '@/hooks/use-workflow';
import { WorkflowCreateDialog } from './WorkflowCreateDialog';
import { WorkflowStepDialog } from './WorkflowStepDialog';

const statusIcons = {
  active: <Play className="h-3 w-3" />,
  completed: <CheckCircle className="h-3 w-3" />,
  cancelled: <XCircle className="h-3 w-3" />,
  paused: <Pause className="h-3 w-3" />,
};

const statusColors = {
  active: 'bg-blue-500/10 text-blue-600 border-blue-200',
  completed: 'bg-green-500/10 text-green-600 border-green-200',
  cancelled: 'bg-red-500/10 text-red-600 border-red-200',
  paused: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
};

const priorityColors = {
  low: 'bg-gray-500/10 text-gray-600 border-gray-200',
  medium: 'bg-orange-500/10 text-orange-600 border-orange-200',
  high: 'bg-red-500/10 text-red-600 border-red-200',
};

const stepStatusColors = {
  pending: 'bg-gray-500/10 text-gray-600',
  'in-progress': 'bg-blue-500/10 text-blue-600',
  completed: 'bg-green-500/10 text-green-600',
  rejected: 'bg-red-500/10 text-red-600',
};

interface WorkflowCardProps {
  workflow: Workflow;
  onUpdateStep: (workflowId: string, stepId: string, updates: Partial<WorkflowStep>) => void;
  onCancel: (workflowId: string) => void;
  getProgress: (workflowId: string) => number;
}

function WorkflowCard({ workflow, onUpdateStep, onCancel, getProgress }: WorkflowCardProps) {
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const progress = getProgress(workflow.id);

  return (
    <Card className="hover:shadow-medium transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{workflow.name}</CardTitle>
              <Badge variant="outline" className={statusColors[workflow.status]}>
                {statusIcons[workflow.status]}
                <span className="ml-1 capitalize">{workflow.status}</span>
              </Badge>
              <Badge variant="outline" className={priorityColors[workflow.priority]}>
                {workflow.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{workflow.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCancel(workflow.id)} className="text-destructive">
                Cancel Workflow
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-3 w-3" />
            Steps ({workflow.steps.length})
          </h4>
          <div className="space-y-1">
            {workflow.steps.slice(0, 3).map((step) => (
              <div key={step.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={stepStatusColors[step.status]}>
                    {step.status}
                  </Badge>
                  <span className="text-sm">{step.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedStep(step)}
                  className="h-6 text-xs"
                >
                  Manage
                </Button>
              </div>
            ))}
            {workflow.steps.length > 3 && (
              <p className="text-xs text-muted-foreground text-center py-1">
                +{workflow.steps.length - 3} more steps
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Created {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
          </div>
          <span className="capitalize">{workflow.type.replace('-', ' ')}</span>
        </div>
      </CardContent>

      {selectedStep && (
        <WorkflowStepDialog
          step={selectedStep}
          workflowId={workflow.id}
          onUpdate={onUpdateStep}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </Card>
  );
}

export function WorkflowManager() {
  const {
    workflows,
    isLoading,
    updateWorkflowStep,
    cancelWorkflow,
    getActiveWorkflows,
    getWorkflowProgress,
  } = useWorkflow();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Workflow['status']>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeWorkflows = getActiveWorkflows();
  const completedWorkflows = workflows.filter(w => w.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflow Manager</h2>
          <p className="text-muted-foreground">
            Manage automated workflows and approval processes
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{activeWorkflows.length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completedWorkflows.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {workflows.reduce((acc, w) => acc + w.steps.filter(s => s.status === 'pending').length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Pending Steps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(
                    workflows.length > 0
                      ? workflows.reduce((acc, w) => acc + getWorkflowProgress(w.id), 0) / workflows.length
                      : 0
                  )}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Status: {statusFilter === 'all' ? 'All' : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
              Paused
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Workflows */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({activeWorkflows.length})</TabsTrigger>
          <TabsTrigger value="all">All ({workflows.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedWorkflows.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onUpdateStep={updateWorkflowStep}
                onCancel={cancelWorkflow}
                getProgress={getWorkflowProgress}
              />
            ))}
            {activeWorkflows.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active workflows</p>
                <p className="text-sm">Create a new workflow to get started</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onUpdateStep={updateWorkflowStep}
                onCancel={cancelWorkflow}
                getProgress={getWorkflowProgress}
              />
            ))}
            {filteredWorkflows.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No workflows found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onUpdateStep={updateWorkflowStep}
                onCancel={cancelWorkflow}
                getProgress={getWorkflowProgress}
              />
            ))}
            {completedWorkflows.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No completed workflows</p>
                <p className="text-sm">Completed workflows will appear here</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <WorkflowCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}