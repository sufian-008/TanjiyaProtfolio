'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  FileText,
  MessageSquare,
  Award,
  Calendar,
  Image,
  Settings,
  LogOut,
  ChevronRight,
  Globe,
  Camera,
  BookOpen,
  Star
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, logout, loading } = useAuth();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  // If loading session state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-sm font-mono text-neutral-400 uppercase tracking-widest animate-pulse">
          Loading Security Session...
        </div>
      </div>
    );
  }

  // If not logged in, or on login page, let Next.js children render without sidebar (login page itself)
  if (isLoginPage || !isAdmin) {
    return <>{children}</>;
  }

  const sidebarLinks = [
    { name: 'Dashboard Home', path: '/admin', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: Layers },
    { name: 'Gallery Cards', path: '/admin/gallery', icon: Camera },
    { name: 'Research Work', path: '/admin/research-work', icon: BookOpen },
    { name: 'Blog System', path: '/admin/blogs', icon: FileText },
    { name: 'Comments', path: '/admin/comments', icon: MessageSquare },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Experience', path: '/admin/experience', icon: Calendar },
    { name: 'Skills List', path: '/admin/skills', icon: Star },
    { name: 'Media Library', path: '/admin/media', icon: Image },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border-light dark:border-border-dark flex flex-col justify-between p-6 bg-card-light dark:bg-card-dark flex-shrink-0 sticky top-0 h-screen z-20">
        <div className="flex flex-col gap-8">
          {/* Dashboard Header */}
          <div className="flex flex-col gap-1.5">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white font-semibold transition-colors">
              <Globe className="h-3 w-3" /> Visit Site
            </Link>
            <h1 className="text-lg font-extrabold text-black dark:text-white tracking-tight uppercase">
              CMS Admin
            </h1>
          </div>

          {/* Links list */}
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
                      : 'text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" /> {link.name}
                  </span>
                  {isActive && <ChevronRight className="h-3 w-3" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" /> Log Out Session
          </button>
        </div>
      </aside>

      {/* Main dashboard content panel */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
