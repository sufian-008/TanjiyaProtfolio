'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, X, Award, ChevronLeft, ChevronRight, Eye, FileText } from 'lucide-react';
import api, { getImageUrl } from '../../services/api';
import { CardSkeleton } from '../../components/Skeleton';

interface Certificate {
  _id: string;
  title: string;
  organization: string;
  date: string;
  imageUrl: string;
  credentialId: string;
  downloadUrl: string;
}

const isPdf = (url: string) => {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.pdf');
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/certificates');
      let data = response.data;
      if (search) {
        const query = search.toLowerCase();
        data = data.filter((c: Certificate) =>
          c.title.toLowerCase().includes(query) ||
          c.organization.toLowerCase().includes(query) ||
          c.credentialId.toLowerCase().includes(query)
        );
      }
      setCertificates(data);
    } catch (err) {
      // Fallback local mock certificates
      const mockCerts: Certificate[] = [
        {
          _id: '1',
          title: 'Sustainable Product Design Masterclass',
          organization: 'Green Design Institute',
          date: 'Nov 2025',
          imageUrl: '',
          credentialId: 'SD-90812-UX',
          downloadUrl: ''
        },
        {
          _id: '2',
          title: 'Urban Environmentalism Foundations',
          organization: 'EcoAct Association',
          date: 'May 2025',
          imageUrl: '',
          credentialId: 'ENV-7719',
          downloadUrl: ''
        },
        {
          _id: '3',
          title: 'Creative Project Leadership',
          organization: 'Design & Management Academy',
          date: 'Jan 2026',
          imageUrl: '',
          credentialId: 'CPL-5049-M',
          downloadUrl: ''
        }
      ];

      let filtered = mockCerts;
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter((c) =>
          c.title.toLowerCase().includes(query) ||
          c.organization.toLowerCase().includes(query) ||
          c.credentialId.toLowerCase().includes(query)
        );
      }
      setCertificates(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [search]);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % Math.max(1, certificates.length));
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + certificates.length) % Math.max(1, certificates.length));
  };



  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Verified Credentials</h2>
        <h1 className="text-4xl font-extrabold text-black dark:text-white">Certificates & Awards</h1>
      </div>

      {/* Featured Slider Banner (Only mount if certificates exist and loading done) */}
      {!loading && certificates.length > 0 && (
        <section className="relative w-full rounded-2xl border border-border-light dark:border-border-dark p-6 sm:p-8 bg-card-light dark:bg-card-dark overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 max-w-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark px-2.5 py-1 rounded w-max">
              Featured Credential
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-black dark:text-white">
              {certificates[activeSlide]?.title}
            </h2>
            <div className="text-sm text-neutral-400">
              <span className="font-semibold text-neutral-600 dark:text-neutral-300">{certificates[activeSlide]?.organization}</span> — {certificates[activeSlide]?.date}
            </div>
            {certificates[activeSlide]?.credentialId && (
              <div className="text-xs text-neutral-500 font-mono">
                Credential ID: {certificates[activeSlide]?.credentialId}
              </div>
            )}
            <div className="flex gap-3 mt-2">
              {certificates[activeSlide]?.imageUrl && (
                <button
                  onClick={() => setPreviewImage(getImageUrl(certificates[activeSlide]?.imageUrl))}
                  className="flex items-center gap-1 text-xs font-bold text-black dark:text-white hover:underline"
                >
                  <Eye className="h-4 w-4" /> {isPdf(certificates[activeSlide]?.imageUrl) ? 'Preview PDF' : 'Preview Image'}
                </button>
              )}
              {certificates[activeSlide]?.downloadUrl && (
                <a
                  href={certificates[activeSlide]?.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Verify Credential
                </a>
              )}
            </div>
          </div>

          {/* Slide image frame */}
          <div className="relative h-44 w-full md:w-80 rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-neutral-950 flex items-center justify-center flex-shrink-0">
            {certificates[activeSlide]?.imageUrl ? (
              isPdf(certificates[activeSlide]?.imageUrl) ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-950/20 to-neutral-900 border border-red-500/20 text-red-400 p-4 gap-2">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-full">
                    <FileText className="h-8 w-8 text-red-500" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">PDF Certificate</span>
                </div>
              ) : (
                <img
                  src={getImageUrl(certificates[activeSlide]?.imageUrl)}
                  alt={certificates[activeSlide]?.title}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900">
                <Award className="h-16 w-16 mb-2" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-600">Credential Badge</span>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          {certificates.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
              <button
                onClick={handlePrevSlide}
                className="p-1.5 rounded-full border border-border-light dark:border-border-dark bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-black dark:hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextSlide}
                className="p-1.5 rounded-full border border-border-light dark:border-border-dark bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-black dark:hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Filters & search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        {/* Search */}
        <div className="relative w-full md:max-w-xs flex items-center border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-neutral-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search credentials or issuer..."
            className="w-full text-xs bg-transparent border-none outline-none text-black dark:text-white"
          />
        </div>
      </div>

      {/* Grid view */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-light dark:border-border-dark rounded-2xl">
          <p className="text-neutral-500">No credentials found under this query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="group border border-border-light dark:border-border-dark rounded-xl p-4 bg-card-light dark:bg-card-dark flex flex-col justify-between hover:border-black dark:hover:border-white transition-all duration-300"
            >
              <div className="flex flex-col gap-3">
                {/* Image Cover */}
                <div className="relative h-40 w-full rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-neutral-950 flex items-center justify-center">
                  {cert.imageUrl ? (
                    isPdf(cert.imageUrl) ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-950/20 to-neutral-900 border border-red-500/20 text-red-400 p-4 gap-2">
                        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-full">
                          <FileText className="h-6 w-6 text-red-500" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">PDF Certificate</span>
                      </div>
                    ) : (
                      <img
                        src={getImageUrl(cert.imageUrl)}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900">
                      <Award className="h-10 w-10 text-neutral-800 mb-1" />
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-black dark:text-white leading-tight">
                  {cert.title}
                </h3>
                <p className="text-xs text-neutral-400">
                  <span className="font-semibold text-neutral-600 dark:text-neutral-300">{cert.organization}</span> — {cert.date}
                </p>
                {cert.credentialId && (
                  <p className="text-[10px] text-neutral-500 font-mono">ID: {cert.credentialId}</p>
                )}
              </div>

              {/* Actions footer */}
              <div className="flex justify-between items-center mt-6 pt-3 border-t border-border-light dark:border-border-dark">
                {cert.imageUrl ? (
                  <button
                    onClick={() => setPreviewImage(getImageUrl(cert.imageUrl))}
                    className="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </button>
                ) : (
                  <span className="text-[10px] text-neutral-500">Image not available</span>
                )}

                {cert.downloadUrl && (
                  <a
                    href={cert.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    Verify <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Overlay Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-xl overflow-hidden border border-neutral-800 bg-black z-10 flex flex-col"
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/80 hover:bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400 hover:text-white z-20"
              >
                <X className="h-4 w-4" />
              </button>
              
              {isPdf(previewImage) ? (
                <div className="w-full h-[75vh] flex flex-col">
                  {/* Top Bar with download/open button */}
                  <div className="flex justify-between items-center bg-neutral-900 px-4 py-3 border-b border-neutral-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-red-500" /> Certificate PDF Preview
                    </span>
                    <a
                      href={previewImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-10 text-[10px] sm:text-xs font-bold px-3 py-1.5 bg-white text-black hover:bg-neutral-200 rounded transition-colors"
                    >
                      Open in New Tab
                    </a>
                  </div>
                  {/* PDF Viewer frame */}
                  <iframe
                    src={previewImage}
                    className="w-full flex-1 border-0 bg-neutral-900"
                    title="PDF Certificate"
                  />
                </div>
              ) : (
                <img
                  src={previewImage}
                  alt="Certificate Verification Preview"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
