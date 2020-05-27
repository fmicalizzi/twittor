// imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v4';
const DYNC_CACHE = 'dynamic-v2';
const INMT_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMT = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {



    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMT_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMT));



    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {

    const deleteCache =
        caches.keys().then(keys => {

            keys.forEach(key => {

                if (key !== STATIC_CACHE && key !== DYNC_CACHE && key !== INMT_CACHE) {
                    return caches.delete(key);
                }


            });

        });


    e.waitUntil(deleteCache);

});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request)
        .then(res => {

            if (res) return res;

            return fetch(e.request).then(newResp => {

                return actualizarCacheDync(DYNC_CACHE, e.request, newResp);

            });

        });

    e.respondWith(respuesta);

});