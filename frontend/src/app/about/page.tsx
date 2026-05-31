'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Award, BookOpen, Mail, Shield,
  GraduationCap, Briefcase, Users, Heart, Lightbulb,
  Brain, Trophy, Target, Sparkles, Star, Rocket, Flame,
  MessageSquare, Compass, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import api from '../../services/api';
import { Skeleton } from '../../components/Skeleton';

interface ExperienceItem {
  _id: string;
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  type: 'Work' | 'Education' | 'Organization' | 'Volunteering';
}

interface SkillItem {
  _id: string;
  name: string;
  category: string;
  percentage: number;
  icon: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Award,
  Brain,
  Target,
  Flame,
  Briefcase,
  Users,
  MessageSquare,
  Lightbulb,
  Heart,
  GraduationCap,
  Trophy,
  Rocket,
  Sparkles,
  Star
};

const getSkillIcon = (iconName: string) => {
  const IconComponent = iconMap[iconName] || Star;
  return <IconComponent className="h-5 w-5 text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />;
};

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [bioText, setBioText] = useState(
    "I am a Grade 7 student at Charfashion Residential Model School & College with a strong passion for science, innovation, leadership, and social impact. I actively participate in educational, scientific, and community development activities."
  );
  const [titleText, setTitleText] = useState(
    "Grade 7 Student | Zero Olympiad Ambassador | Bangla Innovator Team Co-Leader"
  );
  const [avatarUrl, setAvatarUrl] = useState('');
  const [achievements, setAchievements] = useState<{ title: string; description: string }[]>([
    {
      title: "Zero Olympiad Ambassador",
      description: "Appointed as an ambassador to promote academic excellence, Olympiad engagement, and STEM fields among young students."
    },
    {
      title: "Co-Leader, Bangla Innovator Team",
      description: "Successfully led coordination, projects, and design solutions supporting budding inventors and creators."
    },
    {
      title: "Science Project Leader",
      description: "Spearheaded research, robotics, and innovation models for school-based and independent science competitions."
    },
    {
      title: "Active Community Volunteer",
      description: "Contributed to local educational campaigns, youth development drives, and environmental awareness actions."
    }
  ]);
  const [interests, setInterests] = useState<string[]>([
    'Science', 'Technology', 'Innovation', 'Robotics',
    'Olympiads', 'Leadership', 'Social Work', 'Community Development'
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, settingsRes, skillsRes] = await Promise.all([
          api.get('/experience'),
          api.get('/settings'),
          api.get('/skills')
        ]);

        const isMockData = expRes.data && expRes.data.some((item: any) =>
          item.company === 'Aura Design Studio' ||
          item.company === 'University of Environmental Studies'
        );

        if (expRes.data && expRes.data.length > 0 && !isMockData) {
          setExperiences(expRes.data);
        } else {
          throw new Error('Fallback to static data');
        }

        if (settingsRes.data) {
          const isMockBio = settingsRes.data.bio && settingsRes.data.bio.includes("Designing smart");
          if (settingsRes.data.bio && !isMockBio) setBioText(settingsRes.data.bio);
          if (settingsRes.data.title && !isMockBio) setTitleText(settingsRes.data.title);
          if (settingsRes.data.avatarUrl) setAvatarUrl(settingsRes.data.avatarUrl);
          if (settingsRes.data.achievements && settingsRes.data.achievements.length > 0) {
            setAchievements(settingsRes.data.achievements);
          }
          if (settingsRes.data.interests && settingsRes.data.interests.length > 0) {
            setInterests(settingsRes.data.interests);
          }
        }

        const isMockSkills = skillsRes.data && skillsRes.data.some((skill: any) =>
          skill.category === 'Frontend' ||
          skill.category === 'Backend' ||
          skill.category === 'Tools'
        );

        if (skillsRes.data && skillsRes.data.length > 0 && !isMockSkills) {
          setSkills(skillsRes.data);
        } else {
          throw new Error('Fallback to static skills');
        }
      } catch (err) {
        // Fallback to static mock datasets
        setExperiences([
          {
            _id: 'e1',
            company: 'Charfashion Residential Model School & College',
            role: 'Grade 7 Student',
            duration: '2026 – Present',
            responsibilities: [
              'Active participant in science and innovation programs',
              'Engaged in leadership and extracurricular activities',
              'Interested in STEM education and research'
            ],
            achievements: [],
            technologies: ['STEM', 'Science Research'],
            type: 'Education'
          },
          {
            _id: 'e2',
            company: 'Zero Olympiad',
            role: 'Ambassador',
            duration: '2026 – Present',
            responsibilities: [
              'Promote Olympiad and educational activities',
              'Encourage student participation in academic competitions',
              'Represent the organization in outreach programs'
            ],
            achievements: ['Promoted academic excellence'],
            technologies: ['Leadership', 'Public Speaking'],
            type: 'Volunteering'
          },
          {
            _id: 'e3',
            company: 'Bangla Innovator Team',
            role: 'Co-Leader',
            duration: '2026 – Present',
            responsibilities: [
              'Lead innovation-focused projects and initiatives',
              'Coordinate team activities and events',
              'Support young innovators in developing creative solutions'
            ],
            achievements: ['Co-led youth innovation projects'],
            technologies: ['Project Management', 'Teamwork'],
            type: 'Volunteering'
          },
          {
            _id: 'e4',
            company: 'Independent & School-Based Projects',
            role: 'Science Project Leader',
            duration: '2026 – Present',
            responsibilities: [
              'Lead and manage science-related projects',
              'Research and develop solutions to real-world challenges',
              'Participate in science fairs and innovation competitions'
            ],
            achievements: ['Created STEM projects'],
            technologies: ['Robotics', 'Innovation & Creativity'],
            type: 'Volunteering'
          },
          {
            _id: 'e5',
            company: 'Community & Social Activities',
            role: 'Social Volunteer',
            duration: '2026 – Present',
            responsibilities: [
              'Participate in community service activities',
              'Support educational and awareness campaigns',
              'Contribute to youth development and social impact programs'
            ],
            achievements: ['Contributed to community welfare'],
            technologies: ['Community Engagement', 'Social Work'],
            type: 'Volunteering'
          }
        ]);

        setSkills([
          { _id: 's1', name: 'Leadership', category: 'Core Skills', percentage: 95, icon: 'Award' },
          { _id: 's2', name: 'Problem Solving', category: 'Core Skills', percentage: 90, icon: 'Brain' },
          { _id: 's3', name: 'Critical Thinking', category: 'Core Skills', percentage: 90, icon: 'Target' },
          { _id: 's4', name: 'Science Research', category: 'Science & Tech', percentage: 85, icon: 'Flame' },
          { _id: 's5', name: 'Project Management', category: 'Leadership', percentage: 85, icon: 'Briefcase' },
          { _id: 's6', name: 'Teamwork', category: 'Soft Skills', percentage: 95, icon: 'Users' },
          { _id: 's7', name: 'Public Speaking', category: 'Soft Skills', percentage: 80, icon: 'MessageSquare' },
          { _id: 's8', name: 'Innovation & Creativity', category: 'Science & Tech', percentage: 92, icon: 'Lightbulb' },
          { _id: 's9', name: 'Community Engagement', category: 'Soft Skills', percentage: 88, icon: 'Heart' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const educationTimeline = experiences.filter(exp => exp.type === 'Education');
  // Both organization & volunteering go into roles/organizations list
  const organizationTimeline = experiences.filter(exp => exp.type !== 'Education');

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-24 relative z-10">

      {/* Intro section */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 flex justify-center"
        >
          <div className="relative group w-72 h-72 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
            {avatarUrl ? (
              <img
                src={avatarUrl.startsWith('http') ? avatarUrl : `${api.defaults.baseURL?.replace('/api', '') || ''}${avatarUrl}`}
                alt="Tanjiya Nowrin"
                className="w-full h-full object-cover transition-all duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 flex flex-col justify-between p-8 select-none">
                <div className="flex justify-between items-start w-full">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white/70 animate-pulse" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold bg-neutral-950/60 border border-neutral-800/80 px-2.5 py-1 rounded-full">
                    About Me
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-widest leading-none font-display">T.N.</span>
                  <span className="text-sm text-neutral-300 font-bold tracking-wide mt-1">Tanjiya Nowrin</span>
                  <span className="text-xs text-neutral-500 font-medium">Young Leader & Innovator</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-3 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" /> Biography
            </h2>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tight">
              Tanjiya Nowrin
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-neutral-400 tracking-wide leading-relaxed border-l-2 border-neutral-200 dark:border-neutral-800 pl-3">
              {titleText}
            </p>
          </div>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            {bioText}
          </p>

          {/* Core Info Grid Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Bhola, Bangladesh</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Grade 7 Student</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                <Flame className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Science Enthusiast</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                <Rocket className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Young Innovator</span>
            </div>
          </div>

          <div className="mt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200"
            >
              Collaborate & Connect <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Experience, Education and volunteering timelines */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Left Side: Education */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
            <BookOpen className="h-5 w-5 text-neutral-500" />
            <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider font-display">Education & Academic Activity</h2>
          </div>

          <div className="flex flex-col border-l-2 border-neutral-200 dark:border-neutral-800 pl-6 ml-3 gap-10">
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              educationTimeline.map((item) => (
                <div key={item._id} className="relative flex flex-col gap-2 group">
                  <span className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-2 border-black dark:border-white bg-background-light dark:bg-background-dark group-hover:scale-125 transition-transform duration-300" />

                  <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {item.duration}
                  </span>

                  <h3 className="text-base font-bold text-black dark:text-white leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                    {item.role}
                  </h3>

                  <h4 className="text-xs text-neutral-500 font-semibold">{item.company}</h4>

                  <ul className="text-xs text-neutral-500 dark:text-neutral-400 list-disc pl-4 mt-2 gap-1.5 flex flex-col">
                    {item.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Organizations & Activities */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
            <Shield className="h-5 w-5 text-neutral-500" />
            <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider font-display">Organizations & Leadership</h2>
          </div>

          <div className="flex flex-col border-l-2 border-neutral-200 dark:border-neutral-800 pl-6 ml-3 gap-10">
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              organizationTimeline.map((item) => (
                <div key={item._id} className="relative flex flex-col gap-2 group">
                  <span className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-2 border-neutral-600 bg-background-light dark:bg-background-dark group-hover:scale-125 transition-transform duration-300" />

                  <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {item.duration}
                  </span>

                  <h3 className="text-base font-bold text-black dark:text-white leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                    {item.role}
                  </h3>

                  <h4 className="text-xs text-neutral-500 font-semibold">{item.company}</h4>

                  <ul className="text-xs text-neutral-500 dark:text-neutral-400 list-disc pl-4 mt-2 gap-1.5 flex flex-col">
                    {item.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>

                  {item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.technologies.map((t, i) => (
                        <span key={i} className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark px-2 py-0.5 rounded-lg text-neutral-500">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
          <Star className="h-5 w-5 text-neutral-500" />
          <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider font-display">Development & Leadership Skills</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            skills.map((skill) => (
              <div
                key={skill._id}
                className="flex flex-col gap-3 p-5 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-black dark:hover:border-white transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800 transition-colors">
                    {getSkillIcon(skill.icon)}
                  </div>
                  <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">{skill.percentage}%</span>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <h3 className="text-sm font-bold text-black dark:text-white tracking-tight">{skill.name}</h3>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">{skill.category}</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-neutral-800 dark:bg-neutral-200 rounded-full"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
          <Trophy className="h-5 w-5 text-neutral-500" />
          <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider font-display">Key Milestones & Achievements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-black dark:hover:border-white transition-all duration-300"
            >
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-border-light dark:border-border-dark text-neutral-800 dark:text-neutral-200">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-black dark:text-white">{achievement.title}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interests Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
          <Sparkles className="h-5 w-5 text-neutral-500" />
          <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider font-display">Interests & Areas of Engagement</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white hover:scale-[1.05] transition-all cursor-default"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
              {interest}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}
