import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  assignee?: string;
  dueDate?: Date;
  completedAt?: Date;
  comments?: string;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'document-approval' | 'proposal-review' | 'meeting-preparation' | 'custom';
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  steps: WorkflowStep[];
  itemId: string; // ID of the document, proposal, etc.
  itemType: 'document' | 'proposal' | 'meeting';
  metadata?: Record<string, any>;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    event: 'document-upload' | 'proposal-submit' | 'meeting-schedule' | 'approval-complete';
    conditions: Record<string, any>;
  };
  actions: {
    type: 'create-workflow' | 'send-notification' | 'update-status' | 'assign-reviewer';
    parameters: Record<string, any>;
  }[];
  enabled: boolean;
  createdAt: Date;
}

const defaultWorkflowTemplates = {
  'document-approval': [
    { name: 'Initial Review', description: 'Initial review by team lead', order: 1 },
    { name: 'Technical Review', description: 'Technical review by subject matter expert', order: 2 },
    { name: 'Final Approval', description: 'Final approval by department head', order: 3 },
  ],
  'proposal-review': [
    { name: 'Eligibility Check', description: 'Check proposal eligibility and completeness', order: 1 },
    { name: 'Expert Review', description: 'Review by relevant experts', order: 2 },
    { name: 'Committee Decision', description: 'Final decision by review committee', order: 3 },
  ],
  'meeting-preparation': [
    { name: 'Agenda Preparation', description: 'Prepare meeting agenda', order: 1 },
    { name: 'Material Review', description: 'Review all materials to be discussed', order: 2 },
    { name: 'Participant Notification', description: 'Notify all participants', order: 3 },
  ],
};

export function useWorkflow() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createWorkflow = useCallback(async (data: {
    name: string;
    description: string;
    type: Workflow['type'];
    priority: Workflow['priority'];
    itemId: string;
    itemType: Workflow['itemType'];
    steps?: Partial<WorkflowStep>[];
    assignees?: string[];
  }) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const workflow: Workflow = {
        id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        description: data.description,
        type: data.type,
        status: 'active',
        priority: data.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemId: data.itemId,
        itemType: data.itemType,
        steps: data.steps?.map((step, index) => ({
          id: `step-${Date.now()}-${index}`,
          name: step.name || `Step ${index + 1}`,
          description: step.description || '',
          status: index === 0 ? 'in-progress' : 'pending',
          assignee: data.assignees?.[index],
          order: index + 1,
        })) || defaultWorkflowTemplates[data.type]?.map((template, index) => ({
          id: `step-${Date.now()}-${index}`,
          name: template.name,
          description: template.description,
          status: index === 0 ? 'in-progress' : 'pending',
          assignee: data.assignees?.[index],
          order: template.order,
        })) || [],
      };

      setWorkflows(prev => [workflow, ...prev]);
      
      toast({
        title: 'Workflow Created',
        description: `${workflow.name} workflow has been created successfully.`,
      });

      return workflow;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create workflow. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateWorkflowStep = useCallback(async (workflowId: string, stepId: string, updates: Partial<WorkflowStep>) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setWorkflows(prev => prev.map(workflow => {
        if (workflow.id !== workflowId) return workflow;

        const updatedSteps = workflow.steps.map(step => {
          if (step.id !== stepId) return step;

          const updatedStep = { ...step, ...updates };

          // If step is completed, auto-start next step
          if (updates.status === 'completed' && step.status !== 'completed') {
            updatedStep.completedAt = new Date();
            
            // Find next pending step and set to in-progress
            const nextStepIndex = workflow.steps.findIndex(s => s.order > step.order && s.status === 'pending');
            if (nextStepIndex === -1) {
              // No more steps, complete workflow
              workflow.status = 'completed';
              workflow.completedAt = new Date();
            }
          }

          return updatedStep;
        });

        // Auto-start next step if current step is completed
        if (updates.status === 'completed') {
          const currentStepIndex = updatedSteps.findIndex(s => s.id === stepId);
          const nextStep = updatedSteps.find(s => s.order > updatedSteps[currentStepIndex].order && s.status === 'pending');
          if (nextStep) {
            nextStep.status = 'in-progress';
          }
        }

        return {
          ...workflow,
          steps: updatedSteps,
          updatedAt: new Date(),
        };
      }));

      toast({
        title: 'Step Updated',
        description: 'Workflow step has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update workflow step. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelWorkflow = useCallback(async (workflowId: string, reason?: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setWorkflows(prev => prev.map(workflow =>
        workflow.id === workflowId
          ? { ...workflow, status: 'cancelled', updatedAt: new Date() }
          : workflow
      ));

      toast({
        title: 'Workflow Cancelled',
        description: 'Workflow has been cancelled successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel workflow. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAutomationRule = useCallback(async (rule: Omit<AutomationRule, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newRule: AutomationRule = {
        ...rule,
        id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      };

      setAutomationRules(prev => [newRule, ...prev]);

      toast({
        title: 'Automation Rule Created',
        description: `${newRule.name} automation rule has been created.`,
      });

      return newRule;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create automation rule. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerAutomation = useCallback((event: AutomationRule['trigger']['event'], data: Record<string, any>) => {
    automationRules
      .filter(rule => rule.enabled && rule.trigger.event === event)
      .forEach(rule => {
        // Execute automation actions
        rule.actions.forEach(action => {
          switch (action.type) {
            case 'create-workflow':
              if (data.itemId && data.itemType) {
                createWorkflow({
                  name: `Auto: ${rule.name}`,
                  description: `Automatically created workflow from rule: ${rule.name}`,
                  type: action.parameters.workflowType || 'document-approval',
                  priority: action.parameters.priority || 'medium',
                  itemId: data.itemId,
                  itemType: data.itemType,
                  assignees: action.parameters.assignees,
                });
              }
              break;
            case 'send-notification':
              toast({
                title: action.parameters.title || 'Automated Notification',
                description: action.parameters.message || 'An automated action has been triggered.',
              });
              break;
          }
        });
      });
  }, [automationRules, createWorkflow]);

  const getWorkflowsByItem = useCallback((itemId: string, itemType?: string) => {
    return workflows.filter(workflow => 
      workflow.itemId === itemId && 
      (!itemType || workflow.itemType === itemType)
    );
  }, [workflows]);

  const getActiveWorkflows = useCallback(() => {
    return workflows.filter(workflow => workflow.status === 'active');
  }, [workflows]);

  const getWorkflowProgress = useCallback((workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return 0;

    const completedSteps = workflow.steps.filter(step => step.status === 'completed').length;
    return workflow.steps.length > 0 ? (completedSteps / workflow.steps.length) * 100 : 0;
  }, [workflows]);

  return {
    workflows,
    automationRules,
    isLoading,
    createWorkflow,
    updateWorkflowStep,
    cancelWorkflow,
    createAutomationRule,
    triggerAutomation,
    getWorkflowsByItem,
    getActiveWorkflows,
    getWorkflowProgress,
  };
}