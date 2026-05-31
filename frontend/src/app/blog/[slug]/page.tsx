'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Eye, Clock, ArrowLeft, Heart, AlertTriangle, Reply, Send, Share2, CornerDownRight } from 'lucide-react';
import api, { getImageUrl } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Skeleton } from '../../../components/Skeleton';
import ReactMarkdown from 'react-markdown';

interface Comment {
  _id: string;
  blogId: string;
  parentId: string | null;
  author: string;
  content: string;
  likes: number;
  createdAt: string;
  replies?: Comment[];
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  readTime: number;
  createdAt: string;
}

export default function SingleBlogPage({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Comments Form State
  const [authorName, setAuthorName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  
  // Reply Form state
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const { showToast } = useToast();
  const router = useRouter();

  const fetchBlogAndComments = async () => {
    try {
      const blogRes = await api.get(`/blogs/slug/${params.slug}`);
      setBlog(blogRes.data);
      
      const commentsRes = await api.get(`/comments/blog/${blogRes.data._id}`);
      setComments(commentsRes.data);
    } catch (err) {
      // Static fallbacks
      setBlog({
        _id: '1',
        title: 'Mastering Dynamic Programming for Competitive Programming',
        slug: 'mastering-dynamic-programming',
        coverImage: '',
        content: `
Dynamic Programming (DP) is an algorithmic paradigm that solves a complex problem by breaking it down into subproblems and storing the results of these subproblems to avoid redundant computations.

## Why DP is Crucial
In competitions like Olympiads or ACM ICPC, optimizing exponential time complexities to polynomial bounds is often the line between accepted and timed-out.

### Common DP Techniques
1. **Memoization (Top-Down)**: Solve problems recursively, caching results.
2. **Tabulation (Bottom-Up)**: Solve iteratively by building solutions from base states up.

\`\`\`cpp
#include <vector>
#include <iostream>

// Simple Fibonacci DP memoization
long long fib(int n, std::vector<long long>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
}
\`\`\`

## Tips for Identifying DP Problems
Look for:
- Overlapping subproblems
- Optimal substructure properties
- Words like "maximum", "minimum", "longest", or "shortest"
        `,
        category: 'Algorithms',
        tags: ['DP', 'C++', 'Olympiad'],
        views: 125,
        readTime: 6,
        createdAt: new Date().toISOString()
      });
      setComments([
        {
          _id: '101',
          blogId: '1',
          parentId: null,
          author: 'Alex Mercer',
          content: 'This is a fantastic explanation of top-down vs bottom-up memoization! Do you have recommended problems to start practicing?',
          likes: 4,
          createdAt: new Date().toISOString(),
          replies: [
            {
              _id: '102',
              blogId: '1',
              parentId: '101',
              author: 'Tanjiya Nowrin (Admin)',
              content: 'Thanks Alex! I highly recommend starting with the "AtCoder DP Educational Contest". It covers 26 fundamental DP concepts with clean problem descriptions.',
              likes: 12,
              createdAt: new Date().toISOString(),
              replies: []
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogAndComments();
  }, [params.slug]);

  // Submit top-level comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !commentContent.trim()) return;

    try {
      const response = await api.post('/comments', {
        blogId: blog._id,
        author: authorName.trim() || undefined,
        content: commentContent
      });
      showToast(response.data.message || 'Comment submitted for approval!', 'info');
      setCommentContent('');
      setAuthorName('');
    } catch (error) {
      showToast('Failed to post comment', 'error');
    }
  };

  // Submit reply
  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!blog || !replyContent.trim()) return;

    try {
      const response = await api.post('/comments', {
        blogId: blog._id,
        parentId,
        author: authorName.trim() || undefined,
        content: replyContent
      });
      showToast(response.data.message || 'Reply submitted for approval!', 'info');
      setReplyContent('');
      setReplyTargetId(null);
    } catch (error) {
      showToast('Failed to post reply', 'error');
    }
  };

  // Like comment
  const handleLikeComment = async (commentId: string) => {
    try {
      await api.put(`/comments/${commentId}/like`);
      showToast('Comment liked!', 'success');
      // Locally increment likes for immediate UI update
      const updateLikes = (list: Comment[]): Comment[] => {
        return list.map(c => {
          if (c._id === commentId) {
            return { ...c, likes: c.likes + 1 };
          }
          if (c.replies) {
            return { ...c, replies: updateLikes(c.replies) };
          }
          return c;
        });
      };
      setComments(prev => updateLikes(prev));
    } catch (err) {
      showToast('Failed to like comment', 'error');
    }
  };

  // Report comment
  const handleReportComment = async (commentId: string) => {
    try {
      await api.put(`/comments/${commentId}/report`);
      showToast('Comment reported for moderation review', 'info');
    } catch (err) {
      showToast('Failed to report comment', 'error');
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Share link copied to clipboard!', 'success');
    }
  };



  // Recursive Comment Tree Node component
  const CommentNode = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    return (
      <div className="flex flex-col gap-3 relative">
        <div className={`p-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark ${
          comment.author.includes('(Admin)') ? 'border-neutral-700 bg-neutral-100/10 dark:bg-neutral-900/10' : ''
        }`}>
          {/* Header */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-black dark:text-white ${
                comment.author.includes('(Admin)') ? 'text-neutral-700 dark:text-neutral-200' : ''
              }`}>
                {comment.author}
              </span>
              <span className="text-neutral-500 font-mono">
                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex gap-3 text-neutral-500">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Heart className="h-3.5 w-3.5" /> <span>{comment.likes}</span>
              </button>
              <button
                onClick={() => handleReportComment(comment._id)}
                className="hover:text-yellow-600 transition-colors"
                title="Report Spam"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed whitespace-pre-line">
            {comment.content}
          </p>

          {/* Reply trigger button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setReplyTargetId(replyTargetId === comment._id ? null : comment._id)}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <Reply className="h-3 w-3" /> Reply
            </button>
          </div>

          {/* Inline Reply input form */}
          {replyTargetId === comment._id && (
            <form
              onSubmit={(e) => handleSubmitReply(e, comment._id)}
              className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex flex-col gap-3"
            >
              <input
                type="text"
                placeholder="Your name (optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="px-3 py-2 text-xs border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-black dark:text-white outline-none"
              />
              <div className="flex gap-2">
                <textarea
                  placeholder="Write your reply..."
                  rows={2}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-black dark:text-white outline-none resize-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Children replies rendering */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="flex flex-col gap-3 pl-6 md:pl-10 relative">
            {/* Visual tree connection */}
            <div className="absolute left-2.5 top-0 bottom-6 w-0.5 bg-border-light dark:bg-border-dark pointer-events-none" />
            
            {comment.replies.map((reply) => (
              <div key={reply._id} className="relative">
                <CornerDownRight className="absolute -left-5 top-4 h-4 w-4 text-border-light dark:text-border-dark pointer-events-none" />
                <CommentNode comment={reply} isReply={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => router.push('/blog')}
          className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog Listing
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : !blog ? (
        <div className="text-center py-20">
          <p className="text-neutral-500">Blog post could not be loaded.</p>
        </div>
      ) : (
        <article className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark px-2.5 py-1 rounded w-max">
              {blog.category}
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold text-black dark:text-white leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-b border-border-light dark:border-border-dark py-3 text-xs text-neutral-500 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(blog.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {blog.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {blog.views} views
                </span>
              </div>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 hover:text-black dark:hover:text-white font-bold"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          </div>

          {/* Cover image (Gradient fallback if empty) */}
          <div className="relative h-64 sm:h-[400px] w-full rounded-2xl overflow-hidden border border-border-light dark:border-border-dark bg-neutral-950 flex items-center justify-center">
            {blog.coverImage ? (
              <img
                src={getImageUrl(blog.coverImage)}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral-950 to-neutral-900 flex items-center justify-center text-neutral-800 font-display text-4xl font-extrabold select-none">
                T. NOWRIN
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm sm:text-base">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          {/* Comments Section Board */}
          <section className="mt-16 pt-12 border-t border-border-light dark:border-border-dark flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">Discussion Forum</h2>
              <p className="text-xs text-neutral-500 mt-1">Share your thoughts or ask questions below.</p>
            </div>

            {/* Post Top-Level Comment Form */}
            <form onSubmit={handleSubmitComment} className="p-5 rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Join the conversation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name (defaults to Anonymous)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="px-3 py-2 text-xs border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-black dark:text-white outline-none"
                />
              </div>
              <textarea
                placeholder="Write your comment here..."
                rows={4}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="px-3 py-2 text-xs border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-black dark:text-white outline-none resize-none"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all self-end flex items-center gap-1.5"
              >
                Submit Comment <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* List of comments */}
            <div className="flex flex-col gap-6 mt-4">
              {comments.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border-light dark:border-border-dark rounded-xl">
                  <p className="text-xs text-neutral-500">No discussions posted yet. Be the first to start!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentNode key={comment._id} comment={comment} />
                ))
              )}
            </div>

          </section>

        </article>
      )}

    </div>
  );
}
