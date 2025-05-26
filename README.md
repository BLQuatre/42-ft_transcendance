<p align="center">
	<a href="https://github.com/ayogun/42-project-badges"><img src=".assets/badge.png" alt="ft_transcendance Badge (Bonus)"/></a>
</p>

<h1 align="center">
	ft_transcendance
</h1>

<p align="center">
	<b><i>Surprise</i></b><br>
	<b><i>By <a href="https://github.com/ft-NotArt">NotArt</a>, <a href="https://github.com/kaveOO">kaveOO</a>, <a href="https://github.com/Polybiuss">Polybiuss</a> and <a href="https://github.com/BLQuatre">BLQuatre</a></i></b><br>
</p>

## Introduction

A modern web-based gaming platform featuring classic retro games with real-time multiplayer capabilities, chat system, and tournament functionality. Built as part of the 42 School curriculum.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Make (for build commands)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/BLQuatre/42-ft_transcendance transcendance
   cd transcendance
   ```

2. **Start the application**

   ```bash
   make
   ```

3. **Access the application**
   - Open <https://localhost> in your browser
   - Accept the self-signed certificate warning

## 📁 Project Structure

```txt
transcendance/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # App router pages
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utilities and game logic
│   └── types/                # TypeScript type definitions
├── gateway/                  # API gateway service
├── services/                 # Backend microservices
│   ├── auth-service/         # Authentication & 2FA
│   ├── user-service/         # User management
│   ├── chat-service/         # Private messaging
│   ├── generalChat-service/  # Public chat
│   ├── friend-service/       # Friend system
│   ├── pong-service/         # Pong game engine
│   ├── dino-service/         # Dino Run game engine
│   ├── game-history-service/ # Match history
│   └── matchmaking-service/  # Player matching
├── proxy/                    # Nginx configuration
├── docker-compose.yml        # Container orchestration
├── Makefile                  # Build commands
└── README.md                 # This file
```

## 🎯 Game Modes

### Pong Game Modes

- **Local**: Two players on the same device (W/S vs ↑/↓)
- **AI**: Single player vs computer opponent
- **Online**: Real-time multiplayer via WebSocket
- **Tournament**: Bracket-style competition

### Dino Run Modes

- **Solo**: Single player endless runner
- **Multiplayer**: Race against other players

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **2FA Support**: TOTP-based two-factor authentication
- **SSL/TLS**: Encrypted connections
- **Environment Isolation**: Docker containerization

## 🎮 Controls

### Pong

- **Player 1**: W (up) / S (down)
- **Player 2**: ↑ (up) / ↓ (down)
- **AI Mode**: W/S or ↑/↓ (single player)
- **Pause**: P key

### Dino Run

- **Jump**: Spacebar or ↑
- **Lean**: ↓

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports are already in use
2. **Database connection**: Ensure PostgreSQL container is healthy
3. **SSL certificates**: Regenerate with `make reload_cert`

## 🎨 Customization

### Internationalization

The application supports multiple languages:

- English (EN)
- French (FR)
- Romanian (RO)
- Russian (RU)

Language files are located in `/frontend/locales/`

---

Built with ❤️ as part of the 42 School ft_transcendence project.
