export interface KnowledgeDocument {
  id: string;
  title: string;
  type: 'guide' | 'reference' | 'procedure' | 'database';
  category: string;
  date: string;
  size: string;
  downloads: number;
  tags: string[];
  uploadedBy: string;
  content?: string;
}

export interface KnowledgeCategory {
  name: string;
  count: number;
  color: string;
}

class KnowledgeService {
  private documents: KnowledgeDocument[] = [
    {
      id: '1',
      title: 'Pharmaceutical Good Practices Guide',
      type: 'guide',
      category: 'Best Practices',
      date: '2023-12-15',
      size: '4.2 MB',
      downloads: 156,
      tags: ['pharmacy', 'protocol', 'quality'],
      uploadedBy: 'Dr. Martin',
      content: 'Comprehensive guide on pharmaceutical best practices...'
    },
    {
      id: '2',
      title: 'Antibiotic Reference Guide 2024',
      type: 'reference',
      category: 'Medications',
      date: '2024-01-01',
      size: '2.8 MB',
      downloads: 89,
      tags: ['antibiotics', 'dosage', 'indications'],
      uploadedBy: 'Dr. Dubois',
      content: 'Complete antibiotic reference with dosages...'
    },
    {
      id: '3',
      title: 'RAFP Evaluation Procedure',
      type: 'procedure',
      category: 'Processes',
      date: '2023-11-20',
      size: '1.5 MB',
      downloads: 234,
      tags: ['rafp', 'evaluation', 'procedure'],
      uploadedBy: 'Dr. Rodriguez',
      content: 'Step-by-step RAFP evaluation procedure...'
    },
    {
      id: '4',
      title: 'Drug Interactions Database',
      type: 'database',
      category: 'Reference',
      date: '2024-01-05',
      size: '8.7 MB',
      downloads: 67,
      tags: ['interactions', 'safety', 'database'],
      uploadedBy: 'Dr. Chen',
      content: 'Comprehensive drug interactions database...'
    }
  ];

  private categories: KnowledgeCategory[] = [
    { name: 'Best Practices', count: 12, color: 'primary' },
    { name: 'Medications', count: 25, color: 'accent' },
    { name: 'Processes', count: 8, color: 'success' },
    { name: 'Reference', count: 15, color: 'warning' }
  ];

  async getDocuments(searchTerm?: string, category?: string): Promise<KnowledgeDocument[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...this.documents];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        doc.tags.some(tag => tag.toLowerCase().includes(term)) ||
        doc.category.toLowerCase().includes(term)
      );
    }
    
    if (category) {
      filtered = filtered.filter(doc => doc.category === category);
    }
    
    return filtered;
  }

  async getCategories(): Promise<KnowledgeCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.categories];
  }

  async addDocument(file: File, category: string, tags: string[]): Promise<KnowledgeDocument> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDocument: KnowledgeDocument = {
      id: Math.random().toString(36).substr(2, 9),
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      type: this.getDocumentType(file.type),
      category,
      date: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      downloads: 0,
      tags,
      uploadedBy: 'Current User',
      content: 'Document content will be processed...'
    };
    
    this.documents.unshift(newDocument);
    
    // Update category count
    const categoryIndex = this.categories.findIndex(c => c.name === category);
    if (categoryIndex !== -1) {
      this.categories[categoryIndex].count++;
    }
    
    return newDocument;
  }

  async downloadDocument(id: string): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const document = this.documents.find(d => d.id === id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Increment download count
    document.downloads++;
    
    // Create a mock PDF blob
    const content = `Knowledge Document: ${document.title}\n\n${document.content || 'Document content...'}`;
    return new Blob([content], { type: 'application/pdf' });
  }

  async viewDocument(id: string): Promise<KnowledgeDocument> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const document = this.documents.find(d => d.id === id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    return document;
  }

  async deleteDocument(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    const document = this.documents[index];
    this.documents.splice(index, 1);
    
    // Update category count
    const categoryIndex = this.categories.findIndex(c => c.name === document.category);
    if (categoryIndex !== -1) {
      this.categories[categoryIndex].count--;
    }
  }

  private getDocumentType(mimeType: string): 'guide' | 'reference' | 'procedure' | 'database' {
    if (mimeType.includes('pdf')) return 'guide';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'database';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'procedure';
    return 'reference';
  }
}

export const knowledgeService = new KnowledgeService();