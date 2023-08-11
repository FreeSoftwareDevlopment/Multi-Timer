const staticDevCoffee = "multi-alarm-shark-ggy"
const assets = [
  ".",
  "index.html",
  "style.css",
  "script.js",
  "icons/icons8-alarm-48.png",
  "icons/icons8-alarm-96.png"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })
