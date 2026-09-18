// Step 4: Search Comic Vine API (Optional - for comics)
// Add: Code (Node.js) step
// Requires: COMIC_VINE_API_KEY in Pipedream Secrets

export default defineComponent({
  async run({ steps, $ }) {
    const upc = steps.trigger.event.upc;
    const apiKey = process.env.COMIC_VINE_API_KEY; // Set in Pipedream Secrets

    // Search by ISBN
    const url = `https://comicvine.gamespot.com/api/issue/4000-${upc}/?api_key=${apiKey}&format=json`;

    try {
      const response = await require("@pipedreamhq/platform").axios(this, {
        url: url,
        timeout: 5000,
        headers: {
          'User-Agent': 'TradePaperback/1.0'
        }
      });
      
      if (response.results) {
        return response.results;
      } else {
        return { found: false };
      }
    } catch (error) {
      return { found: false };
    }
  },
})

// Export as: comicVineData

// Note: Get free API key at https://comicvine.gamespot.com/api/
// Free tier: 200 requests/day

