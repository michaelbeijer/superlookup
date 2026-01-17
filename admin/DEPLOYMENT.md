# Beijerterm Admin Panel - Deployment Guide

This guide walks you through deploying the Beijerterm admin panel online using Railway, Render, or similar platforms.

## 📋 Prerequisites

1. GitHub account (owner: michaelbeijer)
2. Hosting platform account (Railway/Render/Fly.io)
3. Access to repository settings

---

## 🔐 Step 1: Create GitHub OAuth App

The admin panel uses GitHub OAuth for authentication.

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the form:
   - **Application name**: `Beijerterm Admin Panel`
   - **Homepage URL**: `https://beijerterm.com`
   - **Authorization callback URL**: `https://admin.beijerterm.com/auth/github/callback`
     (Replace with your actual admin panel URL)
   - **Application description**: Admin panel for managing Beijerterm glossaries and terms
4. Click **"Register application"**
5. **Save these values** (you'll need them later):
   - **Client ID**: `Ov...` (starts with "Ov")
   - **Client Secret**: Click "Generate a new client secret" and save it

---

## 🚀 Step 2A: Deploy to Railway (Recommended)

Railway is the easiest option with automatic GitHub deployments.

### 2A.1: Create New Project

1. Go to [Railway.app](https://railway.app/)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **michaelbeijer/beijerterm**
6. Railway will detect the Python app automatically

### 2A.2: Configure Root Directory

Railway needs to know the app is in the `admin/` subfolder:

1. Go to project **Settings**
2. Find **"Root Directory"** or **"Build Settings"**
3. Set **Root Directory** to: `admin`
4. Click **"Save"**

### 2A.3: Set Environment Variables

Go to project **Variables** tab and add:

```
FLASK_SECRET_KEY=<generate a random 32-character string>
GITHUB_CLIENT_ID=<your OAuth app Client ID>
GITHUB_CLIENT_SECRET=<your OAuth app Client Secret>
ALLOWED_GITHUB_USERS=michaelbeijer
PRODUCTION=true
CALLBACK_URL=https://beijerterm-admin.up.railway.app/auth/github/callback
```

**Generate FLASK_SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 2A.4: Deploy

1. Railway will automatically deploy after you save variables
2. Get your app URL from the **Deployments** tab (e.g., `beijerterm-admin.up.railway.app`)
3. **Update GitHub OAuth callback URL** with this domain

### 2A.5: Set Up Custom Domain (Optional)

1. In Railway project, go to **Settings** → **Domains**
2. Click **"Generate Domain"** or **"Custom Domain"**
3. If using custom domain (`admin.beijerterm.com`):
   - Add CNAME record in your DNS: `admin.beijerterm.com` → Railway domain
   - Wait for DNS propagation (~5-60 minutes)
   - Update `CALLBACK_URL` environment variable with new domain

---

## 🚀 Step 2B: Deploy to Render (Alternative)

Render is another easy option with similar features to Railway.

### 2B.1: Create New Web Service

1. Go to [Render.com](https://render.com/)
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub account and select **michaelbeijer/beijerterm**

### 2B.2: Configure Service

Fill in the form:
- **Name**: `beijerterm-admin`
- **Root Directory**: `admin`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Instance Type**: Free (or paid for better performance)

### 2B.3: Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
FLASK_SECRET_KEY=<generate a random string>
GITHUB_CLIENT_ID=<your OAuth app Client ID>
GITHUB_CLIENT_SECRET=<your OAuth app Client Secret>
ALLOWED_GITHUB_USERS=michaelbeijer
PRODUCTION=true
CALLBACK_URL=https://beijerterm-admin.onrender.com/auth/github/callback
```

### 2B.4: Deploy

1. Click **"Create Web Service"**
2. Render will build and deploy automatically
3. Get your app URL (e.g., `beijerterm-admin.onrender.com`)
4. **Update GitHub OAuth callback URL** with this domain

---

## 🌐 Step 3: Update Beijerterm.com Link

The admin link is already added to the site header! Just rebuild and deploy:

```bash
cd c:\Dev\Supervertaler\beijerterm
python scripts\build_site.py
```

The link will appear in the header: **Admin** (with a + icon)

Then commit and push:

```bash
git add _site/
git commit -m "feat: Add Admin link to site header"
git push origin main
```

GitHub Pages will automatically deploy the updated site.

---

## ✅ Step 4: Test Your Deployment

1. Visit your admin panel URL (e.g., `https://admin.beijerterm.com`)
2. Click **"Login with GitHub"**
3. Authorize the OAuth app
4. You should be redirected to the admin dashboard!

### Troubleshooting

**"Error getting access token"**
- Double-check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- Make sure `CALLBACK_URL` matches your OAuth app settings exactly

**"User not authorized"**
- Make sure `ALLOWED_GITHUB_USERS` includes your GitHub username
- Username is case-sensitive!

**"Internal Server Error"**
- Check deployment logs in Railway/Render
- Make sure all environment variables are set
- Verify `PRODUCTION=true` is set

---

## 🔒 Security Notes

- **Never commit** `.env` files with secrets to GitHub
- OAuth tokens are stored in encrypted sessions
- Only users in `ALLOWED_GITHUB_USERS` can access the admin panel
- Git commit/push operations use the authenticated user's token

---

## 🔄 Updating the Admin Panel

Changes you push to GitHub will automatically trigger redeployment on Railway/Render.

1. Edit files in `beijerterm/admin/`
2. Commit and push to GitHub
3. Platform detects changes and redeploys automatically
4. Usually takes 1-3 minutes

---

## 💡 Tips

- **Use Railway for development**: Free tier includes 500 hours/month
- **Use Render for production**: Better uptime guarantees with paid plans
- **Custom domain**: Looks more professional (`admin.beijerterm.com` vs `admin.up.railway.app`)
- **Monitor logs**: Both platforms provide real-time logs for debugging

---

## 📚 Next Steps

Once deployed, you can:
- ✏️ Edit glossaries, terms, and resources from anywhere
- 🚀 Commit and push directly from the web UI
- 📱 Use on mobile devices (responsive design)
- 👥 Add more authorized users to `ALLOWED_GITHUB_USERS`

Enjoy your online admin panel! 🎉
