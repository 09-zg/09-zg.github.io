//reload.js
;(() => {
let startY = 0;
let pullThreshold = 150; // 誤爆防止のため少し長めに設定
let isAtTop = false;

window.addEventListener('touchstart', (e) => {
if (window.scrollY === 0) {
isAtTop = true;
startY = e.touches[0].clientY;
} else {
isAtTop = false;
}
}, { passive: true });

window.addEventListener('touchmove', (e) => {
if (!isAtTop) return;

const currentY = e.touches[0].clientY;
const deltaY = currentY - startY;

if (deltaY > 0) {
if (e.cancelable) e.preventDefault();

if (deltaY > pullThreshold) {
isAtTop = false;

// --- スーパーリロード（キャッシュ無視）の実行 ---
console.log("スーパーリロードを実行します");

// URLに現在の時刻をパラメータとして付与することで、
// ブラウザに「新しいページだ」と認識させ、キャッシュを無視させます。
/*
const url = new URL(window.location.href);
url.searchParams.set('reload', Date.now()); 
*/

// --- 修正版：現在のパラメータを引き継ぐ ---
const url = new URL(window.location.href);
url.searchParams.set('reload', Date.now()); 
// 'p' パラメータ（現在のページ）がすでにあれば、それは保持されたまま reload だけ追加されます
window.location.href = url.toString();


window.location.href = url.toString();
}
}
}, { passive: false });

console.log("run：reload.js (Super Reload Mode)");
})();
