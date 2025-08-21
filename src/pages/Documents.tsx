import { useState, useEffect, useRef } from "react"
import { FileText, Upload, Download, Eye, Trash2, History, CheckSquare, Square, Archive } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useLoading, useAsyncOperation } from "@/hooks/use-loading"
import { documentService, type Document } from "@/services/document-service"
import { withErrorHandling, handleSuccess, handleError } from "@/lib/error-handling"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { DocumentPreviewDialog } from "@/components/documents/DocumentPreviewDialog"
import { DocumentVersionDialog } from "@/components/documents/DocumentVersionDialog"
import { DocumentFilters, type DocumentFilters as DocumentFiltersType } from "@/components/documents/DocumentFilters"
import { DocumentTableSkeleton } from "@/components/documents/DocumentTableSkeleton"
import { useKeyboardShortcuts, createCommonShortcuts } from "@/hooks/use-keyboard-shortcuts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set())
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [versionDocument, setVersionDocument] = useState<Document | null>(null)
  const [filters, setFilters] = useState<DocumentFiltersType>({
    search: '',
    category: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    uploadedBy: '',
    status: ''
  })
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
  const { isLoading: isBulkOperating, withLoading: withBulkOperating } = useLoading()
  const { isLoading: isDownloading, withLoading: withDownloading } = useLoading()
  const { isLoading: isDeleting, withLoading: withDeleting } = useLoading()

  // Load documents on component mount and when filters change
  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(value => value && value.trim() !== '');
    const filtersToUse = hasActiveFilters ? filters : undefined;
    
    loadDocuments(() => documentService.getDocuments(filtersToUse), {
      onSuccess: (data) => setDocuments(data),
      onError: (error) => handleError(error, "Failed to load documents")
    });
  }, [loadDocuments, filters])

  const handleBulkDelete = () => {
    const selectedIds = Array.from(selectedDocuments);
    const selectedNames = documents.filter(d => selectedIds.includes(d.id)).map(d => d.name);
    
    setConfirmDialog({
      open: true,
      title: "Delete Multiple Documents",
      description: `Are you sure you want to delete ${selectedIds.length} documents? This action cannot be undone.\n\nDocuments: ${selectedNames.slice(0, 3).join(', ')}${selectedNames.length > 3 ? '...' : ''}`,
      onConfirm: async () => {
        await withBulkOperating(async () => {
          const success = await withErrorHandling(
            () => documentService.bulkDelete(selectedIds),
            `${selectedIds.length} documents deleted successfully`
          );
          if (success !== undefined) {
            setDocuments(prev => prev.filter(d => !selectedIds.includes(d.id)));
            setSelectedDocuments(new Set());
          }
        });
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  const handleBulkDownload = async () => {
    const selectedIds = Array.from(selectedDocuments);
    
    await withBulkOperating(async () => {
      const blob = await withErrorHandling(
        () => documentService.bulkDownload(selectedIds),
        `${selectedIds.length} documents downloaded successfully`
      );
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `documents-${new Date().toISOString().split('T')[0]}.zip`;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  // Keyboard shortcuts
  const shortcuts = createCommonShortcuts({
    onNew: () => fileInputRef.current?.click(),
    onRefresh: () => {
      const hasActiveFilters = Object.values(filters).some(value => value && value.trim() !== '');
      const filtersToUse = hasActiveFilters ? filters : undefined;
      loadDocuments(() => documentService.getDocuments(filtersToUse), {
        onSuccess: (data) => setDocuments(data),
        onError: (error) => handleError(error, "Failed to refresh documents")
      });
    },
    onSelectAll: () => {
      if (selectedDocuments.size === documents.length) {
        setSelectedDocuments(new Set());
      } else {
        setSelectedDocuments(new Set(documents.map(d => d.id)));
      }
    },
    onDelete: () => {
      if (selectedDocuments.size > 0) {
        handleBulkDelete();
      }
    },
    onEscape: () => {
      setSelectedDocuments(new Set());
      setPreviewDocument(null);
      setVersionDocument(null);
    }
  });

  useKeyboardShortcuts(shortcuts);

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
        const a = window.document.createElement('a');
        a.href = url;
        a.download = name;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
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

  const handleDocumentSelect = (documentId: string, checked: boolean) => {
    const newSelected = new Set(selectedDocuments);
    if (checked) {
      newSelected.add(documentId);
    } else {
      newSelected.delete(documentId);
    }
    setSelectedDocuments(newSelected);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      dateFrom: '',
      dateTo: '',
      uploadedBy: '',
      status: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
          <p className="text-muted-foreground mt-1">
            Advanced document management with versioning, bulk operations, and search
          </p>
        </div>
        <div className="flex gap-2">
          {selectedDocuments.size > 0 && (
            <>
              <Button 
                variant="outline"
                onClick={handleBulkDownload}
                disabled={isBulkOperating}
              >
                <Download className="mr-2 h-4 w-4" />
                Download ({selectedDocuments.size})
              </Button>
              <Button 
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isBulkOperating}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedDocuments.size})
              </Button>
            </>
          )}
          <Button 
            onClick={handleUploadClick}
            disabled={isUploading}
            aria-label="Upload new document"
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
          className="hidden"
          aria-label="Select document file"
        />
      </div>

      {/* Advanced Filters */}
      <DocumentFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Documents Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Available Documents
              {selectedDocuments.size > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedDocuments.size} selected
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedDocuments.size === documents.length) {
                    setSelectedDocuments(new Set());
                  } else {
                    setSelectedDocuments(new Set(documents.map(d => d.id)));
                  }
                }}
                disabled={documents.length === 0}
              >
                {selectedDocuments.size === documents.length ? (
                  <>
                    <Square className="mr-1 h-3 w-3" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <CheckSquare className="mr-1 h-3 w-3" />
                    Select All
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Complete document management with versioning, bulk operations, and advanced search
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingDocs ? (
            <DocumentTableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={documents.length > 0 && selectedDocuments.size === documents.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDocuments(new Set(documents.map(d => d.id)));
                        } else {
                          setSelectedDocuments(new Set());
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No documents found. Upload your first document to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id} className={selectedDocuments.has(doc.id) ? "bg-muted/50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDocuments.has(doc.id)}
                          onCheckedChange={(checked) => handleDocumentSelect(doc.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            {doc.description && (
                              <p className="text-xs text-muted-foreground truncate max-w-48">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{doc.uploadedAt}</TableCell>
                      <TableCell className="text-sm">{doc.size}</TableCell>
                      <TableCell className="text-sm">{doc.uploadedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            v{doc.currentVersion}
                          </Badge>
                          {doc.versions && doc.versions.length > 1 && (
                            <span className="text-xs text-muted-foreground">
                              ({doc.versions.length} versions)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setPreviewDocument(doc)}
                            aria-label={`Preview ${doc.name}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setVersionDocument(doc)}
                            aria-label={`Version history for ${doc.name}`}
                          >
                            <History className="h-4 w-4" />
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Quick Upload
          </CardTitle>
          <CardDescription>
            Drag and drop files or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-gradient-card hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={handleUploadClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              if (files[0]) {
                const event = { target: { files } } as any;
                handleFileUpload(event);
              }
            }}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Drag and drop your documents here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports PDF, DOC, DOCX, XLS, XLSX, TXT files
            </p>
            <Button 
              disabled={isUploading}
              aria-label="Select files to upload"
            >
              {isUploading ? "Uploading..." : "Select Files"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DocumentPreviewDialog
        open={!!previewDocument}
        onOpenChange={(open) => !open && setPreviewDocument(null)}
        document={previewDocument}
        onDownload={(doc) => handleDownload(doc.id, doc.name)}
      />

      <DocumentVersionDialog
        open={!!versionDocument}
        onOpenChange={(open) => !open && setVersionDocument(null)}
        document={versionDocument}
        onDocumentUpdated={() => {
          const hasActiveFilters = Object.values(filters).some(value => value && value.trim() !== '');
          const filtersToUse = hasActiveFilters ? filters : undefined;
          loadDocuments(() => documentService.getDocuments(filtersToUse), {
            onSuccess: (data) => setDocuments(data),
            onError: (error) => handleError(error, "Failed to refresh documents")
          });
        }}
      />

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