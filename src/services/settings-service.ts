export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface SystemSettings {
  emailNotifications: boolean;
  automaticDarkMode: boolean;
  automaticBackup: boolean;
}

export interface SecuritySettings {
  azureAdConnection: string;
  accessLevel: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ip: string;
}

class SettingsService {
  private userProfile: UserProfile = {
    firstName: 'Dr. Rodriguez',
    lastName: 'Maria',
    email: 'dr.rodriguez@hospital.com',
    role: 'CFT Administrator'
  };

  private systemSettings: SystemSettings = {
    emailNotifications: true,
    automaticDarkMode: false,
    automaticBackup: true
  };

  private securitySettings: SecuritySettings = {
    azureAdConnection: 'Connected - hospital.onmicrosoft.com',
    accessLevel: 'Administrator - Full Access'
  };

  private auditLog: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-21 14:30:25',
      user: 'Dr. Rodriguez',
      action: 'Document Upload',
      details: 'Uploaded "Antibiotic Guidelines 2024.pdf"',
      ip: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: '2024-01-21 13:15:42',
      user: 'Dr. Martin',
      action: 'Proposal Approval',
      details: 'Approved proposal "New Chemotherapy Protocol"',
      ip: '192.168.1.102'
    },
    {
      id: '3',
      timestamp: '2024-01-21 11:45:18',
      user: 'Dr. Dubois',
      action: 'Meeting Created',
      details: 'Created emergency CFT meeting for tomorrow',
      ip: '192.168.1.105'
    }
  ];

  async getUserProfile(): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.userProfile };
  }

  async updateUserProfile(profile: UserProfile): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 800));
    this.userProfile = { ...profile };
    
    // Add to audit log
    this.auditLog.unshift({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      user: profile.firstName + ' ' + profile.lastName,
      action: 'Profile Update',
      details: 'Updated user profile information',
      ip: '192.168.1.100'
    });
    
    return { ...this.userProfile };
  }

  async getSystemSettings(): Promise<SystemSettings> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...this.systemSettings };
  }

  async updateSystemSettings(settings: SystemSettings): Promise<SystemSettings> {
    await new Promise(resolve => setTimeout(resolve, 600));
    this.systemSettings = { ...settings };
    
    // Add to audit log
    this.auditLog.unshift({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      user: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      action: 'Settings Update',
      details: 'Updated system settings',
      ip: '192.168.1.100'
    });
    
    return { ...this.systemSettings };
  }

  async reconfigureAzureAD(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate reconfiguration
    const newConnection = 'Reconfigured - hospital.onmicrosoft.com';
    this.securitySettings.azureAdConnection = newConnection;
    
    // Add to audit log
    this.auditLog.unshift({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      user: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      action: 'Azure AD Reconfiguration',
      details: 'Reconfigured Azure AD connection',
      ip: '192.168.1.100'
    });
    
    return newConnection;
  }

  async getAuditLog(): Promise<AuditLogEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.auditLog];
  }

  async exportData(): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const exportData = {
      userProfile: this.userProfile,
      systemSettings: this.systemSettings,
      securitySettings: this.securitySettings,
      auditLog: this.auditLog,
      exportedAt: new Date().toISOString(),
      exportedBy: this.userProfile.firstName + ' ' + this.userProfile.lastName
    };
    
    // Add to audit log
    this.auditLog.unshift({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      user: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      action: 'Data Export',
      details: 'Exported all system data',
      ip: '192.168.1.100'
    });
    
    const jsonString = JSON.stringify(exportData, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  async importData(file: File): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Validate and import data
      if (importedData.userProfile) {
        this.userProfile = { ...importedData.userProfile };
      }
      if (importedData.systemSettings) {
        this.systemSettings = { ...importedData.systemSettings };
      }
      
      // Add to audit log
      this.auditLog.unshift({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleString(),
        user: this.userProfile.firstName + ' ' + this.userProfile.lastName,
        action: 'Data Import',
        details: `Imported data from ${file.name}`,
        ip: '192.168.1.100'
      });
      
    } catch (error) {
      throw new Error('Invalid import file format');
    }
  }

  async getStorageUsage(): Promise<{ used: number; total: number; percentage: number }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate storage calculation
    const used = 650; // MB
    const total = 1000; // MB
    const percentage = Math.round((used / total) * 100);
    
    return { used, total, percentage };
  }
}

export const settingsService = new SettingsService();