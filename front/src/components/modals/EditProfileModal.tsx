import React from 'react';
import { FileInput } from '../FileInput';

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    newUsername: string
    setNewUsername: (username: string) => void
    handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleUpdateProfile: () => void
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    newUsername,
    setNewUsername,
    handleLogoChange,
    handleUpdateProfile
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
            <div className="bg-[#282828] p-6 rounded-lg shadow-lg w-96 max-w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-modal-open">
                <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#b3b3b3]">New Username</label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-3 py-2 text-white bg-[#3e3e3e] border border-[#727272] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                    />
                </div>
                <FileInput
                    label="New Avatar"
                    accept="image/*"
                    onChange={handleLogoChange}
                    isImage={true}
                />
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#b3b3b3] bg-[#3e3e3e] rounded-md hover:bg-[#4f4f4f] transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleUpdateProfile} className="px-4 py-2 text-sm font-medium text-white bg-[#1db954] rounded-md hover:bg-[#1ed760] transition-colors">
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}; 