export default function handler(req, res) {
  // Read environment variables from Vercel
  const config = {
    APPS_SCRIPT_URL: process.env.APPS_SCRIPT_URL || '',
    SHEETS_API_KEY: process.env.GOOGLE_PRIVATE_KEY || '',
    SHEET_ID: process.env.GOOGLE_SHEET_ID || ''
  };

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(config);
}
