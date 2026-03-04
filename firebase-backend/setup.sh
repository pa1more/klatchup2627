#!/bin/bash
# Firebase Backend Deployment Setup Script
# Run this to set up the Firebase backend locally

set -e

echo "🚀 Setting up Klatchup Firebase Backend..."
echo ""

# Check Node version
echo "✓ Checking Node.js version..."
node_version=$(node -v)
echo "  Found: $node_version"
echo ""

# Check Firebase CLI
echo "✓ Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo "  ❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    firebase_version=$(firebase --version)
    echo "  Found: $firebase_version"
fi
echo ""

# Navigate to firebase-backend directory
cd firebase-backend
echo "📂 Current directory: $(pwd)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "  ⚠️  Please fill in your credentials in firebase-backend/.env"
    echo "  Credentials needed:"
    echo "    - GOOGLE_PLACES_API_KEY"
    echo "    - FIREBASE_PROJECT_ID"
    echo "    - FIREBASE_PRIVATE_KEY"
    echo "    - FIREBASE_CLIENT_EMAIL"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Edit firebase-backend/.env with your Firebase credentials"
echo "  2. Run: npm start (in firebase-backend directory)"
echo "  3. Test local functions at http://localhost:5001"
echo "  4. When ready: firebase deploy"
echo ""
echo "📚 Documentation:"
echo "  - Read: firebase-backend/README.md"
echo "  - Read: BACKEND_SWITCHING_GUIDE.md"
echo ""
