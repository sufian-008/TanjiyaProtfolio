'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2, Save, X, FileText } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

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

export default function AdminResearchWorkPage() {
  const [works, setWorks] = useState<ResearchWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('Tanjiya Nowrin');
  const [institution, setInstitution] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [abstract, setAbstract] = useState('');
  const [link, setLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const response = await api.get('/research');
      setWorks(response.data);
    } catch (err) {
      showToast('Failed to load research papers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !institution || !publicationDate || !abstract) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      await api.post('/research', {
        title,
        authors,
        institution,
        publicationDate,
        abstract,
        link,
        tags
      });
      showToast('Research work logged successfully!', 'success');
      // Reset Form
      setTitle('');
      setAuthors('Tanjiya Nowrin');
      setInstitution('');
      setPublicationDate('');
      setAbstract('');
      setLink('');
      setTagsInput('');
      setIsCreating(false);
      fetchResearch();
    } catch (err) {
      showToast('Failed to save research paper', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research entry?')) return;
    try {
      await api.delete(`/research/${id}`);
      showToast('Research work deleted successfully!', 'success');
      fetchResearch();
    } catch (err) {
      showToast('Failed to delete research work', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
          <h1 className="text-2xl font-extrabold text-black dark:text-white">Research Work</h1>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Research
          </button>
        )}
      </div>

      {/* Form Workspace */}
      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-4"
        >
          <div className="flex justify-between items-center border-b border-border-light dark:border-border-dark pb-2 mb-2">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Log New Research Paper
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400">Research Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of the research publication..."
                className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400">Authors (Comma-separated)</label>
              <input
                type="text"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="Tanjiya Nowrin, R. K. Chowdhury"
                className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400">Publisher / Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Institute of Sustainable Materials, Dhaka Council..."
                className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400">Publication Date (e.g. December 2025)</label>
              <input
                type="text"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                placeholder="Month and Year..."
                className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400">Document URL / PDF Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/paper.pdf..."
                className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Sustainability, Materials, Design..."
                className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-400">Abstract (Detailed description)</label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Write the paper abstract or research study overview..."
              rows={5}
              className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all self-end"
          >
            <Save className="h-4 w-4" /> Save Research Paper
          </button>
        </form>
      )}

      {/* List Display */}
      {loading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : works.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-light dark:border-border-dark rounded-xl">
          <p className="text-xs text-neutral-500">No research entries logged. Click Add Research to add your first study.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {works.map((work) => (
            <div
              key={work._id}
              className="border border-border-light dark:border-border-dark rounded-xl p-5 bg-card-light dark:bg-card-dark flex justify-between items-start hover:border-black dark:hover:border-white transition-colors"
            >
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark text-neutral-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1.5 max-w-2xl">
                  <span className="font-bold text-xs text-black dark:text-white block">
                    {work.title}
                  </span>
                  <div className="flex gap-2 text-[10px] text-neutral-500">
                    <span>{work.publicationDate}</span>
                    <span>•</span>
                    <span>{work.institution}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed">
                    {work.abstract}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(work._id)}
                className="p-1.5 rounded-lg border border-border-light dark:border-border-dark text-neutral-400 hover:text-red-400 transition-colors"
                title="Delete Entry"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
