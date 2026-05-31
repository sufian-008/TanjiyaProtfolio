'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Lock, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  // Dark/Light theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme as 'dark' | 'light');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on link click
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Research Work', path: '/research-work' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  // Do not show general navbar inside admin panel dashboard
  const isAdminPanel = pathname?.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminPanel) return null;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled
          ? 'py-4 border-b border-border-light dark:border-border-dark glass'
          : 'py-6 bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-display font-semibold text-lg tracking-wider text-black dark:text-white uppercase">
          Tanjiya<span className="font-light text-neutral-400">.N</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium tracking-wide transition-all ${isActive
                    ? 'text-black dark:text-white active-glow'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Buttons & Toggles */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border-light dark:border-border-dark text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Admin link */}
          {isAdmin ? (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-800 text-xs font-semibold hover:bg-white hover:text-black transition-all"
            >
              <LayoutDashboard className="h-3 w-3" /> Dashboard
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="p-2 rounded-full border border-border-light dark:border-border-dark text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Admin Portal"
            >
              <Lock className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Mobile menu triggers */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border-light dark:border-border-dark text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-neutral-600 dark:text-neutral-400"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#060608] border-b border-border-light dark:border-border-dark py-6 px-6 flex flex-col gap-4 animate-slide-in">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`text-lg font-medium py-1 ${isActive ? 'text-black dark:text-white' : 'text-neutral-500'
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
          {isAdmin ? (
            <Link
              href="/admin"
              className="flex items-center justify-center gap-1.5 py-3.5 rounded-lg bg-neutral-900 text-white font-medium text-sm"
            >
              <LayoutDashboard className="h-4 w-4" /> Go to CMS
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-1.5 py-3.5 rounded-lg border border-border-light dark:border-border-dark font-medium text-sm"
            >
              <Lock className="h-4 w-4" /> Admin Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
