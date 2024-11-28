import React from 'react';

interface UploadProgressProps {
    progress: number;
    fileName: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress, fileName }) => {
    return (
        <div className="w-full bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-300 truncate">{fileName}</span>
                <span className="text-sm text-gray-300">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}; 