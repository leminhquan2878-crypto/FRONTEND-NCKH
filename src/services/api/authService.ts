/**
 * src/services/api/authService.ts
 * Authentication service — wraps mockApi login and handles storage.
 */
import { db } from '../../mock/database';
import { logAction } from '../../mock/database';
import type { AuthResponse } from '../../types';

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

export const authService = {
  /** 
   * POST /api/auth/login
   * Validate credentials against fake DB and return auth payload. 
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(400);
    // password check is demo-only (all '123456')
    const user = db.users.find(u => u.email === email);
    if (!user || password !== '123456') {
      throw new Error('Email hoặc mật khẩu không đúng.');
    }
    const token = `mock_token_${user.id}_${Date.now()}`;
    logAction(user.name, 'Đăng nhập', 'Auth');
    return { user, token, councilRole: user.councilRole };
  },

  async logout(userName: string): Promise<void> {
    await delay(200);
    logAction(userName, 'Đăng xuất', 'Auth');
  },
};
