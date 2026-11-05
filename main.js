// 枕と眠りのおやすみショップ ソーシャルギフト特集
(function () {
  'use strict';

  var ITEM_BASE = 'https://item.rakuten.co.jp/oyasumi/';
  var GIFT_QUERY = '/?gift=social'; // ソーシャルギフト購入への導線

  // いずれも isSocialGift:true を確認済み(2026/11/5)。say=添えるひとこと
  var ITEMS_LIGHT = [
    { id: '999-000900-20', say: '出張おつかれさま', name: 'iSleep 3Dアイマスク', sub: 'フリーサイズ', price: '1,000' },
    { id: '999-001000-20', say: '今日もおつかれさま', name: 'シルク洗顔ミトン', sub: 'iimin 国産シルク100%', price: '1,000' },
    { id: '500369', say: '昼休みくらい休んでね', name: '王様のうたた寝枕', sub: 'ネイビー', price: '4,180' },
    { id: '188-001104-20', say: 'いつもがんばってるね', name: 'シルクナイトキャップ', sub: 'ロングタイプ', price: '4,400' },
    { id: '188-001065-20', say: '寒くなったね あったかくしてね', name: 'あったか着る毛布', sub: 'ポケット付き フリーサイズ', price: '4,400' },
    { id: '571051', say: '誕生日おめでとう 大きいのが届くよ', name: 'BIGバナナ抱き枕', sub: '大人用', price: '4,950' }
  ];

  var ITEMS_FAMILY = [
    { id: '104-002012-12', say: 'いつもありがとう ふたりでどうぞ', name: '王様の足枕 ペアギフト', sub: '2個セット 手提げ袋付き', price: '6,160', from: true },
    { id: '104-002212-20', say: 'ふたりとも 元気でいてね', name: '王様の背中枕 ペアギフト', sub: '2個セット', price: '6,960' },
    { id: '104-000132-20', say: '立ち仕事おつかれさま', name: '王様の足枕 レディース', sub: '日本製', price: '4,500', from: true },
    { id: '104-000130-19', say: '毎日おつかれさま', name: '男の足枕', sub: '日本製', price: '4,500', from: true },
    { id: '104-000012-20', say: 'たまにはゆっくり休んでね', name: 'ママの夢枕', sub: '女性向けの枕', price: '7,700' },
    { id: '104-000001-19', say: '単身赴任おつかれさま', name: '男の夢枕', sub: '男性向けの枕', price: '7,700' }
  ];

  var ITEMS_MILESTONE = [
    { id: 's-500410', say: '新生活がんばってね', name: '王様の夢枕2', sub: '日本製', price: '8,800' },
    { id: 's-500406', say: 'これまでありがとうございました', name: '王様の抱き枕', sub: '日本製', price: '9,900' },
    { id: '500372', say: '体を大事にしてね', name: 'ママ・マタニティ抱き枕', sub: 'ピンク', price: '6,480' },
    { id: '346-002001-20', say: 'ご出産おめでとう', name: '白雲ベビーギフトセット', sub: 'ベビー枕・スタイ・ハンカチ', price: '5,500' }
  ];

  // FVのスマホ内で流す会話
  var CHATS = [
    { to: 'お母さん', time: '22:30', say: 'いつもありがとう おやすみ', img: '104-000132-20', label: '足枕', reply: 'えっ うれしい ありがとう' },
    { to: '田中さん', time: '22:48', say: '今までお世話になりました おやすみなさい', img: '999-000020-20', label: 'カタログギフト', reply: '好きな枕を選べるの？' },
    { to: 'ゆか', time: '23:05', say: '誕生日おめでとう おやすみ', img: '571051', label: '抱き枕', reply: 'バナナ！？ 大きい！' }
  ];

  var TIMING = { typing: 900, gift: 900, reply: 1100, hold: 2800 };
  var STAR_COUNT = 26;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html) node.innerHTML = html;
    return node;
  }

  function itemCard(item) {
    var a = el('a', 'item reveal');
    a.href = ITEM_BASE + item.id + GIFT_QUERY;
    a.innerHTML =
      '<p class="item-say">' + item.say + '</p>' +
      '<div class="item-img"><img src="img/' + item.id + '.jpg" alt="' + item.name + '" width="640" height="640" loading="lazy"></div>' +
      '<p class="item-name">' + item.name + '</p>' +
      '<p class="item-sub">' + item.sub + '</p>' +
      '<p class="item-price"><b>' + item.price + '</b>円' + (item.from ? '〜' : '') + '</p>';
    return a;
  }

  function renderGrid(id, items) {
    var grid = document.getElementById(id);
    items.forEach(function (item) { grid.appendChild(itemCard(item)); });
  }

  function giftBubble(c) {
    return el('div', 'msg-gift',
      '<img src="img/' + c.img + '.jpg" alt="">' +
      '<p>' + c.label + 'のギフトが届きました</p><span>ギフトを受け取る</span>');
  }

  function showChatStatic(chat, c) {
    chat.appendChild(el('div', 'msg msg-me', c.say));
    chat.appendChild(giftBubble(c));
    chat.appendChild(el('div', 'msg msg-you', c.reply));
  }

  function startChat() {
    var chat = document.getElementById('chat');
    var name = document.getElementById('chatName');
    var time = document.getElementById('chatTime');
    var index = 0;

    if (reduceMotion) { showChatStatic(chat, CHATS[0]); return; }

    function play() {
      var c = CHATS[index];
      index = (index + 1) % CHATS.length;
      chat.innerHTML = '';
      name.textContent = c.to;
      time.textContent = c.time;
      var typing = el('div', 'typing', '<i></i><i></i><i></i>');
      chat.appendChild(typing);
      setTimeout(function () {
        chat.removeChild(typing);
        chat.appendChild(el('div', 'msg msg-me', c.say));
      }, TIMING.typing);
      setTimeout(function () { chat.appendChild(giftBubble(c)); }, TIMING.typing + TIMING.gift);
      setTimeout(function () { chat.appendChild(el('div', 'msg msg-you', c.reply)); },
        TIMING.typing + TIMING.gift + TIMING.reply);
      setTimeout(play, TIMING.typing + TIMING.gift + TIMING.reply + TIMING.hold);
    }
    play();
  }

  // 夜空の星。位置は固定の式で決め、再読み込みでも同じ空にする
  function startStars() {
    var box = document.getElementById('stars');
    for (var i = 0; i < STAR_COUNT; i++) {
      var star = document.createElement('i');
      var size = 2 + (i % 3);
      star.style.left = ((i * 37) % 100) + '%';
      star.style.top = (i % 2 ? (i * 7) % 16 : 62 + (i * 11) % 36) + '%';
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.animationDelay = (-(i * 0.7)) + 's';
      box.appendChild(star);
    }
  }

  function startReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function startFloatCta() {
    var cta = document.getElementById('floatCta');
    var fv = document.querySelector('.fv');
    var foot = document.querySelector('.foot');
    function update() {
      var pastFv = window.scrollY > fv.offsetHeight * 0.6;
      var atFoot = foot.getBoundingClientRect().top < window.innerHeight;
      cta.classList.toggle('show', pastFv && !atFoot);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  var CAMPAIGN_END = new Date('2026-12-01T09:59:00+09:00');
  var DAY_MS = 86400000;
  var HOUR_MS = 3600000;
  var MINUTE_MS = 60000;
  var SECOND_MS = 1000;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function countdownHtml(remain) {
    var days = Math.floor(remain / DAY_MS);
    var hours = Math.floor((remain % DAY_MS) / HOUR_MS);
    var minutes = Math.floor((remain % HOUR_MS) / MINUTE_MS);
    var seconds = Math.floor((remain % MINUTE_MS) / SECOND_MS);
    return '<span class="cd-label">終了まで</span>' +
      (days > 0 ? '<b>' + days + '</b>日' : '') +
      '<b>' + pad(hours) + '</b>時間<b>' + pad(minutes) + '</b>分<b>' + pad(seconds) + '</b>秒';
  }

  function startEventCountdown() {
    var left = document.getElementById('eventLeft');
    var timer;
    function tick() {
      var remain = CAMPAIGN_END - new Date();
      if (remain <= 0) {
        left.hidden = true;
        clearInterval(timer);
        return;
      }
      left.innerHTML = countdownHtml(remain);
      left.hidden = false;
    }
    tick();
    timer = setInterval(tick, SECOND_MS);
  }

  renderGrid('gridLight', ITEMS_LIGHT);
  renderGrid('gridFamily', ITEMS_FAMILY);
  renderGrid('gridMilestone', ITEMS_MILESTONE);
  startChat();
  startStars();
  startReveal();
  startFloatCta();
  startEventCountdown();
})();
