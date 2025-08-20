import { useState } from "react"
import { BookOpen, Search, Upload, Tag, FileText, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const knowledgeItems = [
  {
    id: 1,
    title: "Guide des bonnes pratiques pharmaceutiques",
    type: "guide",
    category: "Bonnes pratiques",
    date: "2023-12-15",
    size: "4.2 MB",
    downloads: 156,
    tags: ["pharmacie", "protocole", "qualité"]
  },
  {
    id: 2,
    title: "Référentiel antibiotiques 2024",
    type: "reference",
    category: "Médicaments",
    date: "2024-01-01",
    size: "2.8 MB",
    downloads: 89,
    tags: ["antibiotiques", "posologie", "indications"]
  },
  {
    id: 3,
    title: "Procédure d'évaluation des RAFP",
    type: "procedure",
    category: "Processus",
    date: "2023-11-20",
    size: "1.5 MB",
    downloads: 234,
    tags: ["rafp", "évaluation", "procédure"]
  },
  {
    id: 4,
    title: "Base de données interactions médicamenteuses",
    type: "database",
    category: "Référence",
    date: "2024-01-05",
    size: "8.7 MB",
    downloads: 67,
    tags: ["interactions", "sécurité", "base de données"]
  }
]

const categories = [
  { name: "Bonnes pratiques", count: 12, color: "primary" },
  { name: "Médicaments", count: 25, color: "accent" },
  { name: "Processus", count: 8, color: "success" },
  { name: "Référence", count: 15, color: "warning" }
]

export default function Knowledge() {
  const [searchTerm, setSearchTerm] = useState("")

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide": return "📖"
      case "reference": return "📚"
      case "procedure": return "📋"
      case "database": return "🗃️"
      default: return "📄"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Base de Connaissances</h1>
          <p className="text-muted-foreground mt-1">
            Repository central des documents de référence et guides du CFT
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Ajouter un document
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans la base de connaissances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Catégories
          </CardTitle>
          <CardDescription>
            Navigation par domaine d'expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.name} className="border border-border bg-gradient-card cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">{category.count}</p>
                  <p className="text-xs text-muted-foreground">documents</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base Items */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Documents disponibles
          </CardTitle>
          <CardDescription>
            Collection complète des ressources de connaissances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Téléchargements</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {knowledgeItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getTypeIcon(item.type)}</span>
                      <div>
                        <p className="font-medium">{item.title}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.type === "guide" ? "Guide" :
                       item.type === "reference" ? "Référence" :
                       item.type === "procedure" ? "Procédure" : "Base de données"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.downloads}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Featured Resources */}
      <Card className="shadow-card border-accent/20 bg-gradient-accent/5">
        <CardHeader>
          <CardTitle className="text-accent">Ressources recommandées</CardTitle>
          <CardDescription>
            Documents les plus consultés et références essentielles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-border bg-gradient-card">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <h4 className="font-semibold text-sm">Guide d'évaluation</h4>
                    <p className="text-xs text-muted-foreground">Méthodologie d'évaluation des propositions</p>
                    <Badge variant="outline" className="mt-2 text-xs">156 vues</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border bg-gradient-card">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h4 className="font-semibold text-sm">Référentiel médicaments</h4>
                    <p className="text-xs text-muted-foreground">Liste complète des médicaments autorisés</p>
                    <Badge variant="outline" className="mt-2 text-xs">234 vues</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border bg-gradient-card">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h4 className="font-semibold text-sm">Procédures CFT</h4>
                    <p className="text-xs text-muted-foreground">Guide des procédures internes</p>
                    <Badge variant="outline" className="mt-2 text-xs">189 vues</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}