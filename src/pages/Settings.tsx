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
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Configuration du système et gestion des préférences
        </p>
      </div>

      {/* User Profile */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Profil utilisateur
          </CardTitle>
          <CardDescription>
            Informations personnelles et préférences de compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" defaultValue="Dr. Rodriguez" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" defaultValue="Maria" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="dr.rodriguez@hospital.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Input id="role" defaultValue="Administrateur CFT" disabled />
            </div>
          </div>
          <Button>Sauvegarder les modifications</Button>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5" />
            Paramètres système
          </CardTitle>
          <CardDescription>
            Configuration générale de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications pour les nouvelles propositions
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mode sombre automatique</Label>
              <p className="text-sm text-muted-foreground">
                Basculer automatiquement selon l'heure du système
              </p>
            </div>
            <Switch />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sauvegarde automatique</Label>
              <p className="text-sm text-muted-foreground">
                Synchronisation automatique avec le cloud
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
            Sécurité et accès
          </CardTitle>
          <CardDescription>
            Gestion des permissions et sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Connexion Azure AD</Label>
            <div className="flex items-center space-x-2">
              <Input defaultValue="Connecté - hospital.onmicrosoft.com" disabled />
              <Button variant="outline">Reconfigurer</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Niveau d'accès</Label>
            <Input defaultValue="Administrateur - Accès complet" disabled />
          </div>
          
          <div className="space-y-2">
            <Label>Journal d'audit</Label>
            <p className="text-sm text-muted-foreground">
              Toutes les actions sont enregistrées pour audit
            </p>
            <Button variant="outline" size="sm">
              Voir le journal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Gestion des données
          </CardTitle>
          <CardDescription>
            Import/export et sauvegarde des données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Export des données</Label>
              <p className="text-sm text-muted-foreground">
                Exporter toutes les données en format JSON
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exporter les données
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Import des données</Label>
              <p className="text-sm text-muted-foreground">
                Importer des données depuis un fichier JSON
              </p>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Importer des données
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Stockage local</Label>
            <p className="text-sm text-muted-foreground">
              Fonctionnement hors-ligne avec IndexedDB
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <span className="text-sm text-muted-foreground">65% utilisé</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}