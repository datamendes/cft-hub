import { useState, useEffect } from "react"
import { Settings as SettingsIcon, User, Shield, Database, Download, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AuditLogDialog } from "@/components/dialogs/AuditLogDialog"
import { useLoading } from "@/hooks/use-loading"
import { settingsService, UserProfile, SystemSettings } from "@/services/settings-service"
import { handleError, handleSuccess } from "@/lib/error-handling"

export default function Settings() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  })
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    emailNotifications: true,
    automaticDarkMode: false,
    automaticBackup: true
  })
  const [auditDialogOpen, setAuditDialogOpen] = useState(false)
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 0, percentage: 0 })
  
  const { isLoading: isLoadingProfile, withLoading: withLoadingProfile } = useLoading()
  const { isLoading: isLoadingSettings, withLoading: withLoadingSettings } = useLoading()
  const { isLoading: isReconfiguring, withLoading: withReconfiguring } = useLoading()
  const { isLoading: isExporting, withLoading: withExporting } = useLoading()
  const { isLoading: isImporting, withLoading: withImporting } = useLoading()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const [profileData, settingsData, storageData] = await Promise.all([
        settingsService.getUserProfile(),
        settingsService.getSystemSettings(),
        settingsService.getStorageUsage()
      ])
      setUserProfile(profileData)
      setSystemSettings(settingsData)
      setStorageInfo(storageData)
    } catch (error) {
      handleError(error, "Failed to load settings")
    }
  }

  const handleProfileSave = async () => {
    try {
      await withLoadingProfile(async () => {
        const updatedProfile = await settingsService.updateUserProfile(userProfile)
        setUserProfile(updatedProfile)
        handleSuccess("Profile updated successfully")
      })
    } catch (error) {
      handleError(error, "Failed to update profile")
    }
  }

  const handleSystemSettingsChange = async (key: keyof SystemSettings, value: boolean) => {
    const newSettings = { ...systemSettings, [key]: value }
    setSystemSettings(newSettings)
    
    try {
      await withLoadingSettings(async () => {
        await settingsService.updateSystemSettings(newSettings)
        handleSuccess("Settings updated successfully")
      })
    } catch (error) {
      handleError(error, "Failed to update settings")
      // Revert on error
      setSystemSettings(systemSettings)
    }
  }

  const handleReconfigureAzure = async () => {
    try {
      await withReconfiguring(async () => {
        const newConnection = await settingsService.reconfigureAzureAD()
        handleSuccess(`Azure AD reconfigured: ${newConnection}`)
      })
    } catch (error) {
      handleError(error, "Failed to reconfigure Azure AD")
    }
  }

  const handleExportData = async () => {
    try {
      await withExporting(async () => {
        const blob = await settingsService.exportData()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `cft-data-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        handleSuccess("Data exported successfully")
      })
    } catch (error) {
      handleError(error, "Failed to export data")
    }
  }

  const handleImportData = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      try {
        await withImporting(async () => {
          await settingsService.importData(file)
          handleSuccess("Data imported successfully")
          await loadSettings() // Reload settings
        })
      } catch (error) {
        handleError(error, "Failed to import data")
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          System configuration and preference management
        </p>
      </div>

      {/* User Profile */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            User Profile
          </CardTitle>
          <CardDescription>
            Personal information and account preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={userProfile.firstName}
                onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={isLoadingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={userProfile.lastName}
                onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={isLoadingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={userProfile.email}
                onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoadingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={userProfile.role} disabled />
            </div>
          </div>
          <Button onClick={handleProfileSave} disabled={isLoadingProfile}>
            {isLoadingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            General application configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for new proposals
              </p>
            </div>
            <Switch 
              checked={systemSettings.emailNotifications}
              onCheckedChange={(checked) => handleSystemSettingsChange('emailNotifications', checked)}
              disabled={isLoadingSettings}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch automatically based on system time
              </p>
            </div>
            <Switch 
              checked={systemSettings.automaticDarkMode}
              onCheckedChange={(checked) => handleSystemSettingsChange('automaticDarkMode', checked)}
              disabled={isLoadingSettings}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatic cloud synchronization
              </p>
            </div>
            <Switch 
              checked={systemSettings.automaticBackup}
              onCheckedChange={(checked) => handleSystemSettingsChange('automaticBackup', checked)}
              disabled={isLoadingSettings}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security and Access
          </CardTitle>
          <CardDescription>
            Permission management and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Azure AD Connection</Label>
            <div className="flex items-center space-x-2">
              <Input value="Connected - hospital.onmicrosoft.com" disabled />
              <Button 
                variant="outline" 
                onClick={handleReconfigureAzure}
                disabled={isReconfiguring}
              >
                {isReconfiguring ? "Reconfiguring..." : "Reconfigure"}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Access Level</Label>
            <Input defaultValue="Administrator - Full Access" disabled />
          </div>
          
          <div className="space-y-2">
            <Label>Audit Log</Label>
            <p className="text-sm text-muted-foreground">
              All actions are recorded for audit
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setAuditDialogOpen(true)}
            >
              View Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Data import/export and backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Data Export</Label>
              <p className="text-sm text-muted-foreground">
                Export all data in JSON format
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Download className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Data Import</Label>
              <p className="text-sm text-muted-foreground">
                Import data from JSON file
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleImportData}
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Local Storage</Label>
            <p className="text-sm text-muted-foreground">
              Offline functionality with IndexedDB
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${storageInfo.percentage}%` }}></div>
              </div>
              <span className="text-sm text-muted-foreground">
                {storageInfo.percentage}% used ({storageInfo.used}/{storageInfo.total} MB)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AuditLogDialog
        open={auditDialogOpen}
        onOpenChange={setAuditDialogOpen}
      />
    </div>
  )
}