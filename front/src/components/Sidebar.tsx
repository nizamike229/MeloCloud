import React from 'react';

export const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 p-6 flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">MusicApp</h1>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <a href="/" className="flex items-center space-x-3 text-gray-300 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                            </svg>
                            <span>Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                            </svg>
                            <span>Your Library</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}; 