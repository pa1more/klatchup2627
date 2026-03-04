#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔐 Setting up Firebase Credentials...${NC}\n"

# Step 1: Check Firebase CLI authentication
echo "Step 1: Checking Firebase CLI authentication..."
if firebase projects:list > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Firebase CLI is authenticated${NC}\n"
else
    echo -e "${RED}❌ Firebase CLI not authenticated${NC}"
    echo "Please run: firebase login"
    exit 1
fi

# Step 2: Generate service account key from Firebase
echo "Step 2: To properly seed users, we need a service account key."
echo "Please follow these steps:"
echo ""
echo "1. Go to Firebase Console:"
echo "   https://console.firebase.google.com/project/klatchup-pavan2/settings/serviceaccounts/adminsdk"
echo ""
echo "2. Under 'Service Accounts' tab, click 'Generate New Private Key'"
echo ""
echo "3. Save the downloaded JSON file as: firebase-backend/service-account.json"
echo ""
echo "4. Then run: npm run seed"
echo ""
echo -e "${YELLOW}Or use the manual import method:${NC}"
echo ""
echo "1. Go to Firebase Console Firestore:"
echo "   https://console.firebase.google.com/project/klatchup-pavan2/firestore/data"
echo ""
echo "2. Click 'Start Collection' and create collection named: profiles"
echo ""
echo "3. Go to Import/Export and import: seed-data/firestore-export.json"
echo ""
echo -e "${GREEN}For now, you can test the app with one user (manual login)${NC}"
