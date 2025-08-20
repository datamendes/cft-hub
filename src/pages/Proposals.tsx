import { useState } from "react"
import { Users, Plus, Search, Filter, FileText, Calendar, User } from "lucide-react"
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

const sampleProposals = [
  {
    id: "PROP-2024-001",
    title: "New antibiotic protocol",
    submittedBy: "Dr. Martin",
    date: "2024-01-10",
    status: "pending",
    priority: "high",
    type: "protocol",
    meeting: "CFT-2024-01",
    indication: "Nosocomial infection"
  },
  {
    id: "PROP-2024-002",
    title: "Chemotherapy protocol revision",
    submittedBy: "Dr. Dubois",
    date: "2024-01-09",
    status: "approved",
    priority: "medium",
    type: "revision",
    meeting: "CFT-2023-12",
    indication: "Oncology"
  },
  {
    id: "PROP-2024-003",
    title: "Immunotherapy drug addition",
    submittedBy: "Dr. Leroy",
    date: "2024-01-08",
    status: "rejected",
    priority: "low",
    type: "addition",
    meeting: "CFT-2023-12",
    indication: "Autoimmune"
  },
  {
    id: "PROP-2024-004",
    title: "Cardiac emergency protocol",
    submittedBy: "Dr. Rodriguez",
    date: "2024-01-07",
    status: "in_review",
    priority: "high",
    type: "protocol",
    meeting: "CFT-2024-01",
    indication: "Cardiology"
  }
]

export default function Proposals() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default"
      case "rejected": return "destructive"
      case "pending": return "secondary"
      case "in_review": return "outline"
      default: return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "Approved"
      case "rejected": return "Rejected"
      case "pending": return "Pending"
      case "in_review": return "In Review"
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proposal Management</h1>
          <p className="text-muted-foreground mt-1">
            Creation, tracking and evaluation of CFT proposals
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Proposal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">8</p>
              </div>
              <FileText className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-success">28</p>
              </div>
              <Calendar className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-primary">12</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
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

      {/* Proposals Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Proposal List
          </CardTitle>
          <CardDescription>
            Complete tracking of all proposals submitted to CFT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Indication</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-mono text-sm">{proposal.id}</TableCell>
                  <TableCell className="font-medium">{proposal.title}</TableCell>
                  <TableCell>{proposal.submittedBy}</TableCell>
                  <TableCell>{proposal.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{proposal.indication}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(proposal.priority)}>
                      {proposal.priority === "high" ? "High" :
                       proposal.priority === "medium" ? "Medium" : "Low"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(proposal.status)}>
                      {getStatusLabel(proposal.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{proposal.meeting}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-card border-primary/20 bg-gradient-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
          <CardDescription>
            Direct access to main features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Create Proposal
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Batch Import
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}