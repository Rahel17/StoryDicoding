const urlsToCache = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/scripts/index.js',
  '/scripts/pages/app.js',
  '/scripts/routes/routes.js',
  '/scripts/utils/index.js',
  '/manifest.json',
  '/images/logo.png',
  '/favicon.png',
];

async function checkUrls() {
  for (const url of urlsToCache) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      } else {
        console.log(`Success: ${url}`);
      }
    } catch (error) {
      console.error(`Error fetching ${url}: ${error.message}`);
    }
  }
}

checkUrls();
