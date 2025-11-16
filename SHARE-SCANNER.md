# Share Your Scanner with Others

## Quick Deploy to Vercel (Recommended)

Your scanner is ready to share! Here's how to deploy it:

### Step 1: Deploy via CLI

```bash
cd /Users/loganlorenz/TradePaperback
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time)
- **Project name?** → `tradepaperback-scanner` (or your choice)
- **Directory?** → `./` (current directory)

### Step 2: Get Your Public URL

After deployment, Vercel will give you:
- **Production URL:** `https://tradepaperback-scanner.vercel.app`
- **Custom domain:** (optional, can add later)

### Step 3: Share the URL

Send this URL to anyone:
```
https://your-project.vercel.app
```

They can:
- ✅ Open on any device (phone, tablet, computer)
- ✅ Scan barcodes instantly
- ✅ Use cover scan feature
- ✅ No installation needed!

## Alternative: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** (or create account)
3. **Click "Add New Project"**
4. **Import from GitHub:**
   - Connect your GitHub account
   - Select `TradePaperback` repository
   - Click "Import"
5. **Deploy:**
   - Framework: **Other**
   - Root Directory: `./`
   - Click **"Deploy"**
6. **Get your URL** (takes ~30 seconds)

## What Gets Shared

✅ **Public Scanner** - Anyone can use it
✅ **HTTPS** - Secure, works with camera
✅ **Mobile-Friendly** - Works on phones
✅ **No Login Required** - Just open and scan
✅ **Cover Scan** - Book identification feature

## Privacy & Security

- ✅ Camera access is per-session (not stored)
- ✅ Only barcode numbers sent to backend
- ✅ No personal data collected
- ✅ Images processed but not stored

## Sharing Options

### Option 1: Direct Link
Just share the Vercel URL:
```
https://your-project.vercel.app
```

### Option 2: QR Code
Generate a QR code for the URL:
- Use any QR code generator
- Print or share digitally
- People scan QR → Opens scanner → Ready to use!

### Option 3: Custom Domain
Add your own domain in Vercel:
1. Vercel Dashboard → Settings → Domains
2. Add domain (e.g., `scanner.yourdomain.com`)
3. Configure DNS
4. Share the custom URL

## Testing Before Sharing

Before sharing, test:
- [ ] Scanner opens on mobile
- [ ] Camera permission works
- [ ] Barcode scanning works
- [ ] Cover scan works
- [ ] Data appears in Google Sheet
- [ ] No errors in browser console

## Monitoring Usage

After sharing, you can:
- **Check Google Sheet** - See all scans
- **Check Pipedream** - View API calls
- **Vercel Analytics** - See page views (if enabled)

## Troubleshooting

**If deployment fails:**
- Check `vercel.json` is valid
- Ensure all files are committed
- Check Vercel dashboard for errors

**If scanner doesn't work:**
- Verify HTTPS (required for camera)
- Check browser console for errors
- Test on different devices

---

**Ready to deploy?** Run: `vercel --prod`

