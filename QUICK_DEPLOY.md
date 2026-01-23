# 🚀 Quick Deploy to GitHub Pages

## 30-Second Checklist

### 1️⃣ Update Repository Name
Edit `vite.config.js` line 7:
```javascript
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

### 2️⃣ Add GitHub Secrets
Go to: **Settings** → **Secrets and variables** → **Actions**

Add these 7 secrets (copy from your `.env` file):
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### 3️⃣ Enable GitHub Pages
Go to: **Settings** → **Pages** → Set source to **GitHub Actions**

### 4️⃣ Deploy
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 5️⃣ Wait & Access
- Watch **Actions** tab (2-3 minutes)
- Access: `https://USERNAME.github.io/REPO-NAME/`

## ✅ Done!

**Full instructions:** See `DEPLOY_GITHUB_PAGES.md`

## 🆘 Troubleshooting

**Blank page?** → Check repo name in `vite.config.js`
**Firebase error?** → Verify all 7 secrets are added
**Build failed?** → Check Actions tab for errors
**404 errors?** → Clear cache, wait 2 minutes

## 🔄 Update Site

```bash
# Make changes, then:
git add .
git commit -m "Update"
git push
# Auto-deploys in 2-3 minutes!
```
