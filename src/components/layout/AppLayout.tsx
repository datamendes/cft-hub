import { useState } from "react"
import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"
import { PWAPrompt } from "./PWAPrompt"
import { useIsMobile } from "@/hooks/use-mobile"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <AppSidebar 
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* PWA Install Prompt */}
      <PWAPrompt />
    </div>
  )
}