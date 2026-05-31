'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, Eye, Clock, ArrowRight } from 'lucide-react';
import api, { getImageUrl } from '../../services/api';
import { CardSkeleton } from '../../components/Skeleton';

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

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['All', 'Algorithms', 'Software Engineering', 'System Design', 'General'];

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blogs', {
        params: {
          category: category !== 'All' ? category : undefined,
          search: search || undefined,
          page,
          limit: 6
        }
      });
      setBlogs(response.data.blogs);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      // Mock Fallbacks
      const mockBlogs: Blog[] = [
        {
          _id: '1',
          title: 'Mastering Dynamic Programming for Competitive Programming',
          slug: 'mastering-dynamic-programming',
          coverImage: '',
          content: 'Dynamic Programming is a core pillar of algorithmic interviews...',
          category: 'Algorithms',
          tags: ['DP', 'C++', 'Olympiad'],
          views: 124,
          readTime: 6,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Scaling Express APIs with MongoDB Indexes',
          slug: 'scaling-express-mongodb-indexes',
          coverImage: '',
          content: 'Database scaling is crucial for large application backends...',
          category: 'System Design',
          tags: ['Express', 'MongoDB', 'Indexing'],
          views: 89,
          readTime: 4,
          createdAt: new Date().toISOString()
        }
      ];

      setBlogs(mockBlogs);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [category, page, search]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };



  // Find a featured post for the banner
  const featuredBlog = blogs[0];
  const gridBlogs = blogs.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12">
      {/* Page Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Engineering Insights</h2>
        <h1 className="text-4xl font-extrabold text-black dark:text-white">The Tech Blog</h1>
      </div>

      {/* Featured Blog Post Card banner */}
      {!loading && featuredBlog && (
        <section className="group border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 hover:border-black dark:hover:border-white transition-all duration-300">
          <div className="relative h-64 lg:h-full bg-neutral-900 border-r border-border-light dark:border-border-dark flex items-center justify-center">
            {featuredBlog.coverImage ? (
              <img
                src={getImageUrl(featuredBlog.coverImage)}
                alt={featuredBlog.title}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-neutral-950 to-neutral-900 flex flex-col justify-end p-8">
                <span className="text-3xl font-extrabold text-neutral-800 tracking-wider font-display">FEATURED ARTICLE</span>
              </div>
            )}
            <span className="absolute top-4 left-4 text-[10px] uppercase font-bold bg-black text-white border border-neutral-800 px-3 py-1 rounded">
              Featured ({featuredBlog.category})
            </span>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(featuredBlog.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {featuredBlog.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {featuredBlog.readTime} min read
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-black dark:text-white leading-tight">
                {featuredBlog.title}
              </h2>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                {featuredBlog.content.replace(/[#*`]/g, '')}
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-border-light dark:border-border-dark">
              <div className="flex flex-wrap gap-1">
                {featuredBlog.tags.map((t, i) => (
                  <span key={i} className="text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark px-2 py-0.5 rounded text-neutral-500">
                    #{t}
                  </span>
                ))}
              </div>

              <Link
                href={`/blog/${featuredBlog.slug}`}
                className="flex items-center gap-1.5 font-bold text-xs text-black dark:text-white hover:underline w-max"
              >
                Read Article <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Filter and search options row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        {/* Search */}
        <div className="relative w-full md:max-w-xs flex items-center border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-neutral-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords or tags..."
            className="w-full text-xs bg-transparent border-none outline-none text-black dark:text-white"
          />
        </div>
      </div>

      {/* Grid listing other posts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-light dark:border-border-dark rounded-2xl">
          <p className="text-neutral-500">No blog posts found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridBlogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog.slug}`}
              className="group border border-border-light dark:border-border-dark rounded-xl p-4 bg-card-light dark:bg-card-dark flex flex-col justify-between hover:border-black dark:hover:border-white transition-all duration-300"
            >
              <div className="flex flex-col gap-3">
                {/* Image Cover */}
                <div className="relative h-44 w-full rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-neutral-950 flex items-center justify-center">
                  {blog.coverImage ? (
                    <img
                      src={getImageUrl(blog.coverImage)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-950 to-neutral-900 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-neutral-800 tracking-wider">ARTICLE</span>
                    </div>
                  )}
                  <span className="absolute top-2 right-2 text-[8px] uppercase font-bold bg-black text-white border border-neutral-800 px-2 py-0.5 rounded">
                    {blog.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-mono">
                  <span className="flex items-center gap-0.5">
                    <Calendar className="h-3 w-3" />
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" /> {blog.readTime} min
                  </span>
                </div>

                <h3 className="text-base font-bold text-black dark:text-white leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {blog.content.replace(/[#*`]/g, '')}
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((t, i) => (
                    <span key={i} className="text-[9px] font-semibold bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark px-2 py-0.5 rounded text-neutral-500">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="text-xs font-bold text-black dark:text-white flex items-center gap-1 group-hover:underline pt-3 border-t border-border-light dark:border-border-dark">
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-xs font-semibold bg-card-light dark:bg-card-dark text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Previous
          </button>
          <span className="flex items-center text-xs font-mono text-neutral-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-xs font-semibold bg-card-light dark:bg-card-dark text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
