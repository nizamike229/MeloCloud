import React, { useState } from 'react';
import { Button } from '../ui/button';

interface CreatePlaylistModalProps {
    isOpen: boolean
    onClose: () => void
    onCreatePlaylist: (name: string) => void
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
    isOpen,
    onClose,
    onCreatePlaylist
}) => {
    const [playlistName, setPlaylistName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (playlistName.trim()) {
            onCreatePlaylist(playlistName);
            setPlaylistName('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-white mb-4">Create Playlist</h2>
                <input
                    type="text"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    placeholder="Playlist name"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-3">
                    <Button 
                        onClick={onClose} 
                        variant="outline" 
                        className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Create
                    </Button>
                </div>
            </div>
        </div>
    );
}; 