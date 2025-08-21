import { useState, useEffect } from "react"
import { BookOpen, Search, Upload, Tag, FileText, Download, Eye, Trash2 } from "lucide-react"
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
import { DocumentUploadDialog } from "@/components/dialogs/DocumentUploadDialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useLoading } from "@/hooks/use-loading"
import { knowledgeService, KnowledgeDocument, KnowledgeCategory } from "@/services/knowledge-service"
import { handleError, handleSuccess } from "@/lib/error-handling"

export default function Knowledge() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [categories, setCategories] = useState<KnowledgeCategory[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {}
  })
  
  const { isLoading, withLoading } = useLoading()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchTerm || selectedCategory) {
      searchDocuments()
    } else {
      loadDocuments()
    }
  }, [searchTerm, selectedCategory])

  const loadData = async () => {
    try {
      await withLoading(async () => {
        const [documentsData, categoriesData] = await Promise.all([
          knowledgeService.getDocuments(),
          knowledgeService.getCategories()
        ])
        setDocuments(documentsData)
        setCategories(categoriesData)
      })
    } catch (error) {
      handleError(error, "Failed to load knowledge base")
    }
  }

  const loadDocuments = async () => {
    try {
      const documentsData = await knowledgeService.getDocuments()
      setDocuments(documentsData)
    } catch (error) {
      handleError(error, "Failed to load documents")
    }
  }

  const searchDocuments = async () => {
    try {
      const documentsData = await knowledgeService.getDocuments(searchTerm, selectedCategory)
      setDocuments(documentsData)
    } catch (error) {
      handleError(error, "Failed to search documents")
    }
  }

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? "" : categoryName)
  }

  const handleViewDocument = async (document: KnowledgeDocument) => {
    try {
      await withLoading(async () => {
        const docData = await knowledgeService.viewDocument(document.id)
        // You could open a modal here to display the document content
        handleSuccess(`Viewing: ${docData.title}`)
      })
    } catch (error) {
      handleError(error, "Failed to view document")
    }
  }

  const handleDownloadDocument = async (document: KnowledgeDocument) => {
    try {
      await withLoading(async () => {
        const blob = await knowledgeService.downloadDocument(document.id)
        const url = URL.createObjectURL(blob)
        const a = window.document.createElement('a')
        a.href = url
        a.download = `${document.title}.pdf`
        window.document.body.appendChild(a)
        a.click()
        window.document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        handleSuccess("Document downloaded successfully")
        // Refresh to update download count
        await loadDocuments()
      })
    } catch (error) {
      handleError(error, "Failed to download document")
    }
  }

  const handleDeleteDocument = (document: KnowledgeDocument) => {
    setConfirmDialog({
      open: true,
      title: "Delete Document",
      description: `Are you sure you want to delete "${document.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await withLoading(async () => {
            await knowledgeService.deleteDocument(document.id)
            handleSuccess("Document deleted successfully")
            await loadData() // Reload both documents and categories
          })
        } catch (error) {
          handleError(error, "Failed to delete document")
        }
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

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
          <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">
            Central repository of CFT reference documents and guides
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Add Document
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
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
            Categories
          </CardTitle>
          <CardDescription>
            Navigation by area of expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Card 
                key={category.name} 
                className={`border border-border bg-gradient-card cursor-pointer hover:shadow-md transition-shadow ${
                  selectedCategory === category.name ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
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
            Available Documents
          </CardTitle>
          <CardDescription>
            Complete collection of knowledge resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading documents...
                  </TableCell>
                </TableRow>
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm || selectedCategory ? "No documents found matching your criteria" : "No documents available"}
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((item) => (
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
                         item.type === "reference" ? "Reference" :
                         item.type === "procedure" ? "Procedure" : "Database"}
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDocument(item)}
                          disabled={isLoading}
                          aria-label={`View ${item.title}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadDocument(item)}
                          disabled={isLoading}
                          aria-label={`Download ${item.title}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteDocument(item)}
                          disabled={isLoading}
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Featured Resources */}
      <Card className="shadow-card border-accent/20 bg-gradient-accent/5">
        <CardHeader>
          <CardTitle className="text-accent">Recommended Resources</CardTitle>
          <CardDescription>
            Most consulted documents and essential references
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-border bg-gradient-card">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <h4 className="font-semibold text-sm">Evaluation Guide</h4>
                    <p className="text-xs text-muted-foreground">Proposal evaluation methodology</p>
                    <Badge variant="outline" className="mt-2 text-xs">156 views</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border bg-gradient-card">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h4 className="font-semibold text-sm">Drug Reference</h4>
                    <p className="text-xs text-muted-foreground">Complete list of approved medications</p>
                    <Badge variant="outline" className="mt-2 text-xs">234 views</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border bg-gradient-card">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h4 className="font-semibold text-sm">CFT Procedures</h4>
                    <p className="text-xs text-muted-foreground">Internal procedures guide</p>
                    <Badge variant="outline" className="mt-2 text-xs">189 views</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onDocumentAdded={loadData}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  )
}