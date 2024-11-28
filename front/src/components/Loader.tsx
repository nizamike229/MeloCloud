import React from 'react';

export const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 border-4 border-r-blue-400 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                <div className="absolute inset-2 border-4 border-b-blue-300 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
            </div>
            <p className="mt-4 text-gray-400 text-lg">Loading songs...</p>
        </div>
    );
}; 