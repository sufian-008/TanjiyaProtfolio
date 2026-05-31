'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Check, Trash2, ShieldAlert, Reply, Send, X } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';

interface Comment {
  _id: string;
  blogId: string;
  parentId: string | null;
  author: string;
  content: string;
  likes: number;
  isApproved: boolean;
  isSpam: boolean;
  reported: boolean;
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState('');
  const { showToast } = useToast();

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/comments/admin');
      setComments(response.data);
    } catch (err) {
      showToast('Failed to load comments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/comments/${id}/approve`);
      showToast('Comment approved successfully!', 'success');
      fetchComments();
    } catch (err) {
      showToast('Failed to approve comment', 'error');
    }
  };

  const handleToggleSpam = async (id: string) => {
    try {
      await api.put(`/comments/${id}/spam`);
      showToast('Spam flag toggled!', 'success');
      fetchComments();
    } catch (err) {
      showToast('Failed to toggle spam state', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment and its nested replies?')) return;
    try {
      await api.delete(`/comments/${id}`);
      showToast('Comment deleted successfully!', 'success');
      fetchComments();
    } catch (err) {
      showToast('Failed to delete comment', 'error');
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyText.trim()) return;

    try {
      await api.post('/comments/reply', {
        blogId: replyingTo.blogId,
        parentId: replyingTo._id,
        content: replyText
      });
      showToast('Reply submitted!', 'success');
      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      showToast('Failed to post reply', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-border-light dark:border-border-dark">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">CMS Control</h2>
        <h1 className="text-2xl font-extrabold text-black dark:text-white">Comment Moderation</h1>
      </div>

      {/* Reply Dialog overlays */}
      {replyingTo && (
        <div className="p-4 rounded-xl border border-neutral-700 bg-neutral-900/10 dark:bg-neutral-900/30 flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs border-b border-neutral-800 pb-2">
            <span className="text-neutral-400">Replying to <span className="font-bold text-black dark:text-white">{replyingTo.author}</span></span>
            <button onClick={() => setReplyingTo(null)} className="text-neutral-500 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <p className="text-xs text-neutral-500 line-clamp-2 italic">{replyingTo.content}</p>
          <form onSubmit={handleReplySubmit} className="flex gap-2">
            <textarea
              placeholder="Write admin reply..."
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-border-light dark:border-border-dark bg-transparent rounded-lg text-black dark:text-white outline-none resize-none"
              required
            />
            <button
              type="submit"
              className="px-4 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Grid listing */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : comments.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border-light dark:border-border-dark rounded-xl">
            <p className="text-xs text-neutral-500">No comments posted yet.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all ${
                comment.isSpam ? 'border-red-950/40 bg-red-950/5' :
                comment.reported ? 'border-yellow-950/40 bg-yellow-950/5' :
                !comment.isApproved ? 'border-neutral-800/40 bg-neutral-900/5' :
                'border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black dark:text-white">{comment.author}</span>
                    <span className="text-neutral-500">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-1.5">
                    {comment.isSpam && <span className="bg-red-950/40 text-red-400 border border-red-900 px-2 py-0.5 rounded text-[8px] uppercase font-bold">Spam</span>}
                    {comment.reported && !comment.isSpam && <span className="bg-yellow-950/40 text-yellow-400 border border-yellow-900 px-2 py-0.5 rounded text-[8px] uppercase font-bold">Reported</span>}
                    {!comment.isApproved && !comment.isSpam && <span className="bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded text-[8px] uppercase font-bold">Pending Approval</span>}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-mono">
                  {comment.content}
                </p>
              </div>

              {/* Actions footer tools */}
              <div className="flex justify-between items-center pt-3 border-t border-border-light dark:border-border-dark">
                <div className="flex gap-2">
                  {!comment.isApproved && (
                    <button
                      onClick={() => handleApprove(comment._id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-700"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {comment.isApproved && (
                    <button
                      onClick={() => setReplyingTo(comment)}
                      className="flex items-center gap-1 px-2.5 py-1.5 border border-border-light dark:border-border-dark rounded-lg text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white"
                    >
                      <Reply className="h-3.5 w-3.5" /> Reply
                    </button>
                  )}
                </div>

                <div className="flex gap-2 text-neutral-500">
                  <button
                    onClick={() => handleToggleSpam(comment._id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      comment.isSpam ? 'border-red-900 bg-red-950/20 text-red-500' : 'border-border-light dark:border-border-dark hover:text-red-400'
                    }`}
                    title="Toggle Spam"
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="p-1.5 border border-border-light dark:border-border-dark rounded-lg hover:text-red-500 transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
