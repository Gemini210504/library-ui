import { apiFetch } from '@/lib/api';

/**
 * Service for interacting with the Members API.
 */
export const memberService = {
  /**
   * Fetch all members.
   */
  getMembers: (page = 0, limit = 10) => 
    apiFetch(`/members?page=${page}&size=${limit}`, { 
      next: { tags: ['members'] }, 
      method: 'GET' 
    }),

  /**
   * Fetch a single member by ID.
   * @param {string|number} id 
   */
  getMember: (id) => {
    if (!id) throw new Error("Member ID is required");
    return apiFetch(`/members/${id}`, { method: 'GET' });
  },

  /**
   * Create a new member.
   * @param {Object} memberData 
   */
  createMember: (memberData) => {
    return apiFetch('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  /**
   * Update an existing member.
   * @param {string|number} id 
   * @param {Object} memberData 
   */
  updateMember: (id, memberData) => {
    if (!id) throw new Error("Member ID is required for updates");
    return apiFetch(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  },

  /**
   * Delete a member by ID.
   * @param {string|number} id 
   */
  deleteMember: (id) => {
    if (!id) throw new Error("Member ID is required for deletion");
    return apiFetch(`/members/${id}`, {
      method: 'DELETE',
    });
  },
};
