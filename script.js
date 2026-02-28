//////////////////////////////////////////////////
//  初期処理
//////////////////////////////////////////////////
// 共通項目
let practiceDate = formatDate(new Date());
outputElement("toDayPlayDate" , practiceDate );
outputElement("toDayTotalthrow" , 0 );
outputElement("toDayTotalHat" , 0 );
let toDayTotalTime = "00:00:00";
let toDayStartTime = "";
//本数を数える
function setTodayThrow(num) {
  const current = Number(getElementText("toDayTotalthrow")) || 0;
  const cnt = current + Number(num);
  outputElement("toDayTotalthrow" , cnt );
}

function setTodayHat() {
  toDayTotalthrow = Number(getElementText("toDayTotalthrow"));
   outputElement("toDayTotalHat" , Number(getElementText("toDayTotalHat")) + 1 );
}

//ゲーム開始で使用する共通項目
let totalHistory = [];

//////////////////////////////////////////////////
// 画面上部のボタン 
//////////////////////////////////////////////////
document.querySelectorAll('.nav button').forEach(btn => {
  btn.onclick = () => {
    const id = btn.dataset.target;
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.toggle('active', s.id === id);
    });
  };
});

//////////////////////////////////////////////////
//  ヒット率画面で使用するメソッド
//////////////////////////////////////////////////
let hitHistoryLog = [];
let hitTarget="";
//ヒット率ゲームスタート
function hitStartGame() {
  //画面の更新
  outputElement("hitCurrentRound" , 1 );
  outputElement("hitTotalRound" , Number(getElementValue("hitRounds")) );
  outputElement("hitRroundInfo"    , `-` );
  outputElement("hitTotalThrow"  , `0` );
  outputElement("hitHitCount"     , `0` );
  outputElement("hitRate"      , `0%`);
  outputElement("hitHatTrick"     , `0` );
  hitTarget = getElementValue("hitTarget");
  toDayStartTime = new Date();
}
//ヒット率のレコードカウント
function hitBtn(hit) {
  //[終了]があれば後続の処理はしない
  cRound = getElementText("hitCurrentRound");
  if (cRound == "終了") return;
  
  cRound = Number(getElementText("hitCurrentRound"));
  cTotalRounds = Number(getElementText("hitTotalRound"));
  //ラウンド終了もしくはセットが終了していたら、処理しない
  if (cRound <= 0 || cRound > cTotalRounds) return;
  //値をセット
  setHitData( hit );
  
  //現在のラウンドをセット
  
  //--------------------------------------
  // セット進行中
  //--------------------------------------
  if (cRound < cTotalRounds) {
    cRound++;
    //次ラウンドの設定
    outputElement("hitCurrentRound" , cRound );
    return;
  }else if (cRound = cTotalRounds) {
    setHitHistory();
    return;
  }else {
    //何もしない
  }

}
function setHitData(hit) {
  setTodayThrow(3);
  //Round
  outputElement("hitRroundInfo" , Number(getElementText("hitCurrentRound")) );
  //投数
  outputElement("hitTotalThrow" , Number(getElementText("hitCurrentRound")) * 3 );
  //Hit数
  outputElement("hitHitCount" , Number(getElementText("hitHitCount")) + hit);
  //Hit率
  num1 = Number(getElementText("hitHitCount"));
  num2 = Number(getElementText("hitRroundInfo")) * 3;
  numRate = bulRate(num1,num2)
  outputElement("hitRate" ,`${numRate}` );
  if (hit == 3) {
    outputElement("hitHatTrick" , Number(getElementText("hitHatTrick")) + 1 );
    setTodayHat();
  }
}
function setHitHistory() {
  outputElement("toDayTime" ,cntTime(toDayStartTime));
  outputElement("hitCurrentRound" , `終了` );
  outputElement("hitTotalRound" , "" );
  //練習履歴
  str = "Hit :";
  str += (` T[` +  padStartUtil(5," ",hitTarget) +`],` )
  str += (`投数[` + padStartUtil(3," ",getElementText("hitTotalThrow")) +`], ` )
  str += (`Hit数[` +  padStartUtil(3," ",getElementText("hitHitCount")) +  `], `)
  str += (`Hit率[` + getElementText("hitRate") +  `], `);
  str += (`Hat数[` +  padStartUtil(3," ",getElementText("hitHatTrick")) +  `]`);
  hitHistoryLog.unshift(str);
  document.getElementById("hitHistory").innerText = hitHistoryLog.join("\n");
  setTotalHistory(str);
}

