import React, { useState } from 'react';
import { Button } from '../ui/button';

interface AddSongModalProps {
    isOpen: boolean;
    onClose: () => void;
    songName: string;
    setSongName: (name: string) => void;
    handleSongFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCoverFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCreateSong: () => void;
}

export const AddSongModal: React.FC<AddSongModalProps> = ({
    isOpen,
    onClose,
    songName,
    setSongName,
    handleSongFileChange,
    handleCoverFileChange,
    handleCreateSong
}) => {
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const handleCoverPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        handleCoverFileChange(e);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-white mb-4">Create Song</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Song Name</label>
                    <input
                        type="text"
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                        placeholder="Enter song name"
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Song File (MP3)</label>
                    <input
                        type="file"
                        onChange={handleSongFileChange}
                        accept="audio/mp3"
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                    <div className="space-y-4">
                        <input
                            type="file"
                            onChange={handleCoverPreview}
                            accept="image/*"
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        {coverPreview && (
                            <div className="mt-2 flex justify-center">
                                <img 
                                    src={coverPreview} 
                                    alt="Cover preview" 
                                    className="max-w-full rounded-md"
                                    style={{ maxHeight: '400px' }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button 
                        onClick={onClose} 
                        variant="outline" 
                        className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleCreateSong}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={!songName.trim()}
                    >
                        Create
                    </Button>
                </div>
            </div>
        </div>
    );
}; 