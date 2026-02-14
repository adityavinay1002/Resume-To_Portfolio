import React from 'react';
import { getDownloadUrl } from '../services/api';

const PortfolioPreview = ({ data, fileId, onReset }) => {
    if (!data) return null;

    const { name, contact, summary, skills, experience, education, projects } = data;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toolbar */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-between items-center">
                <span className="font-bold text-xl text-blue-600">Resume2Portfolio Preview</span>
                <div className="space-x-4">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Upload New
                    </button>
                    <a
                        href={getDownloadUrl(fileId)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors"
                        download
                    >
                        Download ZIP
                    </a>
                    <a
                        href={`http://localhost:8080/api/download/pdf/${fileId}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-colors"
                        download
                    >
                        Download PDF
                    </a>
                </div>
            </div>

            {/* Generated Portfolio View (Simplified Responsive Template) */}
            <div className="max-w-4xl mx-auto mt-24 mb-12 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
                {/* Header */}
                <header className="bg-slate-800 text-white p-10 text-center">
                    <h1 className="text-4xl font-bold mb-2">{name || 'Your Name'}</h1>
                    <div className="flex flex-wrap justify-center gap-4 text-slate-300">
                        {contact && contact.map((c, i) => <span key={i}>{c}</span>)}
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Summary */}
                    {summary && summary.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">About Me</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {summary.join(' ')}
                            </p>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills_categorized ? (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">Smart Skills Analysis</h2>
                            <div className="space-y-4">
                                {Object.entries(data.skills_categorized).map(([category, items]) => (
                                    <div key={category}>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{category}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {items.map((skill, index) => (
                                                <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm border border-indigo-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : (
                        skills && skills.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">Experience</h2>
                            <div className="space-y-4">
                                {experience.map((exp, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
                                        <p className="text-gray-800">{exp}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">Projects</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {projects.map((proj, index) => (
                                    <div key={index} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-gray-800 font-medium">{proj}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">Education</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                {education.map((edu, index) => (
                                    <li key={index}>{edu}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                <footer className="bg-gray-100 text-center py-6 text-gray-500 text-sm">
                    Generated by Resume2Portfolio
                </footer>
            </div>
        </div>
    );
};

export default PortfolioPreview;
