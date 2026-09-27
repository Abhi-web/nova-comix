import googleDriveService from '../services/googleDriveService.js';

export async function getStorageStatus(req, res) {
  try {
    const isConfigured = googleDriveService.isConfigured();

    if (!isConfigured) {
      return res.status(200).json({
        success: true,
        configured: false,
        message: 'Google Drive storage is not configured yet.',
        storageQuota: null,
      });
    }

    // Try to get quota and verify root folder
    let rootFolderVerified = false;
    let rootFolderName = null;
    let errorDetail = null;

    try {
      const rootFolder = await googleDriveService.verifyRootFolder();
      rootFolderVerified = true;
      rootFolderName = rootFolder.name;
    } catch (err) {
      errorDetail = err.message;
    }

    const quotaInfo = await googleDriveService.getStorageQuota();

    res.status(200).json({
      success: true,
      configured: true,
      rootFolderVerified,
      rootFolderName,
      rootFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
      storageQuota: quotaInfo ? quotaInfo.storageQuota : null,
      user: quotaInfo ? quotaInfo.user : null,
      errorDetail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve storage status',
      storageQuota: null,
    });
  }
}

export function getAuthUrl(req, res) {
  try {
    const authUrl = googleDriveService.getAuthUrl();
    res.status(200).json({
      success: true,
      authUrl,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to generate OAuth URL. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
    });
  }
}

export async function handleOAuthCallback(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Google Drive Authorization Failed</title><style>body{font-family:sans-serif;background:#0b0e14;color:#f0f2f5;padding:40px;text-align:center;}</style></head>
        <body>
          <h2 style="color:#f43f5e;">Authorization Denied or Failed</h2>
          <p>${error}</p>
        </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send('Authorization code missing from callback.');
  }

  try {
    const tokens = await googleDriveService.getTokensFromCode(code);

    if (tokens.refresh_token) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Google Drive Authorization Success</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B0E14; color: #E1E7EC; padding: 40px; display: flex; justify-content: center; }
              .card { max-width: 600px; background: #121721; border: 1px solid #1F2839; border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
              h1 { color: #10B981; font-size: 22px; margin-top: 0; }
              p { font-size: 14px; line-height: 1.6; color: #9AA7B5; }
              .box { background: #0B0E14; border: 1px solid #E5A93C44; border-radius: 8px; padding: 12px; margin: 16px 0; word-break: break-all; font-family: monospace; font-size: 13px; color: #E5A93C; }
              .btn { display: inline-block; background: #E5A93C; color: #0B0E14; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>✓ Google Drive Authorized Successfully!</h1>
              <p>Your Google Drive account has authorized NOVA PANEL with offline access. Please copy the refresh token below and add it to <code>backend/.env</code>:</p>
              <div class="box">GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</div>
              <p>After saving it in <code>backend/.env</code>, restart your server and Google Drive uploads will be fully active.</p>
              <a href="http://localhost:5173/admin" class="btn">Return to NOVA PANEL Admin</a>
            </div>
          </body>
        </html>
      `);
    } else {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Google Drive Linked</title><style>body{font-family:sans-serif;background:#0b0e14;color:#f0f2f5;padding:40px;text-align:center;}</style></head>
          <body>
            <h2 style="color:#e5a93c;">Account Connected (No New Refresh Token)</h2>
            <p>Google did not issue a new refresh token because this app was already authorized previously.</p>
            <p>If you need a new refresh token, visit <a href="https://myaccount.google.com/permissions" target="_blank" style="color:#e5a93c;">Google Account Permissions</a>, revoke NOVA PANEL, and authorize again.</p>
          </body>
        </html>
      `);
    }
  } catch (err) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Authorization Error</title><style>body{font-family:sans-serif;background:#0b0e14;color:#f0f2f5;padding:40px;text-align:center;}</style></head>
        <body>
          <h2 style="color:#f43f5e;">Token Exchange Failed</h2>
          <p>${err.message}</p>
        </body>
      </html>
    `);
  }
}

export async function streamReaderPage(req, res) {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({ success: false, message: 'fileId is required' });
  }

  // If storage is not configured, or if fileId is an external URL / fallback:
  if (!googleDriveService.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Google Drive storage is not configured on this server.',
    });
  }

  try {
    const { stream, mimeType, size } = await googleDriveService.getFileStream(fileId);

    res.set({
      'Content-Type': mimeType || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, immutable',
      'Accept-Ranges': 'bytes',
    });

    if (size) {
      res.set('Content-Length', size);
    }

    stream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Stream failed' });
      }
    });

    stream.pipe(res);
  } catch (error) {
    if (error.status === 404 || error.code === 404) {
      return res.status(404).json({ success: false, message: 'Image file not found on Google Drive' });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve image from storage',
    });
  }
}
