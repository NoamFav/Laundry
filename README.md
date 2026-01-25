# House Management System

A comprehensive web application for managing a shared household with 14 rooms across 4 floors. Features include laundry management, task rotation, and presence tracking.

## Features

### 🧺 Laundry Room Management
- **Animated Washing Machine & Dryer**: Real-time visual feedback with rotation animations
- **Program Selection**: Multiple wash/dry programs with different durations
- **Queue System**: Add yourself to the queue when machines are busy
- **Auto-completion**: Machines automatically complete when time expires
- **Real-time Status**: See current user and remaining time

### 🏠 3D House Visualization
- Realistic 3D building model with brick walls and slanted roof
- Lit windows showing room occupancy (yellow = home, dark = away)
- Interactive camera controls (rotate, zoom, pan)
- 4 floors with 14 rooms total
- Dormer windows for top floor rooms
- Real-time lighting effects based on presence data

### 📋 Task Management
- **Kitchen Tasks**: Trash, cupboard, and stove cleaning rotation
  - 2 kitchens (lower floors 1-2, upper floors 3-4)
  - Weekly rotation among assigned rooms
- **Shower Cleaning**: Rotation system for 2 showers
- **Toilet Paper Status**: Track and update paper status for 4 toilets
- **Smart Rotation**: Tasks automatically rotate to next room in sequence

### 👥 Presence Tracking
- Mark yourself as home or away
- See who's currently home
- Real-time occupancy statistics
- Floor-by-floor room status

### 🔐 Security
- Room-based authentication with unique codes
- 14 unique access codes (one per room)
- Secure session management with Firebase
- No personal data storage

## Room Codes

Each room has a unique access code:

- **Floor 1**: ALPHA-1001, BETA-1002
- **Floor 2**: GAMMA-2001, DELTA-2002, EPSILON-2003, ZETA-2004, ETA-2005
- **Floor 3**: THETA-3001, IOTA-3002, KAPPA-3003, LAMBDA-3004, MU-3005
- **Floor 4**: NU-4001, XI-4002

## Technology Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Database**: Firebase Realtime Database
- **Authentication**: Room-based codes with Firebase
- **Deployment**: Fly.io with Docker

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Laundry
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Copy your Firebase config
4. Create a `.env` file:

```bash
cp .env.example .env
```

5. Fill in your Firebase credentials in `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Configure Firebase Security Rules

In your Firebase console, set these Realtime Database rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
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

### 5. Run locally

```bash
npm run dev
```

Visit http://localhost:5173

## Deployment to GitHub Pages (Recommended - FREE!)

### Quick Deploy (5 minutes)

1. **Update repository name in `vite.config.js`** if different from "Laundry"
2. **Add GitHub Secrets**: Settings → Secrets → Actions → Add your 7 Firebase secrets
3. **Enable GitHub Pages**: Settings → Pages → Source: "GitHub Actions"
4. **Push to deploy**:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```
5. **Access your site**: `https://USERNAME.github.io/REPO-NAME/`

**📖 Full instructions:** See [DEPLOY_GITHUB_PAGES.md](./DEPLOY_GITHUB_PAGES.md)

**⚡ Quick reference:** See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

### Alternative: Manual Deploy

```bash
npm run deploy
```

This builds and pushes to the `gh-pages` branch automatically.

## Usage

### Login
1. Open the app
2. Enter your room code (e.g., ALPHA-1001)
3. Click "Enter House"

### Using Laundry
1. Navigate to "Laundry" tab
2. Check machine status
3. If idle, click START and select a program
4. If busy, select a program to join the queue
5. When done, click CLEAR to reset

### Managing Tasks
1. Go to "Tasks" tab
2. See your assigned tasks (highlighted in purple)
3. Complete tasks by clicking "Done"
4. Tasks automatically rotate to next room

### Tracking Presence
1. Go to "Presence" tab
2. Toggle your status with the quick button
3. View all rooms and their status
4. See occupancy statistics

## Project Structure

```
src/
├── components/
│   ├── WashingMachine.jsx    # Animated washing machine
│   ├── Dryer.jsx              # Animated dryer
│   ├── House3D.jsx            # 3D house model
│   └── BottomNav.jsx          # Navigation bar
├── pages/
│   ├── Login.jsx              # Login page
│   ├── Dashboard.jsx          # Main dashboard
│   ├── LaundryRoom.jsx        # Laundry management
│   ├── Tasks.jsx              # Task management
│   └── Presence.jsx           # Presence tracking
├── contexts/
│   └── AuthContext.jsx        # Authentication context
├── config/
│   ├── firebase.js            # Firebase configuration
│   ├── roomCodes.js           # Room codes and facilities
│   └── database.js            # Database schema
└── App.jsx                    # Main app component
```

## Mobile Optimization

The app is fully optimized for mobile devices:
- Responsive design with Tailwind CSS
- Touch-friendly buttons and interactions
- Bottom navigation for easy thumb access
- Optimized animations for mobile performance
- Mobile-first design approach

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
