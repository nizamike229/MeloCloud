import React from 'react';
import { FileInput } from '../FileInput';

interface AddSongModalProps {
    isOpen: boolean
    onClose: () => void
    songName: string
    setSongName: (name: string) => void
    handleSongFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleCoverFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleCreateSong: () => void
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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
            <div className="bg-[#282828] p-6 rounded-lg shadow-lg w-96 max-w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-modal-open">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Create Song</h2>
                    <button onClick={onClose} className="text-[#b3b3b3] hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#b3b3b3]">Song Name</label>
                    <input
                        type="text"
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                        className="w-full px-3 py-2 text-white bg-[#3e3e3e] border border-[#727272] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                    />
                </div>
                <FileInput label="Song File (MP3)" accept="audio/mp3" onChange={handleSongFileChange} />
                <FileInput label="Cover Image" accept="image/*" onChange={handleCoverFileChange} isImage={true} />
                <div className="flex justify-end space-x-4">
                    <button onClick={handleCreateSong} className="px-4 py-2 text-sm font-medium text-white bg-[#1db954] rounded-md hover:bg-[#1ed760] transition-colors">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}; 