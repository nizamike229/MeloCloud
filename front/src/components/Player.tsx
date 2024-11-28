import React from 'react';
import { Button } from "@/components/ui/button"
import { Song } from '@/types';
import { Equalizer } from './Equalizer';

interface PlayerProps {
    currentSong: Song
    isPlaying: boolean
    progress: number
    duration: number
    playPreviousSong: () => void
    playNextSong: () => void
    togglePlayPause: () => void
    handleTimelineChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    formatTime: (time: number) => string
}

export const Player: React.FC<PlayerProps> = ({
    currentSong,
    isPlaying,
    progress,
    duration,
    playPreviousSong,
    playNextSong,
    togglePlayPause,
    handleTimelineChange,
    formatTime
}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
            <div className="container mx-auto flex items-center">
                <img 
                    src={`data:image/jpeg;base64,${currentSong.coverEncoded}`} 
                    alt={currentSong.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                    <div className="flex items-center">
                        <h3 className="font-bold text-white text-lg mr-3">{currentSong.name}</h3>
                        <Equalizer isPlaying={isPlaying} />
                    </div>
                    <p className="text-sm text-gray-400">{currentSong.userId}</p>
                </div>
                <div className="flex items-center space-x-8">
                    <Button variant="ghost" onClick={playPreviousSong} className="text-white hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                        </svg>
                    </Button>
                    <Button
                        onClick={togglePlayPause}
                        className="text-white hover:text-blue-500 h-16 w-16 bg-violet-700 hover:bg-blue-700 flex items-center justify-center"
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h4v14H5V5zm10 0h4v14h-4V5z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z"/>
                            </svg>
                        )}
                    </Button>
                    <Button variant="ghost" onClick={playNextSong} className="text-white hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                        </svg>
                    </Button>
                </div>
                <div className="flex-1 mx-4">
                    <input
                        type="range"
                        min="0"
                        max={isNaN(duration) ? 100 : duration}
                        value={isNaN(progress) ? 0 : progress}
                        onChange={handleTimelineChange}
                        className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 