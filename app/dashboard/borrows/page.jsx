"use client";

import { useState, useEffect, useCallback } from "react";
import { borrowService } from "@/services/borrowService";
import { bookService } from "@/services/bookService";
import { memberService } from "@/services/memberService";
import BorrowModal from "@/components/BorrowModal";

export default function BorrowsPage() {
  const [records, setRecords] = useState([]);
  const [booksLookup, setBooksLookup] = useState({});
  const [membersLookup, setMembersLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch records, books, and members to correlate names
      const [borrowsRes, booksRes, membersRes] = await Promise.all([
        borrowService.getAll(),
        bookService.getBooks(0, 1000),
        memberService.getMembers(0, 1000),
      ]);

      const borrowsData = borrowsRes.data || [];
      const booksData = booksRes.data?.content || booksRes.data || [];
      const membersData = membersRes.data?.content || membersRes.data || [];

      // Create lookup maps
      const bMap = {};
      booksData.forEach((b) => (bMap[b.id] = b.title));

      const mMap = {};
      membersData.forEach(
        (m) => (mMap[m.id || m.memberId] = m.fullName || m.name),
      );

      setRecords(borrowsData);
      setBooksLookup(bMap);
      setMembersLookup(mMap);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch borrow records:", err);
      setError("Could not load borrow records. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleReturn = async (id) => {
    try {
      await borrowService.updateStatus(id, "RETURNED");
      fetchRecords();
    } catch (err) {
      console.error("Failed to return book:", err);
      alert("Failed to process return: " + (err.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await borrowService.delete(id);
      fetchRecords();
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete record: " + (err.data?.message || err.message));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Borrows & Returns
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Track and manage book loans and returns.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Borrow Book
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Book
                </th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Member
                </th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Borrow Date
                </th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Due Date
                </th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-semibold text-zinc-900 dark:text-zinc-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-600 dark:border-t-white" />
                      Loading records...
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    {error || "No borrow records found."}
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record.id}
                    className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">
                      <div className="flex flex-col">
                        <span>
                          {booksLookup[record.bookId] || "Unknown Book"}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          ID: #{record.bookId}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      <div className="flex flex-col">
                        <span>
                          {membersLookup[record.memberId] || "Unknown Member"}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          ID: #{record.memberId}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {new Date(record.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {new Date(record.returnDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          record.status === "BORROWED"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : record.status === "RETURNED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {record.status || "NULL"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {record.status === "BORROWED" && (
                          <button
                            onClick={() => handleReturn(record.id)}
                            className="rounded-xl bg-black px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                          >
                            Return
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-50 dark:border-zinc-800 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BorrowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRecords}
      />
    </div>
  );
}
