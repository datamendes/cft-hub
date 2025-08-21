import { useState, useEffect, useRef } from "react"
import { FileText, Upload, Search, Filter, Download, Eye, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useLoading, useAsyncOperation } from "@/hooks/use-loading"
import { documentService, type Document } from "@/services/document-service"
import { withErrorHandling, handleSuccess, handleError } from "@/lib/error-handling"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const sampleDocuments = [
  {
    id: 1,
    name: "CFT Agenda - January 2024.pdf",
    type: "agenda",
    date: "2024-01-10",
    size: "2.4 MB",
    meeting: "CFT-2024-01",
    status: "active"
  },
  {
    id: 2,
    name: "Antibiotic Protocol v2.1.pdf",
    type: "protocol",
    date: "2024-01-08",
    size: "1.8 MB",
    meeting: null,
    status: "approved"
  },
  {
    id: 3,
    name: "RAFP Immunotherapy.pdf",
    type: "rafp",
    date: "2024-01-05",
    size: "3.2 MB",
    meeting: "CFT-2024-01",
    status: "pending"
  }
]

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isLoading: isLoadingDocs, execute: loadDocuments } = useAsyncOperation<Document[]>()
  const { isLoading: isUploading, withLoading: withUploading } = useLoading()
  const { isLoading: isDownloading, withLoading: withDownloading } = useLoading()
  const { isLoading: isDeleting, withLoading: withDeleting } = useLoading()

  // Load documents on component mount
  useEffect(() => {
    loadDocuments(() => documentService.getDocuments(), {
      onSuccess: (data) => setDocuments(data),
      onError: (error) => handleError(error, "Failed to load documents")
    });
  }, [loadDocuments])

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await withUploading(async () => {
      const result = await withErrorHandling(
        () => documentService.uploadDocument(file, "General"),
        `Document "${file.name}" uploaded successfully`
      );
      if (result) {
        setDocuments(prev => [result, ...prev]);
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (id: string, name: string) => {
    await withDownloading(async () => {
      const blob = await withErrorHandling(
        () => documentService.downloadDocument(id),
        `Document "${name}" downloaded successfully`
      );
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleDeleteDocument = async (id: string, name: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Document",
      description: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      onConfirm: async () => {
        await withDeleting(async () => {
          const success = await withErrorHandling(
            () => documentService.deleteDocument(id),
            "Document deleted successfully"
          );
          if (success !== undefined) {
            setDocuments(prev => prev.filter(d => d.id !== id));
          }
        });
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
          <p className="text-muted-foreground mt-1">
            Centralization and organization of all CFT documents
          </p>
        </div>
        <Button 
          onClick={handleUploadClick}
          disabled={isUploading}
          aria-label="Upload new document"
        >
          {isUploading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-pulse" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          aria-label="Select document file"
        />
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => handleSuccess("Filter functionality coming soon")}
              aria-label="Open filter options"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Available Documents
          </CardTitle>
          <CardDescription>
            Complete list of CFT documents with search and filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(documents.length > 0 ? documents : sampleDocuments).map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {doc.category || (doc.type === "agenda" ? "Agenda" :
                       doc.type === "protocol" ? "Protocol" : "RAFP")}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.uploadedAt || doc.date}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>
                    {doc.meeting ? (
                      <Badge variant="secondary">{doc.meeting}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        doc.status === "active" ? "default" :
                        doc.status === "approved" ? "default" : "secondary"
                      }
                    >
                       {doc.status === "active" ? "Active" :
                        doc.status === "approved" ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSuccess("Preview functionality coming soon")}
                        aria-label={`Preview ${doc.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(doc.id, doc.name)}
                        disabled={isDownloading}
                        aria-label={`Download ${doc.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id, doc.name)}
                        disabled={isDeleting}
                        aria-label={`Delete ${doc.name}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Document Upload Area */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Upload Area</CardTitle>
          <CardDescription>
            Drag and drop your documents here or click to select
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-gradient-card">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Drag and drop your PDF files here
            </p>
            <Button 
              onClick={handleUploadClick}
              disabled={isUploading}
              aria-label="Select files to upload"
            >
              {isUploading ? "Uploading..." : "Select Files"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}