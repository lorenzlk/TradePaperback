// Step 5: Search eBay API for Pricing (Optional)
// Add: Code (Node.js) step
// Requires: EBAY_APP_ID in Pipedream Secrets

export default defineComponent({
  async run({ steps, $ }) {
    const upc = steps.trigger.event.upc;
    const appId = process.env.EBAY_APP_ID; // Set in Pipedream Secrets

    // Search completed listings
    const url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${appId}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemFilter(0).name=ProductID&itemFilter(0).value=${upc}&itemFilter(0).paramName=ISBN&itemFilter(1).name=ListingType&itemFilter(1).value(0)=FixedPrice&itemFilter(1).value(1)=AuctionWithBIN&sortOrder=EndTimeSoonest&paginationInput.entriesPerPage=50`;

    try {
      const response = await require("@pipedreamhq/platform").axios(this, {
        url: url,
        timeout: 10000
      });
      
      if (response.findCompletedItemsResponse && 
          response.findCompletedItemsResponse[0].searchResult &&
          response.findCompletedItemsResponse[0].searchResult[0].item) {
        
        const items = response.findCompletedItemsResponse[0].searchResult[0].item;
        const prices = items.map(item => parseFloat(item.sellingStatus[0].currentPrice[0].__value__));
        
        return {
          found: true,
          items: items,
          prices: prices,
          high: Math.max(...prices),
          low: Math.min(...prices),
          avg: prices.reduce((a, b) => a + b, 0) / prices.length,
          count: prices.length,
          lastSale: items[0].listingInfo[0].endTime[0]
        };
      } else {
        return { found: false };
      }
    } catch (error) {
      return { found: false };
    }
  },
})

// Export as: eBayData

// Note: Get free API key at https://developer.ebay.com/
// Free tier: 5,000 calls/day

