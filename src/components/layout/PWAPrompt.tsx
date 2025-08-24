import { useState, useEffect } from "react"
import { Smartphone, Download, X, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePWA } from "@/hooks/use-pwa"
import { useToast } from "@/hooks/use-toast"

export function PWAPrompt() {
  const { isInstallable, isInstalled, installApp, shareApp } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedDismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (storedDismissed === 'true') {
      setDismissed(true)
    }
  }, [])

  useEffect(() => {
    // Show prompt after 30 seconds if app is installable and not previously dismissed
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled && !dismissed) {
        setShowPrompt(true)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled, dismissed])

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      toast({
        title: "App Installed",
        description: "CFT Manager has been added to your home screen",
      })
      setShowPrompt(false)
    } else {
      toast({
        title: "Installation Failed",
        description: "Unable to install the app at this time",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const success = await shareApp({
      title: 'CFT Manager',
      text: 'Streamline your clinical trial management',
      url: window.location.origin,
    })
    
    if (success) {
      toast({
        title: "Shared Successfully",
        description: "CFT Manager link has been shared",
      })
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Don't show if already installed, not installable, or user previously dismissed
  if (isInstalled || !isInstallable || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Install CFT Manager</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-sm">
            Add to your home screen for quick access and offline use
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Install
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
