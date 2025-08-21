export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  submittedBy: string;
  submittedAt: string;
  type: string;
}

class ProposalService {
  private proposals: Proposal[] = [
    {
      id: '1',
      title: 'New Antibiotic Protocol',
      description: 'Implementation of new antibiotic resistance protocols',
      status: 'pending',
      priority: 'high',
      submittedBy: 'Dr. Martin',
      submittedAt: '2024-01-10',
      type: 'protocol'
    },
    {
      id: '2',
      title: 'Chemotherapy Protocol Revision',
      description: 'Updated chemotherapy dosing guidelines',
      status: 'approved',
      priority: 'medium',
      submittedBy: 'Dr. Dubois',
      submittedAt: '2024-01-09',
      type: 'revision'
    }
  ];

  async getProposals(): Promise<Proposal[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.proposals];
  }

  async createProposal(data: Omit<Proposal, 'id' | 'submittedAt'>): Promise<Proposal> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProposal: Proposal = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString().split('T')[0]
    };
    
    this.proposals.unshift(newProposal);
    return newProposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = this.proposals.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Proposal not found');
    }
    
    this.proposals[index] = { ...this.proposals[index], ...updates };
    return this.proposals[index];
  }

  async deleteProposal(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.proposals.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Proposal not found');
    }
    
    this.proposals.splice(index, 1);
  }

  async exportProposals(): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const csvContent = [
      'ID,Title,Status,Priority,Submitted By,Date',
      ...this.proposals.map(p => 
        `${p.id},"${p.title}",${p.status},${p.priority},"${p.submittedBy}",${p.submittedAt}`
      )
    ].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  }
}

export const proposalService = new ProposalService();