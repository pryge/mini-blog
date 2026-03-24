"use client";

import React, { useEffect, useState, use } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Failed to fetch post", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">
          Post Not Found
        </h2>
        <Link
          href="/"
          className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-500 transition-all active:scale-95 inline-block"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-20">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-black text-indigo-600 hover:text-indigo-500 transition-all mb-12 bg-indigo-50 px-5 py-2 rounded-full active:scale-95"
      >
        ← Back to Feed
      </Link>

      <header className="mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tighter mb-8">
          {post.title}
        </h1>

        <div className="flex items-center p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-black text-white mr-5 shadow-lg shadow-indigo-200">
            {post.author.name?.[0] || post.author.email[0].toUpperCase()}
          </div>
          <div>
            <p className="text-slate-900 font-bold text-lg leading-none">
              {post.author.name || "Anonymous"}
            </p>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">
              {post.author.email}
            </p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
              Published
            </p>
            <time className="text-slate-900 font-bold">
              {format(new Date(post.createdAt), "MMMM dd, yyyy")}
            </time>
          </div>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <div className="text-slate-600 leading-relaxed font-medium text-xl whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      <footer className="mt-20 pt-10 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm font-bold italic">
            Thank you for reading our blog.
          </p>
        </div>
      </footer>
    </article>
  );
}
