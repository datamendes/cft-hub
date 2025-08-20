import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: "increase" | "decrease" | "neutral"
  }
  icon: LucideIcon
  className?: string
  gradient?: "primary" | "accent" | "success" | "warning"
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className,
  gradient = "primary" 
}: KPICardProps) {
  const gradientClasses = {
    primary: "bg-gradient-primary",
    accent: "bg-gradient-accent", 
    success: "from-success to-success/80",
    warning: "from-warning to-warning/80"
  }

  return (
    <Card className={cn("overflow-hidden shadow-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <div className="flex items-center space-x-2">
                <span 
                  className={cn(
                    "text-xs font-medium",
                    change.type === "increase" && "text-success",
                    change.type === "decrease" && "text-destructive",
                    change.type === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change.value}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-xl",
            gradientClasses[gradient]
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}