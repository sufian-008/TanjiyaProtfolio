'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Mail, Github, Linkedin, Code } from 'lucide-react';
import api from '../services/api';

const typingTitles = [
  "Zero Olympiad Ambassador",
  "Bangla Innovator Team Co-Leader",
  "Community Volunteer",
  "Science Project Leader",
  "Problem Solver",
  "Youth Changemaker",
  "Leadership & Development Enthusiast"
];

export default function HomePage() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [bioText, setBioText] = useState("I am a Grade 7 student at Charfashion Residential Model School & College, serving as a Zero Olympiad Ambassador and Co-Leader of the Bangla Innovator Team. I am passionate about science, innovation, problem-solving, and social service.");
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    olympiads: 0,
    views: 0
  });

  // Typing effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = typingTitles[titleIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
      }, 100);
    }

    if (!isDeleting && displayText === currentFullText) {
      timer = setTimeout(() => setIsDeleting(true), 150); // pause at end
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % typingTitles.length);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex]);

  // Load actual counts from backend analytics if server is running, otherwise use hardcoded defaults
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/settings?view=true');
        if (response.data && response.data.bio) {
          const isMockBio = response.data.bio.includes("Designing smart");
          if (!isMockBio) {
            setBioText(response.data.bio);
          }
        }
        // also get analytics
        const analyticResponse = await api.get('/analytics').catch(() => null);
        if (analyticResponse) {
          setStats({
            projects: analyticResponse.data.counts.projects ?? 0,
            certificates: analyticResponse.data.counts.certificates ?? 0,
            olympiads: analyticResponse.data.counts.olympiads ?? 0,
            views: analyticResponse.data.counts.views ?? 0
          });
        }
      } catch (err) {
        // use default state
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="relative w-full min-h-[90vh] flex flex-col justify-center items-center px-6 overflow-hidden">

      {/* Animated Hero Grid Background */}
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-white/5 dark:bg-white-[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-neutral-200/5 dark:bg-white-[0.01] rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl w-full text-center flex flex-col items-center gap-8 py-12 relative z-10">

        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 py-1.5 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-xs uppercase tracking-widest text-neutral-500 font-semibold flex items-center gap-2"
        >

        </motion.div>

        {/* Hero Headers */}
        <div className="flex flex-col gap-3">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black dark:text-white"
          >
            Tanjiya Nowrin
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl sm:text-2xl text-neutral-500 h-8 font-display"
          >
            {displayText}
            <span className="border-r-2 border-black dark:border-white ml-1 animate-pulse" />
          </motion.div>
        </div>

        {/* Short Bio description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-2xl text-neutral-500 dark:text-neutral-400 text-sm sm:text-base leading-relaxed"
        >
          {bioText}
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-4"
        >
          <Link
            href="/projects"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:scale-[1.03] active:scale-[0.98] transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            View Projects <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border-light dark:border-border-dark bg-transparent text-black dark:text-white font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            Contact Me <Mail className="h-4 w-4" />
          </Link>

        </motion.div>

        {/* Stat numbers board */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mt-12 pt-8 border-t border-border-light dark:border-border-dark"
        >
          <div className="flex flex-col items-center p-4 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-black dark:hover:border-white transition-all">
            <span className="text-3xl font-extrabold text-black dark:text-white">{stats.projects}+</span>
            <span className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Projects Done</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-black dark:hover:border-white transition-all">
            <span className="text-3xl font-extrabold text-black dark:text-white">{stats.certificates}+</span>
            <span className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Credentials</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-black dark:hover:border-white transition-all">
            <span className="text-3xl font-extrabold text-black dark:text-white">{stats.olympiads}</span>
            <span className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Milestones</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-black dark:hover:border-white transition-all">
            <span className="text-3xl font-extrabold text-black dark:text-white">{stats.views}</span>
            <span className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Profile Views</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-16 text-neutral-500 flex flex-col items-center gap-1.5 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >

        </motion.div>

      </div>
    </div>
  );
}
