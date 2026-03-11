'use client';

import { useState, useEffect } from 'react';

export default function MemberModal({ isOpen, onClose, onSubmit, member }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.fullName || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg scale-100 overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10 animate-in zoom-in-95 duration-300">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {member ? 'Edit Member' : 'Register Member'}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full bg-zinc-50 p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:border-white dark:focus:ring-white"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="group">
            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:border-white dark:focus:ring-white"
              placeholder="e.g. john@example.com"
            />
          </div>

          <div className="group">
            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:border-white dark:focus:ring-white"
              placeholder="e.g. 012 345 678"
            />
          </div>

          <div className="group">
            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:border-white dark:focus:ring-white resize-none"
              placeholder="e.g. Phnom Penh, Cambodia"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-zinc-200 px-6 py-4 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {member ? 'Update Member' : 'Register Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
