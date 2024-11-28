'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from '@/axiosClient';
import { Playlist, Song } from '@/types';
import { Playlists } from '@/components/Playlists';
import { CreatePlaylistModal } from '@/components/modals/CreatePlaylistModal';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Player } from '@/components/Player';
import { Popup } from '@/components/Popup';
import { getErrorMessage } from '@/utils/errorHandler';

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fetchPlaylists = async () => {
        try {
            const response = await axios.get('/Playlist/getAll');
            setPlaylists(response.data);
        } catch (error) {
            setPopup({ message: 'Failed to fetch playlists', type: 'error' });
        }
    };

    const handleCreatePlaylist = async (name: string) => {
        try {
            const playlistData = {
                name: name,
                userId: ""
            };
            
            await axios.post('/Playlist/create', playlistData);
            setPopup({ message: 'Playlist created successfully!', type: 'success' });
            fetchPlaylists();
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            setPopup({ message: errorMessage, type: 'error' });
        }
    };

    const handleAddSongToPlaylist = async (songId: string, playlistId: string) => {
        try {
            await axios.post('/Playlist/addSongToPlaylist', { songId, playlistId });
            setPopup({ message: 'Song added to playlist successfully!', type: 'success' });
            fetchPlaylists();
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            setPopup({ message: errorMessage, type: 'error' });
        }
    };

    const handlePlaySong = (song: Song) => {
        if (currentSong?.id === song.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            {popup && <Popup message={popup.message} type={popup.type} onClose={() => setPopup(null)} />}
            
            <CreatePlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreatePlaylist={handleCreatePlaylist}
            />

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <Playlists
                    playlists={playlists}
                    onPlaySong={handlePlaySong}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onCreatePlaylist={() => setIsCreateModalOpen(true)}
                />
            </div>

            {currentSong && (
                <Player
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    progress={0}
                    duration={0}
                    playPreviousSong={() => {}}
                    playNextSong={() => {}}
                    togglePlayPause={() => setIsPlaying(!isPlaying)}
                    handleTimelineChange={() => {}}
                    formatTime={(time) => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`}
                />
            )}

            <audio
                ref={audioRef}
                src={currentSong ? `data:audio/mp3;base64,${currentSong.songPath}` : undefined}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
}; 