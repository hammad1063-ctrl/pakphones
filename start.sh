#!/bin/bash

echo "🚀 Starting PakPhones Website..."
echo ""

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✅ Docker found! Starting with Docker..."
    docker-compose up --build
else
    echo "❌ Docker not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    echo ""
    echo "Alternative: Try these commands manually:"
    echo "1. Install Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "2. Install Node.js: brew install node@18"
    echo "3. cd to project directory"
    echo "4. npm install"
    echo "5. npm run dev"
    echo ""
    echo "Then open http://localhost:3000 in Google Chrome"
fi