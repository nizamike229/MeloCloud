export default function Component() {
  // Placeholder data for songs
  const songs = [
    { id: 1, title: "Midnight Serenade", artist: "Luna Echo", cover: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 2, title: "Neon Dreams", artist: "The Voltage", cover: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 3, title: "Whispers in the Wind", artist: "Aria Skye", cover: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 4, title: "Electric Pulse", artist: "Synth Collective", cover: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 5, title: "Starlight Sonata", artist: "Cosmic Strings", cover: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
  ]

  return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="sticky top-0 z-10 bg-black text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span className="text-xl font-bold">MusicApp</span>
            </a>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-white bg-black border border-white rounded-md hover:bg-white hover:text-black transition-colors">
                Login
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-black border border-white rounded-md hover:bg-white hover:text-black transition-colors">
                Register
              </button>
              <button className="px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-200 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Song
              </button>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-black">Featured Songs</h1>
          <div className="mb-6">
            <input
                className="w-full max-w-md px-3 py-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Search songs..."
                type="search"
            />
          </div>
          <ul className="space-y-4">
            {songs.map((song) => (
                <li key={song.id} className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
                  <img src={song.cover} alt={`${song.title} cover`} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-black">{song.title}</h2>
                    <p className="text-gray-600">{song.artist}</p>
                  </div>
                  <button className="p-3 text-black bg-gray-200 rounded-full hover:bg-gray-300 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="sr-only">Play</span>
                  </button>
                </li>
            ))}
          </ul>
        </main>
        <footer className="bg-black text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} MusicApp. All rights reserved.</p>
          </div>
        </footer>
      </div>
  )
}