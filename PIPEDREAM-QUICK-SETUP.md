# Quick Setup Guide for Pipedream Vision Workflow

## Step-by-Step Instructions

### 1. Add Code Step
1. In your Pipedream workflow, click the **"+"** button after the HTTP trigger
2. Search for **"Code"** or **"Run Node.js code"**
3. Click to add it

### 2. Add Dependencies
In the code step editor, look for:
- A **"Packages"** or **"Dependencies"** section (usually at the top or bottom of the code editor)
- Or a **"+"** button next to "Packages"

Add this package:
```
@google-cloud/vision
```

**Note:** In newer Pipedream interfaces, dependencies might be added automatically when you use `import` statements, or you might need to click a "Add Package" button.

### 3. Paste the Code
Copy the entire code block from `PIPEDREAM-VISION-WORKFLOW.md` (lines 46-243) and paste it into the code step.

### 4. Add Environment Variables (Secrets)
1. Click on your workflow name at the top
2. Go to **"Secrets"** tab
3. Add these three secrets:
   - `GOOGLE_CLOUD_PROJECT_ID` = your project ID (e.g., `red-forklift-451022-b8`)
   - `GOOGLE_CLOUD_CLIENT_EMAIL` = the `client_email` from your JSON key file
   - `GOOGLE_CLOUD_PRIVATE_KEY` = the `private_key` from your JSON key file (include the full key with BEGIN/END markers)

### 5. Save and Test
1. Click **"Deploy"** or **"Save"** 
2. Test using: `node test-pipedream-vision.js https://eotlck7p4oeyvob.m.pipedream.net`

## If You Don't See Dependencies Section

In some Pipedream interfaces, dependencies are added differently:

1. **Try typing the import** - Sometimes Pipedream auto-detects and adds packages
2. **Look for "Packages" tab** - There might be a separate tab in the code editor
3. **Check the code step settings** - Click the gear icon on the code step
4. **Use the package.json format** - Some workflows let you add a `package.json` section

If none of these work, the package might be auto-installed when you save the code with the `import` statement.

