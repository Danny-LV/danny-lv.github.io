'use strict';

const CACHE_NAME = 'static-cache-v2';
const FILES_TO_CACHE = [
  'index.html',
  'app.js',
  'calculator.js',
  'manifest.json',
  'style.css',
  'themes.css',
  'img/check.svg',
  'img/icons/android-chrome-192x192.png',
  'img/icons/android-chrome-512x512.png',
  'img/icons/apple-touch-icon.png',
  'img/icons/browserconfig.xml',
  'img/icons/favicon-16x16.png',
  'img/icons/favicon-32x32.png',
  'img/icons/favicon.ico',
  'img/icons/mstile-150x150.png',
  'img/icons/safari-pinned-tab.svg',
  'img/splash/iphonexr_splash.png',
];

// Устанавливаем service worker и кэшируем все содержимое
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE_NAME).then(c => c.addAll(FILES_TO_CACHE))));

// Извлекаем содержимое из кэша, если оно доступно, для 
// автономной поддержки и кэшируем новые ресурсы, если они доступны.
self.addEventListener('fetch', e => e.respondWith(
  caches.match(e.request).then((r) => {
    return r || fetch(e.request).then((res) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(e.request, res.clone());
        return res;
      })
    })
  })
));

// Чистим кэш
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
      if(CACHE_NAME.indexOf(key) === -1) {
        return caches.delete(key);
      }
    }));
  })
));
