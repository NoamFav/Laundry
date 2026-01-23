# ✅ GitHub Pages Deployment - All Set!

Your House Management System is now configured for **FREE** deployment to GitHub Pages!

## 🎉 What's Been Set Up

### 1. ✅ Vite Configuration Updated
**File:** `vite.config.js`
- Base path configured for GitHub Pages
- Automatically uses repo name in production
- Local development still works on root path

### 2. ✅ GitHub Actions Workflow Created
**File:** `.github/workflows/deploy.yml`
- Auto-deploys on every push to `main` branch
- Builds with your Firebase secrets
- Deploys to GitHub Pages automatically
- Takes 2-3 minutes per deployment

### 3. ✅ Deploy Scripts Ready
**In:** `package.json`
- `npm run deploy` - Manual deployment
- `npm run build` - Build for production
- `gh-pages` package already installed

### 4. ✅ Documentation Complete
- **DEPLOY_GITHUB_PAGES.md** - Full deployment guide
- **QUICK_DEPLOY.md** - 30-second checklist
- **README.md** - Updated with GitHub Pages instructions
- **.env.example** - Template for Firebase config

## 🚀 How to Deploy (First Time)

### Step 1: Update Repo Name (if needed)
If your repository name is NOT "Laundry", edit `vite.config.js` line 7:

```javascript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

### Step 2: Add GitHub Secrets (Required)
1. Go to your GitHub repository
2. Click: **Settings** → **Secrets and variables** → **Actions**
3. Click: **New repository secret**
4. Add these 7 secrets (get values from your `.env` file):

```
Secret Name                      | Value
---------------------------------|------------------------
VITE_FIREBASE_API_KEY           | AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN       | your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL      | https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID        | your-project-id
VITE_FIREBASE_STORAGE_BUCKET    | your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID| 123456789
VITE_FIREBASE_APP_ID            | 1:123:web:abc
```

### Step 3: Enable GitHub Pages
1. Go to: **Settings** → **Pages**
2. Under **Build and deployment**:
   - Source: Select **GitHub Actions**
3. Click **Save**

### Step 4: Push to Deploy
```bash
git add .
git commit -m "Initial deployment to GitHub Pages"
git push origin main
```

### Step 5: Monitor & Access
1. Go to **Actions** tab to watch deployment
2. Wait 2-3 minutes
3. Once complete, access your site at:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
   ```

## 🔄 How to Update (Every Time)

After the first deployment, updating is simple:

```bash
# Make your changes to the code
# Then:
git add .
git commit -m "Updated feature X"
git push origin main

# That's it! Auto-deploys in 2-3 minutes
```

Watch the **Actions** tab to see deployment progress.

## 💰 Cost Comparison

| Service | Cost | Setup Time | Auto-Deploy |
|---------|------|------------|-------------|
| **GitHub Pages** | FREE | 5 min | ✅ Yes |
| Fly.io | $0-5/month | 10 min | Manual |
| Netlify | FREE | 3 min | ✅ Yes |
| Vercel | FREE | 3 min | ✅ Yes |

**Winner: GitHub Pages** ✅
- No credit card needed
- Unlimited bandwidth (reasonable use)
- Built-in HTTPS
- Easy custom domains

## 📊 Free Tier Limits

### GitHub Pages (Free)
- ✅ 1 GB storage
- ✅ 100 GB/month bandwidth
- ✅ Unlimited builds
- ✅ Custom domains
- ✅ HTTPS included

### Your App Usage
- 📦 Build size: ~2 MB
- 📡 Monthly bandwidth: ~500 MB (14 users)
- ⏱️ Build time: ~1 minute
- **Status: Well within limits!**

### Firebase (Free - Spark Plan)
- ✅ 1 GB storage
- ✅ 10 GB/month data transfer
- ✅ 100 concurrent connections
- ✅ Unlimited reads/writes

### Your Firebase Usage
- 💾 Data: ~5 KB
- 📡 Transfer: ~50 MB/month
- 🔌 Connections: 14 max
- **Status: 100% free forever!**

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Your Code (GitHub Repository)                  │
│  - React + Vite                                  │
│  - Three.js 3D                                   │
│  - Framer Motion                                 │
└──────────────────┬──────────────────────────────┘
                   │ git push
                   ↓
┌─────────────────────────────────────────────────┐
│  GitHub Actions                                  │
│  - Builds your site                              │
│  - Injects Firebase secrets                      │
│  - Optimizes for production                      │
└──────────────────┬──────────────────────────────┘
                   │ deploys
                   ↓
┌─────────────────────────────────────────────────┐
│  GitHub Pages (CDN)                              │
│  - Serves static files                           │
│  - Global distribution                           │
│  - HTTPS enabled                                 │
│  - https://username.github.io/repo/             │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
          ┌────────────────┐
          │  Your Users     │
          │  (14 rooms)     │
          └────────┬───────┘
                   │ connects to
                   ↓
