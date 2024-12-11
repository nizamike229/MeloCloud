# 🎵 MeloCloud

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat&logo=dotnet)](https://dotnet.microsoft.com/)
[![Next.js](https://img.shields.io/badge/Next.js-13-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> Modern web music streaming service with real-time visualization and playlist management.

## 📋 Description
MeloCloud is a full-stack music streaming platform inspired by Spotify, featuring real-time audio visualization, playlist management, and a modern dark theme UI. Built using microservices architecture with ASP.NET Core backend and Next.js frontend.

## ✨ Features

### Music Experience
- 🎧 Real-time audio playback with visualizer
- 🎮 Keyboard shortcuts for playback control
- 🔊 Volume control with mute option
- 🔄 Progress tracking with time display

### Library Management
- 📚 Personal music library
- 📝 Create and manage playlists
- 🎵 Add songs to playlists
- 📱 Drag-and-drop playlist reordering

### User Interface
- 🌙 Modern, responsive dark theme
- 🔍 Real-time search functionality
- 📤 File upload with preview
- ⚡ Loading states and animations
- ❌ User-friendly error handling

### User Features
- 🔐 Secure authentication
- 👤 Profile customization
- 🖼️ Avatar upload
- 🔑 Session management

## 💻 Tech Stack

### Frontend
- **Next.js 13** with TypeScript
- **TailwindCSS** for styling
- **React Hooks** for state management
- **Web Audio API** for audio processing
- **Framer Motion** for animations

### Backend
- **ASP.NET Core** for API
- **Entity Framework Core** for ORM
- **PostgreSQL** database
- **JWT** authentication
- **Microservices** architecture

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- .NET 8.0 SDK
- PostgreSQL
- Docker

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nizamike229/MeloCloud
```

2. Go to project directory
```bash
cd melocloud
```
3. Using Docker:
```bash
docker-compose up --build
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5151

## ⌨️ Keyboard Shortcuts

| Key           | Action                |
|---------------|----------------------|
| Space         | Play/Pause           |
| Left Arrow    | Previous Track       |
| Right Arrow   | Next Track           |
| Ctrl + F      | Focus Search         |

## 📁 Project Structure

```
melocloud/
├── front/                   # Frontend application
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
├── SongLayer/              # Song management service
└── AuthLayer/              # Authentication service
```

## 🔑 Core Components
- **Player**: Audio playback with visualization
- **Playlist Manager**: Playlist CRUD operations
- **File Upload**: Media file handling
- **Audio Visualizer**: Real-time frequency display
- **Error Handler**: Centralized error management

## 🚧 Project Status
**In Active Development**

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Contact
Nizami - [@nizamike229](https://github.com/nizamike229)

Project Link: [https://github.com/nizamike229/MeloCloud](https://github.com/nizamike229/MeloCloud)
