'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Github, ExternalLink, X, BookOpen, Layers } from 'lucide-react';
import api, { API_URL, getImageUrl } from '../../services/api';
import { CardSkeleton } from '../../components/Skeleton';
import ReactMarkdown from 'react-markdown';

interface Project {
  _id: string;
  title: string;
  description: string;
  images: string[];
  techStack: string[];
  features: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  caseStudy: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categories = ['All', 'Product Design', 'Environmental Projects', 'Creative Branding', 'Community Initiatives'];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects', {
        params: {
          category: selectedCategory,
          search: search || undefined
        }
      });
      setProjects(response.data);
    } catch (err) {
      // Fallback static mock
      const mockProjects: Project[] = [
        {
          _id: '1',
          title: 'Smart Home Lock System',
          description: 'An ergonomic keyless home entrance mechanism conceptualized for sustainable architecture.',
          images: [],
          techStack: ['Product Design', 'Eco-materials', 'CAD Modeling', 'Ergonomics'],
          features: ['Biometric secure locking', 'Zero-power offline mechanical override', 'Recycled steel chassis'],
          githubUrl: '',
          liveUrl: '',
          category: 'Product Design',
          caseStudy: `## Case Study: Smart Home Lock System
### The Challenge
Traditional digital locks consume too much standby power, rely on non-recyclable plastic parts, and look generic. We set out to design a beautiful lock that sits harmoniously on minimalist wooden doors, using eco-friendly materials and low-power mechanics.

### The Solution
We drafted a tactile wood-veneer and matte steel mechanical lock with a micro-biometric reader that wakes up only on physical touch. By employing a kinetic energy-harvesting latch mechanism, we reduced power needs by 80%.

### Results
- Designed 3 high-fidelity industrial models
- Winner of the Sustainable Innovation Design Award`
        },
        {
          _id: '2',
          title: 'Urban Environmentalism Initiative',
          description: 'A city-wide community campaign to design and plant micro-gardens on residential rooftops.',
          images: [],
          techStack: ['Environmental Design', 'Community Outreach', 'Project Coordination', 'Sustainable Planning'],
          features: ['15+ rooftop community gardens established', 'Micro-irrigation rainwater collection layouts', 'Interactive community educational sessions'],
          githubUrl: '',
          liveUrl: '',
          category: 'Environmental Projects',
          caseStudy: `## Case Study: Urban Green Roofs
### The Challenge
Dense residential areas suffer from extreme heat-island effects due to concrete surfaces. Community members lacked tools, layouts, and organic seeds to build rooftop gardens themselves.

### The Solution
We coordinated a community project providing prefabricated raised planting beds made of recycled materials, paired with gravity-fed micro-irrigation systems that utilize collected rainwater.

### Results
- Coordinated planting of **15+** rooftops
- Reduced top-floor summer temperatures by an average of **3.5°C**
- Engaged over **200+** local volunteers`
        }
      ];

      // Local mock filter logic
      let filtered = mockProjects;
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.techStack.some(t => t.toLowerCase().includes(query))
        );
      }
      setProjects(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, search]);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setActiveImageIndex(0);
  };



  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Selected Works</h2>
        <h1 className="text-4xl font-extrabold text-black dark:text-white">Project Portfolio</h1>
      </div>

      {/* Filters board */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
        {/* Search */}
        <div className="relative w-full md:max-w-xs flex items-center border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-neutral-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords or stack..."
            className="w-full text-xs bg-transparent border-none outline-none text-black dark:text-white"
          />
        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-light dark:border-border-dark rounded-2xl">
          <p className="text-neutral-500">No projects found. Check back soon or refine your search filters.</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              layout
              key={project._id}
              className="group border border-border-light dark:border-border-dark rounded-xl p-4 bg-card-light dark:bg-card-dark flex flex-col justify-between hover:border-black dark:hover:border-white transition-all duration-300"
            >
              <div className="flex flex-col gap-3">
                {/* Visual Cover image (mock gradient if empty) */}
                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={getImageUrl(project.images[0])}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-950 to-neutral-900 flex items-center justify-center">
                      <Layers className="h-10 w-10 text-neutral-800" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 text-[10px] uppercase font-bold bg-black/80 text-white border border-neutral-800 px-2 py-0.5 rounded">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-black dark:text-white mt-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                {/* Tech tags */}
                <div className="flex flex-wrap gap-1">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-semibold bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark px-2 py-0.5 rounded text-neutral-500"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions row */}
                <div className="flex justify-between items-center pt-3 border-t border-border-light dark:border-border-dark text-xs">
                  <button
                    onClick={() => handleOpenModal(project)}
                    className="flex items-center gap-1 font-bold text-black dark:text-white hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Case Study
                  </button>

                  <div className="flex gap-3 text-neutral-400">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black dark:hover:text-white transition-colors"
                        title="GitHub Code"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black dark:hover:text-white transition-colors"
                        title="Live Site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Case Study Overlay Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-6 sm:p-8 z-10 scrollbar-thin"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-black dark:hover:text-white border border-border-light dark:border-border-dark rounded-full bg-neutral-100 dark:bg-neutral-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                {/* Images Gallery Slider */}
                <div className="flex flex-col gap-4">
                  <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-neutral-950 border border-border-light dark:border-border-dark">
                    {selectedProject.images && selectedProject.images.length > 0 ? (
                      <img
                        src={getImageUrl(selectedProject.images[activeImageIndex])}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 bg-gradient-to-br from-neutral-950 to-neutral-900">
                        <Layers className="h-16 w-16 mb-2" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Case Gallery Empty</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail controls */}
                  {selectedProject.images && selectedProject.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedProject.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden border transition-all ${
                            activeImageIndex === idx ? 'border-black dark:border-white scale-95' : 'border-neutral-800'
                          }`}
                        >
                          <img
                            src={getImageUrl(img)}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Feature Lists Card */}
                  <div className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-neutral-100/30 dark:bg-neutral-900/30">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Core Features</h4>
                    <ul className="text-xs text-neutral-500 flex flex-col gap-2 list-disc pl-4">
                      {selectedProject.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Case text details column */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                      {selectedProject.category} Project
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">
                      {selectedProject.title}
                    </h2>
                  </div>

                  {/* Links Row */}
                  <div className="flex gap-4">
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <Github className="h-4 w-4" /> GitHub Repository
                      </a>
                    )}
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" /> Live Deployment
                      </a>
                    )}
                  </div>

                  {/* Markdown Content Parser */}
                  <div className="prose prose-neutral dark:prose-invert text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-border-light dark:border-border-dark pt-4 max-w-none">
                    {selectedProject.caseStudy ? (
                      <ReactMarkdown>{selectedProject.caseStudy}</ReactMarkdown>
                    ) : (
                      <p>{selectedProject.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
