'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Plus, Trash2, Edit3, Save, X, Upload } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

interface Project {
  _id: string;
  title: string;
  description: string;
  images: string[];
  techStack: string[];
  features: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  caseStudy: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [caseStudy, setCaseStudy] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const categories = ['Product Design', 'Environmental Projects', 'Creative Branding', 'Community Initiatives'];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsCreating(false);
    
    // Set form fields
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category);
    setGithubUrl(project.githubUrl);
    setLiveUrl(project.liveUrl);
    setTechStackInput(project.techStack.join(', '));
    setFeaturesInput(project.features.join('\n'));
    setCaseStudy(project.caseStudy);
    setImageUrl(project.images[0] || '');
  };

  const handleCreateClick = () => {
    setEditingProject(null);
    setIsCreating(true);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Frontend');
    setGithubUrl('');
    setLiveUrl('');
    setTechStackInput('');
    setFeaturesInput('');
    setCaseStudy('');
    setImageUrl('');
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsCreating(false);
  };

  // Image Upload helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'projects');

    setUploading(true);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageUrl(res.data.url);
      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      showToast('Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showToast('Title and Description are required', 'warning');
      return;
    }

    const payload = {
      title,
      description,
      category,
      githubUrl,
      liveUrl,
      techStack: techStackInput.split(',').map(s => s.trim()).filter(Boolean),
      features: featuresInput.split('\n').map(s => s.trim()).filter(Boolean),
      caseStudy,
      images: imageUrl ? [imageUrl] : []
    };

    try {
      if (isCreating) {
        await api.post('/projects', payload);
        showToast('Project created successfully!', 'success');
      } else if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, payload);
        showToast('Project updated successfully!', 'success');
      }
      handleCancel();
      fetchProjects();
    } catch (err) {
      showToast('Failed to save project', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      showToast('Project deleted successfully!', 'success');
      fetchProjects();
    } catch (err) {
      showToast('Failed to delete project', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
          <h1 className="text-2xl font-extrabold text-black dark:text-white">Project Management</h1>
        </div>
        {!isCreating && !editingProject && (
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Project
          </button>
        )}
      </div>

      {/* Grid listing / Form editor toggle */}
      {isCreating || editingProject ? (
        /* Edit / Create Form overlay */
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-6">
          <h2 className="text-lg font-bold text-black dark:text-white border-b border-border-light dark:border-border-dark pb-2">
            {isCreating ? 'Create New Project' : `Editing: ${editingProject?.title}`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Arena Engine"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg text-black dark:text-white outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Short Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for grid card..."
              rows={2}
              className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">GitHub URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Live Deploy URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="Next.js, Tailwind, Node.js"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
              />
            </div>

            {/* Media Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Cover Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Direct image link or upload below..."
                  className="flex-1 px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                />
                <label className="px-4 py-2 border border-border-light dark:border-border-dark bg-neutral-100 dark:bg-neutral-900 rounded-lg hover:bg-neutral-200 cursor-pointer flex items-center justify-center">
                  <Upload className="h-4 w-4 text-neutral-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {uploading && <span className="text-[10px] font-mono text-neutral-500 animate-pulse">Uploading file...</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Key Features (one per line)</label>
            <textarea
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="Dynamic coding arena&#10;Containerized compiler execute"
              rows={3}
              className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Detailed Case Study (Markdown supported)</label>
            <textarea
              value={caseStudy}
              onChange={(e) => setCaseStudy(e.target.value)}
              placeholder="## Core Architecture details..."
              rows={8}
              className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none font-mono"
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
              <Save className="h-4 w-4" /> Save Project
            </button>
          </div>

        </form>
      ) : (
        /* Listing view table */
        <div className="border border-border-light dark:border-border-dark rounded-xl overflow-hidden bg-card-light dark:bg-card-dark">
          {loading ? (
            <div className="p-6">
              <Skeleton className="h-24 w-full" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-neutral-500">No projects compiled in index yet.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-neutral-100/50 dark:bg-neutral-900/50 font-bold uppercase tracking-wider text-neutral-400">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Tech Stack</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj._id} className="border-b border-border-light dark:border-border-dark hover:bg-neutral-100/20 dark:hover:bg-neutral-900/10">
                    <td className="p-4 font-bold text-black dark:text-white">{proj.title}</td>
                    <td className="p-4"><span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded text-[10px] text-neutral-400">{proj.category}</span></td>
                    <td className="p-4 text-neutral-500 max-w-xs truncate">{proj.techStack.join(', ')}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(proj)}
                        className="p-1.5 hover:text-black dark:hover:text-white text-neutral-400 transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj._id)}
                        className="p-1.5 hover:text-red-500 text-neutral-400 transition-colors"
                        title="Delete Project"
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
