import dotenv from 'dotenv';
import readline from 'readline';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/storage/oauth2callback';

if (!clientId || !clientSecret) {
  console.error('\n❌ Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in backend/.env before running this script.\n');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // Ensures refresh token is always returned
  scope: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive',
  ],
});

console.log('\n======================================================');
console.log('NOVA PANEL — GOOGLE DRIVE OAUTH 2.0 AUTHORIZATION');
console.log('======================================================\n');
console.log('1. Open the following URL in your web browser:\n');
console.log(authUrl);
console.log('\n2. Sign in with the Google Account that owns your intended Drive storage.');
console.log('3. Grant permissions.');
console.log('4. After authorizing, Google will redirect you.');
console.log('   - If redirected to http://localhost:5000/api/storage/oauth2callback, the server handles it automatically!');
console.log('   - Or copy the "code" query parameter from the URL address bar and paste it below.\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Paste the authorization code (or press Enter if already handled via browser): ', async (code) => {
  rl.close();

  if (!code || !code.trim()) {
    console.log('\nExiting. If you completed authorization in the browser, check backend/.env.');
    process.exit(0);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    if (tokens.refresh_token) {
      console.log('\n✓ Refresh token received successfully!');
      
      // Update backend/.env with refresh token
      let envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('GOOGLE_REFRESH_TOKEN=')) {
        envContent = envContent.replace(
          /GOOGLE_REFRESH_TOKEN=.*/,
          `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
        );
      } else {
        envContent += `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`;
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log('✓ backend/.env has been automatically updated with GOOGLE_REFRESH_TOKEN.\n');
    } else {
      console.log('\n⚠️ Google did not return a refresh token.');
      console.log('This happens if access was previously granted. Visit https://myaccount.google.com/permissions to revoke NOVA PANEL and run this script again.');
    }
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Token exchange failed:', err.message);
    process.exit(1);
  }
});
