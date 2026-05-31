'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, Trash2, Edit3, Save, Star, 
  Award, Brain, Target, Flame, Briefcase, 
  Users, MessageSquare, Lightbulb, Heart, 
  Code, Terminal, Cpu, Globe, Settings, Database
} from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

interface SkillItem {
  _id: string;
  name: string;
  category: string;
  percentage: number;
  icon: string;
}

// Icon helper map for rendering previews
const iconMap: { [key: string]: any } = {
  Award, Brain, Target, Flame, Briefcase, 
  Users, MessageSquare, Lightbulb, Heart, 
  Code, Terminal, Cpu, Globe, Settings, Database
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [percentage, setPercentage] = useState(80);
  const [icon, setIcon] = useState('Award');

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (err) {
      showToast('Failed to load skills list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleEditClick = (skill: SkillItem) => {
    setEditingSkill(skill);
    setIsCreating(false);

    setName(skill.name);
    setCategory(skill.category);
    setPercentage(skill.percentage);
    setIcon(skill.icon || 'Award');
  };

  const handleCreateClick = () => {
    setEditingSkill(null);
    setIsCreating(true);

    setName('');
    setCategory('');
    setPercentage(80);
    setIcon('Award');
  };

  const handleCancel = () => {
    setEditingSkill(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) {
      showToast('Skill name and Category are required', 'warning');
      return;
    }

    const payload = {
      name,
      category,
      percentage: Number(percentage),
      icon
    };

    try {
      if (isCreating) {
        await api.post('/skills', payload);
        showToast('Skill created successfully!', 'success');
      } else if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, payload);
        showToast('Skill updated successfully!', 'success');
      }
      handleCancel();
      fetchSkills();
    } catch (err) {
      showToast('Failed to save skill', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      showToast('Skill deleted successfully!', 'success');
      fetchSkills();
    } catch (err) {
      showToast('Failed to delete skill', 'error');
    }
  };

  // Helper component to render dynamic icons
  const renderIconPreview = (iconName: string, className = "h-4 w-4") => {
    const IconComponent = iconMap[iconName] || Award;
    return <IconComponent className={className} />;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
          <h1 className="text-2xl font-extrabold text-black dark:text-white flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" /> Development & Soft Skills
          </h1>
        </div>
        {!isCreating && !editingSkill && (
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Skill
          </button>
        )}
      </div>

      {isCreating || editingSkill ? (
        /* Create/Edit Form */
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-6">
          <h2 className="text-lg font-bold text-black dark:text-white border-b border-border-light dark:border-border-dark pb-2">
            {isCreating ? 'Create New Skill' : `Editing Skill: ${editingSkill?.name}`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Skill Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Leadership / Problem Solving"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Core Skills / Soft Skills / Science & Tech"
                className="px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex justify-between">
                <span>Proficiency Level</span>
                <span className="font-mono text-black dark:text-white">{percentage}%</span>
              </label>
              <div className="flex gap-4 items-center h-10">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="flex-1 accent-black dark:accent-white bg-neutral-200 dark:bg-neutral-850 h-1.5 rounded-full cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Representing Icon</label>
              <div className="flex gap-2">
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg text-black dark:text-white outline-none"
                >
                  {Object.keys(iconMap).map((iconName) => (
                    <option key={iconName} value={iconName}>{iconName}</option>
                  ))}
                </select>
                <div className="w-10 h-10 border border-border-light dark:border-border-dark rounded-lg bg-neutral-100/50 dark:bg-neutral-900/50 flex items-center justify-center text-black dark:text-white">
                  {renderIconPreview(icon, "h-5 w-5")}
                </div>
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
              <Save className="h-4 w-4" /> Save Skill
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
          ) : skills.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-neutral-500">No skills added in database.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-neutral-100/50 dark:bg-neutral-900/50 font-bold uppercase tracking-wider text-neutral-400">
                  <th className="p-4 w-12 text-center">Icon</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Percentage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill._id} className="border-b border-border-light dark:border-border-dark hover:bg-neutral-100/20 dark:hover:bg-neutral-900/10">
                    <td className="p-4 text-center">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border border-border-light dark:border-border-dark">
                        {renderIconPreview(skill.icon || 'Award', "h-4 w-4")}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-black dark:text-white">{skill.name}</td>
                    <td className="p-4"><span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded text-[10px] text-neutral-400 font-semibold">{skill.category}</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-neutral-100 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-black dark:bg-white h-full" style={{ width: `${skill.percentage}%` }} />
                        </div>
                        <span className="font-mono font-semibold text-neutral-500">{skill.percentage}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2 h-16 items-center">
                      <button
                        onClick={() => handleEditClick(skill)}
                        className="p-1.5 hover:text-black dark:hover:text-white text-neutral-400 transition-colors"
                        title="Edit Skill"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-1.5 hover:text-red-500 text-neutral-400 transition-colors"
                        title="Delete Skill"
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
