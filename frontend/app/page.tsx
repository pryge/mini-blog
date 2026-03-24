"use client";

import React, { useEffect, useState } from "react";
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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <header className="mb-20 text-center">
        <h1 className="text-5xl font-black text-slate-900 sm:text-7xl tracking-tighter leading-tight">
          Fresh thoughts in our <br />
          <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Blog
          </span>
        </h1>
        <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Learn new things, share your experience and communicate with
          like-minded people.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1 flex flex-col"
          >
            <div className="p-8 grow">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                  Articles
                </span>
                <time className="text-xs font-bold text-slate-400">
                  {format(new Date(post.createdAt), "dd.MM.yyyy")}
                </time>
              </div>
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </h3>
              <p className="mt-4 text-slate-500 text-sm line-clamp-3 leading-relaxed font-medium">
                {post.content}
              </p>
            </div>
            <div className="p-8 pt-0 mt-auto flex items-center justify-between border-t border-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-indigo-200">
                  {post.author.name?.[0] || post.author.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-sm leading-none">
                    {post.author.name || "Anonymous"}
                  </p>
                  <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-tighter">
                    {post.author.email}
                  </p>
                </div>
              </div>
              <Link
                href={`/posts/${post.id}`}
                className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-indigo-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shadow-inner"
              >
                →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-slate-400 text-lg">No posts yet. Be the first!</p>
          <Link
            href="/admin"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Add post
          </Link>
        </div>
      )}
    </div>
  );
}
