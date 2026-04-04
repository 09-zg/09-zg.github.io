// assets/logcount.js
const UtauTracker = (function() {
const BASE_URL = 'https://witchserver.jp';
let isSending = false;
async function _send(type) {
if (isSending) return null;
isSending = true;
const url = `${BASE_URL}?type=${encodeURIComponent(type)}`;
try {
const response = await fetch(url, { method: 'GET' });
if (!response.ok) { isSending = false; return null; }
const text = await response.text();
setTimeout(() => { isSending = false; }, 500);
return text.trim(); 
} catch (e) {
console.error("送信失敗:", e);
isSending = false; return null;
}
}
return {
logCount: function(type) {
_send(type);
},
sendLike: async function(name = 'like', btn) {
if (!btn || btn.style.pointerEvents === 'none') return;
// HTMLの data-after に書かれた文字を取得する
const afterText = btn.getAttribute('data-after') || btn.innerText;
// HTMLの data-show-count が "false" なら数字を出さない
const showCount = btn.getAttribute('data-show-count') !== 'false';
btn.style.pointerEvents = 'none';
btn.style.opacity = '0.5';
const count = await _send(name);
// 文字を入れ替え。数字を出す設定なら後ろに数字をつける
btn.innerText = (showCount && count) ? `${afterText}${count}` : afterText;
}
};
})();
window.UtauTracker = UtauTracker;
