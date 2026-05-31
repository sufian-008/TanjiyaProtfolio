'use client';

import React, { useEffect, useState } from 'react';
import { Save, Lock, User, Github, Linkedin, Mail, Upload, FileText, Plus, Trash2 } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Profile Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [achievements, setAchievements] = useState<{ title: string; description: string }[]>([]);
  const [interestsInput, setInterestsInput] = useState('');

  // Password change Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const [uploading, setUploading] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/settings');
      const data = response.data;

      setName(data.name || '');
      setEmail(data.email || '');
      setBio(data.bio || '');
      setGithub(data.socials?.github || '');
      setLinkedin(data.socials?.linkedin || '');
      setResumeUrl(data.resumeUrl || '');
      setAvatarUrl(data.avatarUrl || '');
      setAchievements(data.achievements || []);
      setInterestsInput(data.interests ? data.interests.join(', ') : '');
    } catch (err) {
      showToast('Failed to load profile settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'resumes');

    setUploading(true);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeUrl(res.data.url);
      showToast('Resume uploaded successfully!', 'success');
    } catch (err) {
      showToast('Resume upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'avatars');

    setUploading(true);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAvatarUrl(res.data.url);
      showToast('Profile photo uploaded successfully!', 'success');
    } catch (err) {
      showToast('Profile photo upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddAchievement = () => {
    setAchievements([...achievements, { title: '', description: '' }]);
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleAchievementChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    setAchievements(updated);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        bio,
        socials: { github, linkedin },
        resumeUrl,
        avatarUrl,
        achievements,
        interests: interestsInput.split(',').map(s => s.trim()).filter(Boolean)
      };
      await api.put('/settings', payload);
      showToast('Settings saved successfully!', 'success');
      fetchSettings();
    } catch (err) {
      showToast('Failed to save profile settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'warning');
      return;
    }

    setPasswordSubmitting(true);
    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword
      });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Password update failed', 'error');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-border-light dark:border-border-dark">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
        <h1 className="text-2xl font-extrabold text-black dark:text-white">Profile & Security Settings</h1>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile form section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <form
              onSubmit={handleProfileSubmit}
              className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-6"
            >
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-border-light dark:border-border-dark pb-2 mb-2">
                <User className="h-4 w-4" /> Personal Brand Identity
              </h3>

              {/* Profile Image Section */}
              <div className="flex flex-col gap-2.5 items-center md:items-start border-b border-border-light dark:border-border-dark pb-6 mb-2">
                <label className="text-xs font-semibold text-neutral-400">Profile Picture</label>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-neutral-250 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl.startsWith('http') ? avatarUrl : `${api.defaults.baseURL?.replace('/api', '') || ''}${avatarUrl}`}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-neutral-400">No Image</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="px-4 py-2 border border-border-light dark:border-border-dark bg-neutral-100 dark:bg-neutral-900 rounded-lg hover:bg-neutral-250 dark:hover:bg-neutral-800 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                      <Upload className="h-3.5 w-3.5 text-neutral-500" /> Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-neutral-500">Supports PNG, JPG, JPEG</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-400">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tanjiya Nowrin"
                    className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-400">Public Contact Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tanjiya@example.com"
                    className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400">Bio Summary</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell visitors about your passion..."
                  rows={4}
                  className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1"><Github className="h-3 w-3" /> GitHub URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1"><Linkedin className="h-3 w-3" /> LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Upload Resume CV asset */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400">Resume / CV File</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none font-mono"
                  />
                  <label className="px-4 py-2 border border-border-light dark:border-border-dark bg-neutral-100 dark:bg-neutral-900 rounded-lg hover:bg-neutral-200 cursor-pointer flex items-center justify-center">
                    <Upload className="h-4 w-4 text-neutral-500" />
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploading && <span className="text-[10px] font-mono text-neutral-500 animate-pulse">Uploading file...</span>}
              </div>

              {/* Interests Cloud Input */}
              <div className="flex flex-col gap-1.5 border-t border-border-light dark:border-border-dark pt-6">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Interests & Areas of Engagement (comma separated)</label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder="Science, Robotics, Olympiads, Leadership"
                  className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                />
                <span className="text-[10px] text-neutral-500">Provide comma-separated values to appear as pills on the About page.</span>
              </div>

              {/* Achievements CRUD */}
              <div className="flex flex-col gap-3 border-t border-border-light dark:border-border-dark pt-6">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Key Achievements & Milestones</label>
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="flex items-center gap-1 px-2.5 py-1.5 border border-border-light dark:border-border-dark hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg text-[10px] font-semibold uppercase text-neutral-600 dark:text-neutral-400"
                  >
                    <Plus className="h-3 w-3" /> Add Achievement
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {achievements.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-3 rounded-lg border border-border-light dark:border-border-dark bg-neutral-50/50 dark:bg-neutral-950/20 relative group">
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(idx)}
                        className="absolute top-2 right-2 text-neutral-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Achievement"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleAchievementChange(idx, 'title', e.target.value)}
                          placeholder="Zero Olympiad Ambassador"
                          className="px-2.5 py-1.5 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-md text-black dark:text-white outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleAchievementChange(idx, 'description', e.target.value)}
                          placeholder="Brief description of your milestone..."
                          rows={2}
                          className="px-2.5 py-1.5 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-md text-black dark:text-white outline-none resize-none"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  {achievements.length === 0 && (
                    <span className="text-[11px] text-neutral-500 text-center py-2">No custom achievements added. Click "Add Achievement" to create one.</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all self-end"
              >
                <Save className="h-4 w-4" /> Save Settings
              </button>
            </form>
          </div>

          {/* Security password settings column */}
          <div className="flex flex-col gap-6">
            <form
              onSubmit={handlePasswordSubmit}
              className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-4"
            >
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-border-light dark:border-border-dark pb-2 mb-2">
                <Lock className="h-4 w-4" /> Security Gateway
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passwordSubmitting}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all mt-2"
              >
                Change Password
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
