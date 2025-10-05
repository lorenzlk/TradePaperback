# 🚀 Vercel Deployment Guide

Quick guide to deploy your UPC Scanner to Vercel.

---

## ⚡ Quick Deploy (5 minutes)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - UPC Scanner"
   git remote add origin https://github.com/loganlorenz/TradePaperback.git
   git push -u origin main
   ```

2. **Go to [Vercel](https://vercel.com)**
   - Sign in with GitHub
   - Click **"Add New Project"**
   - Import your **TradePaperback** repository

3. **Configure Project**:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
   - **Install Command:** (leave empty)

4. **Deploy**
   - Click **"Deploy"**
   - Wait ~30 seconds
   - Your scanner is live! 🎉

5. **Get Your URL**
   - Vercel provides: `https://your-project.vercel.app`
   - Copy and test on your mobile device

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
cd /Users/loganlorenz/TradePaperback
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - What's your project's name? tradepaperback-scanner
# - In which directory is your code located? ./
# - Want to override settings? No

# For production deployment:
vercel --prod
```

---

## ✅ Post-Deployment Checklist

After deployment:

1. **Test the Scanner**
   - [ ] Open URL on mobile device
   - [ ] Camera permission request appears
   - [ ] Camera launches successfully
   - [ ] Scan a barcode
   - [ ] Success animation appears
   - [ ] Check Google Sheet for new row

2. **Verify HTTPS**
   - [ ] URL starts with `https://`
   - [ ] No security warnings
   - [ ] Camera works (requires HTTPS)

3. **Test Cross-Browser**
   - [ ] iOS Safari works
   - [ ] Android Chrome works

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Enter your domain (e.g., `upcscan.app`)
4. Follow DNS configuration instructions
5. Vercel auto-provisions SSL certificate

### DNS Configuration

**For root domain (upcscan.app):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🔧 Configuration

### Environment Variables (Optional)

If you want to use different configs per environment:

1. In Vercel Dashboard → **Settings** → **Environment Variables**
2. Add variables:
   - `WEBHOOK_URL` (if you want to override config.js)
   - `DEBUG_MODE` (true/false)

3. Update `config.js` to read from environment:
   ```javascript
   const CONFIG = {
     WEBHOOK_URL: process.env.WEBHOOK_URL || 'https://...',
     // ...
   };
   ```

---

## 📊 Monitoring & Analytics

### View Deployment Logs

1. Vercel Dashboard → Your Project
2. Click **"Deployments"**
3. Select latest deployment
4. View **"Build Logs"** and **"Function Logs"**

### Add Analytics (Optional)

Vercel provides free analytics:
1. Go to **"Analytics"** tab
2. View page views, unique visitors, top pages
3. No code changes needed

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update scanner UI"
git push

# Vercel automatically:
# 1. Detects the push
# 2. Builds your project
# 3. Deploys to production
# 4. Updates your live URL
```

**Preview Deployments:**
- Every branch gets a unique preview URL
- Pull requests get automatic preview deployments
- Test changes before merging to main

---

## 💰 Cost

**Vercel Free Tier (Hobby):**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant rollbacks
- ✅ Custom domains

**For This Project:**
- Should easily fit within free tier
- No backend compute needed (static site)
- Very low bandwidth usage

**If you need more:**
- Pro plan: $20/month (100x the limits)

---

## 🐛 Troubleshooting

### Deployment Fails

**Check:**
- Is your repository public or Vercel authorized?
- Are there any `.vercelignore` conflicts?
- Check build logs for errors

### Camera Not Working

**Ensure:**
- URL uses HTTPS (Vercel does this automatically)
- Browser permissions are granted
- Not viewing in iframe

### Files Not Found

**Verify:**
- Files are in repository root
- Not excluded in `.vercelignore`
- Correct file paths in HTML

---

## 🎯 Vercel vs Other Options

| Feature | Vercel | Netlify | Railway | GitHub Pages |
|---------|--------|---------|---------|--------------|
| **Setup Time** | 2 min | 2 min | 5 min | 3 min |
| **Auto HTTPS** | ✅ | ✅ | ✅ | ✅ |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Paid | ✅ Free |
| **Build Time** | ~10s | ~10s | ~30s | ~30s |
| **Bandwidth** | 100GB | 100GB | 100GB | Unlimited |
| **Cost** | Free | Free | ~$1/mo | Free |
| **Best For** | Next.js, Static | Static, Jamstack | Full-stack | Simple sites |

---

## 📱 Testing Your Live Scanner

Once deployed, test with these UPCs:

| Barcode | Product | Notes |
|---------|---------|-------|
| 012345678905 | Test UPC | Standard test code |
| 078000001907 | Coca-Cola | Real product |
| 885909950805 | Apple AirPods | Real product |
| 042100005264 | Ritz Crackers | Real product |

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Domain Configuration](https://vercel.com/docs/concepts/projects/domains)

---

## 🎉 After Successful Deployment

1. **Share your URL** with team/testers
2. **Test on multiple devices**
3. **Monitor Google Sheet** for incoming scans
4. **Check Pipedream logs** for any errors
5. **Gather feedback** and iterate

---

**Deployment Platform:** Vercel  
**Status:** Ready to Deploy  
**Last Updated:** October 5, 2025

