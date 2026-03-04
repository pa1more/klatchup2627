#!/bin/bash

# GCP Deployment Script for Klatchup
# Deploys backend to Google Cloud Run

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "☁️  Klatchup GCP Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() { echo -e "${BLUE}▶${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "Google Cloud CLI not found"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

print_success "Google Cloud CLI is installed"

# Get project configuration
echo ""
read -p "Enter your GCP Project ID: " PROJECT_ID
read -p "Enter deployment region [us-central1]: " REGION
REGION=${REGION:-us-central1}

SERVICE_NAME="klatchup-api"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo ""
print_step "Setting GCP project..."
gcloud config set project "$PROJECT_ID"

print_step "Enabling required GCP services..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🐳 Building Container"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Dockerfile exists
if [ ! -f "firebase-backend/Dockerfile" ]; then
    print_warning "Dockerfile not found. Creating one..."
    
    cat > firebase-backend/Dockerfile << 'EOF'
# Use Node.js 18 base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Expose port 8080 (Cloud Run default)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "lib/index.js"]
EOF
    
    print_success "Dockerfile created"
fi

# Check if .dockerignore exists
if [ ! -f "firebase-backend/.dockerignore" ]; then
    cat > firebase-backend/.dockerignore << 'EOF'
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.*
*.md
.DS_Store
lib/
serviceAccountKey.json
EOF
    print_success ".dockerignore created"
fi

# Build using Cloud Build
print_step "Building container image with Cloud Build..."
cd firebase-backend
gcloud builds submit --tag "$IMAGE_NAME"
cd ..

print_success "Container built successfully"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Deploying to Cloud Run"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Memory allocation [512Mi]: " MEMORY
MEMORY=${MEMORY:-512Mi}

read -p "Max instances [10]: " MAX_INSTANCES
MAX_INSTANCES=${MAX_INSTANCES:-10}

read -p "Allow unauthenticated access? (y/n) [y]: " ALLOW_UNAUTH
ALLOW_UNAUTH=${ALLOW_UNAUTH:-y}

AUTH_FLAG=""
if [ "$ALLOW_UNAUTH" = "y" ] || [ "$ALLOW_UNAUTH" = "Y" ]; then
    AUTH_FLAG="--allow-unauthenticated"
else
    AUTH_FLAG="--no-allow-unauthenticated"
fi

print_step "Deploying to Cloud Run..."

gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_NAME" \
  --platform managed \
  --region "$REGION" \
  $AUTH_FLAG \
  --set-env-vars "FIREBASE_PROJECT_ID=$PROJECT_ID" \
  --set-env-vars "NODE_ENV=production" \
  --memory "$MEMORY" \
  --timeout 60s \
  --min-instances 0 \
  --max-instances "$MAX_INSTANCES"

print_success "Deployment complete!"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --platform managed \
  --region "$REGION" \
  --format 'value(status.url)')

echo "Service Name: $SERVICE_NAME"
echo "Region: $REGION"
echo "URL: $SERVICE_URL"
echo ""

print_step "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$SERVICE_URL/health" || echo "Failed")

if [[ "$HEALTH_RESPONSE" == *"OK"* ]]; then
    print_success "Health check passed!"
    echo "$HEALTH_RESPONSE"
else
    print_warning "Health check failed or service not ready yet"
    echo "Response: $HEALTH_RESPONSE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Next Steps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Update mobile app configuration:"
echo "   Edit src/services/apiConfig.ts"
echo "   Set baseURL to: $SERVICE_URL"
echo ""
echo "2. View logs:"
echo "   gcloud run services logs read $SERVICE_NAME --region=$REGION"
echo ""
echo "3. View service details:"
echo "   gcloud run services describe $SERVICE_NAME --region=$REGION"
echo ""
echo "4. Update service:"
echo "   ./deploy-gcp.sh  (run this script again)"
echo ""
