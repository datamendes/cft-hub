import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Users, 
  Plus, 
  Crown, 
  Shield, 
  Eye, 
  Mail,
  MoreVertical,
  UserPlus,
  Settings,
  Globe,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useCollaboration, type Team, type User } from '@/hooks/use-collaboration';

const roleIcons = {
  admin: Crown,
  reviewer: Shield,
  contributor: Users,
  viewer: Eye,
};

const roleColors = {
  admin: 'text-purple-600 bg-purple-100',
  reviewer: 'text-blue-600 bg-blue-100',
  contributor: 'text-green-600 bg-green-100',
  viewer: 'text-gray-600 bg-gray-100',
};

interface TeamCardProps {
  team: Team;
  onInvite: (teamId: string, email: string, role: User['role']) => void;
}

function TeamCard({ team, onInvite }: TeamCardProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<User['role']>('viewer');

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInvite(team.id, inviteEmail, inviteRole);
      setInviteEmail('');
      setInviteRole('viewer');
      setShowInviteDialog(false);
    }
  };

  const onlineMembers = team.members.filter(member => member.status === 'online');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{team.name}</CardTitle>
              {team.settings.isPublic ? (
                <Globe className="h-4 w-4 text-green-600" />
              ) : (
                <Lock className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <CardDescription>{team.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Team Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Members
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Members</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{team.members.length} total</Badge>
            <Badge variant="outline" className="text-green-600">
              {onlineMembers.length} online
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          {team.members.slice(0, 5).map((member) => {
            const RoleIcon = roleIcons[member.role];
            return (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${
                        member.status === 'online' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} 
                    />
                  </div>
                  <span className="text-sm font-medium">{member.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className={`text-xs ${roleColors[member.role]}`}>
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {member.role}
                  </Badge>
                </div>
              </div>
            );
          })}
          {team.members.length > 5 && (
            <p className="text-xs text-muted-foreground text-center">
              +{team.members.length - 5} more members
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(team.createdAt, { addSuffix: true })}
        </div>
      </CardContent>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to {team.name}</DialogTitle>
            <DialogDescription>
              Send an invitation to join this team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@hospital.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={(value: User['role']) => setInviteRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Can view content</SelectItem>
                  <SelectItem value="contributor">Contributor - Can add content</SelectItem>
                  <SelectItem value="reviewer">Reviewer - Can review and approve</SelectItem>
                  <SelectItem value="admin">Admin - Full access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
              <Mail className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function TeamManagement() {
  const { teams, createTeam, inviteToTeam, isLoading } = useCollaboration();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    members: [] as User[],
    settings: {
      isPublic: false,
      allowGuestAccess: false,
      defaultRole: 'viewer' as User['role'],
    },
  });

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) return;

    try {
      await createTeam(newTeam);
      setNewTeam({
        name: '',
        description: '',
        members: [],
        settings: {
          isPublic: false,
          allowGuestAccess: false,
          defaultRole: 'viewer',
        },
      });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleInviteToTeam = async (teamId: string, email: string, role: User['role']) => {
    try {
      await inviteToTeam(teamId, email, role);
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">
            Manage teams and collaborate with colleagues
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Set up a new team for collaboration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="e.g., Cardiology Review Team"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  placeholder="Describe the team's purpose and goals..."
                  value={newTeam.description}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-4">
                <Label>Team Settings</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Public Team</Label>
                      <p className="text-xs text-muted-foreground">
                        Anyone in the organization can find and join
                      </p>
                    </div>
                    <Switch
                      checked={newTeam.settings.isPublic}
                      onCheckedChange={(checked) => 
                        setNewTeam(prev => ({ 
                          ...prev, 
                          settings: { ...prev.settings, isPublic: checked } 
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Guest Access</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow external users to be invited
                      </p>
                    </div>
                    <Switch
                      checked={newTeam.settings.allowGuestAccess}
                      onCheckedChange={(checked) => 
                        setNewTeam(prev => ({ 
                          ...prev, 
                          settings: { ...prev.settings, allowGuestAccess: checked } 
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-role">Default Role for New Members</Label>
                    <Select 
                      value={newTeam.settings.defaultRole} 
                      onValueChange={(value: User['role']) => 
                        setNewTeam(prev => ({ 
                          ...prev, 
                          settings: { ...prev.settings, defaultRole: value } 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="contributor">Contributor</SelectItem>
                        <SelectItem value="reviewer">Reviewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam} disabled={!newTeam.name.trim() || isLoading}>
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teams */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first team to start collaborating with colleagues
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onInvite={handleInviteToTeam}
            />
          ))}
        </div>
      )}
    </div>
  );
}