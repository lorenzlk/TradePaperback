# Troubleshooting Pipedream Vision Workflow

## Issue: Getting default "Success!" HTML response instead of JSON

If you're seeing the default Pipedream HTML response instead of JSON, it means the code step isn't running or returning properly.

### Checklist:

1. **Verify the code step is added:**
   - Open your Pipedream workflow
   - Make sure you have TWO steps:
     - Step 1: HTTP / Webhook (trigger)
     - Step 2: Node.js code step (the Vision API code)

2. **Check the code step configuration:**
   - Click on the Node.js code step
   - Verify the code from `PIPEDREAM-VISION-WORKFLOW.md` is pasted in
   - Make sure it starts with:
     ```javascript
     import vision from '@google-cloud/vision';
     import { axios } from '@pipedreamhq/platform';
     ```

3. **Verify dependencies are installed:**
   - Go to workflow Settings → Dependencies
   - Make sure `@google-cloud/vision` is listed
   - If not, add it and save

4. **Check environment variables:**
   - Go to workflow Secrets
   - Verify these are set:
     - `GOOGLE_CLOUD_PROJECT_ID`
     - `GOOGLE_CLOUD_CLIENT_EMAIL`
     - `GOOGLE_CLOUD_PRIVATE_KEY`

5. **Make sure the code step returns a response:**
   - The code should end with a `return` statement
   - Pipedream will automatically send this as the HTTP response

6. **Test the workflow:**
   - Click "Test" button in Pipedream
   - Or use the test script: `node test-pipedream-vision.js https://eotlck7p4oeyvob.m.pipedream.net`

### Common Issues:

**Issue: "require is not defined"**
- Solution: Make sure you're using `import` statements, not `require`

**Issue: "Cannot find module '@google-cloud/vision'"**
- Solution: Add the dependency in Settings → Dependencies

**Issue: "Environment variable not found"**
- Solution: Check Secrets tab and verify variable names match exactly

**Issue: "Vision API authentication failed"**
- Solution: Verify your Google Cloud credentials are correct in Secrets

### Testing:

Once fixed, you should see a JSON response like:
```json
{
  "success": true,
  "bookData": { ... }
}
```

Instead of the HTML "Success!" message.

