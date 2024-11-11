"use client";

import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from '../axiosClient';
import {router} from "next/client";
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Input} from "@/components/ui/input"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {redirect} from "next/navigation";

interface Song {
    id: string
    name: string
    userId: string
    songPath: string
    coverEncoded: string
}

interface UserData {
    username: string
    logo: string
}

interface FileInputProps {
    label: string
    accept: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    isImage?: boolean
}

interface PopupProps {
    message: string
    type: 'success' | 'error'
    onClose: () => void
}

const Popup: React.FC<PopupProps> = ({message, type, onClose}) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
        }, 3000)

        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <Card
                className={`max-w-md w-full ${type === 'success' ? 'border-t-4 border-t-green-500' : 'border-t-4 border-t-red-500'}`}>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center mb-4">
                        <div
                            className={`w-16 h-16 rounded-md flex items-center justify-center mb-4 ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {type === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M5 13l4 4L19 7"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold">{type === 'success' ? 'Success' : 'Error'}</h3>
                    </div>
                    <p className="text-gray-600 text-center mb-4">{message}</p>
                    <Button
                        onClick={() => {
                            setIsVisible(false)
                            setTimeout(onClose, 300)
                        }}
                        className={`w-full ${type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                        OK
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

const FileInput: React.FC<FileInputProps> = ({label, accept, onChange, isImage = false}) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            if (isImage) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setPreview(reader.result as string)
                }
                reader.readAsDataURL(file)
            }
        } else {
            setFileName(null)
            setPreview(null)
        }
        onChange(e)
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
            <div className="relative">
                <Input
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                    id={label.replace(/\s+/g, '-').toLowerCase()}
                />
                <label
                    htmlFor={label.replace(/\s+/g, '-').toLowerCase()}
                    className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md inline-flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Choose file
                </label>
            </div>
            {fileName && (
                <p className="mt-2 text-sm text-green-400">
                    Selected file: {fileName}
                </p>
            )}
            {isImage && preview && (
                <div className="mt-2">
                    <img src={preview} alt="Preview" className="max-w-full h-auto max-h-40 rounded-md"/>
                </div>
            )}
        </div>
    )
}


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
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [_, setIsDropdownOpen] = useState(false);

    const fetchSongs = useCallback(async () => {
        try {
            const response = await axios.get("/Song/All")
            setSongs(response.data)
        } catch (error) {
            redirect('/auth')
        }
    }, [router])

    const handleSongClick = (song: Song) => {
        if (currentSong && currentSong.id === song.id) {
            togglePlayPause()
        } else {
            playSong(song)
        }
    }

    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5151/auth/personal", {
                baseURL: ""
            })
            if(response.status===401){
                redirect('/auth')
            }
            setUserData(response.data)
        } catch (error) {
            console.error("Error fetching user data:", error)
            await router.push('/auth')
        }
    }, [router])

    const fetchPersonalSongs = useCallback(async () => {
        try {
            const response = await axios.get("/Song/Personal")
            if(response.status===401){
                redirect('/auth')
            }
            setPersonalSongs(response.data)
        } catch (error) {
            console.error("Error fetching personal songs:", error)
            setPopup({message: "Failed to fetch personal songs", type: "error"})
        }
    }, [])

    const handleOpenProfile = () => {
        setIsProfileModalOpen(true)
        fetchPersonalSongs()
    }

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term)
        const lowercasedTerm = term.toLowerCase()
        const filtered = songs.filter(song =>
            song.name.toLowerCase().includes(lowercasedTerm) ||
            song.userId.toLowerCase().includes(lowercasedTerm)
        )
        setFilteredSongs(filtered)
    }, [songs])

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredSongs(songs)
        } else {
            handleSearch(searchTerm)
        }
    }, [searchTerm, songs, handleSearch])


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        fetchSongs()
    }, [fetchSongs])

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play()
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying, currentSong])

    useEffect(() => {
        const audioElement = audioRef.current
        const updateProgress = () => {
            if (audioElement) {
                setProgress(audioElement.currentTime)
                setDuration(audioElement.duration)
            }
        }
        audioElement?.addEventListener("timeupdate", updateProgress)
        return () => {
            audioElement?.removeEventListener("timeupdate", updateProgress)
        }
    }, [])

    useEffect(() => {
        fetchUserData()
        fetchSongs()
    }, [fetchUserData, fetchSongs])


    const playSong = useCallback((song: Song) => {
        if (currentSong && currentSong.id === song.id) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentSong(song)
            setIsPlaying(true)
        }
    }, [currentSong, isPlaying])

    const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = Number(e.target.value)
        if (audioRef.current) {
            audioRef.current.currentTime = newProgress
            setProgress(newProgress)
        }
    }

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying)
    }


    const playNextSong = () => {
        const currentIndex = songs.findIndex(song => song.id === currentSong?.id)
        if (currentIndex > -1 && currentIndex < songs.length - 1) {
            playSong(songs[currentIndex + 1])
        }
    }

    const playPreviousSong = () => {
        const currentIndex = songs.findIndex(song => song.id === currentSong?.id)
        if (currentIndex > 0) {
            playSong(songs[currentIndex - 1])
        }
    }

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const fileToBase64 = (file: File, setEncoded: (encoded: string) => void) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            if (reader.result && typeof reader.result === 'string') {
                setEncoded(reader.result.split(',')[1])
            }
        }
    }

    const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            fileToBase64(file, setSongEncoded)
        }
    }

    const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            fileToBase64(file, setCoverEncoded)
        }
    }

    const handleCreateSong = async () => {
        if (!songName || !songEncoded || !coverEncoded) {
            setPopup({message: "Please fill in all fields", type: "error"})
            return
        }

        const songData = {
            Name: songName,
            SongEncoded: songEncoded,
            CoverEncoded: coverEncoded,
            UserId: ""
        }
        try {
            await axios.post('/Song/Create', songData)
            setPopup({message: "Song created successfully!", type: "success"})
            setIsAddSongModalOpen(false)
            await fetchSongs()
        } catch (error) {
            console.error('Error creating song:', error)
            setPopup({message: "Failed to create song. Please try again.", type: "error"})
        }
    }

    const handleLogout = () => {
        axios.post("http://localhost:5151/auth/logout", {
            baseURL: ""
        })
        router.push('/auth')
    }

    const handleEditProfile = () => {
        setNewUsername(userData.username)
        setIsEditProfileModalOpen(true)
    }


    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setNewLogo(reader.result.split(',')[1])
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpdateProfile = async () => {
        try {
            const updatedData: Partial<UserData> = {}
            if (newUsername && newUsername !== userData.username) {
                updatedData.username = newUsername
            }

            if (newLogo) {
                updatedData.logo = newLogo
            }

            if (Object.keys(updatedData).length === 0) {
                setPopup({message: "No changes to update", type: "error"})
                return
            }

            const response = await axios.patch('http://localhost:5151/auth/edit', updatedData, {
                baseURL: ""
            })
            setUserData(response.data)
            setIsEditProfileModalOpen(false)
            setPopup({message: "Profile updated successfully", type: "success"})
            await fetchUserData()
            await fetchSongs()
        } catch (error) {
            console.error('Error updating profile:', error)
            setPopup({message: "Failed to update profile. Please try again.", type: "error"})
        }
    }

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
        )
    }

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            {popup && (
                <Popup
                    message={popup.message}
                    type={popup.type}
                    onClose={() => setPopup(null)}
                />
            )}
            <div className="w-64 bg-gray-800 p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">MusicApp</h1>
                </div>
                <nav className="flex-1">
                    <ul className="space-y-2">
                        <li>
                            <a href="/" className="flex items-center space-x-3 text-gray-300 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path
                                        d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                                </svg>
                                <span>Home</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path
                                        d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                                </svg>
                                <span>Your Library</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-gray-800 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-300 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <button className="text-gray-300 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
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
                        <Button onClick={() => setIsAddSongModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 me-5">
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
                                    <Button variant="outline" onClick={handleOpenProfile}>
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

                <main className="flex-1 overflow-y-auto p-8 pb-24">
                    <h2 className="text-2xl font-bold mb-6 text-white">
                        {searchTerm ? 'Search Results' : 'Featured Songs'}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredSongs.map((song) => (
                            <div
                                key={song.id}
                                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors relative group cursor-pointer"
                                onClick={() => handleSongClick(song)}
                            >
                                <img
                                    src={`data:image/jpeg;base64,${song.coverEncoded}`}
                                    alt={song.name}
                                    className="w-full aspect-square object-cover rounded-md mb-4"
                                />
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 rounded-md flex items-center justify-center">
                                    <div
                                        className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        {currentSong && currentSong.id === song.id && isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-white truncate">{song.name}</h3>
                                <p className="text-sm text-gray-400 truncate">{song.userId}</p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            {currentSong && (
                <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
                    <div className="container mx-auto flex items-center">
                        <img src={`data:image/jpeg;base64,${currentSong.coverEncoded}`} alt={currentSong.name}
                             className="w-20 h-20 object-cover rounded-md mr-4"/>
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-lg">{currentSong.name}</h3>
                            <p className="text-sm text-gray-400">{currentSong.userId}</p>
                        </div>
                        <div className="flex items-center space-x-8">
                            <Button variant="ghost" onClick={playPreviousSong}
                                    className="text-white hover:text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                                </svg>
                            </Button>
                            <Button
                                onClick={togglePlayPause}
                                className="text-white hover:text-blue-500 h-16 w-16 bg-violet-700 hover:bg-blue-700 flex items-center justify-center"
                            >
                                {isPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 5h4v14H5V5zm10 0h4v14h-4V5z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 3l14 9-14 9V3z"/>
                                    </svg>
                                )}
                            </Button>
                            <Button variant="ghost" onClick={playNextSong} className="text-white hover:text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
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
            )}


            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
                    <div
                        className="bg-[#282828] p-6 rounded-lg shadow-lg w-3/4 h-3/4 max-w-4xl max-h-full overflow-auto transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-modal-open">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-white">Profile</h2>
                            <button onClick={() => setIsProfileModalOpen(false)}
                                    className="text-[#b3b3b3] hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div className="flex">
                            <div className="w-1/3 pr-4 border-r border-[#404040]">
                                <div className="flex flex-col items-center">
                                    {userData.logo ? (
                                        renderLogo(userData.logo, 'large')
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="h-24 w-24 text-[#b3b3b3] rounded-md"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                    )}
                                    <h3 className="mt-2 text-xl font-semibold text-white">{userData.username}</h3>
                                    <button onClick={handleEditProfile}
                                            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#1db954] rounded-md hover:bg-[#1ed760] transition-colors">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                            <div className="w-2/3 pl-4">
                                <h3 className="text-xl font-semibold mb-4 text-white">My Songs</h3>
                                <ul className="space-y-2">
                                    {personalSongs.map((song) => (
                                        <li key={song.id} className="flex items-center">
                                            <button onClick={() => playSong(song)}
                                                    className="play-button mr-4  text-[#b3b3b3] hover:text-white">
                                                {currentSong && currentSong.id === song.id && isPlaying ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8"
                                                         fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                         strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8"
                                                         fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                         strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                    </svg>
                                                )}
                                            </button>
                                            <img src={`data:image/jpeg;base64,${song.coverEncoded}`} alt={song.name}
                                                 className="w-12 h-12 object-cover rounded-md mr-4"/>
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
            )}


            {isEditProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
                    <div
                        className="bg-[#282828] p-6 rounded-lg shadow-lg w-96 max-w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-modal-open">
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
                            <button
                                onClick={() => setIsEditProfileModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-[#b3b3b3] bg-[#3e3e3e] rounded-md hover:bg-[#4f4f4f] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#1db954] rounded-md hover:bg-[#1ed760] transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {isAddSongModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
                    <div
                        className="bg-[#282828] p-6 rounded-lg shadow-lg w-96 max-w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-modal-open">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">Create Song</h2>
                            <button
                                onClick={() => setIsAddSongModalOpen(false)}
                                className="text-[#b3b3b3] hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
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
                        <FileInput
                            label="Song File (MP3)"
                            accept="audio/mp3"
                            onChange={handleSongFileChange}
                        />
                        <FileInput
                            label="Cover Image"
                            accept="image/*"
                            onChange={handleCoverFileChange}
                            isImage={true}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCreateSong}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#1db954] rounded-md hover:bg-[#1ed760] transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
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

                @keyframes dropdownOpen {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-dropdown-open {
                    animation: dropdownOpen 0.2s ease-out forwards;
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
    );
}