'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { UserData } from '@/types';
import { Playlists } from '@/components/Playlists';

interface PlaylistsPageProps {
    userData: UserData;
    playlists: any[];
}

function PlaylistsPage({ userData, playlists }: PlaylistsPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const handleLogout = () => {
        console.log('Logout clicked');
    };

    const fetchPersonalSongs = () => {
        console.log('Fetching personal songs');
    };

    const renderLogo = (logo: string, size: 'small' | 'large') => {
        return <img src={logo} alt="User logo" className={size === 'small' ? 'w-8 h-8' : 'w-12 h-12'} />;
    };

    const handlePlaySong = (songId: string) => {
        console.log('Playing song:', songId);
    };

    return (
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
            <Playlists
                playlists={playlists}
                onPlaySong={handlePlaySong}
            />
        </div>
    );
}

export default PlaylistsPage; 