'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  status: 'draft' | 'published';
  seoTitle: string;
  seoDescription: string;
  readTime: number;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Algorithms');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [coverImage, setCoverImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [readTime, setReadTime] = useState<number>(5);
  const [uploading, setUploading] = useState(false);

  const categories = ['Algorithms', 'Software Engineering', 'System Design', 'General'];

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blogs', { params: { status: 'all' } });
      // If server is not running or error, it will throw. We'll catch and set mock
      setBlogs(response.data.blogs || []);
    } catch (err) {
      showToast('Failed to load blog posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEditClick = (blog: Blog) => {
    setEditingBlog(blog);
    setIsCreating(false);

    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category);
    setTagsInput(blog.tags.join(', '));
    setStatus(blog.status);
    setCoverImage(blog.coverImage || '');
    setSeoTitle(blog.seoTitle || '');
    setSeoDescription(blog.seoDescription || '');
    setReadTime(blog.readTime || 5);
  };

  const handleCreateClick = () => {
    setEditingBlog(null);
    setIsCreating(true);

    setTitle('');
    setContent('');
    setCategory('Algorithms');
    setTagsInput('');
    setStatus('draft');
    setCoverImage('');
    setSeoTitle('');
    setSeoDescription('');
    setReadTime(5);
  };

  const handleCancel = () => {
    setEditingBlog(null);
    setIsCreating(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'blogs');

    setUploading(true);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCoverImage(res.data.url);
      showToast('Cover image uploaded successfully!', 'success');
    } catch (err) {
      showToast('Cover image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      showToast('Title and Content are required', 'warning');
      return;
    }

    const payload = {
      title,
      content,
      category,
      tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean),
      status,
      coverImage,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || content.substring(0, 150),
      readTime
    };

    try {
      if (isCreating) {
        await api.post('/blogs', payload);
        showToast('Blog post created successfully!', 'success');
      } else if (editingBlog) {
        await api.put(`/blogs/${editingBlog._id}`, payload);
        showToast('Blog post updated successfully!', 'success');
      }
      handleCancel();
      fetchBlogs();
    } catch (err) {
      showToast('Failed to save blog post', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      showToast('Blog post deleted successfully!', 'success');
      fetchBlogs();
    } catch (err) {
      showToast('Failed to delete blog post', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
          <h1 className="text-2xl font-extrabold text-black dark:text-white">Blog Management</h1>
        </div>
        {!isCreating && !editingBlog && (
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" /> New Blog
          </button>
        )}
      </div>

      {isCreating || editingBlog ? (
        /* Blog Editor Form */
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-6">
          <h2 className="text-lg font-bold text-black dark:text-white border-b border-border-light dark:border-border-dark pb-2">
            {isCreating ? 'Create New Post' : `Editing: ${editingBlog?.title}`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Article Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Dynamic programming secrets"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none font-semibold"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="C++, Algorithms, ICPC"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Reading Time (minutes)</label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Publish Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg text-black dark:text-white outline-none"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover image upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Cover Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
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
              {uploading && <span className="text-[10px] font-mono text-neutral-500 animate-pulse">Uploading cover...</span>}
            </div>
          </div>

          {/* Markdown Content Area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Article Content (Markdown supported)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Article intro&#10;Write article details here..."
              rows={12}
              className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none font-mono"
              required
            />
          </div>

          {/* SEO Optimizers split */}
          <div className="border-t border-border-light dark:border-border-dark pt-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Search Engine Optimization (SEO)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400">SEO Custom Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Custom browser tab title"
                  className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400">SEO Meta Description</label>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Short Google snippet text..."
                  className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                />
              </div>
            </div>
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
              <Save className="h-4 w-4" /> Save Article
            </button>
          </div>
        </form>
      ) : (
        /* Listing table */
        <div className="border border-border-light dark:border-border-dark rounded-xl overflow-hidden bg-card-light dark:bg-card-dark">
          {loading ? (
            <div className="p-6">
              <Skeleton className="h-24 w-full" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-neutral-500">No blog posts drafted in database.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-neutral-100/50 dark:bg-neutral-900/50 font-bold uppercase tracking-wider text-neutral-400">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-border-light dark:border-border-dark hover:bg-neutral-100/20 dark:hover:bg-neutral-900/10">
                    <td className="p-4 font-bold text-black dark:text-white">{blog.title}</td>
                    <td className="p-4"><span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded text-[10px] text-neutral-400">{blog.category}</span></td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        blog.status === 'published' ? 'bg-neutral-800 text-white' : 'bg-red-950/20 text-red-400 border border-red-950'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-neutral-500">{blog.views || 0}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(blog)}
                        className="p-1.5 hover:text-black dark:hover:text-white text-neutral-400 transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-1.5 hover:text-red-500 text-neutral-400 transition-colors"
                        title="Delete Article"
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
