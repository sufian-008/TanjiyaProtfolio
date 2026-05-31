'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Maximize2, Compass } from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/Skeleton';

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  url: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await api.get('/gallery');
      setItems(response.data);
    } catch (err) {
      // Fallback mock items
      setItems([
        {
          _id: '1',
          title: 'Minimalist Workspace Design',
          description: 'A layout focusing on maximizing natural light, using zero-waste timber furniture, and placing clean indoor plants for air purification.',
          url: ''
        },
        {
          _id: '2',
          title: 'Home Smart Lock Mechanical Sketch',
          description: 'An early architectural drawing showing the internal layout of the low-power kinetic lock gear system.',
          url: ''
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12 min-h-[80vh]">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Visual Archive</h2>
        <h1 className="text-4xl font-extrabold text-black dark:text-white">Creative Gallery</h1>

      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-light dark:border-border-dark rounded-2xl">
          <p className="text-neutral-500">No gallery items uploaded yet. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item._id}
              layoutId={`gallery-card-${item._id}`}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer border border-border-light dark:border-border-dark rounded-xl overflow-hidden bg-card-light dark:bg-card-dark flex flex-col hover:border-black dark:hover:border-white transition-all duration-300 relative"
            >
              {/* Image Area */}
              <div className="relative h-60 w-full overflow-hidden bg-neutral-900 border-b border-border-light dark:border-border-dark">
                {item.url ? (
                  <img
                    src={getImageUrl(item.url)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-950 to-neutral-900 flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="h-8 w-8 text-neutral-800" />
                    <span className="text-[10px] text-neutral-600 font-mono">No Image Uploaded</span>
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                    <Maximize2 className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Title summary */}
              <div className="p-4 flex flex-col gap-1">
                <h3 className="text-sm font-bold text-black dark:text-white truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail view Modal overlay */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Content box */}
            <motion.div
              layoutId={`gallery-card-${selectedItem._id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 max-h-[85vh] md:max-h-[70vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image block */}
              <div className="w-full md:w-1/2 bg-neutral-950 flex items-center justify-center overflow-hidden border-r border-border-light dark:border-border-dark relative min-h-[300px] md:min-h-0">
                {selectedItem.url ? (
                  <img
                    src={getImageUrl(selectedItem.url)}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-neutral-600">
                    <ImageIcon className="h-12 w-12" />
                    <span className="text-xs font-mono">No Preview Available</span>
                  </div>
                )}
              </div>

              {/* Descriptions block */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col gap-4 overflow-y-auto">
                <div className="flex flex-col gap-1.5 border-b border-border-light dark:border-border-dark pb-4">
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-widest flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5" /> Project Asset Detail
                  </span>
                  <h2 className="text-xl font-extrabold text-black dark:text-white leading-tight">
                    {selectedItem.title}
                  </h2>
                </div>

                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-between items-center text-[10px] text-neutral-500">
                  <span>Interactive Gallery CMS</span>
                  <span>ID: {selectedItem._id}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
