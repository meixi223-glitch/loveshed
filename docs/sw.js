/* loveshed service worker.
   Bump VERSION on every release: the new worker takes over at once and drops older caches.
   Pages, scripts, styles and qa.json are network-first (revalidated every time), so a release
   is never hidden behind an old cache; the cache is only the offline fallback.
   Images are cache-first. Cross-origin requests (the submission inbox, GitHub) are never touched. */
var VERSION = "2026-10-03-p12-craft-home";
var CACHE = "loveshed-" + VERSION;
var PRECACHE = [
  "./", "index.html", "skills.html", "qa.html", "submit.html", "mine.html", "style.css", "app.js", "qa.json", "manifest.webmanifest",
  "favicon.svg", "apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"
];
var NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(PRECACHE.map(function (u) { return new Request(u, { cache: "reload" }); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf("loveshed-") === 0 && k !== CACHE; })
                             .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function networkFirst(req) {
  // one cache entry per page: ./?scene=fire and ./ share the offline copy
  var u = new URL(req.url); u.search = ""; u.hash = "";
  var key = u.href;
  var net = fetch(req.url, { cache: "no-cache", credentials: "same-origin" }).then(function (res) {
    if (res.ok) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(key, copy); });
    }
    return res;
  });
  var timeout = new Promise(function (_, reject) { setTimeout(reject, NETWORK_TIMEOUT_MS); });
  return Promise.race([net, timeout]).catch(function () {
    return caches.match(key, { ignoreSearch: true }).then(function (hit) { return hit || net; });
  });
}

function cacheFirst(req) {
  return caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (/\.(png|svg|ico|webp|jpg)$/i.test(url.pathname)) e.respondWith(cacheFirst(req));
  else e.respondWith(networkFirst(req));
});
