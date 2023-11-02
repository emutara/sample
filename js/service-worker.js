// キャッシュしたいファイルの一覧を指定 --- (*1)
const cacheName = 'v1';
var urlsToCache = [
  'sample/',
  // '/index.html',
  '/sample/manifest.json',
  '/sample/js/service-worker.js',

  // '/emutara.github.io/sample/manifest.json',
  // '/emutara.github.io/sample/js/service-worker.js',
];

// インストール時に実行されるイベント --- (*2)
self.addEventListener('install', event => {
  //waitUntil waitUnitl 内に記述されたコードが成功しない限り install が完了しないことを保証してくれます。
  event.waitUntil(
    // キャッシュしたいファイルを指定
    caches.open(cacheName).then(cache => {
      debugger
      console.log("[Service Worker] Caching all: app shell and content");
      return cache.addAll(urlsToCache)//cache.addAll cache.open で指定したキャッシュ空間に対象となるファイルを保存する関数です。
    }).catch(function(e){
      console.log("[Service Worker] Caching failed");
      console.log(e)
    })
  )
});

// インストール後に実行されるイベント
self.addEventListener('activate', e => {
  // 必要に応じて古いキャッシュの削除処理などを行う
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches
          .match(event.request)
          .then(function(response) {
              return response ? response : fetch(event.request);
          })
  );
});