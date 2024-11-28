import React, { useState } from 'react';
import { Playlist, Song } from '@/types';
import { Button } from './ui/button';

interface PlaylistsProps {
    playlists: Playlist[]
    onPlaySong: (song: Song) => void
    currentSong: Song | null
    isPlaying: boolean
    onCreatePlaylist: () => void
}

export const Playlists: React.FC<PlaylistsProps> = ({
    playlists,
    onPlaySong,
    currentSong,
    isPlaying,
    onCreatePlaylist
}) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const defaultPlaylistImage = "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2";

    const handlePlaylistClick = (playlist: Playlist) => {
        setSelectedPlaylist(playlist);
    };

    const handleBackClick = () => {
        setSelectedPlaylist(null);
    };

    if (selectedPlaylist) {
        return (
            <div className="p-8">
                <Button 
                    onClick={handleBackClick}
                    variant="ghost" 
                    className="mb-6 hover:bg-gray-700"
                >
                    <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back to Playlists
                </Button>

                <div className="flex items-start space-x-6 mb-8">
                    <img 
                        src={defaultPlaylistImage}
                        alt={selectedPlaylist.name}
                        className="w-48 h-48 object-cover rounded-lg shadow-lg"
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{selectedPlaylist.name}</h2>
                        <p className="text-gray-400 mb-4">Created by {selectedPlaylist.userId}</p>
                        <p className="text-gray-400">{selectedPlaylist.songs.length} songs</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {selectedPlaylist.songs.map((song, index) => (
                        <div 
                            key={song.id}
                            onClick={() => onPlaySong(song)}
                            className="flex items-center p-3 hover:bg-gray-700 rounded-md cursor-pointer group"
                        >
                            <div className="w-8 text-gray-400 group-hover:text-white">
                                {currentSong?.id === song.id ? (
                                    <div className="text-blue-500">
                                        {isPlaying ? (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                            </svg>
                                        )}
                                    </div>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <img 
                                src={`data:image/jpeg;base64,${song.coverEncoded}`}
                                alt={song.name}
                                className="w-12 h-12 rounded ml-4 mr-6"
                            />
                            <div className="flex-1">
                                <p className="text-white font-medium">{song.name}</p>
                                <p className="text-gray-400 text-sm">{song.userId}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
                <Button onClick={onCreatePlaylist} className="bg-blue-600 hover:bg-blue-700">
                    Create Playlist
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {playlists.map((playlist) => (
                    <div 
                        key={playlist.id} 
                        className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => handlePlaylistClick(playlist)}
                    >
                        <img 
                            src={defaultPlaylistImage}
                            alt={playlist.name}
                            className="w-full aspect-square object-cover rounded-md mb-4 shadow-lg"
                        />
                        <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                        <p className="text-sm text-gray-400 truncate">{playlist.songs.length} songs</p>
                    </div>
                ))}
            </div>
        </div>
    );
}; 