import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import PortfolioPreview from './components/PortfolioPreview';

function App() {
    const [portfolioData, setPortfolioData] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleUploadSuccess = (response) => {
        setIsLoading(false);
        setPortfolioData(response.data);
        setFileId(response.file_id);
    };

    const handleUploadStart = () => {
        setIsLoading(true);
    };

    const handleReset = () => {
        setPortfolioData(null);
        setFileId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {!portfolioData ? (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="text-center mb-10 max-w-2xl px-4">
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 drop-shadow-sm">
                            Resume2Portfolio
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed mb-4">
                            Instantly transform your static resume into a stunning, responsive portfolio website using AI-powered document extraction.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 font-medium">
                            <span className="bg-white px-3 py-1 rounded-full shadow-sm">📄 Document AI Extraction</span>
                            <span className="bg-white px-3 py-1 rounded-full shadow-sm">🎨 Responsive Design</span>
                            <span className="bg-white px-3 py-1 rounded-full shadow-sm">⚡ Instant Download</span>
                        </div>
                    </div>

                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                                <p className="text-xl font-semibold text-gray-700 animate-pulse">Analyzing Document Structure...</p>
                                <p className="text-gray-500 mt-2">Extracting sections, skills, and experience</p>
                            </div>
                        ) : (
                            <FileUploader
                                onUploadSuccess={handleUploadSuccess}
                                onUploadStart={handleUploadStart}
                            />
                        )}
                    </div>

                    <footer className="mt-12 text-gray-400 text-sm">
                        Powered by FastAPI & React &bull; Secure Processing
                    </footer>
                </div>
            ) : (
                <PortfolioPreview
                    data={portfolioData}
                    fileId={fileId}
                    onReset={handleReset}
                />
            )}
        </div>
    );
}

export default App;
