(() => {
// -----------------------------------------------------------
// 1. まず「仕組み」を作る（関数を定義する）
// -----------------------------------------------------------
const ページを入れ替える = (フォルダ, ページ名, 履歴に保存 = true) => {
const ファイルパス = フォルダ.startsWith('http') 
? フォルダ 
: (フォルダ.includes('.html') ? フォルダ : `${フォルダ}/index.html`);
const 表示エリア = document.getElementById('表示場所');
if (!表示エリア) return;

表示エリア.style.opacity = 0;

fetch(ファイルパス).then(r => r.text()).then(t => {
表示エリア.innerHTML = t;
activeFilters = []; 

表示エリア.querySelectorAll('script').forEach(oldScript => {
const newScript = document.createElement('script');
newScript.textContent = oldScript.textContent;
document.body.appendChild(newScript).parentNode.removeChild(newScript);
});

表示エリア.style.opacity = 1;
window.scrollTo(0, 0);

const footerLink = document.querySelector('footer .btn');
const homeIcon = document.getElementById('home-icon');

if (ページ名 !== 'home') {
if (footerLink) footerLink.setAttribute('onclick', "window.site.changePage('home', 'home')");
if (homeIcon) homeIcon.style.display = 'inline';
} else {
if (footerLink) footerLink.setAttribute('onclick', "window.site.changePage('owner', 'owner')");
if (homeIcon) homeIcon.style.display = 'none';
}

if (履歴に保存) {
history.pushState({ フォルダ: フォルダ, 名前: ページ名 }, '', `?p=${ページ名}`);
}
});
};

let activeFilters = [];

const フィルター実行 = (category) => {
const items = document.getElementsByClassName("item");
const allBtn = document.getElementById('btn-all');
if (!allBtn) return; 

if (category === 'all') {
activeFilters = [];
} else {
const index = activeFilters.indexOf(category);
if (index > -1) { 
activeFilters.splice(index, 1); 
} else { 
activeFilters.push(category); 
}
}

document.querySelectorAll('.filter-menu button').forEach(btn => {
btn.classList.remove('active');
});

if (activeFilters.length === 0) {
allBtn.classList.add('active');
} else {
activeFilters.forEach(cat => {
const target = document.getElementById('btn-' + cat);
if (target) target.classList.add('active');
});
}

for (let i = 0; i < items.length; i++) {
if (activeFilters.length === 0) {
items[i].classList.remove("hide");
} else {
const hasMatch = activeFilters.some(cat => items[i].classList.contains(cat));
items[i].classList.toggle("hide", !hasMatch);
}
}
};

window.site = { 
changePage: ページを入れ替える,
toggleFilter: フィルター実行 
};

window.onpopstate = (イベント) => {
if (イベント.state) {
ページを入れ替える(イベント.state.フォルダ, イベント.state.名前, false);
} else {
location.reload();
}
};

// -----------------------------------------------------------
// 2. 最後に「実行」する（ここで404チェックも行う）
// -----------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const currentP = params.get('p') || 'home';

// 404.html からのバトンを受け取る
const isError = sessionStorage.getItem('error_flag');
if (isError === 'true') {
sessionStorage.removeItem('error_flag');
sessionStorage.removeItem('error_from');
// エラーページを表示
ページを入れ替える('dist/page/error', '404', false);
} else {
// 通常通り表示
ページを入れ替える(currentP, currentP, false);
}

document.addEventListener("touchstart", () => {}, {passive: true});

})();
