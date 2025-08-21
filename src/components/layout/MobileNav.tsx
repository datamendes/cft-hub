import { useState } from "react"
import { Menu, X } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const navigationItems = [
  { title: "Dashboard", url: "/", badge: null },
  { title: "Documents", url: "/documents", badge: "12" },
  { title: "Meetings", url: "/meetings", badge: "3" },
  { title: "Proposals", url: "/proposals", badge: "8" },
  { title: "Knowledge Base", url: "/knowledge", badge: null },
  { title: "Workflows", url: "/workflows", badge: "2" },
  { title: "Analytics", url: "/analytics", badge: null },
  { title: "Collaboration", url: "/collaboration", badge: "5" },
  { title: "Security", url: "/security", badge: null },
  { title: "Settings", url: "/settings", badge: null },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden h-9 w-9 p-0"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">CFT</span>
            </div>
            CFT Manager
          </SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                isActive(item.url)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="h-5 px-2 text-xs">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}