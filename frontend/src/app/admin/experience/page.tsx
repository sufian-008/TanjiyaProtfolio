'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

interface ExperienceItem {
  _id: string;
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  type: 'Work' | 'Education' | 'Organization' | 'Volunteering';
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [duration, setDuration] = useState('');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
  const [achievementsInput, setAchievementsInput] = useState('');
  const [technologiesInput, setTechnologiesInput] = useState('');
  const [type, setType] = useState<'Work' | 'Education' | 'Organization' | 'Volunteering'>('Work');

  const types: ('Work' | 'Education' | 'Organization' | 'Volunteering')[] = [
    'Work', 'Education', 'Organization', 'Volunteering'
  ];

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await api.get('/experience');
      setExperiences(response.data);
    } catch (err) {
      showToast('Failed to load experiences', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleEditClick = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setIsCreating(false);

    setCompany(exp.company);
    setRole(exp.role);
    setDuration(exp.duration);
    setResponsibilitiesInput(exp.responsibilities.join('\n'));
    setAchievementsInput(exp.achievements.join('\n'));
    setTechnologiesInput(exp.technologies.join(', '));
    setType(exp.type);
  };

  const handleCreateClick = () => {
    setEditingExp(null);
    setIsCreating(true);

    setCompany('');
    setRole('');
    setDuration('');
    setResponsibilitiesInput('');
    setAchievementsInput('');
    setTechnologiesInput('');
    setType('Work');
  };

  const handleCancel = () => {
    setEditingExp(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !duration) {
      showToast('Institution/Company name, Role and Duration are required', 'warning');
      return;
    }

    const payload = {
      company,
      role,
      duration,
      responsibilities: responsibilitiesInput.split('\n').map(s => s.trim()).filter(Boolean),
      achievements: achievementsInput.split('\n').map(s => s.trim()).filter(Boolean),
      technologies: technologiesInput.split(',').map(s => s.trim()).filter(Boolean),
      type
    };

    try {
      if (isCreating) {
        await api.post('/experience', payload);
        showToast('Milestone created successfully!', 'success');
      } else if (editingExp) {
        await api.put(`/experience/${editingExp._id}`, payload);
        showToast('Milestone updated successfully!', 'success');
      }
      handleCancel();
      fetchExperiences();
    } catch (err) {
      showToast('Failed to save milestone', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career record?')) return;
    try {
      await api.delete(`/experience/${id}`);
      showToast('Milestone deleted successfully!', 'success');
      fetchExperiences();
    } catch (err) {
      showToast('Failed to delete milestone', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
          <h1 className="text-2xl font-extrabold text-black dark:text-white">Career & Education Milestones</h1>
        </div>
        {!isCreating && !editingExp && (
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Milestone
          </button>
        )}
      </div>

      {isCreating || editingExp ? (
        /* Create/Edit Form */
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-6">
          <h2 className="text-lg font-bold text-black dark:text-white border-b border-border-light dark:border-border-dark pb-2">
            {isCreating ? 'Create Career Milestone' : `Editing: ${editingExp?.role}`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Institution / Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Tech Solutions / University"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Designation / Role Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Software Engineer / Student"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Milestone Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg text-black dark:text-white outline-none"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Duration / Date Range</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="2024 - Present / Nov 2025"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Technologies Used (comma separated)</label>
              <input
                type="text"
                value={technologiesInput}
                onChange={(e) => setTechnologiesInput(e.target.value)}
                placeholder="Node.js, Docker, C++"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Responsibilities (one per line)</label>
            <textarea
              value={responsibilitiesInput}
              onChange={(e) => setResponsibilitiesInput(e.target.value)}
              placeholder="Architecting robust REST services&#10;Database normalization reviews"
              rows={3}
              className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Achievements (one per line)</label>
            <textarea
              value={achievementsInput}
              onChange={(e) => setAchievementsInput(e.target.value)}
              placeholder="Reduced CPU overhead by 22%&#10;Mentored 4 junior interns"
              rows={2}
              className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-border-light dark:border-border-dark text-neutral-500 hover:text-black dark:hover:text-white rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" /> Save Milestone
            </button>
          </div>

        </form>
      ) : (
        /* List table view */
        <div className="border border-border-light dark:border-border-dark rounded-xl overflow-hidden bg-card-light dark:bg-card-dark">
          {loading ? (
            <div className="p-6">
              <Skeleton className="h-24 w-full" />
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-neutral-500">No milestones stored in history timeline.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-neutral-100/50 dark:bg-neutral-900/50 font-bold uppercase tracking-wider text-neutral-400">
                  <th className="p-4">Role</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <tr key={exp._id} className="border-b border-border-light dark:border-border-dark hover:bg-neutral-100/20 dark:hover:bg-neutral-900/10">
                    <td className="p-4 font-bold text-black dark:text-white">{exp.role}</td>
                    <td className="p-4 text-neutral-400 font-semibold">{exp.company}</td>
                    <td className="p-4"><span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded text-[10px] text-neutral-400">{exp.type}</span></td>
                    <td className="p-4 text-neutral-500 font-mono">{exp.duration}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(exp)}
                        className="p-1.5 hover:text-black dark:hover:text-white text-neutral-400 transition-colors"
                        title="Edit Record"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="p-1.5 hover:text-red-500 text-neutral-400 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}
