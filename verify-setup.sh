#!/bin/bash

# Quick verification script for Firebase setup

echo "🔍 Checking Firebase Setup for klatchup-pavan2..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

errors=0
warnings=0

# Check Android credentials
if [ -f "android/app/google-services.json" ]; then
    project_id=$(grep -o '"project_id": "[^"]*"' android/app/google-services.json | cut -d'"' -f4)
    if [ "$project_id" = "klatchup-pavan2" ]; then
        echo -e "${GREEN}✓${NC} Android credentials (correct project: $project_id)"
    else
        echo -e "${RED}✗${NC} Android credentials (wrong project: $project_id, expected: klatchup-pavan2)"
        ((errors++))
    fi
else
    echo -e "${RED}✗${NC} Android credentials missing: android/app/google-services.json"
    ((errors++))
fi

# Check iOS credentials
if [ -f "ios/klatchup/GoogleService-Info.plist" ]; then
    if grep -q "klatchup-pavan2" ios/klatchup/GoogleService-Info.plist; then
        echo -e "${GREEN}✓${NC} iOS credentials (project: klatchup-pavan2)"
    else
        echo -e "${YELLOW}⚠${NC} iOS credentials exist but may be for different project"
        ((warnings++))
    fi
else
    echo -e "${RED}✗${NC} iOS credentials missing: ios/klatchup/GoogleService-Info.plist"
    ((errors++))
fi

# Check firebase.json
if grep -q "klatchup-pavan2" firebase.json; then
    echo -e "${GREEN}✓${NC} firebase.json configured for klatchup-pavan2"
else
    echo -e "${RED}✗${NC} firebase.json not configured correctly"
    ((errors++))
fi

# Check backend .env
if [ -f "firebase-backend/.env" ]; then
    if grep -q "PROJECT_ID=klatchup-pavan2" firebase-backend/.env; then
        echo -e "${GREEN}✓${NC} Backend .env configured"
    else
        echo -e "${RED}✗${NC} Backend .env not configured correctly"
        ((errors++))
    fi
else
    echo -e "${RED}✗${NC} Backend .env missing"
    ((errors++))
fi

# Check API config
if grep -q "klatchup-pavan2.cloudfunctions.net" src/services/apiConfig.ts; then
    echo -e "${GREEN}✓${NC} API configuration updated"
else
    echo -e "${RED}✗${NC} API configuration not updated"
    ((errors++))
fi

# Check if Firebase CLI is installed
if command -v firebase &> /dev/null; then
    echo -e "${GREEN}✓${NC} Firebase CLI installed"
else
    echo -e "${YELLOW}⚠${NC} Firebase CLI not installed (npm install -g firebase-tools)"
    ((warnings++))
fi

# Check backend dependencies
if [ -d "firebase-backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed (cd firebase-backend && npm install)"
    ((warnings++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Set Firebase project: firebase use klatchup-pavan2"
    echo "  2. Deploy backend: cd firebase-backend && npm run deploy"
    echo "  3. Test app: npx react-native run-ios (or run-android)"
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup complete with $warnings warnings${NC}"
    echo "You can proceed, but address warnings for best results."
else
    echo -e "${RED}❌ Found $errors errors and $warnings warnings${NC}"
    echo "Please fix the errors above before proceeding."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
