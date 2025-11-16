# Pipedream Workflow: Cloud Vision API
## Backend Endpoint for Cover Image Recognition

---

## 🎯 Overview

Since Google Cloud Vision API requires server-side authentication, we'll create a Pipedream workflow that:
1. Receives base64 image from frontend
2. Calls Cloud Vision API securely
3. Identifies book and fetches metadata
4. Returns book data to frontend

---

## 📋 Setup Steps

### Step 1: Create New Pipedream Workflow

1. Go to [Pipedream](https://pipedream.com/workflows)
2. Click **"New Workflow"**
3. Name: `Book Cover Recognition`

---

### Step 2: Add HTTP Trigger

1. Click **"Select a Trigger"**
2. Choose **"HTTP / Webhook"**
3. Click **"Create Source"**
4. **Copy the webhook URL** (e.g., `https://abc123.m.pipedream.net`)

**Add to config.js**:
```javascript
VISION_API_URL: 'https://your-webhook-url.m.pipedream.net'
```

---

### Step 3: Add Node.js Code Step

**Purpose**: Call Google Cloud Vision API

**Code**:

```javascript
import vision from '@google-cloud/vision';
import { axios } from '@pipedreamhq/platform';

export default defineComponent({
  async run({ steps, $ }) {
    // Get image from request body
    // Handle different Pipedream HTTP trigger structures
    let body = steps.trigger?.event?.body;
    
    // If body is a string, try to parse it
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // If parsing fails, body might be the image itself
        body = { image: body };
      }
    }
    
    // Handle nested body structure (sometimes body.body)
    if (body?.body && typeof body.body === 'object') {
      body = body.body;
    }
    
    // Extract image from body
    let image = body?.image || body?.data?.image || body;
    
    if (!image) {
      return {
        success: false,
        error: 'No image provided',
        debug: {
          bodyType: typeof body,
          bodyKeys: body ? Object.keys(body) : null,
          eventStructure: Object.keys(steps.trigger?.event || {})
        }
      };
    }
    
    // Handle base64 data URLs (remove data:image/...;base64, prefix if present)
    if (typeof image === 'string' && image.startsWith('data:')) {
      image = image.split(',')[1];
    }
    
    // Ensure image is a Buffer for Vision API
    let imageBuffer;
    if (Buffer.isBuffer(image)) {
      imageBuffer = image;
    } else if (typeof image === 'string') {
      // Assume it's base64 encoded
      imageBuffer = Buffer.from(image, 'base64');
    } else {
      return {
        success: false,
        error: 'Invalid image format. Expected base64 string or Buffer.'
      };
    }
    
    try {
      // Initialize Vision client using environment variables
      // Set these in Pipedream Secrets:
      // - GOOGLE_CLOUD_PROJECT_ID
      // - GOOGLE_CLOUD_CLIENT_EMAIL
      // - GOOGLE_CLOUD_PRIVATE_KEY
      const client = new vision.ImageAnnotatorClient({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        credentials: {
          client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n')
        }
      });
      
      // Analyze image
      const [result] = await client.annotateImage({
        image: { content: imageBuffer },
        features: [
          { type: 'TEXT_DETECTION', maxResults: 10 },
          { type: 'WEB_DETECTION', maxResults: 10 },
          { type: 'LABEL_DETECTION', maxResults: 10 }
        ]
      });
      
      // Extract ISBN from web detection
      let isbn = null;
      const webDetection = result.webDetection;
      
      if (webDetection) {
        // Check full matching images
        for (const img of webDetection.fullMatchingImages || []) {
          const match = img.url.match(/\/dp\/(\d{10})/);
          if (match) {
            isbn = match[1];
            break;
          }
        }
        
        // Check pages with matching images
        if (!isbn) {
          for (const page of webDetection.pagesWithMatchingImages || []) {
            const match = page.url.match(/\/dp\/(\d{10})/);
            if (match) {
              isbn = match[1];
              break;
            }
          }
        }
      }
      
      // Extract title from text detection
      let title = null;
      if (result.textAnnotations && result.textAnnotations.length > 0) {
        const fullText = result.textAnnotations[0].description;
        const lines = fullText.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.match(/^(VOL|VOLUME|ISSUE|#)\s*\d+/i)) continue;
          if (line.match(/^\d{4}$/)) continue;
          if (line.length > 5 && line.match(/[a-zA-Z]/)) {
            title = line.trim();
            break;
          }
        }
      }
      
      // Fetch book metadata from Google Books
      let bookData = null;
      
      if (isbn) {
        // Fetch by ISBN (most accurate)
        const booksResponse = await axios(this, {
          url: `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
          timeout: 5000
        });
        
        if (booksResponse.totalItems > 0) {
          const book = booksResponse.items[0].volumeInfo;
          bookData = {
            isbn: isbn,
            title: book.title,
            subtitle: book.subtitle,
            authors: book.authors || [],
            publisher: book.publisher,
            publishedDate: book.publishedDate,
            description: book.description,
            pageCount: book.pageCount,
            categories: book.categories || [],
            imageLinks: book.imageLinks,
            averageRating: book.averageRating,
            confidence: 'high',
            source: 'isbn_web_detection'
          };
        }
      } else if (title) {
        // Search by title
        const booksResponse = await axios(this, {
          url: `https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(title)}"`,
          timeout: 5000
        });
        
        if (booksResponse.totalItems > 0) {
          const book = booksResponse.items[0].volumeInfo;
          const isbn13 = book.industryIdentifiers?.find(i => i.type === 'ISBN_13')?.identifier;
          const isbn10 = book.industryIdentifiers?.find(i => i.type === 'ISBN_10')?.identifier;
          
          bookData = {
            isbn: isbn13 || isbn10,
            title: book.title,
            subtitle: book.subtitle,
            authors: book.authors || [],
            publisher: book.publisher,
            publishedDate: book.publishedDate,
            description: book.description,
            pageCount: book.pageCount,
            categories: book.categories || [],
            imageLinks: book.imageLinks,
            averageRating: book.averageRating,
            confidence: 'medium',
            source: 'title_text_detection',
            detectedTitle: title
          };
        }
      }
      
      return {
        success: true,
        bookData: bookData,
        visionResult: {
          hasText: !!result.textAnnotations?.length,
          hasWebDetection: !!result.webDetection,
          detectedTitle: title,
          detectedISBN: isbn
        }
      };
      
    } catch (error) {
      console.error('Vision API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
})
```

---

### Step 4: Configure Google Cloud Credentials

**Recommended: Use Environment Variables** (More Secure)
1. Go to Pipedream workflow **"Secrets"** tab
2. Add the following secrets from your `google-cloud-key.json`:
   - `GOOGLE_CLOUD_PROJECT_ID` - Your project ID
   - `GOOGLE_CLOUD_CLIENT_EMAIL` - The `client_email` field from the JSON
   - `GOOGLE_CLOUD_PRIVATE_KEY` - The `private_key` field from the JSON (include the full key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

3. The code already uses these environment variables (see Step 3)

**Alternative: Upload Key File** (Less Secure)
1. In your workflow, go to **"Secrets"**
2. Upload `google-cloud-key.json`
3. Update the code to use:
```javascript
const client = new vision.ImageAnnotatorClient({
  keyFilename: '/tmp/google-cloud-key.json'
});
```

---

### Step 5: Install Dependencies

**In the Code Step Editor:**
1. After adding the code step, look for a **"Packages"** or **"Dependencies"** section
2. This is usually:
   - At the top/bottom of the code editor
   - In a separate tab within the code step
   - Or accessible via a "+" or "Add Package" button
3. Add: `@google-cloud/vision`

**Alternative:** Some Pipedream versions auto-detect packages from `import` statements. If you don't see a Dependencies section, try:
- Just paste the code with the `import` statement
- Save the workflow
- Pipedream may auto-install it

**Note:** `@pipedreamhq/platform` is built-in and doesn't need to be added.

---

### Step 6: Test the Workflow

**Option A: Using the test script** (Recommended)
1. Copy your webhook URL from Pipedream (HTTP trigger step)
2. Run the setup script:
```bash
node setup-vision-url.js https://your-webhook-url.m.pipedream.net
```
This will:
- Update `config.js` with your webhook URL
- Run a test request

**Option B: Manual test with curl**
```bash
# Replace with your actual webhook URL
curl -X POST https://your-webhook-url.m.pipedream.net \
  -H "Content-Type: application/json" \
  -d '{
    "image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

