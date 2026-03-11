'use client';

import { useState, useEffect, useCallback } from 'react';
import { memberService } from '@/services/memberService';
import MemberTable from '@/components/MemberTable';
import dynamic from 'next/dynamic';
const MemberModal = dynamic(() => import('@/components/MemberModal'), {
  loading: () => <div className="hidden" />,
  ssr: false
});
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/Pagination';
import Search from '@/components/Search';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { useToast } from '@/components/ToastProvider';
import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';

function MembersContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const currentPage = Number(searchParams.get('page')) || 0;

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [allData, setAllData] = useState([]); 
  const [isServerPaginated, setIsServerPaginated] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const { addToast } = useToast();

  const fetchMembers = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const resp = await memberService.getMembers(page, 10);
      
      if (resp && resp.data) {
        if (resp.data.content) {
          // Backend handles pagination
          setMembers(resp.data.content);
          setTotalPages(resp.data.totalPages || 0);
          setIsServerPaginated(true);
        } else if (Array.isArray(resp.data)) {
          // Backend returns raw array, handle on frontend
          setAllData(resp.data);
          setIsServerPaginated(false);
        } else {
          setMembers([]);
          setTotalPages(0);
        }
      } else {
        setMembers([]);
        setTotalPages(0);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch members. Please check your API connection.');
      addToast('Error fetching members', 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Handle data computation (search + pagination) for client-side fallback
  useEffect(() => {
    if (!isServerPaginated && allData.length > 0) {
      const filtered = allData.filter(member => 
        member.fullName.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase()) ||
        member.phone.toLowerCase().includes(query.toLowerCase())
      );
      
      const limit = 10;
      const start = currentPage * limit;
      const end = start + limit;
      
      setMembers(filtered.slice(start, end));
      setTotalPages(Math.ceil(filtered.length / limit));
    }
  }, [allData, query, currentPage, isServerPaginated]);

  useEffect(() => {
    if (isServerPaginated || allData.length === 0) {
      fetchMembers(currentPage);
    }
  }, [currentPage, fetchMembers, isServerPaginated, allData.length]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedMember) {
        await memberService.updateMember(selectedMember.memberId, formData);
        addToast('Member information updated');
      } else {
        await memberService.createMember(formData);
        addToast('New member registered');
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      addToast('Error saving member: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    if (!id) return;
    
    try {
      await memberService.deleteMember(id);
      addToast('Member deleted successfully');
      fetchMembers();
    } catch (err) {
      addToast('Error deleting member: ' + err.message, 'error');
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const openModal = (member = null) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Member Management
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            View and manage all registered library members.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        >
          <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Register New Member
        </button>
      </header>

      <div className="mb-6 flex items-center gap-4">
        <Search placeholder="Search members by name, email, or phone..." />
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
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/50 backdrop-blur-sm dark:bg-black/50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white"></div>
          </div>
        )}
        
        <MemberTable 
          members={members} 
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

      <MemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateOrUpdate}
        member={selectedMember}
      />

      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Remove Member"
        message="Are you sure you want to remove this member? This action will permanently delete their record from the system."
      />
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white"></div>
      </div>
    }>
      <MembersContent />
    </Suspense>
  );
}
