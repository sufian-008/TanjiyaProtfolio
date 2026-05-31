import React from 'react';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';

export const metadata = {
  title: 'Tanjiya Nowrin | Personal Brand Platform',
  description: 'Premium personal branding platform featuring competitive programming records, professional project portfolios, and software engineering insights.',
  keywords: 'Tanjiya Nowrin, Portfolio, Software Engineer, Competitive Programming, Next.js, Express, MongoDB, CMS',
  authors: [{ name: 'Tanjiya Nowrin' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark antialiased transition-colors duration-300">
        <AuthProvider>
          <ToastProvider>
            {/* Custom Cursor Overlay */}
            <CustomCursor />

            {/* Radial background grids */}
            <div className="fixed inset-0 z-0 bg-grid-pattern-light dark:bg-grid-pattern pointer-events-none opacity-60" />
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-neutral-100/50 dark:from-neutral-900/10 to-transparent pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pt-24">
                {children}
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
