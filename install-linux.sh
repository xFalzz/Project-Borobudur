#!/bin/bash

echo "Installing Borobudur Tour Guide Queue System..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH"
    exit 1
fi

echo "npm version: $(npm --version)"

echo
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo
echo "Installation completed successfully!"
echo
echo "To start the development server, run:"
echo "  npm run dev"
echo
echo "To build for production, run:"
echo "  npm run build"
echo
