#!/bin/bash

# Firebase & GCP Setup Script
# This script helps automate the Firebase project migration

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 Klatchup Firebase Migration Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI not found"
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

print_success "Firebase CLI is installed"

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    print_warning "Google Cloud CLI not found (optional but recommended)"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
else
    print_success "Google Cloud CLI is installed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Step 1: Project Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get project ID
read -p "Enter your new Firebase Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    print_error "Project ID cannot be empty"
    exit 1
fi

print_success "Project ID: $PROJECT_ID"

# Update firebase.json
echo ""
print_step "Updating firebase.json..."

cat > firebase.json << EOF
{
  "projects": {
    "default": "$PROJECT_ID"
  },
  "targets": {
    "$PROJECT_ID": {
      "functions": [
        {
          "source": "firebase-backend",
          "codebase": "default",
          "ignore": [
            "node_modules",
            ".git",
            "firebase-debug.log",
            "firebase-functions-log.log"
          ]
        }
      ]
    }
  }
}
EOF

print_success "firebase.json updated"

# Set Firebase project
echo ""
print_step "Setting Firebase project..."
firebase use "$PROJECT_ID" || {
    print_error "Failed to set Firebase project. Make sure you have access to this project."
    exit 1
}

print_success "Firebase project set to $PROJECT_ID"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Step 2: Mobile App Credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Android credentials
if [ -f "android/app/google-services.json" ]; then
    print_warning "android/app/google-services.json exists"
    read -p "Do you want to replace it? (y/n): " REPLACE_ANDROID
    
    if [ "$REPLACE_ANDROID" = "y" ] || [ "$REPLACE_ANDROID" = "Y" ]; then
        # Backup old file
        mv android/app/google-services.json android/app/google-services.json.backup
        print_success "Old file backed up as google-services.json.backup"
        
        echo "Please download the new google-services.json from Firebase Console:"
        echo "https://console.firebase.google.com/project/$PROJECT_ID/settings/general"
        read -p "Press Enter after you've placed the file in android/app/"
        
        if [ -f "android/app/google-services.json" ]; then
            print_success "Android credentials updated"
        else
            print_error "android/app/google-services.json not found"
        fi
    fi
else
    print_warning "android/app/google-services.json not found"
    echo "Please download it from Firebase Console:"
    echo "https://console.firebase.google.com/project/$PROJECT_ID/settings/general"
    read -p "Press Enter after you've placed the file in android/app/"
fi

# Check iOS credentials
echo ""
if [ -f "ios/klatchup/GoogleService-Info.plist" ]; then
    print_warning "ios/klatchup/GoogleService-Info.plist exists"
    read -p "Do you want to replace it? (y/n): " REPLACE_IOS
    
    if [ "$REPLACE_IOS" = "y" ] || [ "$REPLACE_IOS" = "Y" ]; then
        mv ios/klatchup/GoogleService-Info.plist ios/klatchup/GoogleService-Info.plist.backup
        print_success "Old file backed up as GoogleService-Info.plist.backup"
        
        echo "Please download the new GoogleService-Info.plist from Firebase Console:"
        echo "https://console.firebase.google.com/project/$PROJECT_ID/settings/general"
        read -p "Press Enter after you've placed the file in ios/klatchup/"
        
        if [ -f "ios/klatchup/GoogleService-Info.plist" ]; then
            print_success "iOS credentials updated"
        else
            print_error "ios/klatchup/GoogleService-Info.plist not found"
        fi
    fi
else
    print_warning "ios/klatchup/GoogleService-Info.plist not found"
    echo "Please download it from Firebase Console:"
    echo "https://console.firebase.google.com/project/$PROJECT_ID/settings/general"
    read -p "Press Enter after you've placed the file in ios/klatchup/"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  Step 3: Backend Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create backend .env file
print_step "Creating firebase-backend/.env..."

read -p "Enter Google Places API Key (or press Enter to skip): " PLACES_API_KEY

cat > firebase-backend/.env << EOF
# Firebase Project Configuration
FIREBASE_PROJECT_ID=$PROJECT_ID

# Google Places API Key (optional)
GOOGLE_PLACES_API_KEY=${PLACES_API_KEY:-your_google_places_api_key}

