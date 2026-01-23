# Quick Setup Guide

## Step 1: Firebase Setup (5 minutes)

### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Name it "House Management" (or your preferred name)
4. Disable Google Analytics (not needed)
5. Click "Create Project"

### Enable Realtime Database
1. In Firebase Console, go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose location (closest to you)
4. Start in **Test mode** for now
5. Click "Enable"

### Get Your Firebase Config
1. Click the gear icon ⚙️ → "Project Settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app with name "House Management Web"
5. Copy the config object

### Update Security Rules
1. In Realtime Database, go to "Rules" tab
2. Replace with:

```json
{
  "rules": {
    "laundry": {
      ".read": true,
      ".write": true
    },
    "tasks": {
      ".read": true,
      ".write": true
    },
    "presence": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Click "Publish"

## Step 2: Local Configuration

### Create .env file
```bash
cp .env.example .env
```

### Edit .env with your Firebase config
Open `.env` and paste your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 3: Install and Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Step 4: Test Login

Use any room code to test:
- `ALPHA-1001` (Room 1C, Floor 1)
- `BETA-1002` (Room 2C, Floor 1)
- `GAMMA-2001` (Room 3C, Floor 2)
- etc.

## Step 5: Deploy to Fly.io (Optional)

### Install Fly CLI
```bash
# macOS
brew install flyctl

# Or using install script
curl -L https://fly.io/install.sh | sh
```

### Login
```bash
fly auth login
```

### Set Secrets
```bash
fly secrets set VITE_FIREBASE_API_KEY="your_api_key"
fly secrets set VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
fly secrets set VITE_FIREBASE_DATABASE_URL="https://your_project-default-rtdb.firebaseio.com"
fly secrets set VITE_FIREBASE_PROJECT_ID="your_project"
fly secrets set VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
fly secrets set VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
fly secrets set VITE_FIREBASE_APP_ID="your_app_id"
```

### Deploy
```bash
fly launch
# Follow prompts, choose your region
# Say YES when asked to deploy

# For subsequent deployments:
fly deploy
```

## Troubleshooting

### "Failed to load module"
- Make sure you ran `npm install`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Firebase connection errors
- Check your `.env` file has correct credentials
- Verify Firebase Realtime Database is enabled
- Check database rules are published

### Build errors
- Make sure you have Node.js 18+ installed
- Run `npm run build` to see detailed errors

### 3D house not rendering
- Check browser console for errors
- Try refreshing the page
- Some older browsers may not support WebGL (required for Three.js)

## Customization

### Change Room Codes
Edit `src/config/roomCodes.js` - update the `code` field for each room

### Modify Task Facilities
Edit `src/config/roomCodes.js` - update the `FACILITIES` object

### Change Laundry Programs
Edit `src/config/database.js` - modify `WASHING_PROGRAMS` and `DRYER_PROGRAMS`

### Adjust Colors/Styling
All styling is in Tailwind CSS - edit component files to change colors

## Security Notes

⚠️ **IMPORTANT**: The current Firebase rules allow public read/write access. This is fine for a trusted household, but for production use, you should:

1. Implement proper authentication
2. Restrict database rules to authenticated users only
3. Add rate limiting
4. Consider using Firebase Authentication instead of simple room codes

## Need Help?

- Check the main README.md for detailed documentation
- Open an issue on GitHub
- Check Firebase docs: https://firebase.google.com/docs

## Room Codes Reference

Print this out for your household:

```
Floor 1:
- Room 1C: ALPHA-1001
- Room 2C: BETA-1002

Floor 2:
- Room 3C: GAMMA-2001
- Room 4C: DELTA-2002
- Room 5C: EPSILON-2003
- Room 6C: ZETA-2004
- Room 7C: ETA-2005

Floor 3:
- Room 8C: THETA-3001
- Room 9C: IOTA-3002
- Room 10C: KAPPA-3003
- Room 11C: LAMBDA-3004
- Room 12C: MU-3005

Floor 4:
- Room 13C: NU-4001
- Room 14C: XI-4002
```
