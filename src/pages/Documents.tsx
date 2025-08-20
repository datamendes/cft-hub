import { useState } from "react"
import { FileText, Upload, Search, Filter, Download, Eye } from "lucide-react"
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
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
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
            <Button variant="outline">
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
              {sampleDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {doc.type === "agenda" ? "Agenda" :
                       doc.type === "protocol" ? "Protocol" : "RAFP"}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.date}</TableCell>
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
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
            <Button>
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}