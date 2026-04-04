// assets/logcount.js
const UtauTracker = (function() {
const BASE_URL = 'https://09tool.witchserver.jp/3_data/log.php';

// 【重要】送信中かどうかを管理する「旗」
let isSending = false;

async function _send(type) {
// もし送信中なら、この命令は無視して終了する（これで連打やバグを防ぐ）
if (isSending) return null;

isSending = true; // 送信開始！

// 名前（type）を安全に送れるように整える
const url = `${BASE_URL}?type=${encodeURIComponent(type)}`;

try {
const response = await fetch(url, { method: 'GET' });
if (!response.ok) {
isSending = false;
return null;
}
const text = await response.text();

// 送信が終わってから少しだけ（0.5秒）待ってから「旗」を下ろす
// これで一瞬の間に何度も送られるのを防ぎます
setTimeout(() => { isSending = false; }, 500);

return text.trim(); 
} catch (e) {
console.error("送信失敗:", e);
isSending = false; // 失敗しても旗を下ろして次に行けるようにする
return null;
}
}

return {
// DLボタンなどのカウント
logCount: function(type) {
_send(type);
},

// いいねボタン
sendLike: async function() {
const btn = document.getElementById('like_btn');
const status = document.getElementById('like_status');

if (!btn || btn.style.pointerEvents === 'none') return;

btn.style.pointerEvents = 'none';
btn.style.opacity = '0.5';

const count = await _send('like');

btn.innerText = 'いいね！送信済み';
if (count) {
status.innerText = `（累計 ${count} 件！ありがとうございます）`;
} else {
status.innerText = '（ありがとうございます）';
}
}
};
})();

window.UtauTracker = UtauTracker;
