/**
 * src/services/api/reportService.ts
 * Statistics and export helpers for the Reports module.
 */
import { db } from '../../mock/database';
import type { Project, Contract } from '../../types';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export interface SystemStats {
  totalProjects: number;
  activeProjects: number;
  overdueProjects: number;
  completedProjects: number;
  totalBudget: number;
  disbursedBudget: number;
  contractsTotal: number;
  contractsActive: number;
  contractsPending: number;
}

export const reportService = {
  // GET /api/reports/dashboard
  async getStats(): Promise<SystemStats> {
    await delay();
    const projects = db.projects;
    const contracts = db.contracts;
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'dang_thuc_hien').length,
      overdueProjects: projects.filter(p => p.status === 'tre_han').length,
      completedProjects: projects.filter(p => p.status === 'da_nghiem_thu').length,
      totalBudget: projects.reduce((s, p) => s + p.budget, 0),
      disbursedBudget: projects.reduce((s, p) => s + p.advancedAmount, 0),
      contractsTotal: contracts.length,
      contractsActive: contracts.filter(c => c.status === 'da_ky').length,
      contractsPending: contracts.filter(c => c.status === 'cho_duyet').length,
    };
  },

  // GET /api/reports/topics
  async getProjectsByField(): Promise<{ field: string; count: number }[]> {
    await delay(200);
    const map: Record<string, number> = {};
    db.projects.forEach(p => { map[p.field] = (map[p.field] || 0) + 1; });
    return Object.entries(map).map(([field, count]) => ({ field, count }));
  },

  // GET /api/reports/progress
  async getProjectsByStatus(): Promise<{ status: Project['status']; count: number }[]> {
    await delay(200);
    const map: Record<string, number> = {};
    db.projects.forEach(p => { map[p.status] = (map[p.status] || 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({ status: status as Project['status'], count }));
  },

  // GET /api/reports/export?type={type}&format={format}
  async exportReport(_type: string, _format: 'pdf' | 'excel'): Promise<{ url: string }> {
    await delay(800);
    // In production this would call a backend PDF/Excel generator
    return { url: '#mock-export' };
  },
};
