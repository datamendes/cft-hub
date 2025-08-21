import { useState, useEffect } from "react";
import { FileText, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { documentService, Document } from "@/services/document-service";
import { handleError } from "@/lib/error-handling";

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onDownload?: (document: Document) => void;
}

export function DocumentPreviewDialog({ 
  open, 
  onOpenChange, 
  document,
  onDownload 
}: DocumentPreviewDialogProps) {
  const [preview, setPreview] = useState<{ content: string; type: string } | null>(null);
  const { isLoading, withLoading } = useLoading();

  useEffect(() => {
    if (open && document) {
      loadPreview();
    } else {
      setPreview(null);
    }
  }, [open, document]);

  const loadPreview = async () => {
    if (!document) return;
    
    try {
      await withLoading(async () => {
        const previewData = await documentService.getDocumentPreview(document.id);
        setPreview(previewData);
      });
    } catch (error) {
      handleError(error, "Failed to load document preview");
    }
  };

  const handleDownload = () => {
    if (document && onDownload) {
      onDownload(document);
    }
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5" />
                {document.name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {document.description || "Document preview"}
              </DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{document.type}</Badge>
                <Badge variant="secondary">{document.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Version {document.currentVersion} • {document.size} • {document.uploadedAt}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {onDownload && (
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full border rounded-md">
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="space-y-2 mt-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ) : preview ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {preview.content}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Preview not available for this document type</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {document.tags && document.tags.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-1">
              <span className="text-sm text-muted-foreground mr-2">Tags:</span>
              {document.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}