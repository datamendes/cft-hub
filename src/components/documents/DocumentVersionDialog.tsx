import { useState } from "react";
import { History, Upload, RotateCcw, Calendar, User, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLoading } from "@/hooks/use-loading";
import { documentService, Document, DocumentVersion } from "@/services/document-service";
import { handleError, handleSuccess } from "@/lib/error-handling";

interface DocumentVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onDocumentUpdated: () => void;
}

export function DocumentVersionDialog({ 
  open, 
  onOpenChange, 
  document,
  onDocumentUpdated 
}: DocumentVersionDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [changeLog, setChangeLog] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { isLoading, withLoading } = useLoading();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadNewVersion = async () => {
    if (!selectedFile || !document || !changeLog.trim()) {
      handleError(new Error("Please select a file and provide a change log"));
      return;
    }

    try {
      setIsUploading(true);
      await documentService.uploadNewVersion(document.id, selectedFile, changeLog);
      handleSuccess("New version uploaded successfully");
      onDocumentUpdated();
      setSelectedFile(null);
      setChangeLog("");
    } catch (error) {
      handleError(error, "Failed to upload new version");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRevertToVersion = async (version: number) => {
    if (!document) return;

    try {
      await withLoading(async () => {
        await documentService.revertToVersion(document.id, version);
        handleSuccess(`Reverted to version ${version}`);
        onDocumentUpdated();
      });
    } catch (error) {
      handleError(error, "Failed to revert to version");
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setChangeLog("");
    onOpenChange(false);
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Version History - {document.name}
          </DialogTitle>
          <DialogDescription>
            Manage document versions, upload new versions, or revert to previous ones
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-auto">
          {/* Upload New Version Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Version
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newVersionFile">Select File</Label>
                <Input
                  id="newVersionFile"
                  type="file"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="changeLog">Change Log</Label>
                <Textarea
                  id="changeLog"
                  placeholder="Describe what changed in this version..."
                  value={changeLog}
                  onChange={(e) => setChangeLog(e.target.value)}
                  disabled={isUploading}
                  rows={3}
                />
              </div>
            </div>

            <Button 
              onClick={handleUploadNewVersion}
              disabled={isUploading || !selectedFile || !changeLog.trim()}
              className="w-full md:w-auto"
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Version {document.currentVersion + 1}...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Version {document.currentVersion + 1}
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Version History Table */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Version History
            </h3>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Change Log</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {document.versions
                    .sort((a, b) => b.version - a.version)
                    .map((version) => (
                    <TableRow key={version.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">v{version.version}</span>
                          {version.version === document.currentVersion && (
                            <Badge variant="default" className="text-xs">Current</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-3 w-3" />
                          {version.uploadedAt}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <User className="mr-1 h-3 w-3" />
                          {version.uploadedBy}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{version.size}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate" title={version.changeLog}>
                          {version.changeLog}
                        </p>
                      </TableCell>
                      <TableCell>
                        {version.version !== document.currentVersion && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevertToVersion(version.version)}
                            disabled={isLoading}
                          >
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Revert
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}