/**
 * src/services/api/projectService.ts
 * CRUD operations for research projects.
 */
import { db, logAction } from '../../mock/database';
import type { Project } from '../../types';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const projectService = {
  // GET /api/research-staff/projects
  async getAll(): Promise<Project[]> {
    await delay();
    return [...db.projects];
  },

  // GET /api/research-staff/projects/{id}
  async getById(id: string): Promise<Project | undefined> {
    await delay(150);
    return db.projects.find(p => p.id === id || p.code === id);
  },

  // GET /api/research-staff/projects?status={status}
  async getByStatus(status: Project['status']): Promise<Project[]> {
    await delay();
    return db.projects.filter(p => p.status === status);
  },

  // GET /api/project-owner/projects
  async getByOwnerEmail(ownerEmail: string): Promise<Project[]> {
    await delay();
    // In a real API, the backend would filter by user FK.
    // For demo, we return the "owner" account's project (id=8).
    const project = db.projects.find(p => p.id === '8');
    return project ? [project] : db.projects.slice(0, 2);
  },

  // PUT /api/research-staff/projects/{id}/status
  async updateStatus(id: string, status: Project['status'], actorName: string): Promise<void> {
    await delay(300);
    const p = db.projects.find(p => p.id === id);
    if (p) {
      p.status = status;
      logAction(actorName, `Cập nhật trạng thái đề tài ${p.code} → ${status}`, 'Projects');
    }
  },
};
