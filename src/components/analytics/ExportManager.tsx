import { useState } from "react"
import { Download, FileText, BarChart3, CalendarDays, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const exportTypes = [
  { id: 'documents', name: 'Documents Report', icon: FileText, description: 'Document metrics and activity' },
  { id: 'analytics', name: 'Analytics Report', icon: BarChart3, description: 'Performance metrics and KPIs' },
  { id: 'meetings', name: 'Meetings Report', icon: CalendarDays, description: 'Meeting summaries and attendance' },
  { id: 'proposals', name: 'Proposals Report', icon: Users, description: 'Proposal status and metrics' },
]

const exportFormats = [
  { id: 'pdf', name: 'PDF Report', extension: '.pdf' },
  { id: 'excel', name: 'Excel Spreadsheet', extension: '.xlsx' },
  { id: 'csv', name: 'CSV Data', extension: '.csv' },
  { id: 'json', name: 'JSON Data', extension: '.json' },
]

export function ExportManager() {
  const [selectedType, setSelectedType] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("")
  const [dateRange, setDateRange] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    if (!selectedType || !selectedFormat) {
      toast({
        title: "Validation Error",
        description: "Please select both report type and format",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const reportType = exportTypes.find(t => t.id === selectedType)?.name
      const format = exportFormats.find(f => f.id === selectedFormat)
      
      // Create mock download
      const filename = `${selectedType}_report_${new Date().toISOString().split('T')[0]}${format?.extension}`
      
      toast({
        title: "Export Successful",
        description: `${reportType} has been exported as ${format?.name}`,
      })
      
      // In a real app, you would trigger the actual download here
      console.log(`Downloading: ${filename}`)
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the report",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Reports
        </CardTitle>
        <CardDescription>
          Generate and download comprehensive reports in various formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Report Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exportTypes.map((type) => (
              <div
                key={type.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedType === type.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex items-start gap-3">
                  <type.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{type.name}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Export Format</label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select export format" />
            </SelectTrigger>
            <SelectContent>
              {exportFormats.map((format) => (
                <SelectItem key={format.id} value={format.id}>
                  <div className="flex items-center gap-2">
                    <span>{format.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {format.extension}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Date Range (Optional)</label>
          <div className="text-sm text-muted-foreground border rounded-md p-3">
            Date range picker would be implemented here. For now, exports include all data.
          </div>
        </div>

        {/* Export Button */}
        <Button 
          onClick={handleExport}
          disabled={isExporting || !selectedType || !selectedFormat}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </CardContent>
    </Card>
  )
}