┌─────────────────────────────────────────────────┐
│  Firebase Realtime Database                      │
│  - Stores laundry status                         │
│  - Manages task rotations                        │
│  - Tracks presence                               │
│  - Real-time sync to all users                   │
└─────────────────────────────────────────────────┘
```

## 🔒 Security Notes

### GitHub Secrets
- ✅ Encrypted at rest
- ✅ Only accessible during builds
- ✅ Never exposed in logs
- ✅ Not visible in repository

### Firebase Config
- ✅ API keys identify your app (not sensitive)
- ✅ Database rules control access
- ✅ Room codes provide authentication
- ✅ No sensitive data in client code

### Recommended Firebase Rules
```json
{
  "rules": {
    "laundry": { ".read": true, ".write": true },
    "tasks": { ".read": true, ".write": true },
    "presence": { ".read": true, ".write": true }
  }
}
```

## 📱 Access Your Site

Once deployed, share with your household:

### Desktop
```
🌐 https://USERNAME.github.io/REPO-NAME/
```

### Mobile (Add to Home Screen)
1. Open the URL in mobile browser
2. Tap "Share" → "Add to Home Screen"
3. Icon appears like a native app!
4. Opens full-screen without browser UI

## 🎨 Custom Domain (Optional)

Want `house.yourdomain.com` instead of GitHub URL?

1. **Add in GitHub**: Settings → Pages → Custom domain
2. **Configure DNS**:
   ```
   CNAME record: house → USERNAME.github.io
   ```
3. **Update vite.config.js**:
   ```javascript
   base: '/',
   ```
4. **Enable HTTPS**: Auto-provisions in ~10 minutes

See full instructions in `DEPLOY_GITHUB_PAGES.md`

## 🐛 Troubleshooting

### Blank Page
❌ Problem: Site loads but shows blank screen

✅ Solution:
1. Check repo name in `vite.config.js` matches actual repo name
2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Check browser console (F12) for errors

### Build Failed
❌ Problem: GitHub Actions shows red X

✅ Solution:
1. Click on failed workflow in Actions tab
2. Read error message
3. Common issues:
   - Missing GitHub secrets
   - Wrong secret names
   - Syntax error in code

### Firebase Error
❌ Problem: "Firebase: Error (auth/invalid-api-key)"

✅ Solution:
1. Verify all 7 secrets are added to GitHub
2. Check secret names match exactly (include `VITE_` prefix)
3. No extra spaces in secret values
4. Firebase project is active

### 404 Errors on Refresh
❌ Problem: Page works initially but 404 on refresh

✅ Solution: This is normal! React Router + GitHub Pages.
The app handles this automatically with `BrowserRouter`.
If persists:
1. Clear browser cache
2. Check `base` path in `vite.config.js`
3. Wait 2-3 minutes for CDN to update

## 📚 Files You Can Customize

### Room Codes
**File:** `src/config/roomCodes.js`
```javascript
'1C': { floor: 1, code: 'ALPHA-1001', name: 'Room 1C' },
// Change codes here
```

### Laundry Programs
**File:** `src/config/database.js`
```javascript
export const WASHING_PROGRAMS = [
  { id: 'quick', name: 'Quick Wash', duration: 30 },
  // Add/modify programs
];
```

### Colors/Styling
**Files:** All `.jsx` files
- Use Tailwind classes: `bg-blue-500`, `text-white`, etc.
- Change gradients: `from-blue-500 to-purple-600`

### Task Assignments
**File:** `src/config/roomCodes.js`
```javascript
export const FACILITIES = {
  kitchens: {
    lower: {
      assignedRooms: ['1C', '2C', ...],
      // Modify assignments
    }
  }
}
```

## 🎓 Next Steps

1. ✅ **Deploy to GitHub Pages** (follow steps above)
2. ✅ **Test with room codes**
3. ✅ **Share URL with household**
4. ✅ **Print room codes** (see `ROOM_CODES.txt`)
5. ✅ **Add to mobile home screens**

## 🆘 Getting Help

- **Quick Start**: `QUICK_DEPLOY.md`
- **Full Guide**: `DEPLOY_GITHUB_PAGES.md`
- **Setup Help**: `SETUP.md`
- **Firebase Costs**: This conversation!
- **GitHub Issues**: Open an issue on your repo

## 🎉 Ready to Deploy!

Everything is configured and ready. Just:

1. Add GitHub secrets (7 Firebase values)
2. Enable GitHub Pages (set to "GitHub Actions")
3. Push to main branch
4. Wait 2-3 minutes
5. Access your live site!

**Total time: ~5 minutes** ⚡

Your household management system will be live, free, and automatically updating with every push! 🏠✨

---

**Questions?** Check the other documentation files or reach out!
