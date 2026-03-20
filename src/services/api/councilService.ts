/**
 * src/services/api/councilService.ts
 * Council creation, management, and evaluation operations.
 */
import { db, logAction } from '../../mock/database';
import type { Council, CouncilMember } from '../../types';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const councilService = {
  // GET /api/research-staff/councils
  async getAll(): Promise<Council[]> {
    await delay();
    return [...db.councils];
  },

  // GET /api/research-staff/councils/{id}
  async getById(id: string): Promise<Council | undefined> {
    await delay(150);
    return db.councils.find(c => c.id === id || c.decisionCode === id);
  },

  // POST /api/research-staff/councils
  async create(projectCode: string, projectTitle: string, members: CouncilMember[], actorName: string): Promise<Council> {
    await delay(500);
    const council: Council = {
      id: String(Date.now()),
      decisionCode: `QĐ/${new Date().getFullYear()}/${String(db.councils.length + 1).padStart(3, '0')}`,
      projectCode,
      projectTitle,
      createdDate: new Date().toLocaleDateString('vi-VN'),
      status: 'cho_danh_gia',
      members,
    };
    db.councils.push(council);
    logAction(actorName, `Thành lập Hội đồng ${council.decisionCode} cho ${projectCode}`, 'CouncilCreation');
    return council;
  },

  // PUT /api/research-staff/councils/{id}
  async updateStatus(id: string, status: Council['status'], actorName: string): Promise<void> {
    await delay(300);
    const c = db.councils.find(c => c.id === id);
    if (c) {
      c.status = status;
      logAction(actorName, `Cập nhật Hội đồng ${c.decisionCode} → ${status}`, 'CouncilManagement');
    }
  },

  // POST /api/research-staff/councils/{id}/members
  async addMember(councilId: string | null, member: CouncilMember, actorName: string): Promise<void> {
    await delay(200);
    if (councilId) {
      const c = db.councils.find(c => c.id === councilId);
      if (c) {
        c.members.push(member);
        logAction(actorName, `Thêm thành viên ${member.name} vào HĐ ${c.decisionCode}`, 'CouncilManagement');
      }
    } else {
      logAction(actorName, `Draft thêm thành viên ${member.name}`, 'CouncilCreation');
    }
  },

  /** 
   * POST /api/council/{id}/check-conflict
   * Check conflict of interest for a council member 
   */
  checkConflict(member: CouncilMember, projectCode: string): boolean {
    // COI rule: any member who has been principal investigator of this project
    const project = db.projects.find(p => p.code === projectCode);
    if (!project) return false;
    return project.owner.toLowerCase().includes(member.name.split(' ').pop()?.toLowerCase() ?? '');
  },
};
