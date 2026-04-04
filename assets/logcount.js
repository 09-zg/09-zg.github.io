// assets/logcount.js
const UtauTracker = (function() {
const BASE_URL = 'https://09tool.witchserver.jp/3_data/log.php';
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
// HTMLの btn-after から「変化後の姿」を取得（なければ今のまま）
const afterContent = btn.getAttribute('btn-after') || btn.innerHTML;
const showCount = btn.getAttribute('btn-hidecount') !== 'false';
btn.style.pointerEvents = 'none';
btn.style.opacity = '0.5';
const count = await _send(name);
// 中身をまるごと入れ替えて、数字が必要なら後ろに足すだけ！
btn.innerHTML = (showCount && count) ? `${afterContent}${count}` : afterContent;
}
};
})();
window.UtauTracker = UtauTracker;