export interface Song {
    id: string
    name: string
    userId: string
    songPath: string
    coverEncoded: string
}

export interface UserData {
    username: string
    logo: string
}

export interface Playlist {
    id: string
    name: string
    userId: string
    songs: Song[]
}

export interface PlaylistCreateModel {
    name: string
    userId: string
}

export interface SongAddModel {
    songId: string
    playlistId: string
} 