import React from 'react';
import { Song, Playlist } from '@/types';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface SongCardProps {
    song: Song
    currentSong: Song | null
    isPlaying: boolean
    onClick: () => void
    playlists: Playlist[]
    onAddToPlaylist: (songId: string, playlistId: string) => void
}

export const SongCard: React.FC<SongCardProps> = ({
    song,
    currentSong,
    isPlaying,
    onClick,
    playlists,
    onAddToPlaylist
}) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg transition-colors hover:bg-gray-700 relative">
            <div className="relative group" onClick={onClick}>
                <img
                    src={`data:image/jpeg;base64,${song.coverEncoded}`}
                    alt={song.name}
                    className="w-full aspect-square object-cover rounded-md mb-4"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 rounded-md flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {currentSong?.id === song.id && isPlaying ? (
                            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        ) : (
                            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-semibold text-white truncate">{song.name}</h3>
                    <p className="text-sm text-gray-400 truncate">{song.userId}</p>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-gray-600 z-10 text-gray-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                            </svg>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                        className="w-48 p-0 bg-gray-800 border border-gray-700 shadow-lg" 
                        align="end"
                        sideOffset={5}
                    >
                        <div className="py-1">
                            {playlists.map((playlist) => (
                                <button
                                    key={playlist.id}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToPlaylist(song.id, playlist.id);
                                    }}
                                >
                                    Add to {playlist.name}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}; 