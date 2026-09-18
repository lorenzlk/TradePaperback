# Step 8: Write to Sheet2 - Column Mappings

## Setup

Add: **Google Sheets - Add Row**

## Configuration

- **Spreadsheet**: `Trade Paperback DB`
- **Worksheet**: `Sheet2`

## Column Mappings

Copy each mapping below into the corresponding column field in Pipedream:

### Core Metadata (A-P)

**Column A (UPC):**
```
{{steps.parsedMetadata.upc}}
```

**Column B (Timestamp):**
```
{{steps.parsedMetadata.enriched_at}}
```

**Column C (Title):**
```
{{steps.parsedMetadata.title}}
```

**Column D (Publisher):**
```
{{steps.parsedMetadata.publisher}}
```

**Column E (Release_Date):**
```
{{steps.parsedMetadata.release_date}}
```

**Column F (Format):**
```
{{steps.parsedMetadata.format}}
```

**Column G (Series):**
```
{{steps.parsedMetadata.series}}
```

**Column H (Volume_Issue):**
```
{{steps.parsedMetadata.volume_issue}}
```

**Column I (Page_Count):**
```
{{steps.parsedMetadata.page_count}}
```

**Column J (ISBN):**
```
{{steps.parsedMetadata.isbn}}
```

**Column K (Price_USD):**
```
{{steps.parsedMetadata.price_usd}}
```

**Column L (Genre):**
```
{{steps.parsedMetadata.genre}}
```

**Column M (Description):**
```
{{steps.parsedMetadata.description}}
```

**Column N (Cover_Image_URL):**
```
{{steps.parsedMetadata.cover_image_url}}
```

**Column O (Goodreads_Rating):**
```
{{steps.parsedMetadata.goodreads_rating}}
```

**Column P (Data_Source):**
```
{{steps.parsedMetadata.data_source}}
```

### Comic Specific (Q-X)

**Column Q (Creators):**
```
{{steps.parsedMetadata.creators}}
```

**Column R (Cover_Artist):**
```
{{steps.parsedMetadata.cover_artist}}
```

**Column S (Variant_Type):**
```
{{steps.parsedMetadata.variant_type}}
```

**Column T (First_Print):**
```
{{steps.parsedMetadata.first_print}}
```

**Column U (Print_Number):**
```
{{steps.parsedMetadata.print_number}}
```

**Column V (Comic_Vine_ID):**
```
{{steps.parsedMetadata.comic_vine_id}}
```

**Column W (Key_Issue):**
```
{{steps.parsedMetadata.key_issue}}
```

**Column X (Key_Issue_Reason):**
```
{{steps.parsedMetadata.key_issue_reason}}
```

### Pricing (Y-AF)

**Column Y (MSRP):**
```
{{steps.parsedMetadata.msrp}}
```

**Column Z (Market_Price_High):**
```
{{steps.parsedMetadata.market_price_high}}
```

**Column AA (Market_Price_Low):**
```
{{steps.parsedMetadata.market_price_low}}
```

**Column AB (Market_Price_Avg):**
```
{{steps.parsedMetadata.market_price_avg}}
```

**Column AC (Price_Trend):**
```
{{steps.parsedMetadata.price_trend}}
```

**Column AD (Last_Sale_Date):**
```
{{steps.parsedMetadata.last_sale_date}}
```

**Column AE (Sales_Count):**
```
{{steps.parsedMetadata.sales_count}}
```

**Column AF (Demand_Score):**
```
{{steps.parsedMetadata.demand_score}}
```

### Physical (AG-AK)

**Column AG (Dimensions):**
```
{{steps.parsedMetadata.dimensions}}
```

**Column AH (Weight_Oz):**
```
{{steps.parsedMetadata.weight_oz}}
```

**Column AI (Binding):**
```
{{steps.parsedMetadata.binding}}
```

**Column AJ (Paper_Quality):**
```
{{steps.parsedMetadata.paper_quality}}
```

**Column AK (Color):**
```
{{steps.parsedMetadata.color}}
```

### Content (AL-AP)

**Column AL (Language):**
```
{{steps.parsedMetadata.language}}
```

**Column AM (Age_Rating):**
```
{{steps.parsedMetadata.age_rating}}
```

**Column AN (Content_Warnings):**
```
{{steps.parsedMetadata.content_warnings}}
```

**Column AO (Story_Arc):**
```
{{steps.parsedMetadata.story_arc}}
```

**Column AP (Collected_In):**
```
{{steps.parsedMetadata.collected_in}}
```

### Inventory (AQ-AX)

**Column AQ (Condition_Image_URL):**
```
{{steps.parsedMetadata.condition_image_url}}
```

**Column AR (Condition_Grade):**
```
(Leave empty - user input)
```

**Column AS (Condition_Notes):**
```
(Leave empty - user input)
```

**Column AT (Quantity):**
```
(Leave empty - user input)
```

**Column AU (Location):**
```
(Leave empty - user input)
```

**Column AV (Cost_Basis):**
```
(Leave empty - user input)
```

**Column AW (List_Price):**
```
(Leave empty - user input)
```

**Column AX (Profit_Margin):**
```
(Leave empty - calculated later)
```

### External IDs (AY-BD)

**Column AY (Google_Books_ID):**
```
{{steps.parsedMetadata.google_books_id}}
```

**Column AZ (OpenLibrary_ID):**
```
{{steps.parsedMetadata.openlibrary_id}}
```

**Column BA (Amazon_ASIN):**
```
{{steps.parsedMetadata.amazon_asin}}
```

**Column BB (eBay_Item_Number):**
```
{{steps.parsedMetadata.ebay_item_number}}
```

**Column BC (Goodreads_ID):**
```
{{steps.parsedMetadata.goodreads_id}}
```

**Column BD (Wikipedia_URL):**
```
{{steps.parsedMetadata.wikipedia_url}}
```

### Analytics (BE-BJ)

**Column BE (Views_Count):**
```
0
```

**Column BF (Inquiries_Count):**
```
0
```

**Column BG (Last_Viewed):**
```
(Leave empty)
```

**Column BH (Scan_Count):**
```
1
```

**Column BI (Days_In_Inventory):**
```
0
```

**Column BJ (Enrichment_Confidence):**
```
{{steps.parsedMetadata.enrichment_confidence}}
```

### Social (BK-BO)

**Column BK (Goodreads_Rating):**
```
{{steps.parsedMetadata.goodreads_rating}}
```

**Column BL (Goodreads_Reviews):**
```
{{steps.parsedMetadata.goodreads_reviews}}
```

**Column BM (Amazon_Rating):**
```
{{steps.parsedMetadata.amazon_rating}}
```

**Column BN (Amazon_Reviews):**
```
{{steps.parsedMetadata.amazon_reviews}}
```

**Column BO (Awards):**
```
{{steps.parsedMetadata.awards}}
```

