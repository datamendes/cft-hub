import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Badge } from '@/components/ui/badge';
import { useWorkflow, type Workflow } from '@/hooks/use-workflow';
import { toast } from '@/hooks/use-toast';

interface WorkflowCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkflowCreateDialog({ open, onOpenChange }: WorkflowCreateDialogProps) {
  const { createWorkflow, isLoading } = useWorkflow();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'document-approval' as Workflow['type'],
    priority: 'medium' as Workflow['priority'],
    itemId: '',
    itemType: 'document' as Workflow['itemType'],
  });
  const [customSteps, setCustomSteps] = useState<Array<{ name: string; description: string; assignee: string }>>([]);
  const [newStep, setNewStep] = useState({ name: '', description: '', assignee: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.itemId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createWorkflow({
        ...formData,
        steps: customSteps.length > 0 ? customSteps : undefined,
        assignees: customSteps.map(step => step.assignee).filter(Boolean),
      });
      
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        type: 'document-approval',
        priority: 'medium',
        itemId: '',
        itemType: 'document',
      });
      setCustomSteps([]);
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const addCustomStep = () => {
    if (!newStep.name) {
      toast({
        title: 'Validation Error',
        description: 'Step name is required.',
        variant: 'destructive',
      });
      return;
    }

    setCustomSteps(prev => [...prev, { ...newStep }]);
    setNewStep({ name: '', description: '', assignee: '' });
  };

  const removeCustomStep = (index: number) => {
    setCustomSteps(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Create an automated workflow for document approvals, proposal reviews, or meeting preparations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Clinical Protocol Review"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Workflow['priority']) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the purpose and scope of this workflow..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Workflow Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Workflow['type']) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document-approval">Document Approval</SelectItem>
                  <SelectItem value="proposal-review">Proposal Review</SelectItem>
                  <SelectItem value="meeting-preparation">Meeting Preparation</SelectItem>
                  <SelectItem value="custom">Custom Workflow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemType">Item Type</Label>
              <Select
                value={formData.itemType}
                onValueChange={(value: Workflow['itemType']) => 
                  setFormData(prev => ({ ...prev, itemType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemId">Item ID *</Label>
            <Input
              id="itemId"
              value={formData.itemId}
              onChange={(e) => setFormData(prev => ({ ...prev, itemId: e.target.value }))}
              placeholder="ID of the document, proposal, or meeting"
              required
            />
          </div>

          {/* Custom Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Custom Workflow Steps</Label>
              <p className="text-sm text-muted-foreground">
                Leave empty to use default template
              </p>
            </div>

            {customSteps.length > 0 && (
              <div className="space-y-2">
                {customSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{step.name}</span>
                        {step.assignee && (
                          <Badge variant="secondary">{step.assignee}</Badge>
                        )}
                      </div>
                      {step.description && (
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomStep(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Step name"
                value={newStep.name}
                onChange={(e) => setNewStep(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Description (optional)"
                value={newStep.description}
                onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
              />
              <div className="flex gap-1">
                <Input
                  placeholder="Assignee (optional)"
                  value={newStep.assignee}
                  onChange={(e) => setNewStep(prev => ({ ...prev, assignee: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomStep}
                  disabled={!newStep.name}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Workflow'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}