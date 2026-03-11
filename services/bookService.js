import { apiFetch } from '@/lib/api';

/**
 * Service for interacting with the Books API.
 * Optimized for Next.js 16 / React 19 patterns.
 */
export const bookService = {
  /**
   * Fetch all books.
   * Uses Next.js tags for on-demand revalidation if needed.
   */
  getBooks: (page = 0, limit = 10) => 
    apiFetch(`/books?page=${page}&size=${limit}`, { 
      next: { tags: ['books'] }, 
      method: 'GET' 
    }),

  /**
   * Fetch a single book by ID.
   * @param {string|number} id 
   */
  getBook: (id) => {
    if (!id) throw new Error("Book ID is required");
    return apiFetch(`/books/${id}`, { method: 'GET' });
  },

  /**
   * Create a new book.
   * @param {Object} bookData 
   */
  createBook: (bookData) => {
    return apiFetch('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  },

  /**
   * Update an existing book.
   * Supports partial updates if your backend allows PATCH.
   * @param {string|number} id 
   * @param {Object} bookData 
   */
  updateBook: (id, bookData) => {
    if (!id) throw new Error("Book ID is required for updates");
    return apiFetch(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  },

  /**
   * Delete a book by ID.
   * @param {string|number} id 
   */
  deleteBook: (id) => {
    if (!id) throw new Error("Book ID is required for deletion");
    return apiFetch(`/books/${id}`, {
      method: 'DELETE',
    });
  },
};