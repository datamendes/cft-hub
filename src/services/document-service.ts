export interface DocumentVersion {
  id: string;
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  size: string;
  changeLog?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'active' | 'archived' | 'draft';
  category: string;
  versions: DocumentVersion[];
  currentVersion: number;
  tags?: string[];
  description?: string;
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
      category: 'Guidelines',
      currentVersion: 2,
      tags: ['antibiotics', 'guidelines', 'therapy'],
      description: 'Updated antibiotic therapy guidelines for 2024',
      versions: [
        {
          id: '1-v1',
          version: 1,
          uploadedAt: '2024-01-08',
          uploadedBy: 'Dr. Martin',
          size: '2.2 MB',
          changeLog: 'Initial version'
        },
        {
          id: '1-v2',
          version: 2,
          uploadedAt: '2024-01-10',
          uploadedBy: 'Dr. Martin',
          size: '2.4 MB',
          changeLog: 'Updated dosage recommendations for pediatric patients'
        }
      ]
    },
    {
      id: '2',
      name: 'Chemotherapy Protocols',
      type: 'PDF',
      size: '3.1 MB',
      uploadedBy: 'Dr. Dubois',
      uploadedAt: '2024-01-09',
      status: 'active',
      category: 'Protocols',
      currentVersion: 1,
      tags: ['chemotherapy', 'oncology', 'protocols'],
      description: 'Standard chemotherapy protocols and procedures',
      versions: [
        {
          id: '2-v1',
          version: 1,
          uploadedAt: '2024-01-09',
          uploadedBy: 'Dr. Dubois',
          size: '3.1 MB',
          changeLog: 'Initial protocol document'
        }
      ]
    }
  ];

  async getDocuments(filters?: {
    search?: string;
    category?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    uploadedBy?: string;
    status?: string;
  }): Promise<Document[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filtered = [...this.documents];
    
    if (filters) {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(doc =>
          doc.name.toLowerCase().includes(searchTerm) ||
          doc.category.toLowerCase().includes(searchTerm) ||
          doc.description?.toLowerCase().includes(searchTerm) ||
          doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      if (filters.category) {
        filtered = filtered.filter(doc => doc.category === filters.category);
      }
      
      if (filters.type) {
        filtered = filtered.filter(doc => doc.type === filters.type);
      }
      
      if (filters.uploadedBy) {
        filtered = filtered.filter(doc => doc.uploadedBy === filters.uploadedBy);
      }
      
      if (filters.status) {
        filtered = filtered.filter(doc => doc.status === filters.status);
      }
      
      if (filters.dateFrom) {
        filtered = filtered.filter(doc => doc.uploadedAt >= filters.dateFrom!);
      }
      
      if (filters.dateTo) {
        filtered = filtered.filter(doc => doc.uploadedAt <= filters.dateTo!);
      }
    }
    
    return filtered;
  }

  async uploadDocument(file: File, category: string, description?: string, tags?: string[]): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDocument: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.split('/')[1].toUpperCase(),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      category,
      currentVersion: 1,
      description,
      tags: tags || [],
      versions: [
        {
          id: `${Math.random().toString(36).substr(2, 9)}-v1`,
          version: 1,
          uploadedAt: new Date().toISOString().split('T')[0],
          uploadedBy: 'Current User',
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          changeLog: 'Initial upload'
        }
      ]
    };
    
    this.documents.unshift(newDocument);
    return newDocument;
  }

  async uploadNewVersion(documentId: string, file: File, changeLog: string): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const documentIndex = this.documents.findIndex(d => d.id === documentId);
    if (documentIndex === -1) {
      throw new Error('Document not found');
    }
    
    const document = this.documents[documentIndex];
    const newVersion = document.currentVersion + 1;
    
    const newVersionData: DocumentVersion = {
      id: `${documentId}-v${newVersion}`,
      version: newVersion,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      changeLog
    };
    
    document.versions.push(newVersionData);
    document.currentVersion = newVersion;
    document.size = newVersionData.size;
    document.uploadedAt = newVersionData.uploadedAt;
    
    return document;
  }

  async revertToVersion(documentId: string, version: number): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const documentIndex = this.documents.findIndex(d => d.id === documentId);
    if (documentIndex === -1) {
      throw new Error('Document not found');
    }
    
    const document = this.documents[documentIndex];
    const targetVersion = document.versions.find(v => v.version === version);
    
    if (!targetVersion) {
      throw new Error('Version not found');
    }
    
    document.currentVersion = version;
    document.size = targetVersion.size;
    document.uploadedAt = targetVersion.uploadedAt;
    
    return document;
  }

  async bulkDelete(documentIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.documents = this.documents.filter(doc => !documentIds.includes(doc.id));
  }

  async bulkDownload(documentIds: string[]): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const documents = this.documents.filter(doc => documentIds.includes(doc.id));
    if (documents.length === 0) {
      throw new Error('No documents found');
    }
    
    // Create a mock ZIP file content
    const content = documents.map(doc => 
      `File: ${doc.name}\nSize: ${doc.size}\nUploaded: ${doc.uploadedAt}\nBy: ${doc.uploadedBy}\n\n`
    ).join('---\n\n');
    
    return new Blob([content], { type: 'application/zip' });
  }

  async getDocumentPreview(id: string): Promise<{ content: string; type: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const document = this.documents.find(d => d.id === id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Mock preview content
    const content = `Preview of ${document.name}\n\nThis is a mock preview of the document content.\n\nDocument Details:\n- Category: ${document.category}\n- Size: ${document.size}\n- Uploaded: ${document.uploadedAt}\n- Version: ${document.currentVersion}\n\nContent would be displayed here...`;
    
    return {
      content,
      type: document.type.toLowerCase()
    };
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