import Link from "next/link";
import { bookService } from "@/services/bookService";
import { memberService } from "@/services/memberService";
import { borrowService } from "@/services/borrowService";
import Calendar from "@/components/Calendar";

export default async function DashboardPage() {
  let counts = { books: 0, members: 0, borrows: 0, overdue: 0 };
  let growth = { books: "0%", members: "0%", borrows: "0%" };

  try {
    const [booksRes, membersRes, borrowsRes] = await Promise.all([
      bookService.getBooks(),
      memberService.getMembers(),
      borrowService.getAll(),
    ]);

    const books = booksRes?.data?.content || booksRes?.data || booksRes || [];
    const members =
      membersRes?.data?.content || membersRes?.data || membersRes || [];
    const borrows = Array.isArray(borrowsRes?.data)
      ? borrowsRes.data
      : Array.isArray(borrowsRes)
        ? borrowsRes
        : [];

    counts.books = books.length;
    counts.members = members.length;
    counts.borrows = borrows.filter((b) => b.status === "BORROWED").length;

    // Overdue returns (due date < now and status is BORROWED)
    const now = new Date();
    counts.overdue = borrows.filter(
      (b) => b.status === "BORROWED" && new Date(b.returnDate) < now,
    ).length;

    // --- CALCULATE GROWTH (%) ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const newBooksCount = books.filter(
      (b) => new Date(b.createdAt) >= sevenDaysAgo,
    ).length;
    const newMembersCount = members.filter(
      (m) => new Date(m.createdAt) >= sevenDaysAgo,
    ).length;
    const newBorrowsCount = borrows.filter(
      (b) => new Date(b.borrowDate) >= sevenDaysAgo,
    ).length;

    const calcPct = (newItemCount, totalCount) => {
      const baseline = totalCount - newItemCount;
      if (baseline <= 0) return "+100%";
      const pct = (newItemCount / baseline) * 100;
      return `+${pct.toFixed(0)}%`;
    };

    growth.books = calcPct(newBooksCount, counts.books);
    growth.members = calcPct(newMembersCount, counts.members);
    growth.borrows = calcPct(newBorrowsCount, borrows.length);
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  }

  const stats = [
    {
      name: "Total Books",
      value: counts.books.toLocaleString(),
      change: growth.books,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      name: "Active Members",
      value: counts.members.toLocaleString(),
      change: growth.members,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: "Books Borrowed",
      value: counts.borrows.toLocaleString(),
      change: growth.borrows,
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      name: "Overdue Returns",
      value: counts.overdue.toLocaleString(),
      change: counts.overdue > 0 ? `+${counts.overdue}` : "0",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back, Admin!
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Here is what happening with your library today.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-900 transition-colors group-hover:bg-black group-hover:text-white dark:bg-zinc-900 dark:text-zinc-50 dark:group-hover:bg-white dark:group-hover:text-black">
                {stat.icon}
              </div>
              <span
                className={`text-xs font-bold ${stat.change.startsWith("+") ? "text-green-500" : stat.change === "0" ? "text-zinc-400" : "text-red-500"}`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
              {stat.name}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-4 grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Quick Actions
          </h3>
          <div className="grid gap-4">
            <Link
              href="/dashboard/borrows"
              className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-2 border-transparent hover:border-black dark:hover:border-white"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white">
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
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Borrow & Return Books
                </span>
              </div>
              <svg
                className="h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              href="/dashboard/books"
              className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white">
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Manage Literature
                </span>
              </div>
              <svg
                className="h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              href="/dashboard/members"
              className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Register New Member
                </span>
              </div>
              <svg
                className="h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Activity Calendar
            </h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div>
            <Calendar />
          </div>
        </div>
      </section>
    </div>
  );
}
