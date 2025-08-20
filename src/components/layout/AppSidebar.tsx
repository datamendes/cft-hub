import { useState } from "react"
import { 
  LayoutDashboard, 
  FileText, 
  CalendarDays, 
  Users, 
  BookOpen, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    badge: null
  },
  { 
    title: "Documents", 
    url: "/documents", 
    icon: FileText,
    badge: "12"
  },
  { 
    title: "Meetings", 
    url: "/meetings", 
    icon: CalendarDays,
    badge: "3"
  },
  { 
    title: "Proposals", 
    url: "/proposals", 
    icon: Users,
    badge: "8"
  },
  { 
    title: "Knowledge Base", 
    url: "/knowledge", 
    icon: BookOpen,
    badge: null
  },
]

const quickActions = [
  { title: "New Proposal", icon: Plus, action: "proposal" },
  { title: "Upload Document", icon: Plus, action: "document" },
]

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  return (
    <div 
      className={cn(
        "relative flex flex-col border-r border-border bg-gradient-surface transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">CFT</span>
            </div>
            <span className="font-semibold text-foreground">CFT Manager</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive(item.url)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "mr-3 h-5 w-5")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto h-5 px-2 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <>
            <Separator className="my-4 mx-4" />
            
            {/* Quick Actions */}
            <div className="px-4">
              <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Quick Actions
              </h3>
              <div className="space-y-1">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm font-medium"
                  >
                    <action.icon className="mr-3 h-4 w-4" />
                    {action.title}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <NavLink
          to="/settings"
          className={cn(
            "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            isActive("/settings")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "mr-3 h-5 w-5")} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </div>
  )
}