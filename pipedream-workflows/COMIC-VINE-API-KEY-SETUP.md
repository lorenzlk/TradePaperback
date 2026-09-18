# How to Get Comic Vine API Key

## 🎯 Quick Steps

1. **Create Account** (if you don't have one)
   - Go to: https://www.giantbomb.com/register/
   - Sign up for a free account
   - Verify your email

2. **Get API Key**
   - Log in to your Giant Bomb account
   - Go to: https://www.giantbomb.com/api/
   - Your API key will be displayed on the page
   - Copy the key (it's a long alphanumeric string)

3. **Add to Pipedream Secrets**
   - In Pipedream workflow, go to Settings → Secrets
   - Add new secret:
     - **Name**: `COMIC_VINE_API_KEY`
     - **Value**: Paste your API key
   - Save

---

## 📋 Detailed Instructions

### Step 1: Create Giant Bomb Account

1. Visit: https://www.giantbomb.com/register/
2. Fill out registration form:
   - Username
   - Email
   - Password
3. Verify your email address
4. Log in

**Note**: Comic Vine is part of Giant Bomb, so you use the same account for both.

---

### Step 2: Access API Page

**Direct Link:**
- Go to: https://www.giantbomb.com/api/
- **OR**: https://www.comicvine.com/api/
- Your API key is displayed at the top of the page

**Alternative Method:**
1. Log in to Giant Bomb
2. Click your username (top right)
3. Go to Account Settings
4. Look for "API" section
5. Your API key is displayed there

---

### Step 3: Copy Your API Key

Your API key will look something like:
```
abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

It's a long alphanumeric string (usually 40+ characters). Copy the **entire** key.

---

### Step 4: Add to Pipedream Secrets

**Method 1: In Workflow Secrets (Recommended)**
1. In Pipedream workflow, click **Settings** (gear icon)
2. Go to **Secrets** tab
3. Click **Add Secret**
4. Enter:
   - **Name**: `COMIC_VINE_API_KEY` (exact name, case-sensitive)
   - **Value**: Paste your API key
5. Click **Save**
6. The code will automatically use `process.env.COMIC_VINE_API_KEY`

**Method 2: In Step Configuration**
1. Open Step 4 (Comic Vine step) in your workflow
2. Look for environment variables or secrets section
3. Add: `COMIC_VINE_API_KEY` = your key
4. Save

---

## 🔑 API Key Details

- **Free**: Yes, API keys are free
- **Rate Limit**: 200 requests per day (free tier)
- **Format**: Long alphanumeric string (40+ characters)
- **Location**: https://www.giantbomb.com/api/ or https://www.comicvine.com/api/
- **Terms**: Non-commercial use only

---

## ✅ Verify It Works

After adding the key:

1. Test your workflow
2. Check the Comic Vine step logs
3. If you see `status_code: 1`, it's working! ✅
4. If you see `status_code: 100`, the API key is invalid ❌

---

## 🆘 Troubleshooting

### "Invalid API Key" Error (status_code: 100)
- Make sure you copied the entire key (no spaces before/after)
- Verify the key is correct in Giant Bomb account
- Check that secret name is exactly `COMIC_VINE_API_KEY` (case-sensitive)
- Make sure you saved the secret in Pipedream

### "Rate Limit Exceeded"
- Free tier: 200 requests/day
- Wait 24 hours for reset
- Consider upgrading account for higher limits
- Consider caching results to reduce API calls

### Can't Find API Page
- Try: https://www.giantbomb.com/api/
- Or: https://www.comicvine.com/api/
- Make sure you're logged in
- Check your account settings

### API Key Not Showing
- Make sure you're logged in
- Try refreshing the page
- Check if your account is verified
- Contact Giant Bomb support if needed

---

## 📚 Reference Links

- **API Documentation**: https://comicvine.gamespot.com/api/documentation
- **API Key Page**: https://www.giantbomb.com/api/
- **Registration**: https://www.giantbomb.com/register/
- **Comic Vine API**: https://www.comicvine.com/api/

---

## 💡 Pro Tip

**Step 4 is Optional!**
- If you don't have a Comic Vine API key yet, you can skip Step 4
- The workflow will still work - it just won't have comic-specific data
- You can add it later when you get a key
- The code handles missing API keys gracefully (returns `{ found: false }`)

---

## 🎯 Summary

1. Register at: https://www.giantbomb.com/register/
2. Get key at: https://www.giantbomb.com/api/
3. Add to Pipedream Secrets as: `COMIC_VINE_API_KEY`
4. Done! ✅
