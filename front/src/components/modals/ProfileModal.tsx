import React from 'react';
import { UserData, Song } from '@/types';

interface ProfileModalProps {
    isOpen: boolean
    onClose: () => void
    userData: UserData
    personalSongs: Song[]
    currentSong: Song | null
    isPlaying: boolean
    playSong: (song: Song) => void
    handleEditProfile: () => void
    renderLogo: (logo: string, size: 'small' | 'large') => React.ReactNode
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
    isOpen,
    onClose,
    userData,
    personalSongs,
    currentSong,
    isPlaying,
    playSong,
    handleEditProfile,
    renderLogo
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
            <div className="bg-[#282828] p-6 rounded-lg shadow-lg w-3/4 h-3/4 max-w-4xl max-h-full overflow-auto transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-modal-open">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">Profile</h2>
                    <button onClick={onClose} className="text-[#b3b3b3] hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div className="flex">
                    <div className="w-1/3 pr-4 border-r border-[#404040]">
                        <div className="flex flex-col items-center">
                            {userData.logo ? (
                                renderLogo(userData.logo, 'large')
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-[#b3b3b3] rounded-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                            )}
                            <h3 className="mt-2 text-xl font-semibold text-white">{userData.username}</h3>
                            <button onClick={handleEditProfile} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#1db954] rounded-md hover:bg-[#1ed760] transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                    <div className="w-2/3 pl-4">
                        <h3 className="text-xl font-semibold mb-4 text-white">My Songs</h3>
                        <ul className="space-y-2">
                            {personalSongs.map((song) => (
                                <li key={song.id} className="flex items-center">
                                    <button onClick={() => playSong(song)} className="play-button mr-4 text-[#b3b3b3] hover:text-white">
                                        {currentSong && currentSong.id === song.id && isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        )}
                                    </button>
                                    <img src={`data:image/jpeg;base64,${song.coverEncoded}`} alt={song.name} className="w-12 h-12 object-cover rounded-md mr-4"/>
                                    <div>
                                        <h4 className="font-medium text-white">{song.name}</h4>
                                        <p className="text-sm text-[#b3b3b3]">{song.userId}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}; 