"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { borrowService } from "@/services/borrowService";
import { bookService } from "@/services/bookService";
import { memberService } from "@/services/memberService";

export default function BorrowModal({ isOpen, onClose, onSuccess }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // Search and selection states
  const [bookSearch, setBookSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [isBookListOpen, setIsBookListOpen] = useState(false);
  const [isMemberListOpen, setIsMemberListOpen] = useState(false);

  const [formData, setFormData] = useState({
    bookId: "",
    memberId: "",
    status: "BORROWED",
    borrowDate: new Date().toISOString().split("T")[0],
    returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const bookRef = useRef(null);
  const memberRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setFetchingData(true);
        try {
          const [booksRes, membersRes] = await Promise.all([
            bookService.getBooks(0, 1000),
            memberService.getMembers(0, 1000),
          ]);

          // Handle both direct array and paginated response
          const booksData = booksRes.data?.content || booksRes.data || [];
          const membersData = membersRes.data?.content || membersRes.data || [];

          setBooks(booksData);
          setMembers(membersData);
        } catch (error) {
          console.error("Failed to fetch books or members:", error);
        } finally {
          setFetchingData(false);
        }
      };
      fetchData();
    } else {
      // Reset state when modal closes
      setBookSearch("");
      setMemberSearch("");
      setFormData({
        bookId: "",
        memberId: "",
        status: "BORROWED",
        borrowDate: new Date().toISOString().split("T")[0],
        returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
    }
  }, [isOpen]);

  // Click outside to close lists
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookRef.current && !bookRef.current.contains(event.target)) {
        setIsBookListOpen(false);
      }
      if (memberRef.current && !memberRef.current.contains(event.target)) {
        setIsMemberListOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(bookSearch.toLowerCase()),
  );

  const filteredMembers = members.filter(
    (member) =>
      member.fullName?.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.name?.toLowerCase().includes(memberSearch.toLowerCase()),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bookId || !formData.memberId) {
      alert("Please select both a book and a member.");
      return;
    }
    setLoading(true);
    try {
      await borrowService.create(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create borrow record:", error);
      alert(
        "Failed to create borrow record: " +
          (error.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Borrow a Book
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Search and select a book and member to create a record.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Searchable Book Selection */}
          <div className="relative" ref={bookRef}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Select Book
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={
                  fetchingData ? "Loading books..." : "Type to search books..."
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 outline-none transition-all"
                value={bookSearch}
                onChange={(e) => {
                  setBookSearch(e.target.value);
                  setIsBookListOpen(true);
                  if (formData.bookId) setFormData({ ...formData, bookId: "" });
                }}
                onFocus={() => setIsBookListOpen(true)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {isBookListOpen && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                      onClick={() => {
                        setFormData({ ...formData, bookId: book.id });
                        setBookSearch(book.title);
                        setIsBookListOpen(false);
                      }}
                    >
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {book.title}
                      </div>
                      <div className="text-xs text-zinc-500">{book.author}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-zinc-500">
                    No books found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Searchable Member Selection */}
          <div className="relative" ref={memberRef}>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Select Member
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={
                  fetchingData
                    ? "Loading members..."
                    : "Type to search members..."
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 outline-none transition-all"
                value={memberSearch}
                onChange={(e) => {
                  setMemberSearch(e.target.value);
                  setIsMemberListOpen(true);
                  if (formData.memberId)
                    setFormData({ ...formData, memberId: "" });
                }}
                onFocus={() => setIsMemberListOpen(true)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            {isMemberListOpen && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <button
                      key={member.id || member.memberId}
                      type="button"
                      className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          memberId: member.id || member.memberId,
                        });
                        setMemberSearch(member.fullName || member.name);
                        setIsMemberListOpen(false);
                      }}
                    >
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {member.fullName || member.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {member.email || member.phone}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-zinc-500">
                    No members found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Borrow Date
              </label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                value={formData.borrowDate}
                onChange={(e) =>
                  setFormData({ ...formData, borrowDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Due Date
              </label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-black focus:ring-0 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                value={formData.returnDate}
                onChange={(e) =>
                  setFormData({ ...formData, returnDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-zinc-200 py-3 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetchingData}
              className="flex-1 rounded-2xl bg-black py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {loading ? "Processing..." : "Confirm Borrow"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
