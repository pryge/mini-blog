"use client";

import React from "react";

interface AdminPostModalProps {
  showModal: boolean;
  editingId: string | null;
  title: string;
  content: string;
  error: string;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const AdminPostModal: React.FC<AdminPostModalProps> = ({
  showModal,
  editingId,
  title,
  content,
  error,
  setTitle,
  setContent,
  resetForm,
  handleSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-2xl border border-white w-full max-w-2xl rounded-[2.5rem] p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">
          {editingId ? "Edit Post" : "Create New Post"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold animate-shake">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">
                Title
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">
                Content
              </label>
              <textarea
                required
                rows={8}
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300 resize-none"
                placeholder="Share your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-sm font-black transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-indigo-200 active:scale-95"
            >
              {editingId ? "Save Changes" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPostModal;
