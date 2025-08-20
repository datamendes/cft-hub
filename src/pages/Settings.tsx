import { Settings as SettingsIcon, User, Shield, Database, Download, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function Settings() {
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
              <Input id="firstName" defaultValue="Dr. Rodriguez" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Maria" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="dr.rodriguez@hospital.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="CFT Administrator" disabled />
            </div>
          </div>
          <Button>Save Changes</Button>
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
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch automatically based on system time
              </p>
            </div>
            <Switch />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatic cloud synchronization
              </p>
            </div>
            <Switch defaultChecked />
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
              <Input defaultValue="Connected - hospital.onmicrosoft.com" disabled />
              <Button variant="outline">Reconfigure</Button>
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
            <Button variant="outline" size="sm">
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
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Data Import</Label>
              <p className="text-sm text-muted-foreground">
                Import data from JSON file
              </p>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
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
                <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <span className="text-sm text-muted-foreground">65% used</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}