**Option C: Test with a real image**
```bash
node test-pipedream-vision.js https://your-webhook-url.m.pipedream.net ./path/to/book-cover.jpg
```

**Expected Response**:
```json
{
  "success": true,
  "bookData": {
    "isbn": "9781401235420",
    "title": "Batman Vol 1: Court of Owls",
    "publisher": "DC Comics",
    "imageLinks": {
      "thumbnail": "https://..."
    }
  }
}
```

---

## 🔒 Security Notes

- ✅ API key stays on server (never exposed to browser)
- ✅ Rate limiting handled by Pipedream
- ✅ Can add authentication token if needed
- ✅ Logs all requests for debugging

---

## 💰 Cost

**Pipedream**: Free tier = 10K invocations/month  
**Cloud Vision**: $1.50 per 1,000 requests (after free tier)

**Total cost**: Same as direct Cloud Vision usage ✅

---

## ✅ Implementation Checklist

- [ ] Create Pipedream workflow
- [ ] Add HTTP trigger
- [ ] Configure Google Cloud credentials in Secrets (environment variables)
- [ ] Add Node.js code step
- [ ] Install @google-cloud/vision dependency
- [ ] Test with sample image
- [ ] Copy webhook URL to config.js
- [ ] Test from frontend

---

**Once this is set up, cover scanning will work end-to-end!** 🚀

