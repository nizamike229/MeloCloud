import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void;
    accept: string;
    title: string;
    isImage?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
    onFileSelect, 
    accept, 
    title,
    isImage = false 
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isUploaded, setIsUploaded] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const file = acceptedFiles[0];
            setFileName(file.name);
            setIsUploaded(true);
            
            if (isImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
            
            onFileSelect(file);
        }
    }, [onFileSelect, isImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: { [accept]: [] },
        maxFiles: 1
    });

    return (
        <div className="space-y-4">
            <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-50/10' : 'border-gray-600 hover:border-gray-500'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-300">{isDragActive ? 'Drop the file here' : title}</p>
                    <p className="text-sm text-gray-500 mt-2">or click to select</p>
                </div>
            </div>

            <AnimatePresence>
                {fileName && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-gray-700 rounded-lg p-4"
                    >
                        {isImage && preview ? (
                            <div className="space-y-3">
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="w-32 h-32 object-cover rounded-md mx-auto"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-300 truncate flex-1">
                                        {fileName}
                                    </p>
                                    {isUploaded && (
                                        <svg className="w-5 h-5 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                    <svg className="w-8 h-8 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                                    </svg>
                                    <p className="text-sm text-gray-300 truncate">
                                        {fileName}
                                    </p>
                                </div>
                                {isUploaded && (
                                    <svg className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}; 