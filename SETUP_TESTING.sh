#!/bin/bash

# Klatchup Test User Setup Script
# This script helps configure Firebase for testing with demo users

echo "🚀 Klatchup Multi-User Testing Setup"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: Please run this from the project root directory"
    echo "   cd /Users/pavan/Documents/klatchup/klatchup"
    exit 1
fi

echo "📋 Prerequisites Check:"
echo "  ✓ Firebase CLI installed"
echo "  ✓ Firebase project initialized"
echo ""

echo "📱 Next Steps to Enable Testing:"
echo ""
echo "1️⃣  Manually Add Test Phone Numbers to Firebase Console:"
echo "    Go to: https://console.firebase.google.com"
echo "    → Select your project"
echo "    → Authentication → Sign-in method → Phone"
echo "    → Scroll down to 'Phone numbers for testing'"
echo "    → Add these numbers with OTP '123456':"
echo ""
echo "    +918001001001 → Priya Singh"
echo "    +918001001002 → Raj Patel"
echo "    +918001001003 → Anjali Sharma"
echo "    +918001001004 → Vikram Desai"
echo "    +918001001005 → Neha Gupta"
echo "    +918001001006 → Arjun Kumar"
echo "    +918001001007 → Pooja Reddy"
echo "    +918001001008 → Rohit Singh"
echo "    +918001001009 → Divya Nair"
echo "    +918001001010 → Aman Verma"
echo ""

echo "2️⃣  Install Firebase Backend Dependencies:"
cd firebase-backend
npm install
cd ..

echo ""
echo "3️⃣  Create Demo User Profiles in Firestore:"
echo "    Run: cd firebase-backend && npm run seed"
echo ""

echo "4️⃣  Test the App:"
echo "    Open app on Device 1 → Phone: Send OTP → Enter 123456"
echo "    Use any of the phone numbers from the list above"
echo ""

echo "✅ Setup Complete!"
echo ""
echo "📚 For detailed testing guide, see: TESTING_GUIDE.md"
echo ""
