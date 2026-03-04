#!/bin/bash
# Complete app setup and run script

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║      Klatchup Android Dev - Complete Setup            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

PROJECT_DIR="/Users/pavan/Documents/klatchup/klatchup"
cd "$PROJECT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Cleaning up old processes${NC}"
echo "================================"
adb kill-server || true
lsof -i :8081 | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
pkill -f "react-native start" || true
pkill -f "metro" || true
sleep 2
echo "✓ Old processes cleaned"
echo ""

echo -e "${BLUE}Step 2: Starting ADB server${NC}"
echo "================================"
adb start-server
sleep 2
echo "✓ ADB server started"
echo ""

echo -e "${BLUE}Step 3: Checking device connection${NC}"
echo "================================"
DEVICE_COUNT=$(adb devices | grep -v "List of" | grep -v "^$" | grep -v "daemon" | wc -l)
if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo "❌ No devices found!"
    echo "Please:"
    echo "  1. Connect Android device via USB"
    echo "  2. Enable USB debugging in Settings → Developer options"
    echo "  3. Trust this computer on the device"
    exit 1
fi
DEVICE=$(adb devices | grep -v "List of" | grep -v "^$" | grep -v "daemon" | awk '{print $1}' | head -1)
echo "✓ Device found: $DEVICE"
echo ""

echo -e "${BLUE}Step 4: Setting up USB reverse proxy${NC}"
echo "================================"
adb reverse tcp:8081 tcp:8081
echo "✓ USB reverse proxy configured"
echo ""

echo -e "${BLUE}Step 5: Verifying backend${NC}"
echo "================================"
BACKEND_STATUS=$(curl -s https://api-zajzlo33xa-uc.a.run.app/health | grep -o '"status":"OK"' || echo "")
if [ -z "$BACKEND_STATUS" ]; then
    echo "⚠️  Backend may be slow, but will retry..."
else
    echo "✓ Backend is healthy"
fi
echo ""

echo -e "${BLUE}Step 6: Starting Metro Bundler${NC}"
echo "================================"
echo ""
echo "🚀 Metro is starting on port 8081..."
echo ""
echo "Controls:"
echo "  - Press 'r' to reload app"
echo "  - Press 'i' for iOS simulator"  
echo "  - Press 'a' for Android"
echo "  - Press 'q' to quit"
echo ""
echo "Device will auto-load. If not:"
echo "  1. Double-tap 'R' on device"
echo "  2. Or shake device and select 'Reload'"
echo ""
echo "════════════════════════════════════════════════════════"
echo ""

# Start Metro with environment setup
unset GEM_HOME
unset GEM_PATH
export NODE_ENV=development

node node_modules/metro/src/cli.js serve \
  --port 8081 \
  --max-workers=4 \
  --timeout=120000 \
  --reset-cache
