// Google Cloud Vision API Integration
// Handles book cover recognition via image analysis

const vision = require('@google-cloud/vision');
const path = require('path');

// Initialize client with credentials
let client = null;

function initializeVisionClient() {
  if (client) return client;
  
  try {
    // Set credentials path from config
    if (typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_CLOUD_KEY_FILE) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
        __dirname,
        CONFIG.GOOGLE_CLOUD_KEY_FILE.replace('./', '')
      );
    }
    
    client = new vision.ImageAnnotatorClient();
    return client;
  } catch (error) {
    console.error('Failed to initialize Vision client:', error);
    throw error;
  }
}

/**
 * Extract title from text detection results
 */
function extractTitleFromText(textAnnotations) {
  if (!textAnnotations || textAnnotations.length === 0) {
    return null;
  }
  
  // First annotation is usually the full text block
  const fullText = textAnnotations[0].description;
  
  // Common patterns:
  // "BATMAN\nVOL 1\nCOURT OF OWLS"
  // "Title\nAuthor\nPublisher"
  
  const lines = fullText.split('\n').filter(line => line.trim());
  
  // Title is usually the first or second line
  // Skip volume numbers, look for actual title
  for (const line of lines) {
    // Skip common prefixes
    if (line.match(/^(VOL|VOLUME|ISSUE|#)\s*\d+/i)) continue;
    if (line.match(/^\d{4}$/)) continue; // Year
    
    // Title is usually longer and has words
    if (line.length > 5 && line.match(/[a-zA-Z]/)) {
      return line.trim();
    }
  }
  
  return lines[0] || null;
}

/**
 * Extract ISBN from web detection URLs
 */
function extractISBNFromWebDetection(webDetection) {
  if (!webDetection) return null;
  
  const isbnPatterns = [
    /\/dp\/(\d{10})/, // Amazon
    /isbn[=:](\d{10,13})/i, // Generic ISBN
    /(\d{13})/, // 13-digit ISBN
    /(\d{10})/ // 10-digit ISBN
  ];
  
  // Check full matching images URLs
  for (const image of webDetection.fullMatchingImages || []) {
    for (const pattern of isbnPatterns) {
      const match = image.url.match(pattern);
      if (match) return match[1];
    }
  }
  
  // Check pages with matching images
  for (const page of webDetection.pagesWithMatchingImages || []) {
    for (const pattern of isbnPatterns) {
      const match = page.url.match(pattern);
      if (match) return match[1];
    }
  }
  
  return null;
}

/**
 * Fetch book metadata from Google Books API by ISBN
 */
async function fetchBookByISBN(isbn) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );
    const data = await response.json();
    
    if (data.totalItems > 0) {
      return parseGoogleBooksResult(data.items[0]);
    }
    return null;
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    return null;
  }
}

/**
 * Search book by title using Google Books API
 */
async function searchBookByTitle(title) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(title)}"`
    );
    const data = await response.json();
    
    if (data.totalItems > 0) {
      // Return best match (first result)
      return parseGoogleBooksResult(data.items[0]);
    }
    return null;
  } catch (error) {
    console.error('Error searching book by title:', error);
    return null;
  }
}

/**
 * Parse Google Books API result into our format
 */
function parseGoogleBooksResult(item) {
  const book = item.volumeInfo;
  
  // Extract ISBN (prefer ISBN-13)
  const isbn13 = book.industryIdentifiers?.find(i => i.type === 'ISBN_13')?.identifier;
  const isbn10 = book.industryIdentifiers?.find(i => i.type === 'ISBN_10')?.identifier;
  const isbn = isbn13 || isbn10;
  
  return {
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
    ratingsCount: book.ratingsCount,
    language: book.language,
    googleBooksId: item.id
  };
}

/**
 * Identify book from cover image
 * @param {string} imageBase64 - Base64 encoded image (without data: prefix)
 * @returns {Promise<Object|null>} Book metadata or null if not found
 */
async function identifyBookFromCover(imageBase64) {
  try {
    const client = initializeVisionClient();
    
    // Step 1: Analyze image with Cloud Vision
    const [result] = await client.annotateImage({
      image: { content: imageBase64 },
      features: [
        { type: 'TEXT_DETECTION', maxResults: 10 },
        { type: 'WEB_DETECTION', maxResults: 10 },
        { type: 'LABEL_DETECTION', maxResults: 10 }
      ]
    });
    
    // Step 2: Extract ISBN from web detection (most accurate)
    let isbn = extractISBNFromWebDetection(result.webDetection);
    
    // Step 3: If no ISBN, extract title from text detection
    const title = extractTitleFromText(result.textAnnotations);
    
    // Step 4: Use web entities as fallback
    const bookEntity = result.webDetection?.webEntities?.find(
      e => e.description && e.score > 0.8
    );
    
    // Strategy 1: If we have ISBN, fetch from Google Books (most accurate)
    if (isbn) {
      const bookData = await fetchBookByISBN(isbn);
      if (bookData) {
        return {
          ...bookData,
          confidence: 'high',
          source: 'isbn_web_detection'
        };
      }
    }
    
    // Strategy 2: If we have title, search Google Books
    if (title) {
      const bookData = await searchBookByTitle(title);
      if (bookData) {
        return {
          ...bookData,
          confidence: 'medium',
          source: 'title_text_detection',
          detectedTitle: title
        };
      }
    }
    
    // Strategy 3: Use web entity description
    if (bookEntity) {
      const bookData = await searchBookByTitle(bookEntity.description);
      if (bookData) {
        return {
          ...bookData,
          confidence: 'medium',
          source: 'web_entity',
          detectedEntity: bookEntity.description
        };
      }
    }
    
    // No match found
    return {
      confidence: 'low',
      detectedTitle: title,
      detectedEntity: bookEntity?.description,
      textAnnotations: result.textAnnotations?.[0]?.description
    };
    
  } catch (error) {
    console.error('Vision API error:', error);
    throw error;
  }
}

// Export for use in scanner.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    identifyBookFromCover,
    initializeVisionClient,
    extractTitleFromText,
    extractISBNFromWebDetection,
    fetchBookByISBN,
    searchBookByTitle
  };
}

