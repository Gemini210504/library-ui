"use client";
import React, { memo } from 'react';

const BookTable = memo(({ books, onEdit, onDelete }) => {
  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-2xl dark:border-zinc-800">
        <p className="text-lg font-medium">No books found.</p>
        <p className="text-sm">Start by adding a new book to the library.</p>
      </div>
    );
  }

  return (
    <div className="h-[350px] overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
          <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Author</th>
            <th className="px-6 py-4">ISBN</th>
            <th className="px-6 py-4 text-center">Year</th>
            <th className="px-6 py-4 text-center">Available</th>
            <th className="px-6 py-4 text-center">Total</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {books.map((book) => (
            <tr
              key={book.id}
              className="group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
            >
              <td className="px-6 py-4">
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {book.title}
                </div>
              </td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                {book.author}
              </td>
              <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-500 uppercase">
                {book.isbn}
              </td>
              <td className="px-6 py-4 text-center text-zinc-600 dark:text-zinc-400">
                {book.publishedYear}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    book.availableQuantity > 0
                      ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20"
                      : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
                  }`}
                >
                  {book.availableQuantity}
                </span>
              </td>
              <td className="px-6 py-4 text-center text-zinc-600 dark:text-zinc-400">
                {book.quantity}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(book)}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-zinc-400 transition-colors"
                    title="Edit Book"
                  >
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(book.id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete Book"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

BookTable.displayName = 'BookTable';

export default BookTable;