//////////////////////////////////////////////////
//  インブル画面で使用するメソッド
//////////////////////////////////////////////////
let bullHistoryLog = [];
let bullPoint="";
let bullLevel="";
setBullBtnValue();
// 難易度確定
function setBullBtnValue() {
  const levelSelect = getElementValue("bullLevel");
  let hardList =  [1,0,-1];
  let nomalList = [2,1,-1];
  let easyList = [2,1,0];
  let arr =  [];
  if(levelSelect == "Hard"){
    arr = hardList;
  }else if(levelSelect == "Med"){
    arr = nomalList;
  }else if(levelSelect == "Easy"){
    arr = easyList;
  }else {
    arr = [0,0,0];
  }
  document.querySelector(`.bull-btn[data-type="inbull"]`).textContent = arr[0];
  document.querySelector(`.bull-btn[data-type="bull"]`).textContent = arr[1];
  document.querySelector(`.bull-btn[data-type="other"]`).textContent = arr[2];
}
//インブルゲームスタート
function bullStartGame() {
  setBullBtnValue();
  //画面の更新
  outputElement("bullCurrentPoint" , 0 );
  outputElement("bullPointZan" , Number(getElementValue("bullPoint")));
  outputElement("bullCnt" , 1 );
  outputElement("bullCurrentRound" , 1 );
  outputElement("bullTotalThrow"  , `0` );
  outputElement("bullHitCount"     , `0` );
  outputElement("bullRate"      , `0%`);
  outputElement("bullHatTrick"     , `0` );
  bullPoint = getElementValue("bullPoint");
  bullLevel = getElementValue("bullLevel");
  toDayStartTime = new Date();
}

let isBusy = false;
let bullThrowCnt =0;
async function bullBtn(btn) {
  
  const throwCnt = Number(getElementText("bullCnt"));
  const value = Number(btn.textContent);
  
  if(getElementText("bullCurrentRound") == "終了" ) return;
  if(getElementText("bullCurrentRound") == "" ) return;
  if (isBusy) return;
  //ゲーム中の１本ごとに動く処理
  setTodayThrow(1);
  //本数
  outputElement("bullCnt" , throwCnt + 1 );
  
  //点数を計算
  outputElement("bullCurrentPoint" , Number(getElementText("bullCurrentPoint")) + value );
  let zanPoint =  Number(getElementText("bullPointZan")) - value;
  if(zanPoint > 0){
    outputElement("bullPointZan" , zanPoint);
  }else{
    outputElement("bullPointZan" , 0);
  }
  
  //投数
  outputElement("bullTotalThrow" , Number(getElementText("bullTotalThrow")) + 1 );
  
  //ヒット数
  const pos = btn.dataset.type;
  
  if( pos == "inbull" ||  pos == "bull"){
    outputElement("bullHitCount" , Number(getElementText("bullHitCount")) + 1 );
    bullThrowCnt = bullThrowCnt +1;
  }
  //Hit率
  num1 = Number(getElementText("bullHitCount"));
  num2 = Number(getElementText("bullTotalThrow"));
  numRate = bulRate(num1,num2)
  outputElement("bullRate" , numRate );
  
  //1ラウンド終わったときに集計する内容
  if(throwCnt == 3){
    //ハットトリック数
    if(bullThrowCnt == 3 ){
      outputElement("bullHatTrick" , Number(getElementText("bullHatTrick")) + 1 );
      setTodayHat();
    }
    
    //初期化
    bullThrowCnt = 0;
    outputElement("bullCnt" , 1 );
  }
  
  //残りの点数が０になったとき
  if(Number(getElementText("bullPointZan")) == 0){
    setbullHistory()
  }else{
    if(throwCnt == 3){
      //現在のラウンド
      outputElement("bullCurrentRound" , Number(getElementText("bullCurrentRound")) + 1 );
    }
  }
  //次のラウンドのボタンを誤って押さないようにする
  if(throwCnt == 3){
    isBusy = true;
    await sleep(3000);
    isBusy = false;
  }
}

