import React, { useState, useEffect } from 'react';
import {
    Download,
    ExternalLink,
    RefreshCcw,
    Github,
    Mail,
    Phone,
    Code,
    User,
    Briefcase,
    Layers,
    Send,
    ChevronDown,
    Moon,
    Linkedin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getDownloadUrl } from '../services/api';

const PortfolioPreview = ({ data, onReset, fileId: propFileId }) => {
    if (!data) return null;
    const { name, contact, summary, skills, experience, projects, education, fileId: dataFileId, role, about_generated } = data;
    const activeFileId = propFileId || dataFileId;

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-purple-500/30">
            {/* Header / Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-card px-6 py-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">
                        {name ? name.split(' ')[0] : 'User'} <span className="text-purple-500 font-heading">Portfolio</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    {['Home', 'About', 'Experience', 'Education', 'Skills', 'Projects', 'Contact'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px]"
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full bg-slate-800/50 text-purple-400 border border-purple-500/20">
                        <Moon size={18} />
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10 transition-all font-medium text-slate-200"
                    >
                        <RefreshCcw size={14} /> Reset
                    </button>
                </div>
            </nav>

            {/* Toolbar for Downloads */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 p-2 glass-card rounded-2xl border border-white/10 shadow-2xl">
                <a
                    href={getDownloadUrl(activeFileId)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-premium rounded-xl text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20 text-white"
                    download
                >
                    <Download size={18} /> ZIP Export
                </a>
                <a
                    href={`http://localhost:8080/api/download/pdf/${activeFileId}`}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-all border border-white/5 text-slate-200"
                    download
                >
                    <Layers size={18} /> PDF Export
                </a>
            </div>

            <main className="max-w-6xl mx-auto px-6 pt-32 pb-40">
                {/* Hero Section */}
                <section id="home" className="py-20 flex flex-col md:flex-row items-center gap-16 min-h-[70vh]">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-7xl font-bold leading-tight font-heading">
                                Hi, I'm <span className="text-gradient">{name}</span>
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                                {role} | {Array.isArray(summary) ? summary[0]?.substring(0, 150) : summary?.substring(0, 150)}...
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => scrollToSection('projects')}
                                className="px-8 py-4 bg-gradient-premium rounded-full font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all text-white"
                            >
                                View My Work
                            </button>
                            {contact?.github && (
                                <a
                                    href={contact.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all text-slate-200 flex items-center gap-2"
                                >
                                    <Github size={20} /> Check My GitHub
                                </a>
                            )}
                        </div>
                    </motion.div>

                    <div className="relative w-64 h-64 md:w-96 md:h-96">
                        <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full scale-[0.8]"></div>

                        <div className="animate-orbit absolute top-0 left-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                        <div className="animate-orbit absolute top-1/2 right-0 w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" style={{ animationDelay: '-5s' }}></div>
                        <div className="animate-orbit absolute bottom-0 left-1/2 w-5 h-5 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50" style={{ animationDelay: '-10s' }}></div>

                        <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl animate-float">
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                                <User size={120} strokeWidth={1} />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
                        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
                        <ChevronDown size={20} />
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-32">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <h2 className="text-4xl font-bold font-heading mb-4 text-white">About <span className="text-purple-500">Me</span></h2>
                        <div className="w-20 h-1.5 bg-gradient-premium rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-20">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold font-heading text-white">
                                {role}
                            </h3>
                            <div className="space-y-4 text-slate-400 leading-relaxed italic border-l-4 border-purple-500/50 pl-6">
                                <p>{about_generated}</p>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button onClick={() => scrollToSection('contact')} className="px-6 py-3 bg-blue-600 rounded-xl font-bold text-white">Get In Touch</button>
                                {contact?.linkedin && (
                                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-slate-100 flex items-center gap-2">
                                        <Linkedin size={18} /> LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: "App Architecture", desc: "Building secure, scalable systems.", icon: <Code className="text-purple-400" /> },
                                { title: "UX/UI Design", desc: "Crafting beautiful, accessible interfaces.", icon: <Layers className="text-blue-400" /> },
                                { title: "Problem Solving", desc: "Solving complex engineering challenges.", icon: <Briefcase className="text-emerald-400" /> }
                            ].map((card, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 10 }}
                                    className="glass-card p-6 rounded-2xl flex gap-6 hover-glow group transition-all"
                                >
                                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1 text-white">{card.title}</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                <section id="experience" className="py-32">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <h2 className="text-4xl font-bold font-heading mb-4 text-white">Work <span className="text-purple-500">Experience</span></h2>
                        <div className="w-20 h-1.5 bg-gradient-premium rounded-full"></div>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {experience && experience.length > 0 ? (
                            experience.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="glass-card p-8 rounded-2xl border-l-4 border-l-purple-500"
                                >
                                    <p className="text-slate-300 leading-relaxed">{item}</p>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500">No experience listed.</p>
                        )}
                    </div>
                </section>

                {/* Education Section */}
                <section id="education" className="py-32">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <h2 className="text-4xl font-bold font-heading mb-4 text-white">Academic <span className="text-purple-500">Background</span></h2>
                        <div className="w-20 h-1.5 bg-gradient-premium rounded-full"></div>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {education && education.length > 0 ? (
                            education.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="glass-card p-8 rounded-2xl border-l-4 border-l-blue-500"
                                >
                                    <p className="text-slate-300 leading-relaxed">{item}</p>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500">No education details listed.</p>
                        )}
                    </div>
                </section>

                {/* Skills Section */}
                <section id="skills" className="py-32">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <h2 className="text-4xl font-bold font-heading mb-4 text-white">My <span className="text-purple-500">Skills</span></h2>
                        <div className="w-20 h-1.5 bg-gradient-premium rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {data.skills_categorized ? (
                            Object.entries(data.skills_categorized).map(([category, items]) => (
                                items && Array.isArray(items) && items.map((skill, idx) => (
                                    <div key={`${category}-${idx}`} className="glass-card p-6 rounded-2xl space-y-4">
                                        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                            <span className="font-bold text-slate-100">{skill}</span>
                                            <span className="text-blue-400 text-xs font-bold">{category}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '85%' }}
                                                className="h-full bg-gradient-premium rounded-full"
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))
                            ))
                        ) : (
                            skills?.map((skill, idx) => (
                                <div key={idx} className="glass-card p-6 rounded-2xl space-y-4">
                                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                        <span className="font-bold text-slate-100">{skill}</span>
                                        <span className="text-blue-400 text-xs font-bold">Skill</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '85%' }}
                                            className="h-full bg-gradient-premium rounded-full"
                                        ></motion.div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-32">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <h2 className="text-4xl font-bold font-heading mb-4 text-white">Featured <span className="text-purple-500">Projects</span></h2>
                        <div className="w-20 h-1.5 bg-gradient-premium rounded-full mb-6"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects?.map((proj, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="glass-card overflow-hidden rounded-3xl border border-white/5 group border-t-4 border-t-purple-500/30"
                            >
                                <div className="p-6 space-y-4 text-white h-full flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xl font-bold">{proj.title || proj}</h4>
                                        <Layers className="text-purple-500/50 shrink-0" size={20} />
                                    </div>

                                    <p className="text-slate-400 text-sm line-clamp-3 italic">
                                        {proj.description || "Detailed breakdown of technical implementation."}
                                    </p>

                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul className="space-y-2 mt-4 flex-grow">
                                            {proj.bullets.map((bullet, bidx) => (
                                                <li key={bidx} className="text-xs text-slate-300 flex items-start gap-2">
                                                    <span className="w-1 h-1 bg-purple-500 rounded-full mt-1.5 shrink-0"></span>
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="flex gap-4 pt-4 border-t border-white/5 mt-auto">
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">
                                            <Github size={14} /> Code
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                                            <ExternalLink size={14} /> Demo
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-32">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <h2 className="text-4xl font-bold font-heading mb-4 text-white">Get In <span className="text-purple-500">Touch</span></h2>
                        <div className="w-20 h-1.5 bg-gradient-premium rounded-full mb-6"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <h3 className="text-2xl font-bold font-heading text-white">Let's Talk</h3>
                            <div className="space-y-8">
                                {contact?.email && (
                                    <a href={`mailto:${contact.email}`} className="flex items-center gap-6 group">
                                        <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0 group-hover:scale-110 transition-transform">
                                            <Mail className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Email</p>
                                            <p className="font-bold text-white">{contact.email}</p>
                                        </div>
                                    </a>
                                )}
                                {contact?.phone && (
                                    <a href={`tel:${contact.phone}`} className="flex items-center gap-6 group">
                                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 group-hover:scale-110 transition-transform">
                                            <Phone className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Phone</p>
                                            <p className="font-bold text-white">{contact.phone}</p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                                    <textarea rows="4" placeholder="How can I help you?" className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all resize-none text-white"></textarea>
                                </div>
                                <button className="w-full py-4 bg-gradient-premium rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all text-white">
                                    <Send size={18} /> Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-10 border-t border-white/5 text-center text-slate-500 text-sm">
                <p>Designed for <span className="text-slate-200 font-bold">{name}</span></p>
            </footer>
        </div>
    );
};

export default PortfolioPreview;
