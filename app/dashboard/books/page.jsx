'use client';

import { useState, useEffect, useCallback } from 'react';
import { bookService } from '@/services/bookService';
import BookTable from '@/components/BookTable';
import dynamic from 'next/dynamic';
const BookModal = dynamic(() => import('@/components/BookModal'), {
  loading: () => <div className="hidden" />,
  ssr: false
});
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/Pagination';
import Search from '@/components/Search';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { useToast } from '@/components/ToastProvider';
import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';

function BooksContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const currentPage = Number(searchParams.get('page')) || 0;

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [allData, setAllData] = useState([]); 
  const [isServerPaginated, setIsServerPaginated] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const { addToast } = useToast();

  const fetchBooks = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const resp = await bookService.getBooks(page, 10);
      
      if (resp && resp.data) {
        if (resp.data.content) {
          // Backend handles pagination
          setBooks(resp.data.content);
          setTotalPages(resp.data.totalPages || 0);
          setIsServerPaginated(true);
        } else if (Array.isArray(resp.data)) {
          // Backend returns raw array, handle on frontend
          setAllData(resp.data);
          setIsServerPaginated(false);
        } else {
          setBooks([]);
          setTotalPages(0);
        }
      } else {
        setBooks([]);
        setTotalPages(0);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch books. Please check your API connection.');
      addToast('Error fetching books', 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Handle data computation (search + pagination) for client-side fallback
  useEffect(() => {
    if (!isServerPaginated && allData.length > 0) {
      const filtered = allData.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.isbn.toLowerCase().includes(query.toLowerCase())
      );
      
      const limit = 10;
      const start = currentPage * limit;
      const end = start + limit;
      
      setBooks(filtered.slice(start, end));
      setTotalPages(Math.ceil(filtered.length / limit));
    }
  }, [allData, query, currentPage, isServerPaginated]);

  useEffect(() => {
    if (isServerPaginated || allData.length === 0) {
      fetchBooks(currentPage);
    }
  }, [currentPage, fetchBooks, isServerPaginated, allData.length]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedBook) {
        await bookService.updateBook(selectedBook.id, formData);
        addToast('Book updated successfully');
      } else {
        await bookService.createBook(formData);
        addToast('Book added successfully');
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      addToast('Error saving book: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    if (!id) return;
    
    try {
      await bookService.deleteBook(id);
      addToast('Book deleted successfully');
      fetchBooks();
    } catch (err) {
      addToast('Error deleting book: ' + err.message, 'error');
    }
  };

  const openModal = (book = null) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Book Collection
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Manage and track all library volumes.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        >
          <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Book
        </button>
      </header>

      <div className="mb-6 flex items-center gap-4">
        <Search placeholder="Search books by title, author, or ISBN..." />
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-sm dark:bg-black/50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white"></div>
          </div>
        )}
        
        <BookTable 
          books={books} 
          onEdit={openModal} 
          onDelete={handleDelete} 
        />
      </div>

      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href={pathname + '?' + new URLSearchParams({ ...Object.fromEntries(searchParams), page: Math.max(0, currentPage - 1) })}
              className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                href={pathname + '?' + new URLSearchParams({ ...Object.fromEntries(searchParams), page: i })}
                isActive={currentPage === i}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              href={pathname + '?' + new URLSearchParams({ ...Object.fromEntries(searchParams), page: Math.min(totalPages - 1, currentPage + 1) })}
              className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <BookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateOrUpdate}
        book={selectedBook}
      />

      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action will remove it from the collection forever."
      />
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white"></div>
      </div>
    }>
      <BooksContent />
    </Suspense>
  );
}
