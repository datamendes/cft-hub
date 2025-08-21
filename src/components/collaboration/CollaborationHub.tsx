import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommentSystem } from './CommentSystem';
import { TeamManagement } from './TeamManagement';
import { ActivityFeed } from './ActivityFeed';
import { CollaborationPresence } from './CollaborationPresence';

export function CollaborationHub() {
  const [activeTab, setActiveTab] = useState('activity');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Collaboration Hub</h1>
        <p className="text-muted-foreground">
          Connect, communicate, and collaborate with your team
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="teams">Team Management</TabsTrigger>
          <TabsTrigger value="presence">Live Collaboration</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6">
          <ActivityFeed />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="presence" className="mt-6">
          <CollaborationPresence />
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <div className="max-w-4xl">
            <CommentSystem itemId="demo-document" itemType="document" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}