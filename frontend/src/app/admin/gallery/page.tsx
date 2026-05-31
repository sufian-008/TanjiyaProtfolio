'use client';

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Save, X, Upload } from 'lucide-react';
import api, { getImageUrl } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  url: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await api.get('/gallery');
      setItems(response.data);
    } catch (err) {
      showToast('Failed to load gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery');

    setUploading(true);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUrl(res.data.url);
      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      showToast('Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !url) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    try {
      await api.post('/gallery', { title, description, url });
      showToast('Gallery item created successfully!', 'success');
      // Reset Form
      setTitle('');
      setDescription('');
      setUrl('');
      setIsCreating(false);
      fetchGallery();
    } catch (err) {
      showToast('Failed to save gallery item', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      showToast('Gallery item deleted successfully!', 'success');
      fetchGallery();
    } catch (err) {
      showToast('Failed to delete gallery item', 'error');
    }
  };



  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
          <h1 className="text-2xl font-extrabold text-black dark:text-white">Gallery Management</h1>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Item
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
              <ImageIcon className="h-4 w-4" /> Add New Photo Card
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
              <label className="text-xs font-semibold text-neutral-400">Card Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Workspace Layout, Lock prototype sketch..."
                className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400">Card Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://... or upload file"
                  className="flex-1 px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none font-mono"
                  required
                />
                <label className="px-3 py-2 border border-border-light dark:border-border-dark bg-neutral-100 dark:bg-neutral-900 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-850 cursor-pointer flex items-center justify-center">
                  <Upload className="h-4 w-4 text-neutral-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {uploading && <span className="text-[10px] font-mono text-neutral-500 animate-pulse">Uploading asset...</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-400">Photo Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description that will show when users click this photo card..."
              rows={4}
              className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all self-end"
          >
            <Save className="h-4 w-4" /> Save Photo Card
          </button>
        </form>
      )}

      {/* List Display */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-light dark:border-border-dark rounded-xl">
          <p className="text-xs text-neutral-500">No photo cards uploaded. Click Add Item to upload your first card.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="group border border-border-light dark:border-border-dark rounded-xl overflow-hidden bg-card-light dark:bg-card-dark flex flex-col justify-between"
            >
              {/* Photo area */}
              <div className="h-44 w-full bg-neutral-900 border-b border-border-light dark:border-border-dark flex items-center justify-center overflow-hidden relative">
                {item.url ? (
                  <img
                    src={getImageUrl(item.url)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-neutral-800" />
                )}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-neutral-400 hover:text-red-400 transition-colors"
                  title="Delete Card"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Title Area */}
              <div className="p-4 flex flex-col gap-1">
                <span className="font-bold text-xs text-black dark:text-white truncate block">
                  {item.title}
                </span>
                <span className="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
