const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve the .well-known folder for Universal Links & App Links
// Apple requires the Content-Type for the AASA file to be application/json
app.use('/.well-known', express.static(path.join(__dirname, '.well-known'), {
  setHeaders: (res, path) => {
    if (path.endsWith('apple-app-site-association')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

// A smart fallback route that automatically redirects to the App Store
app.get('*', (req, res) => {
  const userAgent = req.get('User-Agent') || '';

  // If the user is on an Android device, redirect them directly to the Google Play Store
  if (userAgent.match(/Android/i)) {
    console.log("Redirecting Android user to Play Store...");
    return res.redirect('https://play.google.com/store/apps/details?id=com.myfirstapp');
  }

  // If the user is on an iPhone/iPad, redirect them directly to the Apple App Store
  if (userAgent.match(/iPhone|iPad|iPod/i)) {
    console.log("Redirecting iOS user to App Store...");
    return res.redirect('https://apps.apple.com/us/app/your-app-id');
  }

  // If they are on a desktop or unknown device, show a nice Web Fallback page
  res.send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>MyFirstApp Web Experience</h1>
        <p>It looks like you are on a desktop! Scan this QR code to download our app!</p>
        <p><strong>Path requested:</strong> ${req.path}</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`To expose this to the internet so the Simulators can verify it, run in another terminal:`);
  console.log(`npx localtunnel --port ${PORT}`);
});
