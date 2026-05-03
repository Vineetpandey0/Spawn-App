"use client";

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Home, Search, Bell, Mail, Bookmark, User } from 'lucide-react';

interface SocialPost {
  id: string;
  author: string;
  content: string;
  timeAgo: string;
  avatarInitials?: string;
  likes?: number;
  comments?: number;
}

interface SocialData {
  currentUser?: string;
  posts?: SocialPost[];
}

export default function SocialFeed({ data }: { data?: SocialData }) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("For You");

  if (!data) return <div className="p-8">Loading feed...</div>;

  const { currentUser = "User", posts = [] } = data;

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans flex justify-center selection:bg-blue-500/30">
      {/* Left Sidebar */}
      <aside className="w-20 xl:w-64 fixed left-0 h-screen border-r border-slate-800 p-4 flex flex-col justify-between hidden sm:flex bg-black z-10">
        <div className="space-y-4 xl:pr-4">
          <div className="w-12 h-12 rounded-full hover:bg-slate-900 flex items-center justify-center xl:w-fit xl:px-3 xl:rounded-full cursor-pointer transition-colors mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg shrink-0"></div>
            <span className="hidden xl:block font-bold text-xl ml-3 text-white tracking-tight">SocialLink</span>
          </div>
          
          {[
            { icon: <Home className="w-7 h-7" />, label: "Home", active: true },
            { icon: <Search className="w-7 h-7" />, label: "Explore" },
            { icon: <Bell className="w-7 h-7" />, label: "Notifications" },
            { icon: <Mail className="w-7 h-7" />, label: "Messages" },
            { icon: <Bookmark className="w-7 h-7" />, label: "Bookmarks" },
            { icon: <User className="w-7 h-7" />, label: "Profile" },
          ].map(item => (
            <div key={item.label} className="w-12 h-12 xl:w-full xl:h-auto rounded-full hover:bg-slate-900 flex items-center justify-center xl:justify-start xl:px-4 xl:py-3 cursor-pointer transition-colors group">
              <span className={`text-slate-200 group-hover:scale-110 transition-transform ${item.active ? 'text-white' : ''}`}>
                {item.icon}
              </span>
              <span className={`hidden xl:block text-xl ml-5 ${item.active ? 'font-bold text-white' : 'font-normal'}`}>
                {item.label}
              </span>
            </div>
          ))}
          
          <button className="w-12 h-12 xl:w-full xl:h-14 mt-4 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-bold text-lg shadow-lg shadow-blue-500/20 transition-colors flex items-center justify-center">
            <span className="xl:hidden">+</span>
            <span className="hidden xl:block">Post</span>
          </button>
        </div>
        
        <div className="w-12 h-12 xl:w-full rounded-full hover:bg-slate-900 flex items-center xl:px-3 xl:py-2 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full shrink-0 flex items-center justify-center text-white font-bold">
            {currentUser.charAt(0)}
          </div>
          <div className="hidden xl:block ml-3 flex-1 min-w-0">
            <p className="font-bold text-white text-sm truncate">{currentUser}</p>
            <p className="text-slate-500 text-sm truncate">@{currentUser.toLowerCase().replace(/\s/g, '')}</p>
          </div>
          <MoreHorizontal className="hidden xl:block w-5 h-5 text-slate-500 shrink-0" />
        </div>
      </aside>

      {/* Main Feed */}
      <main className="w-full sm:max-w-[600px] border-r border-slate-800 min-h-screen sm:ml-20 xl:ml-64 relative bg-black">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-slate-800">
          <h1 className="text-xl font-bold p-4 text-white">Home</h1>
          <div className="flex border-b border-slate-800">
            {['For You', 'Following'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 hover:bg-slate-900/50 transition-colors relative flex items-center justify-center py-4 font-medium"
              >
                <span className={activeTab === tab ? 'text-white font-bold' : 'text-slate-500'}>{tab}</span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 w-16 h-1 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Compose Post */}
        <div className="p-4 border-b border-slate-800 flex gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full shrink-0 flex items-center justify-center text-white font-bold">
            {currentUser.charAt(0)}
          </div>
          <div className="flex-1">
            <textarea 
              className="w-full bg-transparent text-xl placeholder-slate-600 outline-none resize-none mt-2 text-white" 
              placeholder="What is happening?!"
              rows={2}
            ></textarea>
            <div className="flex justify-end pt-3 border-t border-slate-800 mt-2">
              <button className="px-5 py-2bg-blue-500 hover:bg-blue-600 rounded-full text-white font-bold text-sm transition-colors opacity-50 cursor-not-allowed">
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="pb-20 sm:pb-0">
          {posts?.map((post: SocialPost) => {
            const isLiked = likedPosts.has(post.id);
            return (
              <article key={post.id} className="p-4 border-b border-slate-800 hover:bg-slate-900/30 transition-colors cursor-pointer group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full shrink-0 flex items-center justify-center font-bold text-slate-300">
                    {post.avatarInitials || post.author?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-white hover:underline truncate">{post.author}</span>
                        <span className="text-slate-500 text-sm truncate">@{post.author.toLowerCase().replace(/\s/g, '')}</span>
                        <span className="text-slate-500 text-sm">&middot;</span>
                        <span className="text-slate-500 text-sm hover:underline">{post.timeAgo}</span>
                      </div>
                      <button className="text-slate-500 hover:text-blue-500 p-1.5 rounded-full hover:bg-blue-500/10 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-white text-[15px] leading-relaxed whitespace-pre-wrap break-words mb-3">
                      {post.content}
                    </p>

                    {/* Fake image block if text suggests media */}
                    {post.content?.length > 100 && (post.id as any) % 2 === 0 && (
                      <div className="w-full aspect-video bg-slate-900 rounded-2xl mb-3 border border-slate-800 flex items-center justify-center text-slate-700">
                        [Media Attachment]
                      </div>
                    )}

                    <div className="flex justify-between text-slate-500 max-w-md pr-10">
                      <button className="flex items-center gap-2 group/btn">
                        <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 group-hover/btn:text-blue-500 transition-colors">
                          <MessageCircle className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-sm group-hover/btn:text-blue-500 transition-colors">{post.comments || 0}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 group/btn">
                        <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 group-hover/btn:text-green-500 transition-colors">
                          <Share2 className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-sm group-hover/btn:text-green-500 transition-colors">Repost</span>
                      </button>

                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                        className="flex items-center gap-2 group/btn"
                      >
                        <div className={`p-2 rounded-full transition-colors ${isLiked ? 'text-pink-500' : 'group-hover/btn:bg-pink-500/10 group-hover/btn:text-pink-500'}`}>
                          <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-pink-500' : ''}`} />
                        </div>
                        <span className={`text-sm transition-colors ${isLiked ? 'text-pink-500' : 'group-hover/btn:text-pink-500'}`}>
                          {(post.likes || 0) + (isLiked ? 1 : 0)}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Right Sidebar (Search/Trends) */}
      <aside className="w-80 p-4 hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <div className="bg-slate-900 rounded-full flex items-center px-4 py-3 mb-4 focus-within:ring-1 focus-within:ring-blue-500 focus-within:bg-black border border-transparent focus-within:border-blue-500 transition-all">
          <Search className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
          <input type="text" placeholder="Search" className="bg-transparent text-white outline-none w-full" />
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 mb-4 border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4">What's happening</h2>
          {['Technology', 'Design', 'Development'].map((trend, i) => (
            <div key={i} className="mb-4 last:mb-0 cursor-pointer group">
              <p className="text-xs text-slate-500 mb-0.5">Trending in {trend}</p>
              <p className="font-bold text-white group-hover:underline">#BuildInPublic</p>
              <p className="text-xs text-slate-500 mt-0.5">{Math.floor(Math.random() * 50) + 10}K posts</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-slate-800 flex justify-around py-3 z-30">
        <Home className="w-7 h-7 text-white" />
        <Search className="w-7 h-7 text-slate-400" />
        <Bell className="w-7 h-7 text-slate-400" />
        <Mail className="w-7 h-7 text-slate-400" />
      </nav>
    </div>
  );
}
