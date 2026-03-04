#!/bin/bash
# Start Metro bundler with proper configuration

echo "🚀 Starting Metro Bundler..."
echo "================================"

# Kill any existing Metro processes
echo "Cleaning up old processes..."
lsof -i :8081 | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 2

# Kill any npm/node processes that might be hanging
pkill -f "react-native start" || true
pkill -f "metro" || true
pkill -f "npm start" || true
sleep 2

cd /Users/pavan/Documents/klatchup/klatchup

# Set proper environment
unset GEM_HOME
unset GEM_PATH
export NODE_ENV=development
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$PATH

# Update ADB forward
adb kill-server || true
sleep 1
adb start-server || true
sleep 2

# Setup USB reverse proxy
echo "Setting up USB connection..."
adb reverse tcp:8081 tcp:8081 2>/dev/null
adb devices

echo ""
echo "Starting Metro on port 8081..."
echo "================================"
echo ""

# Start Metro with watch mode
node node_modules/metro/src/cli.js serve \
  --port 8081 \
  --max-workers=4 \
  --timeout=120000 \
  --reset-cache 2>&1

echo ""
echo "Metro is running! Press Ctrl+R on device to reload."
echo "Or type 'r' here to reload the app."
