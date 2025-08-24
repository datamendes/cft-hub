# Audit Scripts

These scripts attempt to crawl the running application and capture console errors.

## Usage
1. Ensure the dev server is running on http://localhost:8080.
2. Install Playwright: `npm install -D playwright` (if not already installed).
3. Run the crawler: `node crawl.js`.

The current audit run could not execute because the dev server exits with a `Bus error` before it can start.
