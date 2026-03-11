'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { useMemo } from 'react';

// Simple debounce function
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function Search({ placeholder }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useMemo(
    () =>
      debounce((term) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '0'); // Reset to first page on search
        if (term) {
          params.set('query', term);
        } else {
          params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
      }, 300),
    [searchParams, pathname, replace]
  );

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          className="peer block w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-white dark:focus:ring-white"
          placeholder={placeholder}
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
        />
      </div>
    </div>
  );
}
