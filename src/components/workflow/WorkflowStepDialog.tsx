import { useState } from 'react';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type WorkflowStep } from '@/hooks/use-workflow';
import { toast } from '@/hooks/use-toast';

interface WorkflowStepDialogProps {
  step: WorkflowStep;
  workflowId: string;
  onUpdate: (workflowId: string, stepId: string, updates: Partial<WorkflowStep>) => void;
  onClose: () => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-gray-600' },
  { value: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-blue-600' },
  { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
  { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600' },
];

export function WorkflowStepDialog({ step, workflowId, onUpdate, onClose }: WorkflowStepDialogProps) {
  const [status, setStatus] = useState(step.status);
  const [comments, setComments] = useState(step.comments || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onUpdate(workflowId, step.id, {
        status: status as WorkflowStep['status'],
        comments,
      });
      
      toast({
        title: 'Step Updated',
        description: `${step.name} has been updated successfully.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update step. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatusOption = statusOptions.find(option => option.value === step.status);
  const StatusIcon = currentStatusOption?.icon || Clock;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${currentStatusOption?.color}`} />
            Manage Step
          </DialogTitle>
          <DialogDescription>
            Update the status and add comments for this workflow step.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step Info */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <h3 className="font-medium">{step.name}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">Order: {step.order}</Badge>
              {step.assignee && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {step.assignee}
                </Badge>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as WorkflowStep['status'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <OptionIcon className={`h-3 w-3 ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments or notes about this step..."
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Step'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}