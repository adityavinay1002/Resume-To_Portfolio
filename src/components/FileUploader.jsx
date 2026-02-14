import React, { useCallback, useState } from 'react';
import { uploadResume } from '../services/api';

const FileUploader = ({ onUploadSuccess, onUploadStart }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const processFile = async (file) => {
        if (!file.type.match('pdf.*') && !file.type.match('image.*')) {
            setError('Please upload a PDF or Image file.');
            return;
        }

        setError(null);
        onUploadStart();

        try {
            const data = await uploadResume(file);
            onUploadSuccess(data);
        } catch (err) {
            setError('Upload failed. Please try again.');
            console.error(err);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <div
                className={`border-4 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleChange}
                />
                <div className="text-gray-600">
                    <svg className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-lg font-medium">Click to upload or drag and drop</p>
                    <p className="mt-1 text-sm text-gray-500">PDF or Image (MAX. 10MB)</p>
                </div>
            </div>
            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
};

export default FileUploader;
