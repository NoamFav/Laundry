# Deploy to GitHub Pages - Complete Guide

This guide will help you deploy your House Management System to GitHub Pages for **FREE**!

## 🎯 Why GitHub Pages?

- ✅ **100% Free** - No credit card needed
- ✅ **Automatic Deployments** - Push to main branch = auto-deploy
- ✅ **Custom Domain Support** - Use your own domain (optional)
- ✅ **HTTPS Enabled** - Secure by default
- ✅ **Fast CDN** - GitHub's global network
- ✅ **Unlimited Bandwidth** - For reasonable use

## 📋 Prerequisites

1. ✅ GitHub account (free)
2. ✅ Firebase project set up
3. ✅ Repository pushed to GitHub

## 🚀 Deployment Steps

### Step 1: Update Repository Name in Config

Edit `vite.config.js` if your repository name is different from "Laundry":

```javascript
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

For example, if your repo is `github.com/username/house-manager`, change to:
```javascript
base: process.env.NODE_ENV === 'production' ? '/house-manager/' : '/',
```

### Step 2: Set Up GitHub Secrets

Your Firebase credentials need to be stored as GitHub secrets for security.

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these 7 secrets one by one:

| Secret Name | Value (from your .env file) |
|-------------|------------------------------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain |
| `VITE_FIREBASE_DATABASE_URL` | Your Firebase database URL |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Your Firebase app ID |

**Example:**
```
Name: VITE_FIREBASE_API_KEY
Value: AIzaSyBxxx...xxx
```

### Step 3: Enable GitHub Pages

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select:
   - Source: **GitHub Actions**
3. Click **Save**

That's it! GitHub Actions is now configured.

### Step 4: Push to Deploy

Every time you push to the `main` branch, your site will automatically deploy:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Step 5: Wait for Deployment

1. Go to **Actions** tab in your repository
2. Watch the deployment workflow run (takes ~2-3 minutes)
3. Once complete, your site will be live! 🎉

### Step 6: Access Your Site

Your site will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example:
```
https://johndoe.github.io/Laundry/
```

## 🔄 Manual Deployment (Alternative)

If you prefer manual deployment without GitHub Actions:

```bash
# Build and deploy manually
npm run deploy
```

This will:
1. Build your site (`npm run build`)
2. Push to `gh-pages` branch
3. GitHub automatically serves from that branch

**Note:** For this method, in GitHub Settings → Pages, set:
- Source: **Deploy from a branch**
- Branch: **gh-pages** / **root**

## 🔧 Troubleshooting

### Issue: Site shows 404 errors on refresh

**Solution:** GitHub Pages serves from a subfolder. The app uses React Router which is configured correctly with `BrowserRouter`. If you still have issues:

1. Make sure `base` in `vite.config.js` matches your repo name
2. Clear your browser cache
3. Wait a few minutes for GitHub's CDN to update

### Issue: Blank page or "Failed to load module"

**Solution:** Check that:
1. Repository name in `vite.config.js` base path is correct
2. All GitHub secrets are set correctly
3. Build completed successfully in Actions tab

### Issue: Firebase connection error

**Solution:** Verify:
1. All 7 Firebase secrets are added to GitHub
2. Secret names match exactly (including `VITE_` prefix)
3. No extra spaces in secret values
4. Firebase database rules allow public read/write

### Issue: Workflow fails

**Solution:**
1. Check the Actions tab for error messages
2. Ensure `package-lock.json` is committed
3. Verify all dependencies are in `package.json`
4. Re-run the workflow

### Issue: Changes not showing

**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Check Actions tab to ensure deployment completed
3. Wait 1-2 minutes for CDN cache to clear
4. Clear browser cache completely

## 🌐 Custom Domain (Optional)

Want to use your own domain like `house.yourdomain.com`?

### Step 1: Add Custom Domain in GitHub

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter: `house.yourdomain.com`
3. Click **Save**
4. Wait for DNS check to complete

### Step 2: Configure DNS

Add these DNS records at your domain provider:

**For subdomain (house.yourdomain.com):**
```
Type: CNAME
Name: house
Value: YOUR-USERNAME.github.io
```

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

### Step 3: Update Vite Config

Change `vite.config.js`:
```javascript
base: '/',  // Use root path for custom domain
```

### Step 4: Enable HTTPS

1. In GitHub Pages settings
2. Check **Enforce HTTPS**
3. Wait for certificate to provision (~10 minutes)

## 📊 Deployment Workflow Explained

The GitHub Actions workflow (`.github/workflows/deploy.yml`) does:

1. **Checkout code** - Gets your latest code
2. **Setup Node.js** - Installs Node 20
3. **Install dependencies** - Runs `npm ci`
4. **Build site** - Runs `npm run build` with Firebase secrets
5. **Upload artifact** - Prepares built files
6. **Deploy** - Publishes to GitHub Pages

## 🔒 Security Notes

### Why Secrets Are Safe

- ✅ GitHub secrets are encrypted
- ✅ Only visible to GitHub Actions
- ✅ Never exposed in logs
- ✅ Not visible in code or commits

### Firebase Security

Your Firebase credentials are in the built JavaScript (client-side), which is normal and safe because:

1. Firebase has security rules to control access
2. API keys are meant to identify your app, not authenticate users
3. Room codes provide your actual authentication
4. Database rules should be configured properly

**Recommended Firebase Rules:**
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

## 📈 Usage Limits

### GitHub Pages Limits (Free)

- ✅ **Storage**: 1 GB
- ✅ **Bandwidth**: 100 GB/month
- ✅ **Build time**: 10 minutes per build
- ✅ **Deployments**: Unlimited

**Your app:**
- Build size: ~2 MB
- Monthly bandwidth (14 users): ~500 MB
- Build time: ~1 minute
- **Status: Well within limits! ✅**

### What If You Exceed Limits?

Very unlikely with 14 users, but if you do:
- GitHub sends a warning email
- Site may be temporarily throttled
- No charges (free tier has hard limits)
- Consider upgrading to GitHub Pro ($4/month for higher limits)

## 🎨 Customization After Deployment

After deploying, you can:

1. **Change room codes**: Edit `src/config/roomCodes.js` and push
2. **Modify colors**: Edit Tailwind classes and push
3. **Add features**: Code, commit, push - auto-deploys!
4. **Update Firebase**: Changes reflect immediately (no redeploy needed)

## 📝 Deployment Checklist

Before deploying:

- [ ] Firebase project created and configured
- [ ] All 7 Firebase secrets added to GitHub
- [ ] Repository name in `vite.config.js` is correct
- [ ] GitHub Pages source set to "GitHub Actions"
- [ ] Code pushed to `main` branch
- [ ] Workflow completed successfully in Actions tab
- [ ] Site accessible at GitHub Pages URL
- [ ] Tested login with room code
- [ ] All features working (laundry, tasks, presence)
- [ ] Mobile responsiveness verified

## 🆘 Getting Help

1. **Check Actions tab** for build errors
2. **Check browser console** (F12) for runtime errors
3. **Verify Firebase console** for database connection
4. **Review this guide** for missed steps

Common mistakes:
- ❌ Forgot to add GitHub secrets
- ❌ Repository name doesn't match `vite.config.js`
- ❌ Firebase rules not set correctly
- ❌ Didn't enable GitHub Pages in settings

## 🎉 Success!

Once deployed, share your site URL with your household:

```
🏠 House Management System
🔗 https://your-username.github.io/your-repo/

Room Codes:
Floor 1: ALPHA-1001, BETA-1002
Floor 2: GAMMA-2001, DELTA-2002, ...
(See ROOM_CODES.txt for full list)
```

Your house management system is now live, free, and automatically deploying! 🎊

## 🔄 Future Updates

To update your site:

```bash
# Make changes to code
git add .
git commit -m "Add new feature"
git push origin main

# GitHub automatically builds and deploys!
# Check Actions tab for progress
# Live in 2-3 minutes
```

---

**Questions?** Check README.md or open an issue on GitHub!
