export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'active' | 'archived' | 'draft';
  category: string;
}

class DocumentService {
  private documents: Document[] = [
    {
      id: '1',
      name: 'Antibiotic Guidelines 2024',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'Dr. Martin',
      uploadedAt: '2024-01-10',
      status: 'active',
      category: 'Guidelines'
    },
    {
      id: '2',
      name: 'Chemotherapy Protocols',
      type: 'PDF',
      size: '3.1 MB',
      uploadedBy: 'Dr. Dubois',
      uploadedAt: '2024-01-09',
      status: 'active',
      category: 'Protocols'
    }
  ];

  async getDocuments(): Promise<Document[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...this.documents];
  }

  async uploadDocument(file: File, category: string): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDocument: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.split('/')[1].toUpperCase(),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      category
    };
    
    this.documents.unshift(newDocument);
    return newDocument;
  }

  async deleteDocument(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    this.documents.splice(index, 1);
  }

  async downloadDocument(id: string): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const document = this.documents.find(d => d.id === id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Simulate file download
    return new Blob(['Mock document content'], { type: 'application/pdf' });
  }
}

export const documentService = new DocumentService();