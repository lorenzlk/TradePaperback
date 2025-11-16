import vision from '@google-cloud/vision';

export default defineComponent({
  async run({ steps, $ }) {
    // Get image from request body
    // In Pipedream, the body is typically at steps.trigger.event.body
    // But it might be parsed or raw depending on Content-Type
    
    // Get the body from the HTTP trigger
    // Based on Pipedream structure: steps.trigger.event.body contains the parsed JSON body
    const body = steps.trigger?.event?.body;
    
    console.log('Body:', body);
    console.log('Body type:', typeof body);
    console.log('Body keys:', body && typeof body === 'object' ? Object.keys(body) : 'N/A');
    
    // Extract image from body
    let image = null;
    if (body) {
      if (typeof body === 'object') {
        // Body is an object, extract image property
        image = body.image || body.data?.image || body.content || body.payload;
      } else if (typeof body === 'string') {
        // Body might be a JSON string, try to parse it
        try {
          const parsed = JSON.parse(body);
          image = parsed.image || parsed.data?.image;
        } catch (e) {
          // If parsing fails, body might be the image itself
          if (body.length > 100) {
            image = body;
          }
        }
      }
    }
    
    console.log('Image:', image ? 'found' : 'not found', typeof image);
    
    if (!image) {
      // Return helpful error with instructions
      return {
        success: false,
        error: 'No image provided. The HTTP trigger event body is empty. Please check: 1) HTTP trigger is configured to parse JSON bodies, 2) Request includes Content-Type: application/json header, 3) Body is being sent correctly.',
        debug: {
          bodyType: typeof body,
          bodyKeys: body ? Object.keys(body) : null,
          bodyValue: typeof body === 'string' ? body.substring(0, 50) + '...' : (typeof body === 'object' ? JSON.stringify(body).substring(0, 200) : body),
          eventStructure: Object.keys(steps.trigger?.event || {}),
          triggerKeys: Object.keys(steps.trigger || {}),
          fullTrigger: JSON.stringify(steps.trigger).substring(0, 1000),
          fullEvent: JSON.stringify(steps.trigger?.event).substring(0, 500),
          instructions: 'The trigger event is empty. In Pipedream, check your HTTP trigger step settings - it may need to be configured to parse JSON bodies automatically.'
        }
      };
    }
    
    // Log image info for debugging
    console.log('Image type:', typeof image);
    console.log('Image is Buffer:', Buffer.isBuffer(image));
    console.log('Image length:', typeof image === 'string' ? image.length : 'N/A');
    console.log('Image preview:', typeof image === 'string' ? image.substring(0, 50) + '...' : image);
    
    // Handle base64 data URLs (remove data:image/...;base64, prefix if present)
    if (typeof image === 'string' && image.startsWith('data:')) {
      image = image.split(',')[1];
    }
    
    // If image is an object, try to extract the actual image data
    if (typeof image === 'object' && image !== null) {
      // Try common property names
      image = image.image || image.data || image.content || image.base64 || image.body;
      console.log('Extracted from object, new type:', typeof image);
    }
    
    // Ensure image is a Buffer for Vision API
    let imageBuffer;
    if (Buffer.isBuffer(image)) {
      imageBuffer = image;
    } else if (typeof image === 'string') {
      // Try to decode as base64
      try {
        imageBuffer = Buffer.from(image, 'base64');
        // Verify it's valid base64 by checking if decoding worked
        if (imageBuffer.length === 0 && image.length > 0) {
          // Might not be base64, try as raw string
          imageBuffer = Buffer.from(image, 'utf8');
        }
      } catch (e) {
        return {
          success: false,
          error: `Failed to decode image: ${e.message}`,
          debug: {
            imageType: typeof image,
            imageLength: image.length,
            imagePreview: image.substring(0, 100)
          }
        };
      }
    } else {
      return {
        success: false,
        error: `Invalid image format. Expected base64 string or Buffer, got ${typeof image}`,
        debug: {
          imageType: typeof image,
          imageValue: image,
          imageKeys: typeof image === 'object' ? Object.keys(image) : null
        }
      };
    }
    
    try {
      // Initialize Vision client using environment variables
      // Make sure these are set in Pipedream Secrets:
      // - GOOGLE_CLOUD_PROJECT_ID
      // - GOOGLE_CLOUD_CLIENT_EMAIL
      // - GOOGLE_CLOUD_PRIVATE_KEY
      
      if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_CLOUD_CLIENT_EMAIL || !process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
        return {
          success: false,
          error: 'Missing Google Cloud credentials. Please set GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_CLIENT_EMAIL, and GOOGLE_CLOUD_PRIVATE_KEY in Secrets.',
          missingVars: {
            projectId: !process.env.GOOGLE_CLOUD_PROJECT_ID,
            clientEmail: !process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
            privateKey: !process.env.GOOGLE_CLOUD_PRIVATE_KEY
          }
        };
      }
      
      const client = new vision.ImageAnnotatorClient({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        credentials: {
          client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n')
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
        const booksResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
          .then(res => res.json())
          .catch(() => ({ totalItems: 0 }));
        
        if (booksResponse.totalItems > 0) {
          const book = booksResponse.items[0].volumeInfo;
          
          // Parse series and volume from title (for shop owners)
          const seriesMatch = book.title.match(/^(.+?)\s+(?:Vol|Volume|#|Issue)\s*(\d+)/i);
          const series = seriesMatch ? seriesMatch[1].trim() : null;
          const volumeIssue = seriesMatch ? (seriesMatch[0].match(/Vol|Volume/i) ? `Vol ${seriesMatch[2]}` : `#${seriesMatch[2]}`) : null;
          
          // Determine format from categories or title
          let format = 'Unknown';
          const titleLower = book.title.toLowerCase();
          const categoriesLower = (book.categories || []).join(' ').toLowerCase();
          
          if (titleLower.includes('hardcover') || titleLower.includes('hc')) {
            format = 'Hardcover';
          } else if (titleLower.includes('trade paperback') || titleLower.includes('tpb')) {
            format = 'Trade Paperback';
          } else if (titleLower.includes('single issue') || titleLower.includes('comic')) {
            format = 'Single Issue';
          } else if (categoriesLower.includes('comic') || categoriesLower.includes('graphic novel')) {
            format = 'Trade Paperback'; // Default for comics
          }
          
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
            // Shop owner fields
            series: series,
            volumeIssue: volumeIssue,
            format: format,
            coverImageUrl: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || book.imageLinks?.medium || book.imageLinks?.large,
            confidence: 'high',
            source: 'isbn_web_detection'
          };
        }
      } else if (title) {
        // Search by title
        const booksResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(title)}"`)
          .then(res => res.json())
          .catch(() => ({ totalItems: 0 }));
        
        if (booksResponse.totalItems > 0) {
          const book = booksResponse.items[0].volumeInfo;
          const isbn13 = book.industryIdentifiers?.find(i => i.type === 'ISBN_13')?.identifier;
          const isbn10 = book.industryIdentifiers?.find(i => i.type === 'ISBN_10')?.identifier;
          
          // Parse series and volume from title (for shop owners)
          const seriesMatch = book.title.match(/^(.+?)\s+(?:Vol|Volume|#|Issue)\s*(\d+)/i);
          const series = seriesMatch ? seriesMatch[1].trim() : null;
          const volumeIssue = seriesMatch ? (seriesMatch[0].match(/Vol|Volume/i) ? `Vol ${seriesMatch[2]}` : `#${seriesMatch[2]}`) : null;
          
          // Determine format from categories or title
          let format = 'Unknown';
          const titleLower = book.title.toLowerCase();
          const categoriesLower = (book.categories || []).join(' ').toLowerCase();
          
          if (titleLower.includes('hardcover') || titleLower.includes('hc')) {
            format = 'Hardcover';
          } else if (titleLower.includes('trade paperback') || titleLower.includes('tpb')) {
            format = 'Trade Paperback';
          } else if (titleLower.includes('single issue') || titleLower.includes('comic')) {
            format = 'Single Issue';
          } else if (categoriesLower.includes('comic') || categoriesLower.includes('graphic novel')) {
            format = 'Trade Paperback'; // Default for comics
          }
          
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
            // Shop owner fields
            series: series,
            volumeIssue: volumeIssue,
            format: format,
            coverImageUrl: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || book.imageLinks?.medium || book.imageLinks?.large,
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
        error: error.message,
        stack: error.stack
      };
    }
  },
})



