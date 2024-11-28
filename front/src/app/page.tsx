"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from '../axiosClient';
import { redirect } from "next/navigation";
import { Popup } from '@/components/Popup';
import { AddSongModal } from '@/components/modals/AddSongModal';
import { EditProfileModal } from '@/components/modals/EditProfileModal';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Player } from '@/components/Player';
import { SongCard } from '@/components/SongCard';
import { Song, UserData, Playlist } from '@/types';
import { getErrorMessage } from '@/utils/errorHandler';

export default function Component() {
    const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [songName, setSongName] = useState("");
    const [songEncoded, setSongEncoded] = useState("");
    const [coverEncoded, setCoverEncoded] = useState("");
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [userData, setUserData] = useState<UserData>({username: "", logo: ""});
    const [newUsername, setNewUsername] = useState("");
    const [newLogo, setNewLogo] = useState<string | null>(null);
    const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [personalSongs, setPersonalSongs] = useState<Song[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const fetchSongs = useCallback(async () => {
        try {
            const response = await axios.get("/Song/All");
            setSongs(response.data);
            setFilteredSongs(response.data);
        } catch (error) {
            redirect('/auth');
        }
    }, []);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5151/auth/personal", {
                baseURL: ""
            });
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            redirect('/auth');
        }
    }, []);

    const fetchPlaylists = useCallback(async () => {
        try {
            const response = await axios.get('/Playlist/getAll');
            setPlaylists(response.data);
        } catch (error) {
            console.error("Error fetching playlists:", error);
            setPopup({ message: "Failed to fetch playlists", type: "error" });
        }
    }, []);

    const fetchPersonalSongs = useCallback(async () => {
        try {
            const response = await axios.get("/Song/Personal");
            setPersonalSongs(response.data);
        } catch (error) {
            console.error("Error fetching personal songs:", error);
            setPopup({message: "Failed to fetch personal songs", type: "error"});
        }
    }, []);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        const lowercasedTerm = term.toLowerCase();
        const filtered = songs.filter(song =>
            song.name.toLowerCase().includes(lowercasedTerm) ||
            song.userId.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredSongs(filtered);
    }, [songs]);

    const handleSongClick = (song: Song) => {
        if (currentSong && currentSong.id === song.id) {
            togglePlayPause();
        } else {
            playSong(song);
        }
    };

    const playSong = useCallback((song: Song) => {
        if (currentSong && currentSong.id === song.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
        }
    }, [currentSong, isPlaying]);

    const togglePlayPause = () => setIsPlaying(!isPlaying);

    const playNextSong = () => {
        const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
        if (currentIndex > -1 && currentIndex < songs.length - 1) {
            playSong(songs[currentIndex + 1]);
        }
    };

    const playPreviousSong = () => {
        const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
        if (currentIndex > 0) {
            playSong(songs[currentIndex - 1]);
        }
    };

    const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newProgress;
            setProgress(newProgress);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5151/auth/logout", {}, { baseURL: "" });
            redirect('/auth');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleCreateSong = async () => {
        if (!songName || !songEncoded || !coverEncoded) {
            setPopup({message: "Please fill in all fields", type: "error"});
            return;
        }

        try {
            await axios.post('/Song/Create', {
                Name: songName,
                SongEncoded: songEncoded,
                CoverEncoded: coverEncoded,
                UserId: ""
            });
            setPopup({message: "Song created successfully!", type: "success"});
            setIsAddSongModalOpen(false);
            await fetchSongs();
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            setPopup({message: errorMessage, type: "error"});
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const updatedData: Partial<UserData> = {};
            if (newUsername && newUsername !== userData.username) {
                updatedData.username = newUsername;
            }
            if (newLogo) {
                updatedData.logo = newLogo;
            }

            if (Object.keys(updatedData).length === 0) {
                setPopup({message: "No changes to update", type: "error"});
                return;
            }

            await axios.patch('http://localhost:5151/auth/edit', updatedData, {
                baseURL: ""
            });
            setPopup({message: "Profile updated successfully", type: "success"});
            setIsEditProfileModalOpen(false);
            await fetchUserData();
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            setPopup({message: errorMessage, type: "error"});
        }
    };

    const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    setSongEncoded(reader.result.split(',')[1]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    setCoverEncoded(reader.result.split(',')[1]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    setNewLogo(reader.result.split(',')[1]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const renderLogo = (logo: string, size: 'small' | 'large' = 'small') => {
        const sizeClass = size === 'small' ? "h-16 w-16" : "h-48 w-48";
        return (
            <div className={`${sizeClass} rounded-md overflow-hidden`}>
                {logo.startsWith('http') ? (
                    <img src={logo} alt="User Logo" className="w-full h-full object-cover"/>
                ) : (
                    <img src={`data:image/jpeg;base64,${logo}`} alt="User Logo" className="w-full h-full object-cover"/>
                )}
            </div>
        );
    };

    const handleAddToPlaylist = async (songId: string, playlistId: string) => {
        try {
            await axios.post('/Playlist/addSongToPlaylist', { songId, playlistId });
            setPopup({ message: "Song added to playlist successfully!", type: "success" });
            fetchPlaylists();
        } catch (error) {
            console.error("Error adding song to playlist:", error);
            setPopup({ message: "Failed to add song to playlist", type: "error" });
        }
    };

    useEffect(() => {
        fetchSongs();
        fetchUserData();
        fetchPlaylists();
        fetchPersonalSongs();
    }, [fetchSongs, fetchUserData, fetchPlaylists, fetchPersonalSongs]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    useEffect(() => {
        const audioElement = audioRef.current;
        const updateProgress = () => {
            if (audioElement) {
                setProgress(audioElement.currentTime);
                setDuration(audioElement.duration);
            }
        };
        audioElement?.addEventListener("timeupdate", updateProgress);
        return () => {
            audioElement?.removeEventListener("timeupdate", updateProgress);
        };
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredSongs(songs);
        } else {
            handleSearch(searchTerm);
        }
    }, [searchTerm, songs, handleSearch]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            {popup && <Popup message={popup.message} type={popup.type} onClose={() => setPopup(null)} />}

            <AddSongModal
                isOpen={isAddSongModalOpen}
                onClose={() => setIsAddSongModalOpen(false)}
                songName={songName}
                setSongName={setSongName}
                handleSongFileChange={handleSongFileChange}
                handleCoverFileChange={handleCoverFileChange}
                handleCreateSong={handleCreateSong}
            />

            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                handleLogoChange={handleLogoChange}
                handleUpdateProfile={handleUpdateProfile}
            />

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                userData={userData}
                personalSongs={personalSongs}
                currentSong={currentSong}
                isPlaying={isPlaying}
                playSong={playSong}
                handleEditProfile={() => {
                    setIsProfileModalOpen(false);
                    setTimeout(() => {
                        setNewUsername(userData.username);
                        setIsEditProfileModalOpen(true);
                    }, 100);
                }}
                renderLogo={renderLogo}
            />

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    setIsAddSongModalOpen={setIsAddSongModalOpen}
                    setIsProfileModalOpen={setIsProfileModalOpen}
                    fetchPersonalSongs={fetchPersonalSongs}
                    handleLogout={handleLogout}
                    userData={userData}
                    renderLogo={renderLogo}
                />

                <main className="flex-1 overflow-y-auto p-8 pb-24">
                    <h2 className="text-2xl font-bold mb-6 text-white">
                        {searchTerm ? 'Search Results' : 'Featured Songs'}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredSongs.map((song) => (
                            <SongCard
                                key={song.id}
                                song={song}
                                currentSong={currentSong}
                                isPlaying={isPlaying}
                                onClick={() => handleSongClick(song)}
                                playlists={playlists}
                                onAddToPlaylist={handleAddToPlaylist}
                            />
                        ))}
                    </div>
                </main>

                {currentSong && (
                    <Player
                        currentSong={currentSong}
                        isPlaying={isPlaying}
                        progress={progress}
                        duration={duration}
                        playPreviousSong={playPreviousSong}
                        playNextSong={playNextSong}
                        togglePlayPause={togglePlayPause}
                        handleTimelineChange={handleTimelineChange}
                        formatTime={formatTime}
                    />
                )}

                <audio
                    ref={audioRef}
                    src={currentSong ? `data:audio/mp3;base64,${currentSong.songPath}` : undefined}
                    onEnded={playNextSong}
                />

                <style jsx global>{`
                    @keyframes modalOpen {
                        from {
                            opacity: 0;
                            transform: scale(0.95) translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }

                    .animate-modal-open {
                        animation: modalOpen 0.3s ease-out forwards;
                    }

                    ::-webkit-scrollbar {
                        width: 12px;
                    }

                    ::-webkit-scrollbar-track {
                        background: #1a1a1a;
                    }

                    ::-webkit-scrollbar-thumb {
                        background-color: #3b82f6;
                        border-radius: 6px;
                        border: 3px solid #1a1a1a;
                    }

                    ::-webkit-scrollbar-thumb:hover {
                        background-color: #60a5fa;
                    }
                `}</style>
            </div>
        </div>
    );
}