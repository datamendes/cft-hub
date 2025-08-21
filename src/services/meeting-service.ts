export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'regular' | 'emergency' | 'special';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  attendees: number;
  proposalsCount: number;
  location: string;
}

class MeetingService {
  private meetings: Meeting[] = [
    {
      id: '1',
      title: 'Monthly CFT Review',
      date: '2024-01-15',
      time: '14:00',
      type: 'regular',
      status: 'scheduled',
      attendees: 12,
      proposalsCount: 8,
      location: 'Conference Room A'
    },
    {
      id: '2',
      title: 'Emergency Protocol Review',
      date: '2024-01-18',
      time: '16:30',
      type: 'emergency',
      status: 'scheduled',
      attendees: 8,
      proposalsCount: 3,
      location: 'Online'
    }
  ];

  async getMeetings(): Promise<Meeting[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.meetings];
  }

  async createMeeting(data: Omit<Meeting, 'id'>): Promise<Meeting> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newMeeting: Meeting = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    this.meetings.unshift(newMeeting);
    return newMeeting;
  }

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.meetings.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Meeting not found');
    }
    
    this.meetings[index] = { ...this.meetings[index], ...updates };
    return this.meetings[index];
  }

  async deleteMeeting(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.meetings.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Meeting not found');
    }
    
    this.meetings.splice(index, 1);
  }

  async joinMeeting(id: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const meeting = this.meetings.find(m => m.id === id);
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    
    // Return a mock meeting URL
    return `https://meet.cft.medical/room/${id}`;
  }
}

export const meetingService = new MeetingService();