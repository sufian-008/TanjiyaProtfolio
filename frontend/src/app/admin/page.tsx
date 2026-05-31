'use client';

import React, { useEffect, useState } from 'react';
import { Eye, Layers, FileText, MessageSquare, Award, CheckCircle, Mail, Clock } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Skeleton } from '../../components/Skeleton';

interface CountStats {
  projects: number;
  blogs: number;
  comments: number;
  pendingComments: number;
  certificates: number;
  olympiads: number;
  unreadContacts: number;
  views: number;
}

interface RecentContact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface RecentComment {
  _id: string;
  blogId: string;
  author: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

interface VisitorChartNode {
  day: string;
  views: number;
}

export default function AdminDashboardHome() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<CountStats>({
    projects: 0,
    blogs: 0,
    comments: 0,
    pendingComments: 0,
    certificates: 0,
    olympiads: 0,
    unreadContacts: 0,
    views: 0
  });
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [chartData, setChartData] = useState<VisitorChartNode[]>([]);

  const { showToast } = useToast();

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setCounts(response.data.counts);
      setRecentContacts(response.data.recent.contacts);
      setRecentComments(response.data.recent.comments);
      setChartData(response.data.visitorChartData);
    } catch (err) {
      // Mock defaults
      setCounts({
        projects: 12,
        blogs: 5,
        comments: 18,
        pendingComments: 3,
        certificates: 15,
        olympiads: 6,
        unreadContacts: 2,
        views: 3120
      });
      setRecentContacts([
        {
          _id: '1',
          name: 'Sarah Connor',
          email: 'sarah@resistance.org',
          subject: 'Robotics Project Consultation',
          message: 'Hi Tanjiya, love your platform. Are you open for a backend consulting project starting next month?',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ]);
      setRecentComments([
        {
          _id: '2',
          blogId: '101',
          author: 'John Doe',
          content: 'This dynamic programming breakdown is incredibly neat!',
          isApproved: false,
          createdAt: new Date().toISOString()
        }
      ]);
      setChartData([
        { day: 'Mon', views: 120 },
        { day: 'Tue', views: 240 },
        { day: 'Wed', views: 180 },
        { day: 'Thu', views: 320 },
        { day: 'Fri', views: 410 },
        { day: 'Sat', views: 350 },
        { day: 'Sun', views: 280 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Poll the backend every 5 seconds for real-time visitor stats
    const interval = setInterval(() => {
      // Fetch silently without turning on the skeleton loader
      api.get('/analytics')
        .then(response => {
          setCounts(response.data.counts);
          setRecentContacts(response.data.recent.contacts);
          setRecentComments(response.data.recent.comments);
          setChartData(response.data.visitorChartData);
        })
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/contact/messages/${id}/read`);
      showToast('Message marked as read!', 'success');
      setRecentContacts(prev => prev.map(c => c._id === id ? { ...c, isRead: true } : c));
      setCounts(prev => ({ ...prev, unreadContacts: Math.max(0, prev.unreadContacts - 1) }));
    } catch (err) {
      showToast('Failed to update message status', 'error');
    }
  };

  // Determine max views to scale custom SVG chart
  const maxViews = Math.max(...chartData.map(node => node.views), 1);

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Platform Core</h2>
        <h1 className="text-3xl font-extrabold text-black dark:text-white">Admin Dashboard</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        /* Metrices overview cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border-light dark:border-border-dark rounded-xl p-4 bg-card-light dark:bg-card-dark flex items-center justify-between relative overflow-hidden group">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-black dark:text-white">{counts.views}</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[9px] text-green-500 font-bold uppercase tracking-wider">Live</span>
              </div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Total Profile Views</span>
            </div>
            <Eye className="h-6 w-6 text-neutral-600" />
          </div>

          <div className="border border-border-light dark:border-border-dark rounded-xl p-4 bg-card-light dark:bg-card-dark flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-black text-black dark:text-white">{counts.projects}</span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Active Projects</span>
            </div>
            <Layers className="h-6 w-6 text-neutral-600" />
          </div>

          <div className="border border-border-light dark:border-border-dark rounded-xl p-4 bg-card-light dark:bg-card-dark flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-black text-black dark:text-white">{counts.blogs}</span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Published Blogs</span>
            </div>
            <FileText className="h-6 w-6 text-neutral-600" />
          </div>

          <div className="border border-border-light dark:border-border-dark rounded-xl p-4 bg-card-light dark:bg-card-dark flex items-center justify-between">
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-2xl font-black text-black dark:text-white">{counts.pendingComments}</span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Pending Moderations</span>
            </div>
            <MessageSquare className="h-6 w-6 text-neutral-600" />
          </div>
        </div>
      )}

      {/* Analytics Chart & Recent activities splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG Custom views chart */}
        <div className="lg:col-span-2 border border-border-light dark:border-border-dark rounded-xl p-5 bg-card-light dark:bg-card-dark flex flex-col gap-6">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Weekly Visitor Graph</h3>
          
          <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 border-b border-l border-neutral-200 dark:border-neutral-800 px-4">
            {chartData.map((node, index) => {
              const barHeightPercent = Math.max(10, Math.floor((node.views / maxViews) * 100));
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-1 text-[8px] bg-black text-white px-1.5 py-0.5 rounded border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    {node.views}
                  </span>
                  
                  {/* Bar */}
                  <div
                    className="w-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-black dark:group-hover:bg-white rounded-t transition-all"
                    style={{ height: `${barHeightPercent}%` }}
                  />
                  
                  <span className="text-[10px] font-mono text-neutral-400">{node.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Counter metrics box */}
        <div className="border border-border-light dark:border-border-dark rounded-xl p-5 bg-card-light dark:bg-card-dark flex flex-col gap-4">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">CMS Index Counts</h3>
          
          <div className="flex flex-col gap-3.5 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-border-light dark:border-border-dark">
              <span className="text-neutral-500">Unread Contacts</span>
              <span className="font-mono bg-red-950/20 text-red-400 px-2 py-0.5 rounded-full">{counts.unreadContacts}</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-border-light dark:border-border-dark">
              <span className="text-neutral-500">Total Credentials</span>
              <span className="font-mono text-black dark:text-white font-bold">{counts.certificates}</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-border-light dark:border-border-dark">
              <span className="text-neutral-500">Key Milestones</span>
              <span className="font-mono text-black dark:text-white font-bold">{counts.olympiads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Total Discussions</span>
              <span className="font-mono text-black dark:text-white font-bold">{counts.comments}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Detailed logs bottom split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Recent Contact Queries */}
        <div className="border border-border-light dark:border-border-dark rounded-xl p-5 bg-card-light dark:bg-card-dark flex flex-col gap-4">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Recent Form Submissions</h3>
          
          <div className="flex flex-col gap-4">
            {recentContacts.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-6">No contact messages received.</p>
            ) : (
              recentContacts.map((contact) => (
                <div key={contact._id} className="p-3 border border-border-light dark:border-border-dark rounded-lg flex flex-col gap-2 bg-neutral-100/10 dark:bg-neutral-900/10">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-black dark:text-white">{contact.name}</span>
                    <span className="text-neutral-500">{new Date(contact.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-400">{contact.subject}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{contact.message}</p>
                  
                  {!contact.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(contact._id)}
                      className="self-end flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-neutral-400 hover:text-black dark:hover:text-white"
                    >
                      <CheckCircle className="h-3 w-3" /> Mark Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Comments */}
        <div className="border border-border-light dark:border-border-dark rounded-xl p-5 bg-card-light dark:bg-card-dark flex flex-col gap-4">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Recent Comments</h3>
          
          <div className="flex flex-col gap-4">
            {recentComments.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-6">No discussions posted.</p>
            ) : (
              recentComments.map((comment) => (
                <div key={comment._id} className="p-3 border border-border-light dark:border-border-dark rounded-lg flex flex-col gap-2 bg-neutral-100/10 dark:bg-neutral-900/10">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-black dark:text-white">{comment.author}</span>
                    <span className="text-neutral-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{comment.content}</p>
                  <span className={`text-[8px] uppercase tracking-wider font-bold w-max px-2 py-0.5 rounded ${
                    comment.isApproved ? 'bg-neutral-800 text-white' : 'bg-red-950/20 text-red-400 border border-red-950'
                  }`}>
                    {comment.isApproved ? 'Approved' : 'Pending Moderation'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
