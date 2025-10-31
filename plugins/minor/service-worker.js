const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BUILD_DIR = path.resolve(__dirname, '../../build');
const SW_FILE = path.resolve(BUILD_DIR, 'service-worker.js');
const OFFLINE_FILE = path.resolve(BUILD_DIR, 'offline.html');

function getAllFiles(dir, prefix = '/') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, path.join(prefix, file)));
    } else {
      if (
        file === '.DS_Store' ||
        file === '.htaccess' ||
        filePath.endsWith('service-worker.js')
      ) return;

      results.push(path.join(prefix, file));
    }
  });
  return results;
}

const files = getAllFiles(BUILD_DIR);

if (!fs.existsSync(OFFLINE_FILE)) {

  const cachedPagesRows = files
    .filter(f => f.endsWith('.html'))
    .map(f => `<tr class="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-300"><td class="px-4 py-2"><a href="${f}" class="text-blue-400 hover:underline">${f}</a></td></tr>`)
    .join('\n');

  fs.writeFileSync(
    OFFLINE_FILE,
    `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Вы офлайн</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-4">
  <main class="max-w-xl w-full">
    <h1 class="text-3xl font-bold mb-4">Вы офлайн</h1>
    <p class="mb-4 text-gray-400">Проверьте соединение и попробуйте снова.</p>
    <button 
      onclick="window.location.reload()" 
      class="px-6 py-2 mb-10 bg-blue-600 rounded hover:bg-blue-500 transition-colors duration-300">
      Попробовать снова
    </button>
    
    <h2 class="text-xl font-semibold mb-4">Доступные страницы из кеша:</h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left border border-gray-700">
        <thead>
          <tr class="bg-gray-800">
            <th class="px-4 py-2">Страница</th>
          </tr>
        </thead>
        <tbody>
          ${cachedPagesRows}
        </tbody>
      </table>
    </div>
  </main>
</body>
</html>`
  );
}

const hash = crypto
  .createHash('sha256')
  .update(files.map(f => fs.readFileSync(path.join(BUILD_DIR, f))).join(''))
  .digest('hex')
  .substring(0, 12);

const CACHE_NAME = `${hash}`;

const swContent = `
const CACHE_NAME = '${CACHE_NAME}';
const STATIC_ASSETS = ${JSON.stringify(files, null, 2)};
const DATO_ENDPOINT = 'https://graphql.datocms.com/';
const TTL = 10 * 60 * 1000; // 10 минут

// ============ Вспомогательные проверки ============

function isHttpUrl(url) {
  try {
    if (url.startsWith('/')) return true; // относительные пути от origin
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function isCacheableRequest(request) {
  return isHttpUrl(request.url);
}

function isCacheableResponse(request, response) {
  try {
    if (!response || !response.ok) return false;
    if (!isHttpUrl(response.url)) return false;
    return true;
  } catch (e) {
    return false;
  }
}

// ============ Установка и кеширование статических файлов ============

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[ServiceWorker] Caching', STATIC_ASSETS.length, 'files');
      for (const url of STATIC_ASSETS) {
        if (!isHttpUrl(url)) {
          console.warn('[SW] Пропущен (не http):', url);
          continue;
        }
        try {
          const response = await fetch(url);
          if (isCacheableResponse({ url }, response)) {
            await cache.put(url, response.clone());
          } else {
            console.warn('[SW] Пропущен (', response && response.status, '):', url);
          }
        } catch (err) {
          console.warn('[SW] Ошибка при загрузке:', url, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// ============ Активация и очистка старого кеша ============

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[ServiceWorker] Старый кеш удалён', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ============ Fetch-обработчик ============

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const reqUrl = event.request.url;
  if (!isHttpUrl(reqUrl)) return; // игнорируем chrome-extension:, devtools:, blob:, data:

  const requestUrl = new URL(reqUrl);

  if (requestUrl.searchParams.has('barba') || requestUrl.pathname.startsWith('/api/')) {
    return;
  }

  if (requestUrl.href === DATO_ENDPOINT) {
    event.respondWith(handleDatoCMSRequest(event));
    return;
  }

  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

// ============ Стратегии кеширования ============

async function cacheFirst(request) {
  if (!isCacheableRequest(request)) return fetch(request);

  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (isCacheableResponse(request, response)) {
      try {
        await cache.put(request, response.clone());
      } catch (err) {
        console.warn('[SW] cache.put failed for', request.url, err);
      }
    } else {
      console.warn('[SW] Не кешируем ответ (not ok or unsupported):', request.url, response && response.status);
    }
    return response;
  } catch (err) {
    console.warn('[SW] Cache-first failed', request.url, err);
    return cached;
  }
}

async function networkFirst(request) {
  if (!isCacheableRequest(request)) return fetch(request);

  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (isCacheableResponse(request, response)) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    return cached || caches.match('/offline.html');
  }
}

// ============ DatoCMS (GraphQL TTL Cache) ============

async function handleDatoCMSRequest(event) {
  const cloned = event.request.clone();
  const body = await cloned.text();

  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body));
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const cacheKey = new Request(\`\${DATO_ENDPOINT}?cache=\${hashHex}\`);
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(cacheKey);
  const now = Date.now();

  if (cachedResponse) {
    const fetchedAt = cachedResponse.headers.get('sw-fetched-at');
    if (fetchedAt && now - new Date(fetchedAt).getTime() < TTL) {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(event.request.clone());
    const headers = new Headers(networkResponse.headers);
    headers.append('sw-fetched-at', new Date().toISOString());
    const responseToCache = new Response(await networkResponse.clone().blob(), { headers });

    await cache.put(cacheKey, responseToCache.clone());
    return networkResponse;
  } catch (err) {
    if (cachedResponse) return cachedResponse;
    return new Response(JSON.stringify({ error: 'offline', message: 'No network and no cache' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503,
    });
  }
}
`;

fs.writeFileSync(SW_FILE, swContent);
console.log(`✅ Готово: service worker (${CACHE_NAME}) создан (файлов в кеше: ${files.length})`);
