'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/contact', formData);
      showToast(response.data.message || 'Message sent successfully!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      showToast('Failed to deliver message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Connect</h2>
        <h1 className="text-4xl font-extrabold text-black dark:text-white">Get in Touch</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
        {/* Contact Info Column */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-black dark:text-white">Let&apos;s Build Something Together</h2>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
              If you have an interesting social work, sustainability initiative, or creative collaboration in mind, feel free to reach out. I will respond to your queries in under 24 hours.
            </p>
          </div>

          <div className="flex flex-col gap-6 text-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 border border-border-light dark:border-border-dark rounded-xl bg-card-light dark:bg-card-dark text-neutral-500">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email</span>
                <a href="mailto:mdrafin008@gmail.com" className="text-black dark:text-white hover:underline mt-1">
                  mdrafin008@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 border border-border-light dark:border-border-dark rounded-xl bg-card-light dark:bg-card-dark text-neutral-500">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Phone</span>
                <span className="text-black dark:text-white mt-1">+880 1731302437</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 border border-border-light dark:border-border-dark rounded-xl bg-card-light dark:bg-card-dark text-neutral-500">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Location</span>
                <span className="text-black dark:text-white mt-1">Charfashion, Bhola, Barisal, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-6"
          >
            <h3 className="text-lg font-bold text-black dark:text-white">Send a Message</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="px-3 py-2.5 text-xs sm:text-sm border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="px-3 py-2.5 text-xs sm:text-sm border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Project proposal / Job inquiry"
                className="px-3 py-2.5 text-xs sm:text-sm border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell me about your project..."
                rows={5}
                className="px-3 py-2.5 text-xs sm:text-sm border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-black dark:text-white outline-none resize-none focus:border-black dark:focus:border-white transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-xs sm:text-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              {submitting ? 'Sending Message...' : 'Send Message'} <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
