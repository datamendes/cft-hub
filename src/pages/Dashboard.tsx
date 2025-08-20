import { FileText, Users, Calendar, CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KPICard } from "@/components/dashboard/KPICard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts"

// Sample data
const proposalsByMonth = [
  { month: "Jan", proposals: 12, approved: 8 },
  { month: "Feb", proposals: 15, approved: 11 },
  { month: "Mar", proposals: 18, approved: 14 },
  { month: "Apr", proposals: 22, approved: 16 },
  { month: "May", proposals: 19, approved: 15 },
  { month: "Jun", proposals: 25, approved: 20 },
]

const proposalsByType = [
  { name: "Nouveaux médicaments", value: 45, color: "hsl(var(--primary))" },
  { name: "Révisions", value: 30, color: "hsl(var(--accent))" },
  { name: "Protocoles", value: 15, color: "hsl(var(--success))" },
  { name: "Autres", value: 10, color: "hsl(var(--warning))" },
]

const chartConfig = {
  proposals: {
    label: "Proposals",
    color: "hsl(var(--primary))",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--accent))",
  },
}

const upcomingMeetings = [
  {
    id: 1,
    title: "CFT Monthly Review",
    date: "2024-01-15",
    time: "14:00",
    proposals: 8,
    status: "scheduled"
  },
  {
    id: 2,
    title: "Emergency Protocol Review",
    date: "2024-01-18",
    time: "16:30",
    proposals: 3,
    status: "urgent"
  },
  {
    id: 3,
    title: "Annual Budget Meeting",
    date: "2024-01-22",
    time: "09:00",
    proposals: 12,
    status: "scheduled"
  }
]

const recentProposals = [
  {
    id: 1,
    title: "Nouveau protocole antibiotiques",
    status: "pending",
    submittedBy: "Dr. Martin",
    date: "2024-01-10",
    priority: "high"
  },
  {
    id: 2,
    title: "Révision protocole chimiothérapie",
    status: "approved",
    submittedBy: "Dr. Dubois",
    date: "2024-01-09",
    priority: "medium"
  },
  {
    id: 3,
    title: "Ajout médicament immunothérapie",
    status: "rejected",
    submittedBy: "Dr. Leroy",
    date: "2024-01-08",
    priority: "low"
  }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard CFT</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble des activités du Comité de Pharmacie et Thérapeutique
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Nouvelle proposition
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Propositions actives"
          value={42}
          change={{ value: "+12%", type: "increase" }}
          icon={FileText}
          gradient="primary"
        />
        <KPICard
          title="Réunions ce mois"
          value={3}
          change={{ value: "+1", type: "increase" }}
          icon={Calendar}
          gradient="accent"
        />
        <KPICard
          title="Taux d'approbation"
          value="78%"
          change={{ value: "+5%", type: "increase" }}
          icon={CheckCircle}
          gradient="success"
        />
        <KPICard
          title="En attente"
          value={8}
          change={{ value: "-2", type: "decrease" }}
          icon={Clock}
          gradient="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Proposals Timeline */}
        <Card className="lg:col-span-4 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Évolution des propositions
            </CardTitle>
            <CardDescription>
              Nombre de propositions soumises et approuvées par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <BarChart data={proposalsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="proposals" fill="var(--color-proposals)" radius={4} />
                <Bar dataKey="approved" fill="var(--color-approved)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Proposal Types */}
        <Card className="lg:col-span-3 shadow-card">
          <CardHeader>
            <CardTitle>Types de propositions</CardTitle>
            <CardDescription>
              Répartition par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <PieChart>
                <Pie
                  data={proposalsByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {proposalsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Upcoming Meetings */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Meetings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Prochaines réunions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-gradient-card"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{meeting.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {meeting.date} à {meeting.time}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {meeting.proposals} propositions à examiner
                    </p>
                  </div>
                  <Badge 
                    variant={meeting.status === "urgent" ? "destructive" : "secondary"}
                  >
                    {meeting.status === "urgent" ? "Urgent" : "Programmé"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Proposals */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Propositions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-gradient-card"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{proposal.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Par {proposal.submittedBy} • {proposal.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        proposal.priority === "high" ? "destructive" : 
                        proposal.priority === "medium" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {proposal.priority}
                    </Badge>
                    <Badge 
                      variant={
                        proposal.status === "approved" ? "default" :
                        proposal.status === "rejected" ? "destructive" : "secondary"
                      }
                    >
                      {proposal.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}