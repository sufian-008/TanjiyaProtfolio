'use client';

import React, { useEffect, useState } from 'react';
import { Award, Plus, Trash2, Edit3, Save, X, Upload } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

interface Certificate {
  _id: string;
  title: string;
  organization: string;
  date: string;
  imageUrl: string;
  credentialId: string;
  downloadUrl: string;
}

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [date, setDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/certificates');
      setCertificates(response.data);
    } catch (err) {
      showToast('Failed to load certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleEditClick = (cert: Certificate) => {
    setEditingCert(cert);
    setIsCreating(false);

    setTitle(cert.title);
    setOrganization(cert.organization);
    setDate(cert.date);
    setCredentialId(cert.credentialId);
    setDownloadUrl(cert.downloadUrl);
    setImageUrl(cert.imageUrl || '');
  };

  const handleCreateClick = () => {
    setEditingCert(null);
    setIsCreating(true);

    setTitle('');
    setOrganization('');
    setDate('');
    setCredentialId('');
    setDownloadUrl('');
    setImageUrl('');
  };

  const handleCancel = () => {
    setEditingCert(null);
    setIsCreating(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'certificates');

    setUploading(true);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageUrl(res.data.url);
      showToast('Certificate image uploaded successfully!', 'success');
    } catch (err) {
      showToast('Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organization || !date) {
      showToast('Title, Issuer and Date are required', 'warning');
      return;
    }

    const payload = {
      title,
      organization,
      date,
      credentialId,
      downloadUrl,
      imageUrl
    };

    try {
      if (isCreating) {
        await api.post('/certificates', payload);
        showToast('Certificate logged successfully!', 'success');
      } else if (editingCert) {
        await api.put(`/certificates/${editingCert._id}`, payload);
        showToast('Certificate updated successfully!', 'success');
      }
      handleCancel();
      fetchCertificates();
    } catch (err) {
      showToast('Failed to save certificate', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate record?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      showToast('Certificate deleted successfully!', 'success');
      fetchCertificates();
    } catch (err) {
      showToast('Failed to delete certificate', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
          <h1 className="text-2xl font-extrabold text-black dark:text-white">Credentials Directory</h1>
        </div>
        {!isCreating && !editingCert && (
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Certificate
          </button>
        )}
      </div>

      {isCreating || editingCert ? (
        /* Create/Edit Form */
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-6">
          <h2 className="text-lg font-bold text-black dark:text-white border-b border-border-light dark:border-border-dark pb-2">
            {isCreating ? 'Register Certificate' : `Editing: ${editingCert?.title}`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Credential Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Data Structures Masterclass"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Issuer Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Coursera / Stanford"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Date Issued</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Nov 2025"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Credential ID (Optional)</label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="CS-DSA-9821"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Verification Link</label>
              <input
                type="url"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://..."
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
              />
            </div>

            {/* Image upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Certificate Scan Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
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
              {uploading && <span className="text-[10px] font-mono text-neutral-500 animate-pulse">Uploading asset...</span>}
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
              <Save className="h-4 w-4" /> Save Certificate
            </button>
          </div>

        </form>
      ) : (
        /* List Table view */
        <div className="border border-border-light dark:border-border-dark rounded-xl overflow-hidden bg-card-light dark:bg-card-dark">
          {loading ? (
            <div className="p-6">
              <Skeleton className="h-24 w-full" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-neutral-500">No credentials stored in system registry.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-neutral-100/50 dark:bg-neutral-900/50 font-bold uppercase tracking-wider text-neutral-400">
                  <th className="p-4">Title</th>
                  <th className="p-4">Issuer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr key={cert._id} className="border-b border-border-light dark:border-border-dark hover:bg-neutral-100/20 dark:hover:bg-neutral-900/10">
                    <td className="p-4 font-bold text-black dark:text-white">{cert.title}</td>
                    <td className="p-4 text-neutral-400 font-semibold">{cert.organization}</td>
                    <td className="p-4 text-neutral-500 font-mono">{cert.date}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(cert)}
                        className="p-1.5 hover:text-black dark:hover:text-white text-neutral-400 transition-colors"
                        title="Edit Record"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert._id)}
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
