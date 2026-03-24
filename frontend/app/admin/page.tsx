"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import { useAuth } from "@/context/auth-context";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const data = { title, content };

    try {
      if (editingId) {
        await api.put(`/posts/${editingId}`, data);
      } else {
        await api.post("/posts", data);
      }
      resetForm();
      fetchPosts();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.details?.[0]?.message ||
            err.response?.data?.error ||
            "Error saving post",
        );
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingId(post.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (error) {
      alert("Error deleting post");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
    setShowModal(false);
    setError("");
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manage your posts and platform content
          </p>
        </div>
        <button
          onClick={() => {
            resetForm(); // Use resetForm to clear fields and editingId
            setShowModal(true);
          }}
          className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center"
        >
          <span className="mr-2 text-xl leading-none">+</span> New Post
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-50">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Title
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Author
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts
              .filter((p) => user?.role === "ADMIN" || p.authorId === user?.id)
              .map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-black text-indigo-600 mr-3">
                        {post.author.name?.[0] ||
                          post.author.email[0].toUpperCase()}
                      </div>
                      <div className="text-sm font-bold text-slate-500">
                        {post.author.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-400">
                      {format(new Date(post.createdAt), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all active:scale-95"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {posts.filter((p) => user?.role === "ADMIN" || p.authorId === user?.id)
          .length === 0 && (
          <div className="py-20 text-center text-slate-500 italic">
            You haven&apos;t written any posts yet
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-100 flex items-center justify-center p-4">
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
                  onClick={resetForm} // Use resetForm to close modal and clear fields
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
      )}
    </div>
  );
}
