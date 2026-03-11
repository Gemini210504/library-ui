import React, { memo } from 'react';

const MemberTable = memo(({ members, onEdit, onDelete }) => {
  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-3xl dark:border-zinc-800">
        <p className="text-lg font-medium">No members found.</p>
        <p className="text-sm text-zinc-400">
          Register your first member to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[350px] overflow-y-auto rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-900 dark:bg-zinc-900/50 dark:text-zinc-400">
            <tr>
              <th className="px-8 py-5">Full Name</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Phone</th>
              <th className="px-6 py-5">Address</th>
              <th className="px-6 py-5">Joined Date</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {members.map((member) => (
              <tr
                key={member.memberId}
                className="group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 font-bold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
                      {member.fullName.charAt(0)}
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {member.fullName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-zinc-600 dark:text-zinc-400">
                  {member.email}
                </td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                    {member.phone}
                  </span>
                </td>
                <td className="px-6 py-5 text-zinc-600 dark:text-zinc-400">
                  {member.address}
                </td>
                <td className="px-6 py-5 text-zinc-500 dark:text-zinc-500">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opactiy-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(member)}
                      className="rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
                      title="Edit Member"
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
                      onClick={() => onDelete(member.memberId)}
                      className="rounded-xl p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete Member"
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
    </div>
  );
});

MemberTable.displayName = 'MemberTable';

export default MemberTable;