# Environment
NODE_ENV=production
REGION=us-central1
EOF

print_success "Backend .env file created"

# Update API config
echo ""
print_step "Updating mobile app API configuration..."

FUNCTIONS_URL="https://us-central1-$PROJECT_ID.cloudfunctions.net/api"

# Create a temporary file with the updated content
cat > src/services/apiConfig.ts << 'EOF'
/**
 * ===========================================================
 * API CONFIGURATION - FALLBACK SYSTEM
 * ===========================================================
 * 
 * This file provides a single source of truth for API endpoints.
 * You can switch between Firebase and AWS by changing API_PROVIDER.
 * 
 * NO OTHER CHANGES NEEDED IN THE APP - everything else works the same!
 * ===========================================================
 */

// Choose your backend: 'firebase' | 'aws'
export const API_PROVIDER = 'firebase'; // ← Change this to switch!

export const API_CONFIG = {
  firebase: {
EOF

echo "    baseURL: '$FUNCTIONS_URL'," >> src/services/apiConfig.ts

cat >> src/services/apiConfig.ts << 'EOF'
    name: 'Firebase',
    status: 'ACTIVE - Real-time enabled',
  },
  aws: {
    baseURL: 'https://xxxxxxx.execute-api.us-east-1.amazonaws.com/dev',
    name: 'AWS Lambda',
    status: 'BACKUP - Available if needed',
  },
};

// Get active configuration
export const getActiveConfig = () => API_CONFIG[API_PROVIDER as keyof typeof API_CONFIG];

// Get fallback configuration
export const getFallbackConfig = () => {
  const fallback = API_PROVIDER === 'firebase' ? 'aws' : 'firebase';
  return API_CONFIG[fallback as keyof typeof API_CONFIG];
};

export const BASE_URL = getActiveConfig().baseURL;

export const FALLBACK_URL = getFallbackConfig().baseURL;

// Log current configuration (for debugging)
export const logConfig = () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 API CONFIGURATION');
  console.log(`Active Provider: ${API_PROVIDER.toUpperCase()}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Fallback: ${getFallbackConfig().name}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};
EOF

print_success "API configuration updated"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "☁️  Step 4: GCP Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v gcloud &> /dev/null; then
    read -p "Do you want to enable required GCP services? (y/n): " ENABLE_SERVICES
    
    if [ "$ENABLE_SERVICES" = "y" ] || [ "$ENABLE_SERVICES" = "Y" ]; then
        print_step "Setting GCP project..."
        gcloud config set project "$PROJECT_ID"
        
        print_step "Enabling GCP services (this may take a few minutes)..."
        
        gcloud services enable cloudfunctions.googleapis.com
        gcloud services enable firestore.googleapis.com
        gcloud services enable firebase.googleapis.com
        gcloud services enable cloudscheduler.googleapis.com
        gcloud services enable cloudbuild.googleapis.com
        gcloud services enable run.googleapis.com
        
        print_success "GCP services enabled"
    fi
else
    print_warning "Skipping GCP service enablement (gcloud CLI not installed)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Step 5: Deploy Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Do you want to deploy Firebase Functions now? (y/n): " DEPLOY_NOW

if [ "$DEPLOY_NOW" = "y" ] || [ "$DEPLOY_NOW" = "Y" ]; then
    print_step "Installing backend dependencies..."
    cd firebase-backend
    npm install
    
    print_step "Building backend..."
    npm run build
    
    print_step "Deploying to Firebase..."
    firebase deploy --only functions
    
    cd ..
    
    print_success "Backend deployed successfully!"
    echo ""
    echo "Your API is now available at:"
    echo "$FUNCTIONS_URL"
else
    print_warning "Skipping deployment. You can deploy later with:"
    echo "  cd firebase-backend && npm run deploy"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Migration Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "  1. Rebuild your mobile app:"
echo "     iOS:     npx react-native run-ios"
echo "     Android: npx react-native run-android"
echo ""
echo "  2. Test the backend health endpoint:"
echo "     curl $FUNCTIONS_URL/health"
echo ""
echo "  3. Deploy Firestore and Database rules:"
echo "     firebase deploy --only firestore:rules,database"
echo ""
echo "For detailed instructions, see: FIREBASE_SETUP_GUIDE.md"
echo ""
