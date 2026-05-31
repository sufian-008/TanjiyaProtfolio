'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Upload, Copy, Trash2, Image as ImageIcon, Link as LinkIcon, FileText } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

interface MediaItem {
  _id: string;
  filename: string;
  url: string;
  publicId: string;
  size: number;
  mimeType: string;
  folder: string;
  createdAt: string;
}

export default function AdminMediaLibrary() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await api.get('/media');
      setMediaList(response.data);
    } catch (err) {
      showToast('Failed to load media assets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'uploads');

    setUploading(true);
    try {
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Media asset uploaded successfully!', 'success');
      fetchMedia();
    } catch (err) {
      showToast('Media upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleCopyLink = (url: string) => {
    const formattedUrl = url.startsWith('/uploads/') ? `http://localhost:5000${url}` : url;
    navigator.clipboard.writeText(formattedUrl);
    showToast('Direct asset link copied to clipboard!', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this media file?')) return;
    try {
      await api.delete(`/media/${id}`);
      showToast('Asset deleted successfully', 'success');
      fetchMedia();
    } catch (err) {
      showToast('Failed to delete media asset', 'error');
    }
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('/uploads/')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-border-light dark:border-border-dark">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
        <h1 className="text-2xl font-extrabold text-black dark:text-white">Media Library</h1>
      </div>

      {/* Drag & Drop Upload Zone Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
          dragActive
            ? 'border-black dark:border-white bg-neutral-100/10'
            : 'border-border-light dark:border-border-dark hover:border-black dark:hover:border-white'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept="image/*,application/pdf"
        />
        
        <div className="p-4 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-neutral-500">
          <Upload className="h-6 w-6" />
        </div>

        <div className="text-center flex flex-col gap-1">
          <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
            {uploading ? 'Uploading asset...' : 'Drag and drop or click to upload'}
          </span>
          <span className="text-[10px] text-neutral-500 font-medium">Supports PNG, JPG, WEBP or PDF files up to 10MB</span>
        </div>
      </div>

      {/* Media Grid listing */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Storage Assets</h3>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : mediaList.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border-light dark:border-border-dark rounded-xl">
            <p className="text-xs text-neutral-500">Storage is empty. Upload your first asset.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaList.map((item) => {
              const isImage = item.mimeType?.startsWith('image/');
              return (
                <div
                  key={item._id}
                  className="group relative border border-border-light dark:border-border-dark rounded-xl overflow-hidden bg-card-light dark:bg-card-dark flex flex-col justify-between"
                >
                  {/* Thumbnail */}
                  <div className="h-32 w-full bg-neutral-950 border-b border-border-light dark:border-border-dark flex items-center justify-center overflow-hidden relative">
                    {isImage ? (
                      <img
                        src={getImageUrl(item.url)}
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <FileText className="h-10 w-10 text-neutral-700" />
                    )}
                    
                    {/* Hover controls overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleCopyLink(item.url)}
                        className="p-2 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
                        title="Copy direct URL"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-full border border-red-900 bg-neutral-900 text-neutral-400 hover:text-red-500 transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details summary */}
                  <div className="p-3 flex flex-col gap-0.5 text-[10px]">
                    <span className="font-bold text-black dark:text-white truncate block" title={item.filename}>
                      {item.filename}
                    </span>
                    <span className="text-neutral-500 font-mono block">
                      {Math.ceil(item.size / 1024)} KB — {item.folder}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
