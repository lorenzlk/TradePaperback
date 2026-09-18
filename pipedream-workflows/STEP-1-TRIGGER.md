# Step 1: Google Sheets Trigger

## Setup

1. Create **New Workflow** in Pipedream
2. Add trigger: **Google Sheets - New Row**
3. Configure:
   - **Spreadsheet**: `Trade Paperback DB` (or select your sheet)
   - **Worksheet**: `Sheet1`
   - **Watch for**: New rows

## What This Does

- Watches Sheet1 for new rows
- Triggers workflow when a UPC is scanned
- Passes row data to next step

## No Code Needed

This is a Pipedream built-in trigger - just configure the settings above.

