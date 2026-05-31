'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Calendar, BookOpen, Compass, Search } from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/Skeleton';

interface ResearchWork {
  _id: string;
  title: string;
  authors: string;
  institution: string;
  publicationDate: string;
  abstract: string;
  link: string;
  tags: string[];
}

export default function ResearchWorkPage() {
  const [works, setWorks] = useState<ResearchWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const response = await api.get('/research');
      setWorks(response.data);
    } catch (err) {
      // Fallback mocks
      setWorks([
        {
          _id: '1',
          title: 'Biodegradable Materials in Consumer Electronics Packaging: A Comparative Study',
          authors: 'Tanjiya Nowrin, R. K. Chowdhury',
          institution: 'Institute of Sustainable Materials',
          publicationDate: 'December 2025',
          abstract: 'This study analyzes the structural integrity, decomposition rates, and moisture resistance of three starch-based bioplastics as potential replacements for expanded polystyrene (EPS) in consumer hardware housing. Experimental findings demonstrate a 40% improvement in biodegradable decomposition rate under standardized soil conditions, while maintaining baseline impact resistance suitable for transport safeguards.',
          link: 'https://example.com/research-paper-biodegradable.pdf',
          tags: ['Sustainability', 'Product Design', 'Materials Research']
        },
        {
          _id: '2',
          title: 'Urban Canopy Densification and Its Microclimatic Impact in Residential Dhaka',
          authors: 'Tanjiya Nowrin, S. T. Rahman',
          institution: 'Dhaka Urban Planning Council',
          publicationDate: 'October 2024',
          abstract: 'An empirical observation of temperature deviations across three municipal areas of Dhaka City, comparing microclimatic conditions before and after structural community garden implementation. Utilizing thermal imaging datasets and local temperature sensors, we demonstrate a localized cooling of 2.1 degrees Celsius during peak afternoon heatwaves, illustrating the long-term utility of community-led roof vegetation initiatives.',
          link: 'https://example.com/research-paper-urban-canopy.pdf',
          tags: ['Environmental Studies', 'Urban Architecture', 'Climatology']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredWorks = works.filter((w) =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12 min-h-[80vh]">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Academic & Environmental Logs</h2>
        <h1 className="text-4xl font-extrabold text-black dark:text-white">Research Work</h1>
      </div>

      {/* Search filters */}
      <div className="relative w-full flex items-center border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-xl px-4 py-3">
        <Search className="h-4.5 w-4.5 text-neutral-500 mr-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by publication name, publisher, tags..."
          className="w-full text-sm bg-transparent outline-none text-black dark:text-white placeholder-neutral-550"
        />
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : filteredWorks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-light dark:border-border-dark rounded-2xl">
          <p className="text-neutral-500">No research papers found matching your query.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredWorks.map((work) => (
            <motion.div
              layout
              key={work._id}
              className="border border-border-light dark:border-border-dark rounded-xl p-6 bg-card-light dark:bg-card-dark hover:border-black dark:hover:border-white transition-all duration-300 flex flex-col gap-4"
            >
              {/* Top metadata */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider items-center">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {work.publicationDate}</span>
                  <span className="text-neutral-600">•</span>
                  <span className="flex items-center gap-1"><Compass className="h-3 w-3" /> {work.institution}</span>
                </div>

                <h3 className="text-lg font-bold text-black dark:text-white leading-snug">
                  {work.title}
                </h3>

                <span className="text-xs text-neutral-400 font-medium">
                  Authors: {work.authors}
                </span>
              </div>

              {/* Abstract */}
              <div className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 font-medium">
                {expandedId === work._id ? (
                  <p>{work.abstract}</p>
                ) : (
                  <p className="line-clamp-2">{work.abstract}</p>
                )}
              </div>

              {/* Lower Actions & Tags */}
              <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {work.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark px-2 py-0.5 rounded text-neutral-550"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 items-center text-xs font-semibold">
                  <button
                    onClick={() => toggleExpand(work._id)}
                    className="flex items-center gap-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {expandedId === work._id ? 'Collapse Abstract' : 'View Abstract'}
                  </button>

                  {work.link && (
                    <a
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-black dark:text-white hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" /> Full Paper <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