function setbullHistory() {
  outputElement("toDayTime" ,cntTime(toDayStartTime));
  outputElement("bullCurrentRound" , "終了" );
  //練習履歴
  str = "Bull:";
  str += (padStartUtil(3," ",bullPoint) +`[` + padStartUtil(4," ",bullLevel) +`]` )
  str += (`,投数[` + padStartUtil(3," ",getElementText("bullTotalThrow")) +`]` )
  str += (`, Hit数[` + padStartUtil(3," ",getElementText("bullHitCount")) +`]`)
  str += (`, Hit率[` + getElementText("bullRate") +`]`);
  str += (`, Hat数[` + padStartUtil(3," ",getElementText("bullHatTrick")) +`]`);
  bullHistoryLog.unshift(str);
  document.getElementById("bullHistory").innerText = bullHistoryLog.join("\n");
  //totalの履歴
  setTotalHistory(str);
}

//////////////////////////////////////////////////
//  １０マーク画面で使用するメソッド
//////////////////////////////////////////////////
let markHistoryLog = [];
//テーブルを作成
const marks = ["20", "19", "18", "17", "16", "15", "BULL"];
function createMarkTable() {
  const table = document.getElementById("markTable");
  // ヘッダー行
  let thead = "<thead><tr><th>９マーク</th>";
  marks.forEach(m => {
    thead += `<th id="mark${m}">${m}</th>`;
  });
  thead += "</tr></thead>";
  // マーク数行
  let tbody = "<tbody><tr><td>マーク数</td>";
  marks.forEach(m => {
    tbody += `<td id="mark${m}num">0</td>`;
  });
  tbody += "</tr></tbody>";
  table.innerHTML = thead + tbody;
}
createMarkTable();

//値と背景色を更新する
function updateMarkCell(id, value) {
  const cell = document.getElementById(id);
  cell.textContent = value;
  cell.classList.toggle("over10", value >= 10);
}
//初期化
function clearMarkTable() {
  document.querySelectorAll("#markTable td[id$='num']").forEach(td => {
    td.textContent = 0;
    td.classList.remove("over10"); // 灰色も解除
  });
}
//10マークゲームスタート
function markStartGame() {
  //画面の更新
  outputElement("markCurrentRound" , 1 );
  outputElement("markCnt" , 1);
  outputElement("markTotalThrow" , 0 );
  outputElement("markRate" , 0);
  outputElement("markFullRate" , 0);
  outputElement("markHat" , 0);
  clearMarkTable();
  toDayStartTime = new Date();
}

let isMarkBusy =false;
let markRound=0;
let markCnt=0;
let markFullCnt=0;
let currentIndex = 0;
async function MarkBtn(value) {
  //押されないようにする
  if(getElementText("markCurrentRound") == "終了" ) return;
  if(getElementText("markCurrentRound") == "" ) return;
  if (isMarkBusy) return;
  setTodayThrow(1);
  markRound = markRound + value;
  markCnt = markCnt + value;
  markFullCnt = markFullCnt + value;
  
  // 値を更新
  const mark = marks[currentIndex];
  const id = `mark${mark}num`;
  let current = Number(getElementText(id)) || 0;
  let next = current + value;
  updateMarkCell(id, next);
  
  //本数
  const numCnt = Number(getElementText("markCnt"));
  //本数の更新
  outputElement("markCnt" , Number(getElementText("markCnt")) + 1);
  
  outputElement("markTotalThrow" , Number(getElementText("markTotalThrow")) + 1);
  
  if(numCnt == 3){
    const round = Number(getElementText("markCurrentRound"));
    
    if(mark != "BULL"){
      outputElement("markRate" , markRate(markCnt ,round));
    }
    outputElement("markFullRate" , markRate(markFullCnt ,round));
    if(markRound == 9){
      outputElement("markHat" , Number(getElementText("markHat")) + 1);
      setTodayHat();
    }
    //初期化
    markRound =0;
    outputElement("markCnt" , 1);
    outputElement("markCurrentRound" , Number(getElementText("markCurrentRound")) + 1);
  }
  
  // 10を超えたら次の番号へ進む
  if (next >= 10 && currentIndex < marks.length - 1) {
    currentIndex++;
  }
  
  if(mark == "BULL" && next>= 10){
    setMarkHistory();
  }
  //次のラウンドのボタンを誤って押さないようにする
  if(numCnt == 3){
    isMarkBusy = true;
    await sleep(3000);
    isMarkBusy = false;
  }
}


