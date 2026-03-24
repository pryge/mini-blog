"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1 flex flex-col">
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
  );
};

export default PostCard;
