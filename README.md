# Borobudur Tour Guide Queue System

A modern, responsive web application for managing tour guide attendance and queue system at Borobudur Temple.

## Features

- **Dynamic Session Management**: PAGI, SIANG, SORE sessions with automatic guide rotation
- **Real-time Queue System**: FCFS (First-Come, First-Served) queue management
- **Admin Panel**: Secure admin access with role-based permissions
- **WIB Timezone Support**: All times displayed in Asia/Jakarta timezone
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Light/Dark Mode**: Toggle between light and dark themes
- **Persistent Storage**: Data saved in browser localStorage
- **Cross-platform Compatibility**: Works on Windows, Linux, and macOS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context + useReducer
- **Timezone**: Intl.DateTimeFormat (Asia/Jakarta)

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

## Installation

1. Clone the repository:
```bash
git clone https://github.com/xFalzz/Project-Borobudur.git
cd Project-Borobudur/borobudur
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server (without Turbopack)
- `npm run dev:turbo` - Start development server with Turbopack
- `npm run build` - Build for production (without Turbopack)
- `npm run build:turbo` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Windows 11 Compatibility

This project is optimized for Windows 11 dual boot systems:

- **No Turbopack by default**: Uses standard webpack for better Windows compatibility
- **File watching**: Configured with polling for Windows file system
- **Cross-platform paths**: Uses forward slashes for consistency
- **Node.js version**: Requires Node.js 18+ for Windows compatibility

## Usage

### For Tour Guides
1. Click "ABSENSI / CHECK-IN" to join the queue
2. Select your session (PAGI, SIANG, SORE)
3. Wait for admin assignment to a session slot
4. Click "Selesai Sesi / Ready" when finished

### For Admins
1. Click "Masuk Mode Admin" and login with credentials
2. Assign guides from queue to session slots
3. Use "Reset Harian" to clear daily data
4. Edit guide tags for special requests

### Admin Credentials (Hardcoded for Demo)
- Username: `admin`, Password: `admin123`
- Username: `korlap`, Password: `korlap123`

## Project Structure

```
borobudur/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── AdminPanel.tsx     # Admin controls
│   ├── CheckInModal.tsx   # Check-in modal
│   ├── Header.tsx         # App header
│   ├── QueueItem.tsx      # Queue item component
│   ├── QueueList.tsx      # Queue list
│   └── SessionBoard.tsx   # Session slots
├── lib/                   # Utilities and data
│   ├── data/
│   │   └── guides.ts      # Dummy guide data
│   ├── queueContext.tsx   # State management
│   ├── time.ts            # Timezone utilities
│   └── types.ts           # TypeScript types
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies
└── tsconfig.json         # TypeScript config
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both Linux and Windows
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.