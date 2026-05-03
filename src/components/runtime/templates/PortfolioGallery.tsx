"use client";

import React, { useState } from 'react';
import { Mail, ArrowUpRight, Code2, Layout, Database } from 'lucide-react';
import { FaGithub, FaTwitter } from 'react-icons/fa';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies?: string[];
}

interface PortfolioData {
  authorName?: string;
  bio?: string;
  projects?: Project[];
}

export default function PortfolioGallery({ data }: { data?: PortfolioData }) {
  const [activeFilter, setActiveFilter] = useState("All");

  if (!data) return <div className="p-8">Loading portfolio...</div>;

  const { authorName = "Developer", bio, projects = [] } = data;

  // Extract unique categories from projects
  const categories = ["All", ...Array.from(new Set(projects.map((p: Project) => p.category).filter(Boolean)))];

  const filteredProjects = projects.filter((p: Project) => 
    activeFilter === "All" || p.category === activeFilter
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-zinc-800">
      
      {/* Header/Hero */}
      <header className="px-6 py-24 md:py-32 max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-2xl">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-2xl text-zinc-300 mb-8 border border-zinc-700">
            {authorName.charAt(0)}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
            Hi, I'm {authorName}.<br/>
            <span className="text-zinc-500 text-3xl sm:text-4xl md:text-6xl">I build digital experiences.</span>
          </h1>
          <p className="text-base md:text-xl text-zinc-400 leading-relaxed max-w-xl">
            {bio || "A passionate software engineer specializing in building exceptional digital experiences. Currently focused on building accessible, human-centered products."}
          </p>
        </div>
        
        <div className="flex gap-4 pb-2">
          <a href="#" className="p-3 bg-zinc-900 rounded-full border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 transition-all text-zinc-400 hover:text-white">
            <FaGithub className="w-5 h-5" />
          </a>
          <a href="#" className="p-3 bg-zinc-900 rounded-full border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 transition-all text-zinc-400 hover:text-white">
            <FaTwitter className="w-5 h-5" />
          </a>
          <a href="#" className="p-3 bg-zinc-900 rounded-full border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 transition-all text-zinc-400 hover:text-white">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Projects Section */}
      <section className="px-6 pb-32 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-4 z-20">
          <h2 className="text-2xl font-bold">Selected Work</h2>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat, i) => (
              <button 
                key={i}
                onClick={() => setActiveFilter(cat as string)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === cat ? 'bg-zinc-100 text-black' : 'bg-transparent border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {filteredProjects.map((project: Project, i: number) => (
            <div 
              key={project.id} 
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800/50 mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-zinc-800/50 to-zinc-900/50 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                {/* Mock abstract representation of project based on index */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700">
                  {i % 3 === 0 ? <Layout className="w-32 h-32 text-zinc-500" /> : 
                   i % 3 === 1 ? <Database className="w-32 h-32 text-zinc-500" /> : 
                   <Code2 className="w-32 h-32 text-zinc-500" />}
                </div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-mono text-zinc-300 border border-zinc-700/50 uppercase tracking-widest">
                      {project.category}
                    </span>
                    <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-zinc-300 transition-colors">{project.title}</h3>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-5 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech: string, idx: number, arr: string[]) => (
                    <span key={idx} className="text-sm font-mono text-zinc-500">
                      {tech}{idx < arr.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500">No projects found in this category.</p>
          </div>
        )}
      </section>
      
      {/* Footer */}
      <footer className="border-t border-zinc-900 px-6 py-12 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} {authorName}. Built dynamically.</p>
      </footer>
    </div>
  );
}
