// Step 7: Parse GPT Response
// Add: Node.js Code

export default defineComponent({
  async run({ steps, $ }) {
    try {
      const content = steps.gptResponse.$return_value.choices[0].message.content;
      
      // Extract JSON (handle markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/\{[\s\S]*\}/);
      const metadata = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      
      // Add original UPC and timestamp
      metadata.upc = steps.trigger.event.upc;
      metadata.enriched_at = new Date().toISOString();
      
      // Add condition image URL if available from Sheet1
      metadata.condition_image_url = steps.trigger.event.condition_image_url || null;
      
      // Calculate enrichment confidence
      let confidenceScore = 0;
      if (metadata.title) confidenceScore += 20;
      if (metadata.publisher) confidenceScore += 10;
      if (metadata.cover_image_url) confidenceScore += 15;
      if (metadata.creators) confidenceScore += 10;
      if (metadata.comic_vine_id) confidenceScore += 15;
      if (metadata.market_price_avg) confidenceScore += 10;
      if (steps.googleBooksData.found) confidenceScore += 10;
      if (steps.comicVineData && steps.comicVineData.found) confidenceScore += 10;
      
      metadata.enrichment_confidence = confidenceScore >= 70 ? 'High' : 
                                       confidenceScore >= 40 ? 'Medium' : 'Low';
      
      return metadata;
    } catch (error) {
      return {
        upc: steps.trigger.event.upc,
        enriched_at: new Date().toISOString(),
        error: "Failed to parse metadata",
        raw_response: steps.gptResponse.$return_value.choices[0].message.content
      };
    }
  },
})

// Export as: parsedMetadata

