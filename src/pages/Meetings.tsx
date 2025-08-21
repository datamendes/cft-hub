import { useState, useEffect } from "react"
import { Calendar, Users, Clock, Plus, PlayCircle, Edit, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLoading, useAsyncOperation } from "@/hooks/use-loading"
import { meetingService, type Meeting } from "@/services/meeting-service"
import { withErrorHandling, handleSuccess, handleError } from "@/lib/error-handling"

const upcomingMeetings = [
  {
    id: 1,
    title: "CFT Monthly Review",
    date: "2024-01-15",
    time: "14:00",
    duration: "2h30",
    attendees: 12,
    proposals: 8,
    status: "scheduled",
    location: "Conference Room A"
  },
  {
    id: 2,
    title: "Emergency Protocol Review",
    date: "2024-01-18",
    time: "16:30",
    duration: "1h00",
    attendees: 8,
    proposals: 3,
    status: "urgent",
    location: "Meeting Room B"
  }
]

const recentMeetings = [
  {
    id: 3,
    title: "CFT December 2023",
    date: "2023-12-20",
    time: "14:00",
    attendees: 15,
    proposals: 12,
    approved: 9,
    rejected: 2,
    postponed: 1,
    status: "completed"
  },
  {
    id: 4,
    title: "November Urgent Review",
    date: "2023-11-28",
    time: "16:00",
    attendees: 10,
    proposals: 5,
    approved: 4,
    rejected: 1,
    postponed: 0,
    status: "completed"
  }
]

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])

  const { isLoading: isLoadingMeetings, execute: loadMeetings } = useAsyncOperation<Meeting[]>()
  const { isLoading: isCreating, withLoading: withCreating } = useLoading()
  const { isLoading: isJoining, withLoading: withJoining } = useLoading()
  const { isLoading: isUpdating, withLoading: withUpdating } = useLoading()

  // Load meetings on component mount
  useEffect(() => {
    loadMeetings(() => meetingService.getMeetings(), {
      onSuccess: (data) => setMeetings(data),
      onError: (error) => handleError(error, "Failed to load meetings")
    });
  }, [loadMeetings])

  const handleCreateMeeting = async () => {
    await withCreating(async () => {
      const newMeeting = {
        title: "New CFT Meeting",
        date: new Date().toISOString().split('T')[0],
        time: "14:00",
        type: "regular" as const,
        status: "scheduled" as const,
        attendees: 0,
        proposalsCount: 0,
        location: "Conference Room A"
      };
      
      const result = await withErrorHandling(
        () => meetingService.createMeeting(newMeeting),
        "Meeting created successfully"
      );
      if (result) {
        setMeetings(prev => [result, ...prev]);
      }
    });
  };

  const handleJoinMeeting = async (id: string, title: string) => {
    await withJoining(async () => {
      const meetingUrl = await withErrorHandling(
        () => meetingService.joinMeeting(id),
        `Joining meeting: ${title}`
      );
      if (meetingUrl) {
        window.open(meetingUrl, '_blank');
      }
    });
  };

  const handleEditMeeting = async (id: string) => {
    handleSuccess("Edit meeting functionality coming soon");
  };

  const handleMeetingMode = () => {
    handleSuccess("Meeting mode will provide a full-screen interface for conducting meetings");
  };

  const handleViewMinutes = (title: string) => {
    handleSuccess(`Viewing minutes for ${title} - functionality coming soon`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meeting Management</h1>
          <p className="text-muted-foreground mt-1">
            Planning and tracking of CFT meetings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={handleMeetingMode}
            aria-label="Enter meeting mode"
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Meeting Mode
          </Button>
          <Button 
            onClick={handleCreateMeeting}
            disabled={isCreating}
            aria-label="Create new meeting"
          >
            {isCreating ? (
              <>
                <Plus className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Meeting
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Meetings
          </CardTitle>
          <CardDescription>
            Scheduled meetings with status and detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {(meetings.length > 0 ? meetings.filter(m => m.status === 'scheduled') : upcomingMeetings).map((meeting) => (
              <Card key={meeting.id} className="border border-border bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground">{meeting.location}</p>
                    </div>
                    <Badge 
                      variant={meeting.status === "urgent" ? "destructive" : "default"}
                    >
                      {meeting.status === "urgent" ? "Urgent" : "Scheduled"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{meeting.date} à {meeting.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Estimated duration: {meeting.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{meeting.attendees} participants</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {meeting.proposals} proposals to review
                    </span>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditMeeting(meeting.id)}
                        disabled={isUpdating}
                        aria-label={`Edit ${meeting.title}`}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleJoinMeeting(meeting.id, meeting.title)}
                        disabled={isJoining}
                        aria-label={`Join ${meeting.title}`}
                      >
                        {isJoining ? (
                          "Joining..."
                        ) : (
                          <>
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Meetings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Recent Meetings
          </CardTitle>
          <CardDescription>
            Meeting history with results and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMeetings.map((meeting) => (
              <Card key={meeting.id} className="border border-border bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {meeting.date} à {meeting.time} • {meeting.attendees} participants
                      </p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-success">{meeting.approved}</p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-destructive">{meeting.rejected}</p>
                      <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-warning">{meeting.postponed}</p>
                      <p className="text-xs text-muted-foreground">Postponed</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-primary">{meeting.proposals}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewMinutes(meeting.title)}
                      aria-label={`View minutes for ${meeting.title}`}
                    >
                      View Minutes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meeting Mode Section */}
      <Card className="shadow-card border-primary/20 bg-gradient-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <PlayCircle className="mr-2 h-5 w-5" />
            Meeting Mode
          </CardTitle>
          <CardDescription>
            Dedicated interface for real-time meeting management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <PlayCircle className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start a Meeting Session</h3>
            <p className="text-muted-foreground mb-6">
              Full-screen interface to present proposals and record decisions
            </p>
            <Button 
              size="lg" 
              className="bg-primary"
              onClick={handleMeetingMode}
              aria-label="Enter meeting mode for full-screen presentation"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Enter Meeting Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}