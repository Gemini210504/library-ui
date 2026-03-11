import { apiFetch } from '@/lib/api';

/**
 * Service for interacting with the Borrows API.
 */
export const borrowService = {
  /**
   * Fetch all borrow records.
   */
  getAll: () => 
    apiFetch('/borrows', { 
      next: { tags: ['borrows'] }, 
      method: 'GET' 
    }),

  /**
   * Create a new borrow record.
   * @param {Object} borrowData { bookId, memberId, borrowDate, returnDate }
   */
  create: (borrowData) => {
    return apiFetch('/borrows', {
      method: 'POST',
      body: JSON.stringify(borrowData),
    });
  },

  /**
   * Update borrow status (Return Book).
   * @param {number} id 
   * @param {string} status 
   */
  updateStatus: (id, status) => {
    if (!id) throw new Error("Borrow Record ID is required for updates");
    return apiFetch(`/borrows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
  },

  /**
   * Delete a borrow record by ID.
   * @param {number} id 
   */
  delete: (id) => {
    if (!id) throw new Error("Borrow Record ID is required for deletion");
    return apiFetch(`/borrows/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Fetch records for a specific member.
   * @param {number} memberId 
   */
  getByMember: (memberId) => {
    if (!memberId) throw new Error("Member ID is required");
    return apiFetch(`/borrows/member/${memberId}`, { method: 'GET' });
  },
};