function setMarkHistory() {
  outputElement("toDayTime" ,cntTime(toDayStartTime));
  outputElement("markCurrentRound" , "終了");
  //練習履歴
  str = "Cricket:10Mark,";
  str += (`投数[` + padStartUtil(3," ",getElementText("markTotalThrow")) +`]` )
  str += (`,     Stats[ ` + padStartUtil(3," ",getElementText("markRate")))
  str += (`( ` + padStartUtil(3," ",getElementText("markFullRate")) +  `)]`)
  str += (`, Hat数[` + padStartUtil(3," ",getElementText("markHat")) +`]`);
  markHistoryLog.unshift(str);
  document.getElementById("markHistory").innerText = markHistoryLog.join("\n");
  //totalの履歴
  setTotalHistory(str);
}

//////////////////////////////////////////////////
//  共通処理
//////////////////////////////////////////////////
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0始まりなので+1
  const day = String(date.getDate()).padStart(2, '0');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  return `${year}/${month}/${day}(${weekday})`;
}

//画面のエレメント設定
function outputElement(eID, msg) {
  document.getElementById(eID).textContent = msg;
}
function getElementText(eID) {
  return document.getElementById(eID).textContent;
}
function getElementValue(eID) {
  return document.getElementById(eID).value;
}
function bulRate(bullcnt ,tRound) {
  const bullrate = tRound > 0 ? (bullcnt / tRound) * 100 : 0;
  return ( (bullrate.toFixed(0)).padStart(3," ")+ `%`)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function markRate(markCnt ,tRound) {
  const markrate = tRound > 0 ? (markCnt / tRound) : 0;
  return ( (markrate.toFixed(2)).padStart(4," "))
}

//時間の集計
function cntTime(sTime) {
  //練習時間の集計
  const endTime = new Date();
  //セット毎の練習時間を算出
  const diffSec = Math.floor((endTime - sTime) / 1000);
  timeTotal = toHHMMSS( diffSec ); 
  const sumSeconds = toSeconds(toDayTotalTime) + toSeconds(timeTotal);
  toDayTotalTime = toHHMMSS( sumSeconds ); 
  return toDayTotalTime;
}
function toHHMMSS(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}
function toSeconds(hhmmss) {
  const [h, m, s] = hhmmss.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}
//現在時間を取得
function getNowTime() {
 // 現在時刻を取得
  const now = new Date();
  // HH:mm:ss 形式に整形
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const timeStr = `${hh}:${mm}:${ss}`;
  return timeStr
}
function padStartUtil(padnum,padStr,str) {
  return String(str).padStart(padnum, padStr)
}
function setTotalHistory(str) {
  //
  outputElement("historyPlayDate" , getElementText("toDayPlayDate"));
  outputElement("historyPlayTime" , getElementText("toDayTime"));
  outputElement("historyTotalthrow" , getElementText("toDayTotalthrow"));
  outputElement("historyTotalHat" , getElementText("toDayTotalHat"));
  //練習履歴
  totalHistory.unshift(str);
  document.getElementById("totalHistory").innerText = totalHistory.join("\n");
  //DBに登録
  saveDbHistory();
}
//DBへの保存
function saveDbHistory() {
  const bdPlayDate = getElementText("toDayPlayDate");
  const dbPlayTime = getElementText("toDayTime");
  const dbTotalthrow = getElementText("toDayTotalthrow");
  const dbTotalHat = getElementText("toDayTotalHat");
  const dbHitHistory = hitHistoryLog.join("\n");
  const dbBullHistory = bullHistoryLog.join("\n");
  const dbMarkHistory = markHistoryLog.join("\n");
  const dbTotalHistory = totalHistory.join("\n");
  saveResult({
    date: bdPlayDate,
    time: dbPlayTime,
    count: dbTotalthrow,
    hatCount: dbTotalHat,
    hitHistoryLog: dbHitHistory,
    bullHistoryLog: dbBullHistory,
    markHistoryLog: dbMarkHistory,
    totalhistory: dbTotalHistory
  });
}
//////////////////////////////////////////////////
//  DB処理
//////////////////////////////////////////////////
// データベースを開く
let db;
const request = indexedDB.open("DartsDB", 1);

//DBの接続処理
request.onsuccess = (event) => {
  db = event.target.result;
  loadTodayData(); // ページロード時に呼び出す
   populateDateSelect();
};
//DB定義
request.onupgradeneeded = (event) => {
  db = event.target.result;
  // オブジェクトストア作成（主キーは autoIncrement）
  const store = db.createObjectStore("history", { keyPath: "date" });
};
//DBのセーブ
function saveResult(entry) {
  const transaction = db.transaction(["history"], "readwrite");
  const store = transaction.objectStore("history");
  store.put(entry);  // put は同じキーがあれば上書き、なければ追加
}

//初回ロード
function loadTodayData() {
  const transaction = db.transaction(["history"], "readonly");
  const store = transaction.objectStore("history");
  //日付
  let pDate = formatDate(new Date());

  const request = store.get(pDate);
  request.onsuccess = (event) => {
    const data = event.target.result;
    if (data) {
      outputElement("toDayPlayDate" , data.date );
      outputElement("toDayTime" , data.time );
      outputElement("toDayTotalthrow" , data.count);
      outputElement("toDayTotalHat" , data.hatCount);

      outputElement("hitHistory" , data.hitHistoryLog);
      outputElement("bullHistory" , data.bullHistoryLog);
      outputElement("markHistory" , data.markHistoryLog);

      outputElement("historyPlayDate" , data.date );
      outputElement("historyPlayTime" , data.time );
      outputElement("historyTotalthrow" , data.count);
      outputElement("historyTotalHat" , data.hatCount);
      outputElement("totalHistory" , data.totalhistory);
      //
      hitHistoryLog =data.hitHistoryLog.split("\n"); 
      bullHistoryLog =data.bullHistoryLog.split("\n"); 
      markHistoryLog =data.markHistoryLog.split("\n"); 
      totalHistory =data.totalhistory.split("\n"); 
    }else{
      outputElement("toDayTime" , "未練習" );
    }
  };
}

function populateDateSelect() {
  const transaction = db.transaction(["history"], "readonly");
  const store = transaction.objectStore("history");
  const request = store.getAllKeys();

  request.onsuccess = () => {
    const select = document.getElementById("historyDateSelect");
    select.innerHTML = '<option value="">-- 選択 --</option>';
    request.result.sort().forEach(date => {
      const option = document.createElement("option");
      option.value = date;
      option.textContent = date;
      select.appendChild(option);
    });
  };
}
document.getElementById("viewHistoryBtn").addEventListener("click", () => {
  const date = document.getElementById("historyDateSelect").value;
  if (!date) return alert("日付を選択してください");

  const transaction = db.transaction(["history"], "readonly");
  const store = transaction.objectStore("history");
  const req = store.get(date);

  req.onsuccess = () => {
    const data = req.result;
    if (data) {
      outputElement("historyPlayDate" , data.date );
      outputElement("historyPlayTime" , data.time );
      outputElement("historyTotalthrow" , data.count);
      outputElement("historyTotalHat" , data.hatCount);
      outputElement("totalHistory" , data.totalhistory);
    } else {
      alert("データが存在しません");
    }
  };
});
// 選択日付を削除
document.getElementById("deleteHistoryBtn").addEventListener("click", () => {
  const date = document.getElementById("historyDateSelect").value;
  if (!date) return alert("日付を選択してください");

  if (!confirm(`${date} の履歴を削除しますか？`)) return;

  const transaction = db.transaction(["history"], "readwrite");
  const store = transaction.objectStore("history");
  store.delete(date);

  transaction.oncomplete = () => {
    alert("削除完了");
    populateDateSelect(); // 選択リスト更新
    outputElement("historyPlayDate" , "" );
    outputElement("historyPlayTime" , "" );
    outputElement("historyTotalthrow" , "");
    outputElement("historyTotalHat" , "");
    outputElement("totalHistory" , "");
  };
});