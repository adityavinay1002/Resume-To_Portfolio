import React, { useState } from 'react';
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
    Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getDownloadUrl } from '../services/api';

const PortfolioPreview = ({ data, onReset }) => {
    if (!data) return null;
    const { name, contact, summary, skills, experience, projects, education, fileId } = data;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-purple-500/30">
            {/* Header / Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-card px-6 py-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">
                        {name?.split(' ')[0]} <span className="text-purple-500 font-heading">Portfolio</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px]">
                            {item}
                        </a>
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
                    href={getDownloadUrl(fileId)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-premium rounded-xl text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20 text-white"
                    download
                >
                    <Download size={18} /> ZIP Export
                </a>
                <a
                    href={`http://localhost:8080/api/download/pdf/${fileId}`}
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
                                {summary?.[0] || "Passionate developer crafting end-to-end web applications."}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-gradient-premium rounded-full font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all text-white">
                                View My Work
                            </button>
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
                                Professional <span className="text-blue-400">Profile</span>
                            </h3>
                            <div className="space-y-4 text-slate-400 leading-relaxed italic border-l-4 border-purple-500/50 pl-6">
                                {summary?.map((p, i) => <p key={i}>{p}</p>) || "Full stack developer with a focus on intuitive design."}
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button className="px-6 py-3 bg-blue-600 rounded-xl font-bold text-white">Get In Touch</button>
                                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-slate-100">Download CV</button>
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

                {/* Skills Section */}
                <section id="skills" className="py-32">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <h2 className="text-4xl font-bold font-heading mb-4 text-white">My <span className="text-purple-500">Skills</span></h2>
                        <div className="w-20 h-1.5 bg-gradient-premium rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {Object.entries(data.skills_categorized || { 'Skills': skills }).map(([category, items]) => (
                            items && Array.isArray(items) && items.map((skill, idx) => (
                                <div key={`${category}-${idx}`} className="glass-card p-6 rounded-2xl space-y-4">
                                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                        <span className="font-bold text-slate-100">{skill}</span>
                                        <span className="text-blue-400 text-xs font-bold">Expert</span>
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
                        ))}
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-32">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <h2 className="text-4xl font-bold font-heading mb-4 text-white">Featured <span className="text-purple-500">Projects</span></h2>
                        <div className="w-20 h-1.5 bg-gradient-premium rounded-full mb-6"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {projects?.map((proj, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="glass-card overflow-hidden rounded-3xl border border-white/5 group"
                            >
                                <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                                    <Layers className="text-slate-700 opacity-20" size={60} />
                                </div>
                                <div className="p-6 space-y-4 text-white">
                                    <h4 className="text-xl font-bold">{proj}</h4>
                                    <p className="text-slate-400 text-sm line-clamp-3 italic">
                                        Detailed breakdown of project impact and technical implementation.
                                    </p>
                                    <div className="flex gap-4 pt-4 border-t border-white/5 mt-4">
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
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                                        <Mail className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Email</p>
                                        <p className="font-bold text-white">{contact?.email || 'hello@portfolio.com'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                                        <Phone className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Phone</p>
                                        <p className="font-bold text-white">{contact?.phone || '+1 (555) 000-0000'}</p>
                                    </div>
                                </div>
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
