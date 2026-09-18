// Step 2: Search OpenLibrary API
// Add: Code (Node.js) step

export default defineComponent({
  async run({ steps, $ }) {
    const upc = steps.trigger.event.upc;

    // Try as ISBN first
    const isbnUrl = `https://openlibrary.org/isbn/${upc}.json`;

    try {
      const response = await require("@pipedreamhq/platform").axios(this, {
        url: isbnUrl,
        timeout: 5000
      });
      return response;
    } catch (error) {
      // No data found
      return { found: false };
    }
  },
})

// Export as: openLibraryData

