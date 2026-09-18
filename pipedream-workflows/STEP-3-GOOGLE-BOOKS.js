// Step 3: Search Google Books API
// Add: Code (Node.js) step

export default defineComponent({
  async run({ steps, $ }) {
    const upc = steps.trigger.event.upc;
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${upc}`;

    try {
      const response = await require("@pipedreamhq/platform").axios(this, {
        url: url,
        timeout: 5000
      });
      
      if (response.totalItems > 0) {
        return response.items[0];
      } else {
        return { found: false };
      }
    } catch (error) {
      return { found: false };
    }
  },
})

// Export as: googleBooksData

