import { QboCompany } from '../types/mcp.js';

class CompanyManager {
  private companies: Map<string, QboCompany> = new Map();
  private activeCompanyId: string = 'comp-101';
  private safeModeEnabled: boolean = true; // Prevents destructive actions unless explicitly disarmed

  constructor() {
    this.seedDefaultCompanies();
  }

  private seedDefaultCompanies() {
    const defaults: QboCompany[] = [
      {
        id: 'comp-101',
        realmId: '913035298172101',
        name: 'Apex Global Technologies',
        legalName: 'Apex Global Technologies Inc.',
        country: 'US',
        currency: 'USD',
        environment: 'sandbox',
        status: 'connected',
        role: 'financial_admin',
        clientId: 'ABx98Yza...IntuitProd',
        tokenExpiresAt: new Date(Date.now() + 3600 * 1000 * 12).toISOString(),
        lastSyncAt: new Date().toISOString(),
        fiscalYearStartMonth: 'January'
      },
      {
        id: 'comp-102',
        realmId: '913035298172102',
        name: 'Meridian Distribution LLC',
        legalName: 'Meridian Supply & Logistics LLC',
        country: 'US',
        currency: 'USD',
        environment: 'production',
        status: 'connected',
        role: 'read_write',
        clientId: 'PRD-77291...IntuitLive',
        tokenExpiresAt: new Date(Date.now() + 3600 * 1000 * 8).toISOString(),
        lastSyncAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        fiscalYearStartMonth: 'January'
      },
      {
        id: 'comp-103',
        realmId: '913035298172103',
        name: 'Horizon Cloud Software',
        legalName: 'Horizon SaaS Holdings Inc.',
        country: 'US',
        currency: 'USD',
        environment: 'sandbox',
        status: 'connected',
        role: 'read_only',
        clientId: 'SBX-44910...IntuitDev',
        tokenExpiresAt: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
        lastSyncAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
        fiscalYearStartMonth: 'January'
      },
      {
        id: 'comp-104',
        realmId: '913035298172104',
        name: 'Sterling Retail UK Group',
        legalName: 'Sterling Retail International Ltd',
        country: 'GB',
        currency: 'GBP',
        environment: 'production',
        status: 'connected',
        role: 'read_write',
        clientId: 'GB-PRD-1029...IntuitEU',
        tokenExpiresAt: new Date(Date.now() + 3600 * 1000 * 18).toISOString(),
        lastSyncAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        fiscalYearStartMonth: 'April'
      }
    ];

    defaults.forEach((c) => this.companies.set(c.id, c));
  }

  public getCompanies(): QboCompany[] {
    return Array.from(this.companies.values());
  }

  public getCompany(idOrRealm: string): QboCompany | undefined {
    if (this.companies.has(idOrRealm)) {
      return this.companies.get(idOrRealm);
    }
    for (const comp of this.companies.values()) {
      if (comp.realmId === idOrRealm) return comp;
    }
    return undefined;
  }

  public getActiveCompany(): QboCompany {
    const comp = this.companies.get(this.activeCompanyId);
    if (!comp) {
      const first = Array.from(this.companies.values())[0];
      this.activeCompanyId = first.id;
      return first;
    }
    return comp;
  }

  public setActiveCompany(id: string): boolean {
    if (this.companies.has(id)) {
      this.activeCompanyId = id;
      return true;
    }
    return false;
  }

  public addCompany(company: Omit<QboCompany, 'id' | 'lastSyncAt'>): QboCompany {
    const id = `comp-${Date.now().toString(36)}`;
    const newComp: QboCompany = {
      ...company,
      id,
      lastSyncAt: new Date().toISOString()
    };
    this.companies.set(id, newComp);
    return newComp;
  }

  public updateCompany(id: string, updates: Partial<QboCompany>): QboCompany | undefined {
    const existing = this.companies.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, lastSyncAt: new Date().toISOString() };
    this.companies.set(id, updated);
    return updated;
  }

  public deleteCompany(id: string): boolean {
    if (this.companies.size <= 1) return false;
    const deleted = this.companies.delete(id);
    if (this.activeCompanyId === id) {
      this.activeCompanyId = Array.from(this.companies.keys())[0];
    }
    return deleted;
  }

  public isSafeMode(): boolean {
    return this.safeModeEnabled;
  }

  public setSafeMode(enabled: boolean): void {
    this.safeModeEnabled = enabled;
  }
}

export const companyManager = new CompanyManager();
