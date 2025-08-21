import { useState } from "react"
import { Plus, Settings, BarChart3, PieChart, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AdvancedChart } from "./AdvancedChart"

const availableWidgets = [
  { id: 'documents_trend', name: 'Documents Trend', type: 'line', icon: BarChart3 },
  { id: 'proposal_status', name: 'Proposal Status', type: 'pie', icon: PieChart },
  { id: 'team_performance', name: 'Team Performance', type: 'bar', icon: Users },
  { id: 'kpi_overview', name: 'KPI Overview', type: 'metric', icon: TrendingUp },
]

interface DashboardWidget {
  id: string
  name: string
  type: string
  position: { row: number; col: number }
  size: 'small' | 'medium' | 'large'
  visible: boolean
}

export function CustomDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    { id: 'documents_trend', name: 'Documents Trend', type: 'line', position: { row: 0, col: 0 }, size: 'large', visible: true },
    { id: 'proposal_status', name: 'Proposal Status', type: 'pie', position: { row: 0, col: 1 }, size: 'medium', visible: true },
    { id: 'team_performance', name: 'Team Performance', type: 'bar', position: { row: 1, col: 0 }, size: 'medium', visible: true },
  ])
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [newWidgetDialog, setNewWidgetDialog] = useState(false)

  const addWidget = (widgetType: string) => {
    const widget = availableWidgets.find(w => w.id === widgetType)
    if (!widget) return

    const newWidget: DashboardWidget = {
      id: widget.id + '_' + Date.now(),
      name: widget.name,
      type: widget.type,
      position: { row: widgets.length, col: 0 },
      size: 'medium',
      visible: true
    }

    setWidgets([...widgets, newWidget])
    setNewWidgetDialog(false)
  }

  const updateWidget = (id: string, updates: Partial<DashboardWidget>) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, ...updates } : w))
  }

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id))
  }

  const getSampleData = (type: string) => {
    switch (type) {
      case 'line':
        return {
          data: [
            { month: 'Jan', value: 45 },
            { month: 'Feb', value: 52 },
            { month: 'Mar', value: 48 },
            { month: 'Apr', value: 61 },
            { month: 'May', value: 55 },
            { month: 'Jun', value: 67 }
          ]
        }
      case 'pie':
        return {
          data: [
            { name: 'Draft', value: 30, fill: 'hsl(var(--primary))' },
            { name: 'Review', value: 25, fill: 'hsl(var(--accent))' },
            { name: 'Approved', value: 35, fill: 'hsl(var(--success))' },
            { name: 'Rejected', value: 10, fill: 'hsl(var(--destructive))' }
          ]
        }
      case 'bar':
        return {
          data: [
            { team: 'Clinical', score: 85 },
            { team: 'Regulatory', score: 92 },
            { team: 'Quality', score: 78 },
            { team: 'Data', score: 88 }
          ]
        }
      default:
        return { data: [] }
    }
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Custom Dashboard</h2>
          <p className="text-muted-foreground">Configure your personalized analytics view</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={newWidgetDialog} onOpenChange={setNewWidgetDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Widget</DialogTitle>
                <DialogDescription>Choose a widget to add to your dashboard</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {availableWidgets.map((widget) => (
                  <Card
                    key={widget.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => addWidget(widget.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <widget.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">{widget.name}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {widget.type}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline"
            onClick={() => setIsConfiguring(!isConfiguring)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.filter(w => w.visible).map((widget) => (
          <Card key={widget.id} className={`${widget.size === 'large' ? 'md:col-span-2' : ''} relative`}>
            {isConfiguring && (
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeWidget(widget.id)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{widget.name}</CardTitle>
              {isConfiguring && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`visible-${widget.id}`} className="text-xs">Visible</Label>
                    <Switch
                      id={`visible-${widget.id}`}
                      checked={widget.visible}
                      onCheckedChange={(checked) => updateWidget(widget.id, { visible: checked })}
                    />
                  </div>
                  <Select
                    value={widget.size}
                    onValueChange={(size: 'small' | 'medium' | 'large') => 
                      updateWidget(widget.id, { size })
                    }
                  >
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="h-48">
                <AdvancedChart
                  type={widget.type as any}
                  data={getSampleData(widget.type).data}
                  height={200}
                  xAxisKey={widget.type === 'line' ? 'month' : widget.type === 'bar' ? 'team' : 'name'}
                  yAxisKeys={widget.type === 'line' ? ['value'] : widget.type === 'bar' ? ['score'] : ['value']}
                  colors={['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--destructive))']}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {widgets.filter(w => w.visible).length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No widgets configured</h3>
            <p className="text-muted-foreground mb-4">Add widgets to customize your dashboard</p>
            <Button onClick={() => setNewWidgetDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Widget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}