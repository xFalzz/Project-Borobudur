# Windows 11 Installation Guide

## Prerequisites

1. **Node.js 18+**: Download from [https://nodejs.org/](https://nodejs.org/)
2. **Git**: Download from [https://git-scm.com/](https://git-scm.com/)

## Quick Installation (Windows)

1. **Download the project**:
   ```cmd
   git clone https://github.com/xFalzz/Project-Borobudur.git
   cd Project-Borobudur\borobudur
   ```

2. **Run the installer**:
   ```cmd
   install-windows.bat
   ```

3. **Start the application**:
   ```cmd
   npm run dev
   ```

4. **Open your browser** and go to: `http://localhost:3000`

## Manual Installation (Windows)

1. **Open Command Prompt or PowerShell** as Administrator

2. **Navigate to project folder**:
   ```cmd
   cd C:\path\to\Project-Borobudur\borobudur
   ```

3. **Install dependencies**:
   ```cmd
   npm install
   ```

4. **Start development server**:
   ```cmd
   npm run dev
   ```

## Available Commands

- `npm run dev` - Start development server (recommended for Windows)
- `npm run dev:turbo` - Start with Turbopack (may have issues on Windows)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Check code quality

## Troubleshooting

### Common Issues on Windows:

1. **Permission Errors**:
   - Run Command Prompt as Administrator
   - Or use PowerShell with execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

2. **Node.js Version Issues**:
   - Ensure Node.js 18+ is installed
   - Check with: `node --version`

3. **Port Already in Use**:
   - Kill process using port 3000: `netstat -ano | findstr :3000`
   - Or use different port: `npm run dev -- -p 3001`

4. **File Watching Issues**:
   - The app is configured with polling for Windows compatibility
   - If still having issues, restart the dev server

### Performance Tips:

- Use `npm run dev` instead of `npm run dev:turbo` on Windows
- Close unnecessary applications to free up memory
- Ensure Windows Defender excludes the project folder

## Features

- ✅ Cross-platform compatibility (Windows/Linux/macOS)
- ✅ No Turbopack dependency (better Windows support)
- ✅ File watching with polling for Windows
- ✅ Responsive design for all screen sizes
- ✅ Light/Dark mode toggle
- ✅ WIB timezone support
- ✅ Persistent data storage

## Support

If you encounter issues on Windows 11, please:
1. Check Node.js version: `node --version`
2. Check npm version: `npm --version`
3. Try running as Administrator
4. Open an issue on GitHub with your Windows version and error details
