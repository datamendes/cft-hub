import { useState, useEffect } from "react";
import { Shield, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLoading } from "@/hooks/use-loading";
import { settingsService, AuditLogEntry } from "@/services/settings-service";
import { handleError, handleSuccess } from "@/lib/error-handling";

interface AuditLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDialog({ open, onOpenChange }: AuditLogDialogProps) {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const { isLoading, withLoading } = useLoading();
  const { isLoading: isExporting, withLoading: withExporting } = useLoading();

  useEffect(() => {
    if (open) {
      loadAuditLog();
    }
  }, [open]);

  const loadAuditLog = async () => {
    try {
      await withLoading(async () => {
        const log = await settingsService.getAuditLog();
        setAuditLog(log);
      });
    } catch (error) {
      handleError(error, "Failed to load audit log");
    }
  };

  const handleExport = async () => {
    try {
      await withExporting(async () => {
        const logData = auditLog.map(entry => ({
          timestamp: entry.timestamp,
          user: entry.user,
          action: entry.action,
          details: entry.details,
          ip: entry.ip
        }));
        
        const csvContent = [
          'Timestamp,User,Action,Details,IP Address',
          ...logData.map(entry => 
            `"${entry.timestamp}","${entry.user}","${entry.action}","${entry.details}","${entry.ip}"`
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        handleSuccess("Audit log exported successfully");
      });
    } catch (error) {
      handleError(error, "Failed to export audit log");
    }
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action.toLowerCase()) {
      case 'document upload':
      case 'proposal approval':
        return 'default';
      case 'meeting created':
        return 'secondary';
      case 'profile update':
      case 'settings update':
        return 'outline';
      case 'data export':
      case 'data import':
        return 'secondary';
      case 'azure ad reconfiguration':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Audit Log
          </DialogTitle>
          <DialogDescription>
            Complete record of system activities and user actions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {auditLog.length} recent entries
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              disabled={isExporting || auditLog.length === 0}
            >
              {isExporting ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </>
              )}
            </Button>
          </div>

          <div className="border rounded-md max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading audit log...
                    </TableCell>
                  </TableRow>
                ) : auditLog.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No audit entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLog.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs">
                        {entry.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.user}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(entry.action)}>
                          {entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {entry.details}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.ip}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}