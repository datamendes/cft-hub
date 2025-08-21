import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { ExportManager } from '@/components/analytics/ExportManager'
import { CustomDashboard } from '@/components/analytics/CustomDashboard'

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your CFT management performance
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-fit">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="custom">Custom Views</TabsTrigger>
          <TabsTrigger value="export">Export Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <CustomDashboard />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <ExportManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}