import React from 'react';
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserData } from '@/types';

interface HeaderProps {
    searchTerm: string
    handleSearch: (term: string) => void
    setIsAddSongModalOpen: (isOpen: boolean) => void
    setIsProfileModalOpen: (isOpen: boolean) => void
    fetchPersonalSongs: () => void
    handleLogout: () => void
    userData: UserData
    renderLogo: (logo: string, size: 'small' | 'large') => React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({
    searchTerm,
    handleSearch,
    setIsAddSongModalOpen,
    setIsProfileModalOpen,
    fetchPersonalSongs,
    handleLogout,
    userData,
    renderLogo
}) => {
    return (
        <header className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button className="text-gray-300 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <button className="text-gray-300 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
            <div className="flex-1 mx-4">
                <Input
                    type="text"
                    placeholder="Search songs by name or author..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex items-center space-x-4">
                <Button onClick={() => setIsAddSongModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 me-5">
                    Add Song
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Avatar className="h-14 w-14 border-white border-2 rounded-md">
                                {userData.logo ? (
                                    renderLogo(userData.logo, 'small')
                                ) : (
                                    <AvatarFallback>{userData.username ? userData.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                )}
                            </Avatar>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56" align="end" forceMount>
                        <div className="grid gap-4">
                            <div className="font-medium">{userData.username}</div>
                            <Button variant="outline" onClick={() => {
                                setIsProfileModalOpen(true);
                                fetchPersonalSongs();
                            }}>
                                Profile
                            </Button>
                            <Button variant="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}; 