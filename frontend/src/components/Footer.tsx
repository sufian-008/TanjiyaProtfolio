'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Linkedin, Mail, ArrowUp, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const pathname = usePathname();
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Subscribed successfully to newsletter!', 'success');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminPanel = pathname?.startsWith('/admin') && pathname !== '/admin/login';
  if (isAdminPanel) return null;

  return (
    <footer className="border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Info Column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-display font-semibold text-lg tracking-wider uppercase text-black dark:text-white">
            TANJIYA NOWRIN
          </Link>
          <p className="text-sm text-neutral-500 max-w-xs">
            Grade 7 student | Zero Olympiad Ambassador | Bangla Innovator Team Co-Leader | Science & Innovation Enthusiast.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://github.com/tanjiya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://linkedin.com/in/tanjiya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
            <a
              href="mailto:tanjiya.nowrin@example.com"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Sitemap Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Navigation</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/about" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
              About Bio
            </Link>
            <Link href="/projects" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/certificates" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
              Certificates
            </Link>
            <Link href="/blog" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
              Tech Blog
            </Link>
            <Link href="/contact" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Newsletter</h4>
          <p className="text-sm text-neutral-500">Subscribe for technical insights, project releases, and engineering blogs.</p>
          <form onSubmit={handleSubscribe} className="flex border border-border-light dark:border-border-dark rounded-lg overflow-hidden bg-card-light dark:bg-card-dark">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-3 py-2 text-xs bg-transparent border-none outline-none text-black dark:text-white"
              required
            />
            <button
              type="submit"
              className="px-3 border-l border-border-light dark:border-border-dark text-neutral-500 hover:text-black dark:hover:text-white transition-colors bg-neutral-100 dark:bg-neutral-900"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Under footer */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-border-light dark:border-border-dark flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
        <div>
          © {new Date().getFullYear()} Tanjiya Nowrin. All rights reserved.
        </div>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors"
        >
          Back to top <ArrowUp className="h-3 w-3" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
