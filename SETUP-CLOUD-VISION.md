# Google Cloud Vision Setup Checklist

## ✅ Completed Steps

- [x] Created Google Cloud project: `red-forklift-451022-b8`
- [x] Downloaded service account JSON key
- [x] Copied key to project: `google-cloud-key.json`
- [x] Added to `.gitignore` (won't be committed)
- [x] Installed `@google-cloud/vision` SDK
- [x] Created `vision-api.js` helper module
- [x] Updated `config.js` with Cloud Vision settings

## ⏳ Next Steps

### 1. Enable Billing (Required)

**Even though you get 1,000 free requests/month, Google requires billing to be enabled.**

1. Go to: https://console.cloud.google.com/billing/enable?project=394049389831
2. Or: Google Cloud Console → Billing → Link a billing account
3. Add a credit card (won't be charged unless you exceed free tier)

**Free Tier**: First 1,000 requests/month FREE  
**After Free**: $1.50 per 1,000 requests

### 2. Verify Vision API is Enabled

1. Go to: https://console.cloud.google.com/apis/library/vision.googleapis.com?project=red-forklift-451022-b8
2. Click **"Enable"** if not already enabled
3. Wait ~30 seconds for activation

### 3. Test the API

```bash
node test-vision-api.js
```

Should see:
```
✅ Vision client initialized
✅ API call successful!
📝 Text Detected: ...
🏷️ Labels: ...
🌐 Web Entities: ...
```

### 4. Integrate into Scanner

Once billing is enabled and test passes:
1. Add cover scan button to `index.html`
2. Wire up `vision-api.js` in `scanner.js`
3. Test with real book covers!

---

## 🔒 Security Notes

- ✅ `google-cloud-key.json` is in `.gitignore`
- ✅ Never commit credentials to git
- ✅ Key file is in project root (not in public folder)
- ⚠️ For production, consider using environment variables instead

---

## 💰 Cost Estimate

**Current Usage** (0 shops):
- Cost: $0 (within free tier)

**10 shops × 50 scans/month = 500 scans**:
- Cost: $0 (within free tier) ✅

**100 shops × 50 scans/month = 5,000 scans**:
- Free: 1,000 requests
- Paid: 4,000 × $1.50/1000 = **$6/month** ✅

**Cost per shop**: $0.06/month  
**Revenue per shop**: $49/month  
**Margin**: $48.94/shop ✅

---

**Ready to enable billing and test?** 🚀

