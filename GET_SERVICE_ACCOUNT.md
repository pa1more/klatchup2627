# Get Your Service Account Key (30 seconds)

## Quick Steps:

1. **Open Firebase Console:**
   https://console.firebase.google.com/project/klatchup-pavan2/settings/serviceaccounts/adminsdk

2. **Click "Generate New Private Key"** (big button)

3. **Save the file** to:
   `/Users/pavan/Documents/klatchup/klatchup/firebase-backend/service-account.json`

4. **Run:**
   ```bash
   cd firebase-backend && npm run seed
   ```

That's it! The seed script will automatically find and use it.

## Why You Need It:
- Firebase CLI login = User account (good for deploying functions)
- Service account key = Backend account (needed for scripts to access Firestore)
- They're different types of credentials

It's essentially a "password" for your backend services. It's safe to have it in your project folder.
