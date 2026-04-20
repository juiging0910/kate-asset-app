import React, { useState, useRef, useEffect } from "react";

// ── 產品知識庫 ──
const DISCLAIMER = "本頁所載產品資訊僅供參考，由凱特資產管理顧問提供，不構成任何投資建議或要約。所有產品均涉及風險，過往表現不代表未來回報。投保前請詳閱相關保單條款，並諮詢您的專屬顧問。";

const DEFAULT_PRODUCT_GROUPS = [
  {
    cat:"🇭🇰 香港保險", color:"var(--gold)", dimColor:"var(--gold-dim)", border:"rgba(200,168,75,.22)",
    items:[
      {company:"富邦", name:"富域多元貨幣", country:"香港", type:"分紅保單", min:"USD 20,000/年", payTerms:["躉繳優惠","2年","5年"], breakeven:"", irr:"", tags:["不可撤銷信託","五種貨幣"], suitable:"台灣客戶，小孩海外留學", notes:"不可撤銷信託，五種貨幣"},
      {company:"義大利忠意", name:"啟航創富卓越版", country:"義大利", type:"分紅保單", min:"USD 13,000/年", payTerms:["躉繳優惠","2年","5年"], breakeven:"兩年期第四年回本", irr:"", tags:["第四年回本","近200年歷史"], suitable:"想提早退休規劃", notes:"第四年回本，近200年歷史悠久"},
      {company:"安達", name:"傳承守創V", country:"美國", type:"分紅保單", min:"USD 5,000/年", payTerms:["躉繳優惠","2年","5年"], breakeven:"兩年期第五年回本，五年期第八年回本", irr:"", tags:["折扣最多","回本快"], suitable:"小資族長期規劃", notes:"可利用折扣放大本金"},
      {company:"蘇黎世", name:"瑞駿IUL", country:"瑞士", type:"IUL指數型萬用壽險", min:"USD 5,000/年", payTerms:["躉繳優惠","2年","5年"], breakeven:"五年閉鎖期", irr:"", tags:["保底3%上不封頂","可月配"], suitable:"想要保本投資", notes:"保底3%上不封頂，可月配"},
      {company:"安盛AXA", name:"盛利", country:"法國", type:"分紅保單", min:"USD 3,000/年", payTerms:["躉繳優惠"], breakeven:"", irr:"", tags:["9種貨幣自由轉換"], suitable:"貿易商，小孩海外留學，外匯操作者", notes:"9種貨幣自由轉換"},
      {company:"永明", name:"星河尊享2", country:"加拿大", type:"分紅保單", min:"USD 15,000/年", payTerms:["躉繳優惠","2年","5年"], breakeven:"", irr:"", tags:["多元貨幣","戰爭條款","信託選項全面","五星級第一名"], suitable:"年長者，保證收益最快", notes:"多元貨幣，戰爭條款，信託選項全面，五星級保險獎項第一名，歸元紅利"},
      {company:"永明", name:"永延壽險", country:"加拿大", type:"終身壽險", min:"USD 3,000/年", payTerms:["躉繳優惠","6年","12年"], breakeven:"", irr:"", tags:["多元貨幣","戰爭條款","信託選項"], suitable:"創業者風險分散", notes:"多元貨幣，戰爭條款，信託選項全面"},
      {company:"富衛FWD", name:"盈聚天下 分紅儲蓄", country:"香港", type:"分紅保單", min:"USD 10,000/年", payTerms:["躉繳優惠","2年","5年"], breakeven:"兩年期第三年回本，五年期第八年回本", irr:"", tags:["最快第三年回本","保監局推薦","五星級第三名"], suitable:"想回本最快", notes:"最快第三年回本，保監局推薦，五星級保險獎項第三名"},
    ]
  },
  {
    cat:"🇸🇬 新加坡保險", color:"var(--blue)", dimColor:"var(--blue-dim)", border:"rgba(72,120,192,.22)",
    items:[
      {company:"AIA友邦", name:"PIL指數型萬能壽險", country:"美國", type:"IUL指數型萬用壽險", min:"保額 USD 500,000", payTerms:["躉繳優惠","2年","5年","10年","20年"], breakeven:"", irr:"", tags:["保底封頂9%","壽險槓桿高"], suitable:"", notes:"保底封頂9%，壽險槓桿高"},
      {company:"AIA友邦", name:"PIW百樂財富永傳", country:"美國", type:"分紅保單", min:"USD 100,000/年（躉繳）\nUSD 20,000/年（5年）", payTerms:["躉繳優惠","5年"], breakeven:"", irr:"", tags:[], suitable:"", notes:""},
      {company:"大東方", name:"定期壽險", country:"新加坡", type:"定期壽險", min:"", payTerms:["躉繳優惠","2年","5年","10年","12年","15年","20年","靈活"], breakeven:"", irr:"", tags:[], suitable:"", notes:""},
    ]
  },
  {
    cat:"🇧🇲 百慕達保險", color:"var(--rose)", dimColor:"var(--rose-dim)", border:"rgba(196,120,128,.22)",
    items:[
      {company:"富衛FWD", name:"指數萬用壽險", country:"香港", type:"IUL指數型萬用壽險", min:"保額 USD 500,000", payTerms:["躉繳優惠"], breakeven:"", irr:"", tags:["保底封頂9%","壽險槓桿高"], suitable:"中小企業主防火牆", notes:"保底封頂9%，壽險槓桿高"},
    ]
  },
  {
    cat:"💰 固定收益", color:"var(--green)", dimColor:"var(--green-dim)", border:"rgba(58,170,120,.22)",
    items:[
      {company:"萬兆豐", name:"金益求金", country:"香港", type:"私募固定收益", min:"USD 10,000", payTerms:["躉繳優惠"], breakeven:"", irr:"6%", tags:["一年一約","CRS不申報"], suitable:"", notes:"一年一約，免CRS"},
      {company:"萬兆豐", name:"金益求兆", country:"香港", type:"私募固定收益", min:"USD 30,000", payTerms:["躉繳優惠"], breakeven:"", irr:"6%", tags:["一年一約","CRS不申報"], suitable:"", notes:"一年一約，免CRS"},
    ]
  },
  {
    cat:"🏠 房地產", color:"var(--silver)", dimColor:"var(--silver-dim)", border:"rgba(148,168,192,.22)",
    items:[
      {company:"萬兆豐", name:"瓦努阿圖預售屋", country:"香港", type:"房地產預售", min:"USD 400,000", payTerms:["躉繳優惠"], breakeven:"", irr:"", tags:["送永久居留","黃金護照","CRS不申報"], suitable:"", notes:"送永久居留，一個月即可拿到黃金護照（費用另計）"},
    ]
  },
  {
    cat:"💎 貴金屬", color:"#b8902a", dimColor:"rgba(184,144,42,.12)", border:"rgba(184,144,42,.22)",
    items:[
      {company:"萬兆豐貴金屬", name:"實體黃金", country:"香港", type:"實體黃金", min:"", payTerms:["躉繳優惠"], breakeven:"", irr:"", tags:["CRS不申報","實物資產"], suitable:"", notes:"免CRS"},
      {company:"萬兆豐", name:"金盈滿堂（黃金存摺）", country:"香港", type:"黃金存摺", min:"1公斤黃金", payTerms:["躉繳優惠"], breakeven:"", irr:"", tags:["一年一約","CRS不申報"], suitable:"", notes:"一年一約，免CRS"},
    ]
  },
  {
    cat:"🇺🇸 美國保險", color:"var(--md)", dimColor:"rgba(106,120,144,.1)", border:"rgba(106,120,144,.2)",
    items:[], comingSoon:true
  },
  {
    cat:"📋 現增認購", color:"#2a6ea8", dimColor:"rgba(42,110,168,.1)", border:"rgba(42,110,168,.22)",
    items:[]
  },
];

function buildKB(groups){
  const obj={};
  groups.forEach(g=>{
    (g.items||[]).forEach(p=>{
      obj[`${p.company} — ${p.name}`]={region:g.cat,type:p.type,summary:p.notes||p.name,suitable:p.suitable,features:p.tags||[]};
    });
  });
  return obj;
}
function buildKBText(groups){
  return groups.map(g=>
    `${g.cat}：${(g.items||[]).map(p=>`${p.company}${p.name}（${p.type}，最低${p.min||"洽詢"}，${(p.tags||[]).join("、")}）`).join("、")}`
  ).join("。");
}

// Static versions used before login (fallback)
const PRODUCT_KB_OBJ = buildKB(DEFAULT_PRODUCT_GROUPS);
const PRODUCTS_LIST = Object.keys(PRODUCT_KB_OBJ);
const PRODUCT_KB_TEXT = buildKBText(DEFAULT_PRODUCT_GROUPS);

const THEMES=[{key:"inheritance",label:"傳承規劃",icon:"👨‍👩‍👧‍👦"},{key:"retirement",label:"退休規劃",icon:"🏖️"},{key:"protection",label:"資產保全",icon:"🛡️"},{key:"overseas",label:"海外配置",icon:"🌏"},{key:"tax",label:"節稅規劃",icon:"📋"},{key:"geopolitical",label:"地緣政治",icon:"⚠️"}];

// ── AI helpers（所有 Anthropic 呼叫走 /api/ai，金鑰留在伺服器端）──
async function callAI(body){
  const res=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
  if(!res.ok){const e=await res.text();throw new Error(`AI API error ${res.status}: ${e}`);}
  return res.json();
}

// ── 即時指數（透過 Vercel Edge Function，伺服器端抓 Yahoo Finance）──
async function fetchAllIndices(){
  const res=await fetch("/api/indices",{signal:AbortSignal.timeout(8000)});
  if(!res.ok)throw new Error(`API error ${res.status}`);
  const data=await res.json();
  return(data.indices||[]).map(idx=>({...idx,loading:false}));
}
// fetchYahooIndex 仍保留供貴金屬使用
async function fetchYahooIndex(symbol){
  try{
    const res=await fetch(`/api/indices?symbol=${encodeURIComponent(symbol)}`,{signal:AbortSignal.timeout(8000)});
    if(!res.ok)throw new Error(`API ${res.status}`);
    const data=await res.json();
    const idx=data.indices?.[0];
    if(!idx)throw new Error("no data");
    return{price:idx.val,chg:idx.chg,up:idx.up};
  }catch{
    throw new Error(`fetchYahooIndex failed: ${symbol}`);
  }
}
// ── 新聞主題 SVG 插圖生成 ──
function getNewsSVG(tag,emoji,cls){
  const isDark=true;
  const bg=cls==="tm"?"#0a1828":cls==="ti"?"#100a1a":cls==="tb"?"#0a1a10":"#1a0a0a";
  const accent=cls==="tm"?"#3a7abf":cls==="ti"?"#7a5abf":cls==="tb"?"#3aaa70":"#c8a84b";
  const accentDim=cls==="tm"?"rgba(58,122,191,.18)":cls==="ti"?"rgba(122,90,191,.18)":cls==="tb"?"rgba(58,170,112,.18)":"rgba(200,168,75,.18)";

  if(tag==="總經"||cls==="tm"){
    return`<svg viewBox="0 0 430 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="240" preserveAspectRatio="xMidYMid slice">
      <rect width="430" height="240" fill="${bg}"/>
      <circle cx="380" cy="40" r="120" fill="${accentDim}"/>
      <circle cx="50" cy="200" r="80" fill="${accentDim}" opacity=".5"/>
      ${[0,1,2,3,4,5,6,7,8,9,10].map((i)=>{
        const x=30+i*38; const h=40+Math.sin(i*0.9)*50+i*6; const y=200-h;
        return`<rect x="${x}" y="${y}" width="22" height="${h}" rx="3" fill="${accent}" opacity="${0.3+i*0.06}"/>`;
      }).join("")}
      <polyline points="${[0,1,2,3,4,5,6,7,8,9,10].map((i)=>`${41+i*38},${180-30-Math.sin(i*0.9)*50-i*6}`).join(" ")}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
      ${[0,1,2,3,4,5,6,7,8,9,10].map((i)=>`<circle cx="${41+i*38}" cy="${180-30-Math.sin(i*0.9)*50-i*6}" r="3.5" fill="${accent}" opacity=".8"/>`).join("")}
      <text x="30" y="36" font-family="serif" font-size="42" opacity=".15" fill="white">${emoji}</text>
    </svg>`;
  }
  if(tag==="股市"||tag==="個股"){
    const pts=[[0,80],[40,65],[80,72],[120,45],[160,55],[200,30],[240,42],[280,20],[320,35],[360,15],[400,25]];
    return`<svg viewBox="0 0 430 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="240" preserveAspectRatio="xMidYMid slice">
      <rect width="430" height="240" fill="${bg}"/>
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${accent}" stop-opacity="0.25"/><stop offset="100%" stop-color="${accent}" stop-opacity="0.02"/></linearGradient></defs>
      <circle cx="360" cy="60" r="100" fill="${accentDim}"/>
      <path d="M${pts.map(([x,y])=>`${x+15},${y+100}`).join(" L")} L415,240 L15,240 Z" fill="url(#sg)"/>
      <polyline points="${pts.map(([x,y])=>`${x+15},${y+100}`).join(" ")}" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map(([x,y],i)=>i%3===0?`<circle cx="${x+15}" cy="${y+100}" r="4" fill="${accent}" opacity=".9"/>`:"").join("")}
      ${[40,80,120,160,200,240,280,320,360,400].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="240" stroke="white" stroke-width="0.3" opacity=".06"/>`).join("")}
      ${[60,100,140,180].map(y=>`<line x1="0" y1="${y}" x2="430" y2="${y}" stroke="white" stroke-width="0.3" opacity=".06"/>`).join("")}
      <text x="30" y="42" font-family="serif" font-size="42" opacity=".12" fill="white">${emoji}</text>
    </svg>`;
  }
  if(tag==="台灣資產"){
    return`<svg viewBox="0 0 430 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="240" preserveAspectRatio="xMidYMid slice">
      <rect width="430" height="240" fill="${bg}"/>
      <circle cx="215" cy="120" r="160" fill="${accentDim}" opacity=".6"/>
      <circle cx="215" cy="120" r="100" fill="${accentDim}" opacity=".4"/>
      <circle cx="215" cy="120" r="50" fill="${accentDim}" opacity=".5"/>
      ${[0,30,60,90,120,150,180,210,240,270,300,330].map((deg)=>{
        const r1=55,r2=155,rad=deg*Math.PI/180;
        return`<line x1="${215+r1*Math.cos(rad)}" y1="${120+r1*Math.sin(rad)}" x2="${215+r2*Math.cos(rad)}" y2="${120+r2*Math.sin(rad)}" stroke="${accent}" stroke-width="0.8" opacity=".2"/>`;
      }).join("")}
      <text x="185" y="135" font-family="serif" font-size="52" opacity=".2" fill="white">${emoji}</text>
      <text x="30" y="36" font-family="serif" font-size="42" opacity=".12" fill="white">🏝️</text>
    </svg>`;
  }
  // default
  return`<svg viewBox="0 0 430 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="240" preserveAspectRatio="xMidYMid slice">
    <rect width="430" height="240" fill="${bg}"/>
    <circle cx="380" cy="30" r="130" fill="${accentDim}"/>
    <circle cx="60" cy="210" r="90" fill="${accentDim}" opacity=".4"/>
    ${[0,1,2,3,4].map(i=>`<circle cx="${80+i*70}" cy="${160-i*15}" r="${20+i*5}" fill="${accent}" opacity="${0.08+i*0.04}" />`).join("")}
    <text x="30" y="42" font-family="serif" font-size="42" opacity=".15" fill="white">${emoji}</text>
  </svg>`;
}
// ── 新聞配圖 ──
// 根據主題關鍵字映射到 Unsplash 精選圖片 ID（穩定可用）
const NEWS_IMG_MAP={
  "federal reserve":"photo-1611974789855-9c2a0a7236a3",
  "interest rate":"photo-1611974789855-9c2a0a7236a3",
  "inflation":"photo-1549421263-5ec394a5ad4c",
  "economy":"photo-1504868584819-f8e8b4b6d7e3",
  "stock market":"photo-1535320903710-d993d3d77d29",
  "wall street":"photo-1535320903710-d993d3d77d29",
  "semiconductor":"photo-1518770660439-4636190af475",
  "chip":"photo-1518770660439-4636190af475",
  "taiwan":"photo-1565967511849-76a60a516170",
  "gold":"photo-1610375461246-83df859d849d",
  "currency":"photo-1580519542036-c47de6196ba5",
  "ai":"photo-1677442135703-1787eea5ce01",
  "nvidia":"photo-1518770660439-4636190af475",
  "gdp":"photo-1504868584819-f8e8b4b6d7e3",
  "geopolitics":"photo-1586348943529-beaae6c28db9",
  "war":"photo-1586348943529-beaae6c28db9",
  "inheritance":"photo-1450101499163-c8848c66ca85",
  "estate":"photo-1450101499163-c8848c66ca85",
  "retirement":"photo-1517048676732-d65bc937f952",
  "pension":"photo-1517048676732-d65bc937f952",
  "default_tg":"photo-1586348943529-beaae6c28db9",  // 國際局勢
  "default_ti":"photo-1450101499163-c8848c66ca85",  // 資產傳承
  "default_tr":"photo-1517048676732-d65bc937f952",  // 退休規劃
  "default_tt":"photo-1535320903710-d993d3d77d29",  // 投資焦點
  "default_tm":"photo-1611974789855-9c2a0a7236a3",
  "default_tb":"photo-1610375461246-83df859d849d",
};
function getNewsImgUrl(imgUrl,imgQuery,cls){
  // 優先使用 OG image URL
  if(imgUrl&&imgUrl.startsWith("http"))return imgUrl;
  // fallback: curated Unsplash
  const q=(imgQuery||"").toLowerCase();
  let id="";
  for(const [key,val] of Object.entries(NEWS_IMG_MAP)){
    if(q.includes(key)){id=val;break;}
  }
  if(!id) id=NEWS_IMG_MAP[`default_${cls||"tg"}`]||NEWS_IMG_MAP["default_tg"];
  return`https://images.unsplash.com/${id}?w=800&q=75&fit=crop&auto=format`;
}

async function searchNews(query){
  const data=await callAI({model:"claude-sonnet-4-20250514",max_tokens:1000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:query}]});
  return data.content?.filter(b=>b.type==="text").map(b=>b.text).join("\n")||"";
}
async function generateAI(prompt,maxTokens=1500){
  const data=await callAI({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]});
  return data.content?.[0]?.text||"";
}
async function aiChat(messages,systemPrompt){
  const data=await callAI({model:"claude-haiku-4-5-20251001",max_tokens:600,system:systemPrompt,messages});
  return data.content?.[0]?.text||"抱歉，請稍後再試。";
}

const ADVISOR_SYSTEM=`你是凱特資產管理的專屬線上顧問，代表凱特與客戶溝通。個性：專業、溫暖、親切，像一位懂得傾聽的私人財富顧問。

產品知識庫：${JSON.stringify(PRODUCT_KB_OBJ)}

【重要：以下為台灣稅務與財務的正確數據，回答時必須以此為準，不得與此矛盾】

▌房地合一稅 2.0（2021年7月1日起）
個人持有：
- 持有 2 年以內：45%
- 持有超過 2 年、未逾 5 年：35%
- 持有超過 5 年、未逾 10 年：20%
- 持有超過 10 年：15%
- 自住且設籍滿 6 年：10%（獲利 400 萬以內免稅）
法人/公司持有：一律 45%

▌遺產稅（現行）
- 免稅額：1,333 萬元
- 稅率級距：5,000 萬以下 10%、5,000 萬至 1 億 15%、逾 1 億 20%
- 配偶扣除額：553 萬、每位直系血親卑親屬扣除額：56 萬
- 父母扣除額：每人 138 萬、喪葬費扣除額：138 萬
- 壽險死亡給付免計入遺產，但超過 3,740 萬部分須計入個人基本所得額

▌贈與稅
- 每人每年免稅額：244 萬元
- 稅率：2,500 萬以下 10%、2,500 萬至 5,000 萬 15%、逾 5,000 萬 20%
- 婚嫁贈與（子女結婚）：額外 100 萬免稅

▌綜合所得稅（114 年度，115 年 5 月申報）
- 稅率級距：59 萬以下 5%、59–133 萬 12%、133–266 萬 20%、266–498 萬 30%、逾 498 萬 40%
- 免稅額：每人 9.7 萬
- 標準扣除額：單身 13.1 萬、夫妻合併 26.2 萬
- 薪資所得特別扣除額：上限 21.8 萬
- 幼兒學前特別扣除額：第 1 名 15 萬、第 2 名以上 22.5 萬
- 長照特別扣除額：每人 18 萬
- 房租支出特別扣除額：上限 18 萬

▌房屋稅
- 自住：1.2%（全國最多 3 戶）
- 非自住（囤房稅 2.0，2024年7月起）：2%–4.8%（各縣市不同）

▌土地增值稅
- 自用住宅優惠稅率：10%（需自住且設籍）
- 一般稅率：20%、30%、40%（依漲價倍數）

▌境外所得與CRS
- 台灣居民境外所得超過 100 萬須申報最低稅負
- CRS（共同申報準則）：台灣已加入，金融帳戶資訊與多國交換

▌壽險相關
- 保險給付（死亡）不計入遺產（實質課稅原則除外）
- 躉繳投資型保單注意實質課稅原則

回答規則：
1. 繁體中文，語氣自然親切
2. 所有稅務數字必須以上方知識庫為準，不得自行推算或猜測
3. 介紹產品時只給 50 字摘要，問客戶想進一步了解哪個部分
4. 客戶追問才提供細節，一次只說一個重點
5. 數字從知識庫引用
6. 遇到不確定或知識庫未涵蓋的內容，說「這個我幫您記下來，請凱特稍後確認，建議諮詢專業稅務顧問」
7. 不要用條列式或標題，就是自然對話語氣
8. 涉及稅務規劃時，提醒客戶以專業稅務顧問的意見為準`;

const QUICK_OPTIONS=[
  {label:"了解產品",action:"product_menu"},
  {label:"配置建議",action:"ai",msg:"我想了解適合我的資產配置建議"},
  {label:"傳承規劃",action:"ai",msg:"我想了解如何透過保險做傳承規劃"},
  {label:"地緣風險",action:"ai",msg:"台海地緣政治風險升溫，我的資產配置需要調整嗎？"},
  {label:"市場動態",action:"ai",msg:"請問最近的市場情況如何？"},
];

const QA_SUGGESTIONS=["什麼是複利？","為什麼要做資產配置？","分紅保單安全嗎？","匯率風險怎麼理解？","什麼時候適合買保險？","私募投資風險高嗎？"];

// ── Static Data ──
const stocks=[
  {icon:"🍎",name:"Apple",code:"AAPL",price:"189.30",chg:"+1.24%",up:true,open:"186.82",high:"190.15",low:"186.10",vol:"52.4M",mktcap:"2.93T"},
  {icon:"🔍",name:"Alphabet",code:"GOOGL",price:"163.45",chg:"+0.87%",up:true,open:"162.03",high:"164.20",low:"161.80",vol:"18.2M",mktcap:"2.05T"},
  {icon:"⚡",name:"Tesla",code:"TSLA",price:"175.20",chg:"-2.13%",up:false,open:"179.10",high:"179.50",low:"174.30",vol:"88.6M",mktcap:"558B"},
  {icon:"💾",name:"台積電",code:"2330.TW",price:"905.00",chg:"+1.90%",up:true,open:"888.00",high:"908.00",low:"886.00",vol:"32.1M",mktcap:"23.5T"},
  {icon:"🏗️",name:"中鋼",code:"2002.TW",price:"26.90",chg:"-0.74%",up:false,open:"27.10",high:"27.20",low:"26.80",vol:"15.8M",mktcap:"218B"},
];
const indices=[
  {name:"台灣加權",val:"—",chg:"—",up:true,loading:true},
  {name:"S&P 500",val:"—",chg:"—",up:true,loading:true},
  {name:"那斯達克",val:"—",chg:"—",up:true,loading:true},
  {name:"日經 225",val:"—",chg:"—",up:true,loading:true},
];
const ALL_NEWS=[
  {cls:"tg",tag:"國際局勢",imgQuery:"geopolitics world map conflict",title:"台海局勢升溫，高資產族群加速境外資產布局",time:"2小時前",src:"Reuters",body:"近期台海周邊軍事活動頻繁，解放軍軍機及艦艇繞台次數創近三個月新高。美國國防部隨即重申對台安全承諾，並加速對台軍售審核流程。此波緊張態勢引發國際投資機構重新評估亞太地區風險溢價，台灣相關資產短期承壓。\n\n地緣政治風險升溫直接影響台灣高資產族群的財富保全策略。根據私人銀行業者統計，過去一季台灣客戶境外資產配置需求較上季成長逾40%，香港與新加坡成為最主要目標市場。資產外移趨勢明顯加速，尤其集中在USD 50萬以上的高淨值客戶群。\n\n凱特觀點：地緣政治風險是無法迴避的長期課題。建議高資產客戶以「分散管轄區」為核心策略，透過香港或新加坡分紅保單，將30-50%的可投資資產配置於台灣管轄範圍外，保單身故保障同時具有傳承效益，是兼顧安全與報酬的優先選項。",keyStats:[{label:"境外配置需求",value:"+40%"},{label:"建議境外比例",value:"30-50%"}]},
  {cls:"ti",tag:"資產傳承",imgQuery:"estate planning inheritance family wealth",title:"台灣遺產稅改革討論再起，信託與保單成最佳工具",time:"4小時前",src:"工商時報",body:"立法院財政委員會最新會期排入遺產稅制改革討論，部分立委提案將最高稅率由20%調升至30%，並縮減壽險免稅上限。現行制度下，壽險保險金不計入遺產，享有3,740萬的基本所得稅免稅額，是台灣高資產家庭最常用的傳承工具之一。若法案通過，現有規劃將需全面檢視。\n\n根據財政部統計，去年台灣遺產稅申報件數年增12%，平均每筆遺產稅額高達NT$ 438萬。遺產稅制的不確定性促使越來越多家庭提前規劃，境外保單因不計入台灣遺產而備受青睞。法律顧問估計，若稅率調升，百億家族每年稅負可能增加逾億元。\n\n凱特觀點：不論稅改結果如何，提早布局永遠優於被動等待。建議客戶善用現行3,740萬壽險免稅額，同時以香港或新加坡保單補足境外傳承缺口。以安達傳承守創V為例，2年繳清後即可鎖定複利增值，兼顧傳承效率與資金彈性。",keyStats:[{label:"壽險免稅上限",value:"NT$3,740萬"},{label:"平均遺產稅額",value:"NT$438萬"}]},
  {cls:"tr",tag:"退休規劃",imgQuery:"retirement planning savings pension",title:"勞退基金報酬率創新低，自主退休規劃刻不容緩",time:"6小時前",src:"聯合報",body:"勞動部最新公布數據顯示，勞工退休基金今年首季報酬率僅0.8%，遠低於目標的6%年化報酬率，主因全球股市波動加劇與債市承壓。依目前趨勢，勞退基金若無法達標，未來20年將面臨嚴峻的給付缺口壓力，預估缺口達NT$ 9.2兆。對45歲以上的勞工而言，光靠勞退金平均每月僅能領約NT$ 1.7萬，遠不足以維持退休生活品質。\n\n以雙薪家庭每月生活費NT$ 8萬計算，30年退休期間需備妥約NT$ 2,880萬。扣除勞退與勞保，一般上班族的退休缺口高達NT$ 1,500-2,000萬。若不提早規劃，退休後生活水準將大幅下降。理財顧問建議45歲前每月應額外儲備至少NT$ 3-5萬用於退休準備。\n\n凱特觀點：填補退休缺口最有效的工具之一是具有長期複利特性的分紅保單。以蘇黎世瑞駿IUL為例，保底3%上不封頂，五年閉鎖後可月配，非常適合作為退休現金流來源。建議40-55歲客戶，以10-15%的月收入配置境外保單，30年後可累積可觀的退休備糧。",keyStats:[{label:"平均退休缺口",value:"NT$1,500萬+"},{label:"勞退首季報酬",value:"0.8%"}]},
  {cls:"tt",tag:"投資焦點",imgQuery:"stock market trading screen financial",title:"美股科技股強彈，台積電ADR跟漲2.3%",time:"1小時前",src:"Bloomberg",body:"美國聯準會最新會議紀錄顯示鴿派立場，帶動科技股全面反彈，那斯達克指數單日上漲1.8%，標普500也收復月線。輝達、蘋果、微軟等科技巨頭均上漲逾2%，市場對AI基礎建設持續投資的預期升溫。台積電ADR跟漲2.3%，反映外資對台灣半導體供應鏈的信心恢復。\n\n台股明日開盤預料將同步走強，預估台積電將挑戰1,000元整數關卡。外資期貨部位由淨空翻多，是近三個月最大的一次方向轉換，顯示短線資金面顯著改善。法人分析，若Fed釋放更明確的降息訊號，台股有望突破前高。但需留意美元指數走弱可能帶來的匯率壓力。\n\n凱特觀點：股市反彈提供了檢視整體資產配置的好時機。建議不要因股市上漲而忽略保障型資產的配置。以富衛盈聚天下分紅儲蓄為例，最快第三年回本，保監局推薦，可作為股票部位的穩定壓艙石，在市場波動時提供確定性報酬。",keyStats:[{label:"那斯達克漲幅",value:"+1.8%"},{label:"台積電ADR",value:"+2.3%"}]},
];
const katePosts=[
  {id:1,badge:"本週精選",title:"半導體族群低接時機已至，重點留意台積電與聯發科",preview:"外資近三日持續回補，AI 伺服器需求仍強勁。建議分批布局，單次倉位控制在 5% 以內。",body:"近期半導體族群在外資持續買超帶動下，走勢明顯強於大盤。台積電與聯發科作為主要受惠標的，後市仍具相當投資吸引力。\n\n技術面觀察，台積電在880-890元區間獲得強力支撐，目前反彈至905元。\n\n配置建議：可分三批買進，每批建議占整體股票部位的5-7%，並設定-8%的停損線。"},
  {id:2,badge:"配置建議",title:"第二季建議：防禦與成長各半，靜待降息訊號",preview:"建議維持 50% 科技成長股、30% 防禦型債券 ETF、20% 現金部位。",body:"進入第二季，總體經濟環境維持「降息在望、但時間未定」的格局。凱特建議採取防禦與成長並重的均衡配置策略。\n\n成長部位（50%）：以科技股為核心，重點配置半導體、AI相關及平台型科技。\n\n防禦部位（30%）：以中期美國公債ETF為主。\n\n現金部位（20%）：保留流動性，預計在Fed正式宣布降息後降至10%以下。"},
];
const healthItems=[
  {lb:"緊急備用金",v:"6.2個月",s:"建議 6 個月以上",p:80,c:"#4aaa80"},
  {lb:"負債比率",v:"18%",s:"健康上限 30%",p:82,c:"#7898c0"},
  {lb:"退休準備度",v:"62%",s:"目標 80%",p:62,c:"#c8a84b"},
  {lb:"保險覆蓋率",v:"55%",s:"建議 70% 以上",p:55,c:"#c47880"},
];
const NOTIFS=[
  {id:5,icon:"📅",cls:"ni-green",title:"繳費日提醒",desc:"保單繳費提醒將自動顯示於此",time:"",unread:false},
];
// 台灣稅務行事曆（固定日期，每年自動適用）
const TAX_CALENDAR=[
  {key:"income_tax",   icon:"💼",name:"綜合所得稅申報",    month:5, day:1,  endMonth:5, endDay:31, desc:"114年度綜所稅申報期間",        warnDays:30},
  {key:"house_tax",    icon:"🏠",name:"房屋稅開徵",        month:5, day:1,  endMonth:6, endDay:2,  desc:"房屋稅繳納期限",              warnDays:14},
  {key:"land_tax",     icon:"🌍",name:"地價稅開徵",        month:11,day:1,  endMonth:11,endDay:30, desc:"地價稅繳納期限",              warnDays:14},
  {key:"car_tax",      icon:"🚗",name:"牌照稅申報繳納",    month:4, day:1,  endMonth:4, endDay:30, desc:"汽機車牌照稅繳納期限",         warnDays:14},
  {key:"fuel_tax",     icon:"⛽",name:"燃料使用費開徵",    month:7, day:1,  endMonth:9, endDay:30, desc:"燃料使用費繳納期限",           warnDays:14},
  {key:"gift_tax",     icon:"🎁",name:"贈與稅申報提醒",    month:12,day:15, endMonth:12,endDay:31, desc:"年底前善用 244 萬免稅額",      warnDays:30},
  {key:"estate_plan",  icon:"📋",name:"遺產稅試算提醒",    month:1, day:1,  endMonth:1, endDay:31, desc:"新年度資產傳承規劃時間",        warnDays:7},
];

const NOTIF_SETTINGS=[
  {icon:"📈",cls:"ni-blue",name:"股票漲跌警報",key:"stock"},
  {icon:"📅",cls:"ni-green",name:"保單繳費日提醒",key:"payment"},
  {icon:"💱",cls:"ni-blue",name:"匯率大幅波動",key:"fx"},
  {icon:"🗓️",cls:"ni-gold",name:"稅務報稅時程提醒",key:"tax"},
];
const TERMS=[
  {word:"殖利率",en:"Yield",icon:"📈",iconCls:"ti-blue",cat:"債市",simple:"你借錢給政府或公司，他們每年還你多少利息的百分比。殖利率越高，代表這筆錢幫你賺的利息越多。",detail:"殖利率是債券投資的核心指標。當市場對未來悲觀時，大家搶買債券避險，債券價格上漲，殖利率就會下降。",example:"美國10年期公債殖利率從5%降到4.28%，代表市場有更多人搶著買這張債券，認為未來情況不太妙。"},
  {word:"ETF",en:"Exchange Traded Fund",icon:"🧺",iconCls:"ti-gold",cat:"股票",simple:"把很多股票裝在一個籃子裡，你只要買這個籃子，就等於同時擁有裡面所有的股票，風險比較分散。",detail:"ETF在股票市場上交易，像買賣股票一樣方便。常見的有追蹤台灣50大企業的元大台灣50（0050）。",example:"買一張0050，等於同時持有台積電、鴻海、聯發科等台灣前50大公司的股份。"},
  {word:"升息 / 降息",en:"Rate Hike / Rate Cut",icon:"🏦",iconCls:"ti-silver",cat:"總經",simple:"升息就是央行讓借錢變貴，大家少借少花，讓物價降下來。降息則相反，讓借錢變便宜，刺激大家消費投資。",detail:"利率是整個金融市場的地基。升息通常讓股市承壓；降息則有利股市和債市。",example:"Fed把利率從5.5%降到5.25%，代表美國企業借錢成本變低，更敢擴張，股市通常有正面反應。"},
  {word:"分紅保單",en:"Participating Policy",icon:"📋",iconCls:"ti-gold",cat:"保險",simple:"保險公司把一部分投資獲利分給你，稱為「分紅」。分成保證和非保證兩部分，長期累積可以很可觀。",detail:"分為「歸原紅利」（每年公佈後保證）和「特別紅利」（非保證）兩種。",example:"富衛盈聚天下II，供款期滿後累積分紅可顯著提升保單現金價值。"},
  {word:"私募基金",en:"Private Fund",icon:"💰",iconCls:"ti-silver",cat:"投資",simple:"不在公開市場買賣的投資產品，只開放給高資產投資人。門檻較高但潛在回報也較高，流動性較低。",detail:"私募固定收益類似借錢給特定企業或項目，約定固定利率和還款期，風險比股票低但比定存高。",example:"萬兆豐金益求兆，年化報酬率約6%，資金鎖定期1-3年，適合有閒置資金的高資產客戶。"},
];

// ── 股票現價批次查詢 ──
async function fetchStockPrices(codes){
  const priceMap=new Map();
  if(!codes.length)return priceMap;
  try{
    const res=await fetch(`/api/quotes?symbols=${encodeURIComponent(codes.join(","))}`,{signal:AbortSignal.timeout(10000)});
    if(res.ok){
      const data=await res.json();
      (data.indices||[]).forEach(item=>{
        if(item.symbol&&item.val){
          const price=parseFloat(String(item.val).replace(/,/g,""));
          if(price>0)priceMap.set(item.symbol,price);
        }
      });
      if(priceMap.size===codes.length)return priceMap;
    }
  }catch{}
  // Fallback：對拿不到的逐一 AI 搜尋
  const missing=codes.filter(c=>!priceMap.has(c));
  await Promise.allSettled(missing.map(async code=>{
    try{
      const isTW=code.endsWith(".TW");
      const raw=await searchNews(isTW?`台股 ${code.replace(".TW","")} 今日收盤價`:`${code} stock latest price today`);
      const data=await callAI({model:"claude-haiku-4-5-20251001",max_tokens:200,messages:[{role:"user",content:`找出股票「${code}」的最新股價。只輸出純JSON：{"price":數字}\n資料：${raw.slice(0,1000)}`}]});
      const result=data.content?.[0]?.text||"";
      const cleaned=result.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(cleaned.slice(cleaned.indexOf("{"),cleaned.lastIndexOf("}")+1));
      if(parsed.price&&parsed.price>0)priceMap.set(code,parsed.price);
    }catch{}
  }));
  return priceMap;
}

// ── 貴金屬持倉連動金價 ──
function syncMetalHoldingPrices(holdings,metalPrices,usdTwd){
  if(!holdings.length)return holdings;
  const goldUSDNum=parseFloat(String(metalPrices.goldUSD).replace(/,/g,""))||0;
  if(goldUSDNum<=0)return holdings;
  const goldPerGramUSD=Math.round((goldUSDNum/31.1035)*100)/100;
  const goldPerGramTWD=Math.round(goldPerGramUSD*usdTwd*100)/100;
  let changed=false;
  const updated=holdings.map(h=>{
    const isGoldTWD=h.currency==="TWD"||h.product?.includes("黃金");
    const newPrice=isGoldTWD?goldPerGramTWD:goldPerGramUSD;
    if(Math.abs((h.currentPricePerGram||0)-newPrice)>0.01){changed=true;return{...h,currentPricePerGram:newPrice};}
    return h;
  });
  return changed?updated:holdings;
}

async function askAI(question){
  const data=await callAI({model:"claude-haiku-4-5-20251001",max_tokens:500,messages:[{role:"user",content:`你是凱特資產管理財商顧問。繁體中文，簡潔回答。

【正確稅務數據，回答時必須以此為準】
房地合一稅2.0個人稅率：2年內45%、2-5年35%、5-10年20%、10年以上15%、自住設籍6年10%（400萬免稅）。
遺產稅：免稅額1,333萬，稅率10%/15%/20%三級。壽險死亡給付不計遺產但超過3,740萬計入最低稅負。
贈與稅：每人每年244萬免稅，稅率10%/15%/20%。
綜所稅114年度：59萬以下5%、59-133萬12%、133-266萬20%、266-498萬30%、逾498萬40%。
不確定的數字不要自行推算，回答「建議諮詢專業稅務顧問確認最新規定」。

純JSON格式：{"answer":"100字內解答","keyPoint":"一句話重點","related":["相關問題1","相關問題2","相關問題3"]}
問題：${question}`}]});
  const raw=data.content?.[0]?.text||"";
  try{
    const cleaned=raw.replace(/```json|```/g,"").trim();
    const start=cleaned.indexOf("{");const end=cleaned.lastIndexOf("}")+1;
    return JSON.parse(cleaned.slice(start,end));
  }catch{return{answer:raw.replace(/```json|```|\{|\}/g,"").trim()||"抱歉，請再試一次。",keyPoint:"",related:[]};}
}
function generateChartPath(up){
  const w=280,h=120;let y=up?80:40;
  let path=`M 0 ${y}`;
  for(let i=1;i<=12;i++){
    const x=(w/12)*i;const noise=(Math.random()-.45)*(up?-8:8)*1.5;
    y=Math.max(10,Math.min(h-10,y+noise));
    if(up&&i===12)y=30;if(!up&&i===12)y=90;
    path+=` L ${x} ${y}`;
  }
  return path;
}

// ─────────── CSS ───────────
const S=`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Noto+Serif+TC:wght@300;400;500&family=Noto+Sans+TC:wght@300;400;500;700&family=JetBrains+Mono:wght@500;600;700&family=Cinzel:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --ink:#ede9e3;--card:#ffffff;--card2:#f5f2ec;--card3:#ebe7df;
    --gold:#9a6e20;--gold2:#b8862a;--gold-dim:rgba(154,110,32,0.10);
    --silver:#5a6878;--silver-dim:rgba(90,104,120,0.10);
    --rose:#b05060;--rose-dim:rgba(176,80,96,0.10);
    --green:#2a8a5a;--green-dim:rgba(42,138,90,0.10);
    --red:#c03040;--blue:#2a5ea8;--blue-dim:rgba(42,94,168,0.10);
    --td:#1a0e05;--tm:#2a1508;--tl:#0e1218;
    --md:#4a3020;--bl:rgba(140,110,80,0.18);
  }
  html,body{background:var(--ink);}
  .app{max-width:430px;margin:0 auto;min-height:100vh;font-family:'Noto Sans TC',sans-serif;color:var(--tl);position:relative;}
  .page{padding-bottom:90px;min-height:100vh;}

  /* ── LOGIN ── */
  .login{min-height:100vh;display:flex;flex-direction:column;}
  .lt{flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:64px 36px 44px;background:linear-gradient(170deg,#1a0c05 0%,#2a1608 65%,#1c0e05 100%);position:relative;overflow:hidden;}
  .lt::before{content:'';position:absolute;top:-80px;left:-60px;width:320px;height:320px;background:radial-gradient(circle,rgba(200,168,75,.09) 0%,transparent 70%);}
  .lb{background:#faf8f4;padding:36px 32px 52px;border-radius:26px 26px 0 0;}
  .l-en{font-family:'Cinzel',serif;font-size:14px;letter-spacing:6px;color:var(--gold);opacity:.7;margin-bottom:14px;text-transform:uppercase;}
  .l-brand{font-family:'Noto Serif TC',serif;font-size:42px;font-weight:600;color:#f0f2f8;line-height:1.2;letter-spacing:4px;margin-bottom:8px;}
  .l-brand span{color:var(--gold);}
  .l-tag{font-family:'Cinzel',serif;font-size:15px;letter-spacing:5px;color:rgba(240,242,248,.3);}
  .l-lbl{font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;color:var(--md);text-transform:uppercase;margin-bottom:8px;}
  .l-inp{width:100%;background:#fff;border:1px solid var(--bl);border-radius:12px;padding:15px 18px;color:var(--td);font-size:15px;font-family:'Noto Sans TC',sans-serif;margin-bottom:18px;outline:none;transition:border-color .25s;}
  .l-inp:focus{border-color:var(--gold);}
  .l-btn{width:100%;padding:17px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:15px;font-weight:600;letter-spacing:5px;cursor:pointer;}
  .l-foot{text-align:center;font-size:15px;color:var(--md);margin-top:18px;}

  /* ── NAV (4 tabs) ── */
  .bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:rgba(28,14,5,.98);backdrop-filter:blur(24px);border-top:1px solid rgba(200,160,80,.25);display:flex;padding:10px 0 24px;z-index:100;}
  .ni{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;color:rgba(220,200,170,.80);font-size:15px;letter-spacing:.5px;transition:color .2s;font-family:'Cinzel',serif;position:relative;font-weight:500;}
  .ni.active{color:#e8c87a;}
  .ni.active::before{content:'';position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:24px;height:2.5px;background:#e8c87a;border-radius:2px;}
  .ni-ic{font-size:24px;}
  .ni-badge{position:absolute;top:-2px;right:50%;transform:translateX(140%);width:15px;height:15px;background:var(--red);border-radius:50%;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff;}

  /* ── SHARED ── */
  .ph{padding:52px 22px 24px;background:linear-gradient(165deg,#0c1420 0%,#1c0f08 100%);position:relative;overflow:hidden;}
  .ph::after{content:'';position:absolute;top:-50px;right:-50px;width:220px;height:220px;background:radial-gradient(circle,rgba(200,168,75,.07) 0%,transparent 65%);pointer-events:none;}
  .ph-en{font-family:'Cinzel',serif;font-size:15px;letter-spacing:5px;color:var(--gold);opacity:.6;text-transform:uppercase;margin-bottom:8px;}
  .ph-t{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#f0f2f8;letter-spacing:1px;}
  .ph-s{font-size:15px;color:rgba(240,242,248,.38);letter-spacing:1.5px;margin-top:5px;}
  .sec{font-family:'Cinzel',serif;font-size:15px;letter-spacing:4px;color:rgba(240,242,248,.28);text-transform:uppercase;padding:18px 18px 10px;display:flex;align-items:center;gap:12px;}
  .sec::after{content:'';flex:1;height:1px;background:rgba(240,242,245,.07);}
  .back-btn{display:inline-flex;align-items:center;gap:6px;position:absolute;top:52px;left:16px;z-index:10;background:rgba(28,15,8,.6);backdrop-filter:blur(8px);border:1px solid rgba(240,242,248,.12);border-radius:20px;padding:6px 14px;font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:rgba(240,242,248,.6);cursor:pointer;}
  .toast{position:fixed;bottom:110px;left:50%;transform:translateX(-50%);background:rgba(255,252,245,.96);backdrop-filter:blur(12px);border:1px solid rgba(200,168,75,.3);border-radius:14px;padding:12px 20px;font-family:'Cinzel',serif;font-size:13px;letter-spacing:2px;color:#2c1e0f;z-index:400;white-space:nowrap;animation:fadeup .3s ease;box-shadow:0 4px 20px rgba(0,0,0,.15);}
  @keyframes fadeup{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  .add-btn{margin:12px 16px 0;width:calc(100% - 32px);background:transparent;border:1px dashed rgba(200,168,75,.25);border-radius:12px;padding:13px;font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:rgba(200,168,75,.4);cursor:pointer;transition:all .2s;display:block;}
  .add-btn:hover{border-color:var(--gold);color:var(--gold);}

  /* ── SUB-TABS ── */
  .sub-tabs{display:flex;background:rgba(28,15,8,.3);border-bottom:1px solid rgba(240,242,248,.08);overflow-x:auto;}
  .sub-tabs::-webkit-scrollbar{display:none;}
  .st{flex-shrink:0;padding:14px 20px;font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:rgba(245,220,170,.95);cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;text-transform:uppercase;font-weight:500;}
  .st.active{color:#f5d060;border-bottom-color:#f5d060;font-weight:700;}

  /* ── HOME ── */
  .home-hero{padding:52px 20px 20px;background:linear-gradient(165deg,#0c1420 0%,#1c0f08 100%);position:relative;overflow:hidden;}
  .home-hero::before{content:'';position:absolute;top:-60px;right:-40px;width:280px;height:280px;background:radial-gradient(circle,rgba(200,168,75,.08) 0%,transparent 65%);pointer-events:none;}
  .home-greeting{font-family:'Cinzel',serif;font-size:15px;letter-spacing:4px;color:rgba(200,168,75,.6);text-transform:uppercase;margin-bottom:4px;}
  .home-name{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#f0f2f8;margin-bottom:2px;}
  .home-date{font-size:15px;color:rgba(240,242,248,.3);letter-spacing:1.5px;margin-bottom:20px;}

  /* 總資產大卡 */
  .asset-card{background:linear-gradient(135deg,#faf6ee 0%,#f2ebe0 100%);border:1px solid rgba(160,120,60,.2);border-radius:20px;padding:20px;position:relative;overflow:hidden;}
  .asset-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#9a6e20,#c8a84b,#9a6e20);}
  .asset-lbl{font-family:'Cinzel',serif;font-size:11px;letter-spacing:3px;color:#9a7030;text-transform:uppercase;margin-bottom:6px;font-weight:600;}
  .asset-val{font-family:'JetBrains Mono',monospace;font-size:32px;font-weight:700;color:#2c1e0f;letter-spacing:-1px;margin-bottom:4px;}
  .asset-chg{font-family:'JetBrains Mono',monospace;font-size:14px;color:#2a7a50;font-weight:700;}
  .asset-breakdown{display:flex;gap:0;margin-top:16px;padding-top:14px;border-top:1px solid rgba(160,120,60,.15);}
  .ab-item{flex:1;padding:0 10px;}
  .ab-item:first-child{padding-left:0;}
  .ab-item+.ab-item{border-left:1px solid rgba(160,120,60,.15);}
  .ab-lbl{font-family:'Cinzel',serif;font-size:9px;letter-spacing:1.5px;color:#9a7030;text-transform:uppercase;margin-bottom:4px;font-weight:600;}
  .ab-val{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:#2c1e0f;}

  /* 健康分小卡 */
  .health-mini{display:flex;align-items:center;gap:14px;background:rgba(42,138,90,.1);border:1px solid rgba(42,138,90,.3);border-radius:14px;padding:14px 16px;cursor:pointer;transition:all .2s;}
  .health-mini:hover{background:rgba(58,170,120,.12);}
  .hm-ring{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;flex-shrink:0;}
  .hm-info{flex:1;}
  .hm-title{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--green);text-transform:uppercase;margin-bottom:3px;}
  .hm-desc{font-size:14px;color:#4a3520;line-height:1.5;}
  .hm-arr{color:#9a7030;font-size:18px;font-weight:700;}

  /* 凱特今日建議卡 */
  .kate-suggest{background:linear-gradient(135deg,#2a1e10 0%,#1e1608 100%);border:1px solid rgba(200,160,60,.25);border-radius:16px;padding:16px;cursor:pointer;transition:all .2s;}
  .kate-suggest:hover{border-color:rgba(200,160,60,.45);}
  .ks-head{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
  .ks-badge{font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:#c8a84b;background:rgba(200,168,75,.15);border:1px solid rgba(200,168,75,.3);border-radius:3px;padding:2px 8px;text-transform:uppercase;}
  .ks-title{font-family:'Noto Serif TC',serif;font-size:16px;font-weight:600;color:#f5ead8;line-height:1.6;margin-bottom:8px;}
  .ks-preview{font-size:14px;color:rgba(245,234,216,.65);line-height:1.8;}
  .ks-action{display:flex;align-items:center;justify-content:space-between;margin-top:12px;}
  .ks-more{font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:#c8a84b;}

  /* 新聞精選 */
  .news-card{display:flex;gap:12px;margin:0 16px 10px;padding:14px;background:var(--card);border-radius:14px;border:1px solid var(--bl);cursor:pointer;transition:all .2s;}
  .news-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.1);}
  .nc-emoji{font-size:26px;flex-shrink:0;width:40px;height:40px;display:flex;align-items:center;justify-content:center;}
  .nc-tag{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:4px;}
  .nc-title{font-size:15px;color:var(--td);font-weight:500;line-height:1.855;margin-bottom:4px;}
  .nc-meta{font-size:15px;color:var(--md);}

  /* 指數 */
  .idx{display:flex;margin:0 16px 0;background:var(--card);border:1px solid var(--bl);border-radius:14px;overflow:hidden;}
  .ii{flex:1;padding:11px 8px;}
  .ii+.ii{border-left:1px solid var(--bl);}
  .ii-n{font-family:'Cinzel',serif;font-size:15px;letter-spacing:1px;color:var(--md);text-transform:uppercase;margin-bottom:4px;}
  .ii-v{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:var(--td);}
  .ii-c{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;margin-top:2px;}
  .up{color:var(--green);}
  .dn{color:var(--red);}

  /* ── ASSETS TAB ── */
  /* 持有摘要 */
  .hld-summary{margin:0 16px 14px;background:var(--card);border:1px solid var(--bl);border-radius:18px;padding:18px;position:relative;overflow:hidden;}
  .hld-summary::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#9a7030,#deba60,#9a7030);}
  .hld-total-lbl{font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:6px;}
  .hld-total-val{font-family:'JetBrains Mono',monospace;font-size:30px;font-weight:700;color:#2c1e0f;margin-bottom:3px;}
  .hld-row{display:flex;gap:0;margin-top:12px;padding-top:12px;border-top:1px solid var(--bl);}
  .hld-st{flex:1;padding:0 10px;}
  .hld-st:first-child{padding-left:0;}
  .hld-st+.hld-st{border-left:1px solid var(--bl);}
  .hld-sl{font-family:'Cinzel',serif;font-size:15px;letter-spacing:1.5px;color:var(--md);text-transform:uppercase;margin-bottom:4px;}
  .hld-sv{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;}
  /* 持有列表 */
  .hld-list{margin:0 16px;}
  .hld-item{background:var(--card);border:1px solid var(--bl);border-radius:14px;padding:16px;margin-bottom:10px;}
  .hld-item-name{font-family:'Noto Serif TC',serif;font-size:14px;font-weight:500;color:var(--td);}
  .hld-item-type{font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--md);margin-top:3px;text-transform:uppercase;}
  .hld-item-bar{height:3px;background:var(--card3);border-radius:3px;margin-top:10px;}
  .hld-item-fill{height:3px;border-radius:3px;}
  .hld-actions{display:flex;gap:6px;margin-top:12px;}
  .hld-edit-btn{flex:1;padding:7px;border-radius:8px;border:1px solid var(--bl);background:transparent;font-family:'Cinzel',serif;font-size:15px;letter-spacing:1px;color:var(--md);cursor:pointer;transition:all .2s;}
  .hld-edit-btn:hover{border-color:var(--gold);color:var(--gold);}
  .hld-del-btn{padding:7px 12px;border-radius:8px;border:1px solid rgba(216,88,104,.2);background:transparent;font-family:'Cinzel',serif;font-size:15px;color:var(--rose);cursor:pointer;}
  /* 持有分類tab */
  .htab-row{display:flex;margin:0 16px 14px;background:var(--card2);border:1px solid var(--bl);border-radius:12px;overflow:hidden;}
  .htab{flex:1;padding:11px 4px;text-align:center;font-family:'Cinzel',serif;font-size:14px;letter-spacing:1px;cursor:pointer;transition:all .2s;color:var(--td);font-weight:500;border-bottom:2px solid transparent;}
  .htab.active{background:rgba(154,110,32,.12);color:#8a5e18;border-bottom-color:#8a5e18;}

  /* 健檢 */
  .hd-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px 4px;}
  .hd-sc{grid-column:1/-1;background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:16px;display:flex;align-items:center;gap:14px;}
  .s-ring{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .s-num{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:700;color:var(--td);}
  .hd-gr{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--td);margin-bottom:4px;}
  .hd-ds{font-size:15px;color:var(--md);line-height:1.855;}
  .hm{background:var(--card);border:1px solid var(--bl);border-radius:12px;padding:14px;position:relative;overflow:hidden;}
  .hm-lb{font-family:'Cinzel',serif;font-size:14px;letter-spacing:1.5px;color:var(--md);text-transform:uppercase;margin-bottom:6px;}
  .hm-v{font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;margin-bottom:3px;}
  .hm-s{font-size:14px;color:var(--md);margin-bottom:8px;}
  .hm-bg{height:3px;background:var(--card3);border-radius:3px;}
  .hm-b{height:3px;border-radius:3px;}
  .hm-w{grid-column:1/-1;background:var(--card);border:1px solid var(--bl);border-radius:12px;padding:14px;display:flex;gap:0;}
  .hw-i{flex:1;padding:0 10px;}
  .hw-i:first-child{padding-left:0;}
  .hw-i+.hw-i{border-left:1px solid var(--bl);}
  .hw-lb{font-family:'Cinzel',serif;font-size:15px;letter-spacing:1px;color:var(--md);text-transform:uppercase;margin-bottom:5px;}
  .hw-v{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;color:var(--td);margin-bottom:5px;}
  .hw-bg{height:3px;background:var(--card3);border-radius:3px;}
  .hw-b{height:3px;border-radius:3px;}
  .health-update-btn{margin:14px 16px 0;width:calc(100% - 32px);padding:14px;border:1px solid rgba(58,170,120,.25);border-radius:12px;background:var(--green-dim);font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--green);cursor:pointer;display:block;}

  /* 試算 */
  .calc-section{padding:0 16px 32px;}
  .calc-card{background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:20px;margin-bottom:14px;}
  .calc-title{font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:14px;}
  .calc-desc{font-size:14px;color:var(--md);margin-bottom:16px;line-height:1.85;}
  .calc-lbl{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:7px;margin-top:12px;}
  .calc-lbl:first-of-type{margin-top:0;}
  .calc-inp{width:100%;background:#fff;border:1px solid rgba(140,110,80,.2);border-radius:11px;padding:13px 16px;color:#2c1e0f;font-size:15px;font-family:'Noto Sans TC',sans-serif;outline:none;transition:border-color .2s;}
  .calc-inp:focus{border-color:var(--gold);}
  .calc-btn{width:100%;margin-top:16px;padding:15px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:14px;font-weight:600;letter-spacing:4px;cursor:pointer;}
  .calc-result{background:var(--card);border-radius:16px;padding:20px;margin-top:14px;}
  .calc-res-hd{font-family:'Cinzel',serif;font-size:15px;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;}
  .calc-res-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--bl);}
  .calc-res-row:last-child{border-bottom:none;}
  .calc-res-lbl{font-size:14px;color:#6b5040;}
  .calc-res-val{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;color:#2c1e0f;}
  .calc-note{margin-top:12px;padding:12px 14px;border-radius:10px;font-size:14px;line-height:1.85;}

  /* ── EXPLORE TAB (市場) ── */
  .news-feat{margin:0 16px 12px;position:relative;border-radius:18px;overflow:hidden;cursor:pointer;}
  .news-feat-img{width:100%;height:180px;display:flex;align-items:center;justify-content:center;font-size:72px;}
  .news-feat-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(28,15,8,.95) 0%,rgba(28,15,8,.2) 60%,transparent 100%);padding:20px;display:flex;flex-direction:column;justify-content:flex-end;}
  .nf-tag{display:inline-block;font-family:'Cinzel',serif;font-size:14px;padding:3px 10px;border-radius:3px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;background:var(--gold-dim);color:var(--gold);border:1px solid rgba(200,168,75,.22);}
  .nf-tt{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;line-height:1.45;color:#f4f2ee;}
  .nf-mt{font-size:15px;color:rgba(240,242,248,.38);display:flex;gap:10px;margin-top:6px;}
  .news-list-item{display:flex;gap:12px;margin:0 16px 10px;padding:14px;background:var(--card);border-radius:14px;border:1px solid var(--bl);cursor:pointer;}
  .nli-emoji{font-size:24px;width:36px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
  .nli-tag{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:3px;}
  .nli-title{font-size:15px;color:var(--td);font-weight:600;line-height:1.55;}
  .nli-meta{font-size:15px;color:var(--md);margin-top:3px;}
  .si{display:flex;align-items:center;gap:12px;margin:0 16px 10px;padding:14px;background:var(--card);border:1px solid var(--bl);border-radius:14px;cursor:pointer;}
  .si-ic{font-size:24px;width:38px;height:38px;background:var(--card2);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .si-nm{font-size:16px;color:var(--td);font-weight:600;}
  .si-cd{font-family:'Cinzel',serif;font-size:15px;letter-spacing:1px;color:var(--md);margin-top:2px;}
  .si-r{margin-left:auto;text-align:right;}
  .si-p{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;color:#2c1e0f;}
  .si-c{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;margin-top:2px;}
  /* 股票詳情 */
  .sd-hd{padding:52px 20px 20px;background:linear-gradient(165deg,#0c1420 0%,#1c0f08 100%);}
  .sd-name{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#f0f2f8;}
  .sd-code{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--md);margin-top:3px;}
  .sd-price{font-family:'JetBrains Mono',monospace;font-size:32px;font-weight:700;color:#f0f2f8;margin-top:12px;}
  .sd-chg{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;margin-top:4px;}
  .chart-wrap{margin:0 16px;background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:14px;}
  .chart-tabs{display:flex;gap:0;margin-bottom:12px;}
  .ct{flex:1;padding:6px;text-align:center;border:none;background:transparent;font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--md);cursor:pointer;border-radius:8px;transition:all .2s;}
  .ct.active{background:var(--gold-dim);color:var(--gold);}
  .sd-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:14px 16px 24px;}
  .sd-stat{background:var(--card);border:1px solid var(--bl);border-radius:12px;padding:12px;}
  .sd-stat-l{font-family:'Cinzel',serif;font-size:14px;letter-spacing:1px;color:var(--md);text-transform:uppercase;margin-bottom:5px;}
  .sd-stat-v{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;color:var(--td);}

  /* ── ADVISOR TAB ── */
  /* 推薦hero */
  .kt-hero{margin:0 16px 14px;border-radius:20px;overflow:hidden;position:relative;cursor:pointer;min-height:200px;background:linear-gradient(135deg,#1e1005 0%,#2a1208 50%,#1a0e06 100%);}
  .kt-glow{position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:radial-gradient(circle,rgba(200,168,75,.15) 0%,transparent 70%);pointer-events:none;}
  .kt-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(28,15,8,.85) 0%,transparent 60%);}
  .kt-con{position:absolute;bottom:0;left:0;right:0;padding:20px;}
  .kt-badge{display:inline-flex;align-items:center;gap:5px;font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--gold);background:var(--gold-dim);border:1px solid rgba(200,168,75,.25);border-radius:3px;padding:3px 10px;text-transform:uppercase;margin-bottom:10px;}
  .kt-t{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#f0f2f8;line-height:1.4;margin-bottom:6px;}
  .kt-b{font-size:14px;color:rgba(240,242,248,.45);line-height:1.8;}
  .kt-ac{display:flex;align-items:center;justify-content:space-between;margin-top:12px;}
  .kt-more{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--gold);}
  /* 產品推薦卡 */
  .prod-rec{margin:0 16px 10px;background:var(--card);border:1px solid var(--bl);border-radius:14px;padding:16px;}
  .prod-rec-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
  .prod-rank{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;padding:3px 10px;border-radius:3px;text-transform:uppercase;}
  .r1{background:rgba(200,168,75,.15);color:#a07830;border:1px solid rgba(200,168,75,.25);}
  .r2{background:var(--silver-dim);color:var(--silver);border:1px solid rgba(148,168,192,.2);}
  .r3{background:var(--card2);color:var(--md);border:1px solid var(--bl);}
  .prod-name{font-family:'Noto Serif TC',serif;font-size:16px;font-weight:600;color:var(--td);flex:1;}
  .prod-meta-t{font-size:15px;color:var(--md);}
  .prod-body-t{font-size:14px;color:var(--md);line-height:1.8;}
  .prod-action{display:inline-block;margin-top:8px;font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--gold);cursor:pointer;}
  /* 知識庫 */
  .term-card{margin:0 16px 10px;background:var(--card);border:1px solid var(--bl);border-radius:14px;overflow:hidden;cursor:pointer;}
  .term-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;}
  .term-left{display:flex;align-items:center;gap:12px;}
  .term-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;}
  .ti-gold{background:var(--gold-dim);}
  .ti-blue{background:var(--blue-dim);}
  .ti-silver{background:var(--silver-dim);}
  .ti-rose{background:var(--rose-dim);}
  .ti-green{background:var(--green-dim);}
  .term-word{font-family:'Noto Serif TC',serif;font-size:17px;font-weight:600;color:var(--td);}
  .term-en{font-family:'Cinzel',serif;font-size:15px;letter-spacing:1px;color:var(--md);margin-top:2px;}
  .term-arr{color:var(--md);font-size:16px;transition:transform .2s;}
  .term-arr.open{transform:rotate(180deg);}
  .term-body{padding:0 16px 16px;border-top:1px solid var(--bl);}
  .term-slbl{font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;margin:12px 0 6px;}
  .term-simple{font-family:'Noto Serif TC',serif;font-size:15px;color:var(--td);line-height:1.85;}
  .term-detail{font-size:14px;color:var(--md);line-height:1.85;margin-top:8px;}
  .term-ex{background:var(--card2);border-radius:10px;padding:12px;margin-top:10px;}
  .term-exl{font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:5px;}
  .term-ext{font-size:14px;color:var(--tm);line-height:1.8;}

  /* 後台 */
  .kate-admin{margin:0 16px 14px;background:rgba(200,168,75,.06);border:1px solid rgba(200,168,75,.2);border-radius:14px;padding:16px;}
  .admin-title{font-family:'Cinzel',serif;font-size:15px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:14px;}
  .theme-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
  .theme-chip{padding:8px 14px;border-radius:20px;border:1px solid var(--bl);background:transparent;font-size:14px;color:var(--md);cursor:pointer;transition:all .2s;}
  .theme-chip.selected{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}
  .gen-btn{width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:15px;font-weight:600;letter-spacing:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;}
  .gen-btn:disabled{opacity:.4;cursor:not-allowed;}
  .draft-card{margin:0 16px 12px;background:var(--card);border:1px solid var(--bl);border-radius:14px;padding:16px;}
  .draft-badge{font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--rose);text-transform:uppercase;margin-bottom:10px;}
  .draft-title-inp{width:100%;background:transparent;border:none;outline:none;font-family:'Playfair Display',serif;font-size:16px;color:var(--td);font-weight:700;margin-bottom:10px;border-bottom:1px solid var(--bl);padding-bottom:8px;}
  .draft-edit{width:100%;background:var(--card2);border:1px solid var(--bl);border-radius:10px;padding:12px;color:var(--td);font-size:15px;font-family:'Noto Serif TC',serif;outline:none;min-height:100px;resize:vertical;line-height:1.85;}
  .pub-btn{width:calc(100% - 32px);margin:0 16px 8px;padding:15px;border:none;border-radius:13px;background:linear-gradient(135deg,#2a6a50,#3aaa78);color:#fff;font-family:'Cinzel',serif;font-size:15px;font-weight:600;letter-spacing:3px;cursor:pointer;}
  .reset-btn{width:calc(100% - 32px);margin:0 16px 24px;padding:12px;border:1px solid rgba(240,242,245,.1);border-radius:12px;background:transparent;font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:rgba(240,242,248,.3);cursor:pointer;}
  .loading-wrap{padding:24px;text-align:center;}
  .spin{width:32px;height:32px;border:2px solid rgba(200,168,75,.2);border-top-color:var(--gold);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 12px;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .loading-step{font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;color:var(--gold);}
  /* picks news */
  .picks-news-card{margin:0 16px 8px;background:var(--card);border-radius:12px;padding:14px;border-left:3px solid var(--gold);}
  .pnc-tag{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;margin-bottom:4px;}
  .pnc-title{font-size:15px;color:var(--td);font-weight:500;margin-bottom:3px;}
  .pnc-desc{font-size:15px;color:var(--md);}

  /* AI 問答 */
  .qa-wrap{padding:0 16px 24px;}
  .qa-hero{background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:16px;margin-bottom:16px;text-align:center;}
  .qa-hero-t{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--td);margin-bottom:6px;}
  .qa-hero-s{font-size:14px;color:var(--md);}
  .qa-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
  .qa-chip{padding:8px 14px;border-radius:20px;border:1px solid var(--bl);background:transparent;font-size:14px;color:var(--md);cursor:pointer;transition:all .2s;}
  .qa-chip:hover{border-color:rgba(200,168,75,.3);color:var(--gold);}
  .qa-thread{max-height:360px;overflow-y:auto;margin-bottom:12px;}
  .qa-b-user{background:rgba(154,110,32,.12);border:1px solid rgba(154,110,32,.25);border-radius:14px 14px 4px 14px;padding:12px 14px;font-size:15px;color:#7a4e10;margin-bottom:10px;text-align:right;}
  .qa-b-kate{background:var(--card2);border:1px solid var(--bl);border-radius:14px 14px 14px 4px;padding:14px;margin-bottom:10px;}
  .qa-key{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--gold);margin-bottom:8px;text-transform:uppercase;}
  .qa-related{margin-top:12px;padding-top:10px;border-top:1px solid var(--bl);}
  .qa-rl{font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:8px;}
  .qa-rc{display:inline-block;margin:4px 4px 0 0;padding:6px 12px;border-radius:16px;border:1px solid var(--bl);font-size:15px;color:var(--md);cursor:pointer;}
  .qa-thinking{display:flex;align-items:center;gap:12px;padding:12px;}
  .qa-dots{display:flex;gap:4px;}
  .qa-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:blink 1.2s ease infinite;}
  .qa-dot:nth-child(2){animation-delay:.2s;}
  .qa-dot:nth-child(3){animation-delay:.4s;}
  @keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}
  .qa-input-row{display:flex;gap:10px;}
  .qa-inp{flex:1;background:var(--card2);border:1px solid var(--bl);border-radius:22px;padding:12px 18px;color:var(--td);font-size:14px;font-family:'Noto Sans TC',sans-serif;outline:none;}
  .qa-inp:focus{border-color:var(--gold);}
  .qa-send-btn{width:44px;height:44px;border-radius:50%;border:none;background:linear-gradient(135deg,#9a7030,#deba60);color:#07090f;font-size:18px;cursor:pointer;flex-shrink:0;}
  .qa-send-btn:disabled{opacity:.35;cursor:not-allowed;}

  /* 線上顧問 Messenger */
  .msg-overlay{position:fixed;inset:0;background:rgba(18,8,2,.75);backdrop-filter:blur(8px);z-index:300;display:flex;align-items:flex-end;}
  .msg-sheet{background:#1c0f08;border-radius:24px 24px 0 0;width:100%;max-width:430px;margin:0 auto;max-height:88vh;display:flex;flex-direction:column;border-top:1px solid rgba(200,160,60,.2);}
  .msg-handle{width:36px;height:4px;background:rgba(240,242,248,.15);border-radius:2px;margin:12px auto 0;}
  .msg-hdr{display:flex;align-items:center;gap:12px;padding:14px 16px 12px;border-bottom:1px solid rgba(200,160,60,.12);}
  .msg-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .msg-hname{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:#f5ead8;}
  .msg-hstatus{display:flex;align-items:center;gap:5px;font-size:13px;color:#4aaa78;margin-top:2px;}
  .online-dot{width:6px;height:6px;border-radius:50%;background:var(--green);}
  .msg-close{margin-left:auto;background:rgba(255,248,235,.08);border:none;border-radius:50%;width:28px;height:28px;color:rgba(245,220,170,.6);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;}
  .msg-thread{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px;}
  .b-time{text-align:center;font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:rgba(240,242,248,.2);margin:4px 0;}
  .b-kate-wrap{display:flex;gap:8px;align-items:flex-end;}
  .b-kate-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
  .b-kate{background:rgba(255,248,235,.08);border:1px solid rgba(200,160,60,.2);border-radius:14px 14px 14px 4px;padding:12px 15px;font-size:15px;color:#f0e0c0;line-height:1.8;max-width:80%;}
  .b-user{background:rgba(200,160,60,.22);border:1px solid rgba(200,160,60,.35);border-radius:14px 14px 4px 14px;padding:12px 15px;font-size:15px;color:#f5dea0;max-width:80%;align-self:flex-end;}
  .prod-menu{background:rgba(255,248,235,.05);border:1px solid rgba(200,160,60,.18);border-radius:14px;overflow:hidden;}
  .prod-menu-lbl{font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--md);text-transform:uppercase;padding:10px 14px 8px;}
  .prod-menu-item{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-top:1px solid rgba(200,160,60,.1);cursor:pointer;transition:background .15s;}
  .prod-menu-item:hover{background:rgba(240,242,248,.04);}
  .prod-menu-name{font-size:15px;color:#f0e0c0;}
  .prod-menu-region{font-size:14px;color:var(--md);margin-top:2px;}
  .thinking-wrap{display:flex;align-items:center;gap:8px;padding:4px 0;}
  .thinking-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
  .dots-wrap{display:flex;gap:4px;padding:10px 14px;background:rgba(240,242,248,.06);border-radius:14px;}
  .dot-t{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:blink 1.2s ease infinite;}
  .dot-t:nth-child(2){animation-delay:.2s;}
  .dot-t:nth-child(3){animation-delay:.4s;}
  .msg-quick-row{padding:10px 16px;border-top:1px solid rgba(200,160,60,.1);overflow-x:auto;display:flex;gap:8px;flex-shrink:0;}
  .msg-quick-row::-webkit-scrollbar{display:none;}
  .msg-qc{flex-shrink:0;padding:8px 14px;border-radius:20px;border:1px solid rgba(200,160,60,.25);background:rgba(200,160,60,.08);font-size:14px;color:rgba(245,220,170,.7);cursor:pointer;white-space:nowrap;font-family:'Noto Sans TC',sans-serif;transition:all .2s;}
  .msg-qc:hover{border-color:rgba(200,168,75,.3);color:var(--gold);}
  .msg-inp-row{display:flex;gap:10px;padding:12px 16px 28px;background:rgba(24,12,4,.97);border-top:1px solid rgba(240,242,245,.07);flex-shrink:0;}
  .msg-inp{flex:1;background:#fff;border:1px solid rgba(140,110,80,.2);border-radius:22px;padding:12px 18px;color:#2c1e0f;font-size:15px;font-family:'Noto Sans TC',sans-serif;outline:none;}
  .msg-inp:focus{border-color:var(--silver);}
  .msg-send{width:44px;height:44px;border-radius:50%;border:none;background:linear-gradient(135deg,#9a7030,#deba60);color:#07090f;font-size:18px;cursor:pointer;flex-shrink:0;}
  .msg-send:disabled{opacity:.35;cursor:not-allowed;}

  /* 通知 */
  .notif-item{display:flex;align-items:flex-start;gap:12px;margin:0 16px 10px;padding:16px;background:var(--card);border-radius:14px;border:1px solid var(--bl);cursor:pointer;transition:background .15s;}
  .notif-item.unread{background:rgba(200,168,75,.05);border-color:rgba(200,168,75,.15);}
  .n-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .ni-gold{background:var(--gold-dim);}
  .ni-blue{background:var(--blue-dim);}
  .ni-rose{background:var(--rose-dim);}
  .ni-green{background:var(--green-dim);}
  .n-title{font-size:15px;color:var(--td);font-weight:500;margin-bottom:3px;}
  .n-desc{font-size:14px;color:var(--md);line-height:1.855;}
  .n-time{font-size:14px;color:var(--md);margin-top:4px;}
  .n-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:4px;}
  .ns-group{margin:0 16px 16px;background:var(--card);border:1px solid var(--bl);border-radius:14px;overflow:hidden;}
  .ns-hd{padding:12px 16px;font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--md);text-transform:uppercase;border-bottom:1px solid var(--bl);}
  .ns-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--bl);cursor:pointer;}
  .ns-item:last-child{border-bottom:none;}
  .ns-ic{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
  .ns-name{flex:1;font-size:15px;color:var(--td);}
  .toggle{width:40px;height:22px;border-radius:11px;position:relative;cursor:pointer;flex-shrink:0;transition:background .2s;}
  .toggle.on{background:var(--green);}
  .toggle.off{background:rgba(240,242,245,.12);}
  .toggle-dot{position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s;}
  .toggle.on .toggle-dot{left:21px;}
  .toggle.off .toggle-dot{left:3px;}

  /* Profile */
  .prof-header{padding:52px 20px 28px;background:linear-gradient(165deg,#0c1420 0%,#1c0f08 100%);text-align:center;}
  .prof-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px;}
  .prof-name{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#f0f2f8;margin-bottom:4px;}
  .prof-role{font-family:'Cinzel',serif;font-size:15px;letter-spacing:3px;color:rgba(200,168,75,.6);text-transform:uppercase;}
  .set-group{margin:0 16px 12px;background:var(--card);border:1px solid var(--bl);border-radius:14px;overflow:hidden;}
  .set-gl{padding:10px 16px;font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--md);text-transform:uppercase;border-bottom:1px solid var(--bl);}
  .set-item{display:flex;align-items:center;gap:12px;padding:13px 16px;border-bottom:1px solid var(--bl);cursor:pointer;}
  .set-item:last-child{border-bottom:none;}
  .set-ic{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
  .sg{background:var(--gold-dim);}
  .ss{background:var(--blue-dim);}
  .sr{background:var(--rose-dim);}
  .set-nm{font-size:14px;color:var(--td);}
  .set-ds{font-size:15px;color:var(--md);margin-top:2px;}
  .risk-row{display:flex;gap:8px;padding:12px 16px;}
  .risk-chip{flex:1;padding:10px;border-radius:10px;border:1px solid var(--bl);background:transparent;font-family:'Cinzel',serif;font-size:14px;letter-spacing:1px;color:var(--md);cursor:pointer;text-align:center;transition:all .2s;}
  .risk-chip.active{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}

  /* 新聞詳情 */
  .nd-hero{min-height:240px;display:flex;flex-direction:column;justify-content:flex-end;position:relative;padding:20px;overflow:hidden;}
  .nd-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(28,15,8,.95),transparent 60%);}
  .nd-hcon{position:relative;z-index:1;}
  .nd-tag{display:inline-block;font-family:'Cinzel',serif;font-size:14px;padding:3px 10px;border-radius:3px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;background:var(--gold-dim);color:var(--gold);border:1px solid rgba(200,168,75,.22);}
  .nd-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#f4f2ee;line-height:1.4;}
  .nd-meta{display:flex;gap:12px;font-size:15px;color:rgba(240,242,248,.4);margin-top:8px;}
  .nd-body{padding:20px 20px 32px;background:var(--card);}
  .nd-body p{font-family:'Noto Serif TC',serif;font-size:14px;color:var(--td);line-height:1.9;margin-bottom:16px;}

  /* 保單+股票+固收表單 */
  .holding-form-overlay{position:fixed;inset:0;background:rgba(28,15,8,.88);backdrop-filter:blur(8px);z-index:350;display:flex;align-items:flex-end;}
  .holding-form-sheet{background:var(--card);border-radius:24px 24px 0 0;width:100%;max-width:430px;margin:0 auto;padding:24px 20px 40px;max-height:90vh;overflow-y:auto;}
  .hf-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--td);margin-bottom:20px;}
  .hf-lbl{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:7px;margin-top:14px;}
  .hf-inp{width:100%;background:#fff;border:1px solid rgba(140,110,80,.2);border-radius:11px;padding:14px 16px;color:#2c1e0f;font-size:15px;font-family:'Noto Sans TC',sans-serif;outline:none;transition:border-color .2s;}
  .hf-inp:focus{border-color:var(--gold);}
  select.hf-inp{appearance:auto;-webkit-appearance:auto;-moz-appearance:auto;}
  .hf-row{display:flex;gap:8px;}
  .hf-type-chip{padding:7px 14px;border-radius:20px;border:1px solid var(--bl);background:transparent;font-size:14px;color:var(--md);cursor:pointer;transition:all .2s;}
  .hf-type-chip.active{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}
  .hf-save-btn{width:100%;margin-top:20px;padding:16px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:14px;font-weight:600;letter-spacing:4px;cursor:pointer;}
  .hf-cancel-btn{width:100%;margin-top:8px;padding:13px;border:1px solid rgba(240,242,245,.1);border-radius:12px;background:transparent;font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:rgba(240,242,248,.3);cursor:pointer;}

  /* 健檢問卷 */
  .health-form-overlay{position:fixed;inset:0;background:rgba(28,15,8,.9);backdrop-filter:blur(10px);z-index:350;overflow-y:auto;}
  .health-form-wrap{max-width:430px;margin:0 auto;padding:40px 20px 60px;}
  .hform-hdr{margin-bottom:28px;}
  .hform-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#f0f2f8;margin-bottom:6px;}
  .hform-sub{font-size:14px;color:rgba(240,242,248,.38);letter-spacing:1px;}
  .hform-section{background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:18px;margin-bottom:14px;}
  .hform-section-title{font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:16px;}
  .hform-lbl{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:7px;margin-top:12px;}
  .hform-lbl:first-of-type{margin-top:0;}
  .hform-inp{width:100%;background:var(--card2);border:1px solid var(--bl);border-radius:11px;padding:12px 16px;color:var(--td);font-size:14px;font-family:'Noto Sans TC',sans-serif;outline:none;}
  .hform-check-row{display:flex;flex-direction:column;gap:10px;margin-top:4px;}
  .hform-check{display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--bl);transition:all .2s;}
  .hform-check.checked{border-color:rgba(200,168,75,.3);background:var(--gold-dim);}
  .hform-check-box{width:20px;height:20px;border-radius:6px;border:1px solid var(--bl);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .hform-check.checked .hform-check-box{background:var(--gold);border-color:var(--gold);color:#07090f;font-size:14px;}
  .hform-check-lbl{font-size:14px;color:var(--td);}
  .hform-submit{width:100%;padding:17px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:15px;font-weight:600;letter-spacing:4px;cursor:pointer;margin-top:8px;}
  .hform-cancel{width:100%;padding:13px;border:1px solid rgba(240,242,245,.1);border-radius:12px;background:transparent;font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:rgba(240,242,248,.3);cursor:pointer;margin-top:8px;}

  /* Onboarding */
  .onb-overlay{position:fixed;inset:0;background:rgba(28,15,8,.95);backdrop-filter:blur(12px);z-index:350;overflow-y:auto;}
  .onb-wrap{max-width:430px;margin:0 auto;padding:40px 20px 60px;min-height:100vh;}
  .onb-steps{display:flex;gap:6px;margin-bottom:24px;}
  .onb-step-dot{flex:1;height:3px;border-radius:3px;background:rgba(240,242,245,.1);}
  .onb-step-dot.done{background:var(--gold);}
  .onb-step-dot.active{background:rgba(200,168,75,.5);}
  .onb-step-title{font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:6px;}
  .onb-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#f0f2f8;margin-bottom:20px;}
  .onb-card{background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:20px;margin-bottom:14px;}
  .onb-lbl{font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:7px;margin-top:14px;}
  .onb-lbl:first-of-type{margin-top:0;}
  .onb-inp{width:100%;background:var(--card2);border:1px solid var(--bl);border-radius:11px;padding:13px 16px;color:var(--td);font-size:14px;font-family:'Noto Sans TC',sans-serif;outline:none;}
  .onb-goal-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;}
  .onb-goal-chip{padding:8px 16px;border-radius:20px;border:1px solid var(--bl);background:transparent;font-size:15px;color:var(--md);cursor:pointer;}
  .onb-goal-chip.sel{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}
  .onb-risk-row{display:flex;gap:8px;margin-top:4px;}
  .onb-risk-chip{flex:1;padding:10px;border-radius:10px;border:1px solid var(--bl);background:transparent;font-family:'Cinzel',serif;font-size:14px;color:var(--md);cursor:pointer;text-align:center;}
  .onb-risk-chip.sel{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}
  .onb-next-btn{width:100%;padding:16px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:14px;font-weight:600;letter-spacing:4px;cursor:pointer;}
  .onb-back-btn{width:100%;padding:13px;border:1px solid rgba(240,242,245,.1);border-radius:12px;background:transparent;font-family:'Cinzel',serif;font-size:15px;letter-spacing:2px;color:rgba(240,242,248,.3);cursor:pointer;margin-top:8px;}
  .onb-success{text-align:center;padding:60px 20px;}
  .onb-success-icon{font-size:56px;margin-bottom:16px;}
  .onb-success-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--green);margin-bottom:10px;}
  .onb-new-btn{width:calc(100% - 32px);margin:0 16px 16px;padding:14px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:15px;font-weight:600;letter-spacing:3px;cursor:pointer;}
  .onb-list-item{background:var(--card);border:1px solid var(--bl);border-radius:14px;padding:14px;margin:0 16px 10px;cursor:pointer;}
  .onb-list-name{font-family:'Noto Serif TC',serif;font-size:15px;font-weight:500;color:var(--td);margin-bottom:4px;}
  .onb-list-tag{font-family:'Cinzel',serif;font-size:14px;letter-spacing:1px;padding:3px 10px;border-radius:20px;text-transform:uppercase;}
  .onb-tag-done{background:var(--green-dim);color:var(--green);}
  .onb-tag-pend{background:var(--gold-dim);color:#a07830;}

  /* avatar btn */
  .avatar-btn{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;flex-shrink:0;}
`;

// ─────────── SUPABASE（透過 /api/db 代理，金鑰留在伺服器端）───────────
async function supaFetch(path,opts={}){
  const [basePath,qs]=path.split("?");
  const proxyUrl=`/api/db?path=${encodeURIComponent(basePath)}${qs?"&"+qs:""}`;
  const headers={"Content-Type":"application/json"};
  if(opts.headers?.Prefer)headers["Prefer"]=opts.headers.Prefer;
  const res=await fetch(proxyUrl,{method:opts.method||"GET",headers,body:opts.body||undefined});
  if(!res.ok){const e=await res.text();throw new Error(e);}
  const text=await res.text();
  return text?JSON.parse(text):null;
}
async function hashPwd(pwd){
  const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(pwd+"kate_salt_2026"));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function loginUser(username,password){
  const hash=await hashPwd(password);
  const data=await supaFetch(`/kate_users?username=eq.${encodeURIComponent(username)}&password_hash=eq.${encodeURIComponent(hash)}&select=*`);
  if(!data||data.length===0)throw new Error("帳號或密碼錯誤");
  return data[0];
}
async function registerUser(username,password){
  const existing=await supaFetch(`/kate_users?username=eq.${encodeURIComponent(username)}&select=id`);
  if(existing&&existing.length>0)throw new Error("此帳號已被使用，請換一個");
  const hash=await hashPwd(password);
  const data=await supaFetch(`/kate_users`,{
    method:"POST",
    body:JSON.stringify({username,password_hash:hash,display_name:username,risk_level:"穩健",is_kate:false})
  });
  return data[0];
}
async function updateDisplayName(userId,name){
  await supaFetch(`/kate_users?id=eq.${userId}`,{
    method:"PATCH",
    body:JSON.stringify({display_name:name})
  });
}
async function loadUserData(userId,key){
  const data=await supaFetch(`/kate_user_data?user_id=eq.${userId}&data_key=eq.${encodeURIComponent(key)}&select=data_value`);
  return data&&data.length>0?data[0].data_value:null;
}
async function saveUserData(userId,key,value,retries=2){
  for(let attempt=0;attempt<=retries;attempt++){
    try{
      await supaFetch(`/kate_user_data`,{
        method:"POST",
        headers:{"Prefer":"resolution=merge-duplicates"},
        body:JSON.stringify({user_id:userId,data_key:key,data_value:value,updated_at:new Date().toISOString()})
      });
      return;
    }catch(err){
      if(attempt===retries)throw err;
      await new Promise(r=>setTimeout(r,800*(attempt+1)));
    }
  }
}

// ─────────── MAIN COMPONENT ───────────
export default function App(){
  // Auth
  const [loggedIn,setLoggedIn]=useState(false);
  const [isKate,setIsKate]=useState(false);
  const [acct,setAcct]=useState("");
  const [pwd,setPwd]=useState("");
  const [loginLoading,setLoginLoading]=useState(false);
  const [loginError,setLoginError]=useState("");
  const [currentUser,setCurrentUser]=useState(null);
  const [loginMode,setLoginMode]=useState("login"); // login | register
  const [regPwd2,setRegPwd2]=useState("");
  const [showEditName,setShowEditName]=useState(false);
  const [editNameVal,setEditNameVal]=useState("");
  // Navigation
  const [tab,setTab]=useState("home");      // home | assets | calc | advisor
  const [assetsSub,setAssetsSub]=useState("holdings");  // holdings | coverage | health
  const [advisorSub,setAdvisorSub]=useState("qa");
  const [liveNews,setLiveNews]=useState([]);
  const [newsLoading,setNewsLoading]=useState(false);
  const [liveIndices,setLiveIndices]=useState(indices);
  const [indicesLoading,setIndicesLoading]=useState(false);
  const [screen,setScreen]=useState(null);  // {type: news|stock|article, data}
  // UI
  const [chartTab,setChartTab]=useState("1M");
  const [toast,setToast]=useState("");
  const [openTerm,setOpenTerm]=useState(null);
  const [risk,setRisk]=useState("穩健");
  // Holdings state
  const USD_TWD=31.5;
  const [holdingsTab,setHoldingsTab]=useState("insurance");
  const INS_BLANK={product:"富邦 — 富域多元貨幣",policyNo:"",policyType:"分紅",paymentTerm:"2年",faceAmountUSD:"",annualPremiumUSD:"",actualCostUSD:"",startYear:String(new Date().getFullYear()),lifeCoverUSD:""};
  const [insuranceHoldings,setInsuranceHoldings]=useState([]);
  const [showInsForm,setShowInsForm]=useState(false);
  const [editInsId,setEditInsId]=useState(null);
  const [insForm,setInsForm]=useState(INS_BLANK);
  const [stockHoldings,setStockHoldings]=useState([]);
  const [showStockForm,setShowStockForm]=useState(false);
  const [editStockId,setEditStockId]=useState(null);
  const [stockForm,setStockForm]=useState({code:"",name:"",shares:"",costPerShare:"",currentPrice:"",currency:"TWD"});
  const [stockCodeInput,setStockCodeInput]=useState("");
  const [stockLookupLoading,setStockLookupLoading]=useState(false);
  const [stockRefreshing,setStockRefreshing]=useState(false);
  const [fixedHoldings,setFixedHoldings]=useState([]);
  const [showFixedForm,setShowFixedForm]=useState(false);
  const [editFixedId,setEditFixedId]=useState(null);
  const [fixedForm,setFixedForm]=useState({product:"萬兆豐 — 金益求金",amountUSD:"",startDate:"",lockYears:"1",annualRate:"6"});
  // 貴金屬
  const METAL_BLANK={product:"萬兆豐貴金屬 — 實體黃金",grams:"",costPerGram:"",currentPricePerGram:"",purchaseDate:""};
  const RE_BLANK={name:"",propertyType:"住宅",address:"",marketValue:"",govValue:"",mortgage:"",purchaseYear:"",purchasePrice:"",annualReturn:"",currency:"TWD",notes:""};
  const [metalHoldings,setMetalHoldings]=useState([]);
  const [showMetalForm,setShowMetalForm]=useState(false);
  const [editMetalId,setEditMetalId]=useState(null);
  const [metalForm,setMetalForm]=useState({product:"萬兆豐貴金屬 — 實體黃金",grams:"",costPerGram:"",currentPricePerGram:"",purchaseDate:""});
  // 房地產
  const [realEstateHoldings,setRealEstateHoldings]=useState([]);
  const [showRealEstateForm,setShowRealEstateForm]=useState(false);
  const [editRealEstateId,setEditRealEstateId]=useState(null);
  const [realEstateForm,setRealEstateForm]=useState({name:"",propertyType:"住宅",address:"",marketValue:"",govValue:"",mortgage:"",purchaseYear:"",purchasePrice:"",annualReturn:"",currency:"TWD",notes:""});
  // Health
  const [showHealthForm,setShowHealthForm]=useState(false);
  const [showCoverageForm,setShowCoverageForm]=useState(false);
  const [coverageForm,setCoverageForm]=useState({
    monthlyExpense:"",    // 家庭月支出
    lifeInsurance:"",     // 壽險保額
    realExpense:"",       // 實支實付上限/次
    dailyHospital:"",     // 住院日額
    cancerLump:"",        // 癌症一次金
  });
  const [coverageResult,setCoverageResult]=useState(null);
  const [healthForm,setHealthForm]=useState({monthlyIncome:"",monthlyExpense:"",emergencyFund:"",totalDebt:"",hasLife:false,hasHealth:false,hasCritical:false,retirementTarget:"",retirementCurrent:""});
  const [healthScore,setHealthScore]=useState(null);
  // Calculators
  const [calcMode,setCalcMode]=useState("mortgage"); // mortgage | retire | compound | estate | gift | incometax | realestate2 | fx | rule72 | inflation | breakeven | irr
  const [mtgForm,setMtgForm]=useState({homeValue:"",loanBalance:"",rate:"2.6",years:"20",targetRate:"6",originalMonthly:""});
  const [mtgResult,setMtgResult]=useState(null);
  const [retForm,setRetForm]=useState({currentAge:"",retireAge:"65",currentSavings:"",monthlyContrib:"",expectedReturn:"5",monthlyExpense:""});
  const [retResult,setRetResult]=useState(null);
  // 複利計算機
  const [compForm,setCompForm]=useState({principal:"",rate:"",years:"",monthly:""});
  const [compResult,setCompResult]=useState(null);
  // 遺產稅試算
  const [estateForm,setEstateForm]=useState({totalAsset:"",spouse:true,children:"2",parents:"0",funeralExp:"1380000",debt:"",disabledCount:"0",lifeInsurance:""});
  const [estateResult,setEstateResult]=useState(null);
  // 贈與稅試算
  const [giftForm,setGiftForm]=useState({totalGift:"",donors:"1",wedding:false,spouseGift:false});
  const [giftResult,setGiftResult]=useState(null);
  // 匯率換算
  const [fxAmount,setFxAmount]=useState("");
  const [fxFrom,setFxFrom]=useState("USD");
  const [fxTo,setFxTo]=useState("TWD");
  const [fxRates,setFxRates]=useState({USD:1,TWD:31.5,HKD:7.82,SGD:1.34,JPY:149.5,EUR:0.92,CNY:7.24});
  const [fxLoading,setFxLoading]=useState(false);
  const [fxUpdatedAt,setFxUpdatedAt]=useState("");
  const [metalPrices,setMetalPrices]=useState({goldUSD:"4,733",silverUSD:"75.40",goldTWD:"4,794",platinumUSD:"980",goldUSDChg:"+0.8%",silverUSDChg:"+1.2%",goldTWDChg:"+0.8%",platinumChg:"-0.3%",goldUp:true,silverUp:true,platinumUp:false,updatedAt:""});
  const [metalPricesLoading,setMetalPricesLoading]=useState(false);
  // 72法則
  const [rule72Rate,setRule72Rate]=useState("");
  // 通膨侵蝕
  const [inflForm,setInflForm]=useState({amount:"",rate:"3",years:"20"});
  // 綜所稅
  const [itaxForm,setItaxForm]=useState({income:"",spouse:false,children:"0",parents:"0",salary:true,rent:false,youngKids:"",ltc:""});
  // 房地合一稅
  const [reit2Form,setReit2Form]=useState({sellPrice:"",buyPrice:"",cost:"",holdYears:"",isPersonal:true,selfUse:false});
  // 回本年試算
  const [breakevenForm,setBreakevenForm]=useState({premium:"",payYears:"2",targetRate:"6"});
  const [breakevenResult,setBreakevenResult]=useState(null);
  // IRR 試算
  const [irrForm,setIrrForm]=useState({mode:"insurance",payYears:"2",annualPremium:"",rows:[{year:"",value:""}]});
  const [irrResult,setIrrResult]=useState(null);
  // 客戶摘要卡
  const [summaryClientId,setSummaryClientId]=useState(null);
  // 推薦信
  const [letterType,setLetterType]=useState("referral");
  const [letterResult,setLetterResult]=useState("");
  const [letterLoading,setLetterLoading]=useState(false);
  // Product groups (editable by Kate)
  const [productGroups,setProductGroups]=useState(DEFAULT_PRODUCT_GROUPS);
  const [showProdEditor,setShowProdEditor]=useState(false);
  const [prodEditorGroupIdx,setProdEditorGroupIdx]=useState(0);
  const [prodEditorItemIdx,setProdEditorItemIdx]=useState(null); // null = new
  const PROD_BLANK={company:"",name:"",country:"香港",type:"分紅保單",min:"",payTerms:["躉繳優惠","2年","5年"],breakeven:"",irr:"",tags:[],suitable:"",notes:""};
  const [prodForm,setProdForm]=useState(PROD_BLANK);
  const [prodFormTagInput,setProdFormTagInput]=useState("");
  const [prodFormTermInput,setProdFormTermInput]=useState("");
  // Advisor / Picks
  const [picksStep,setPicksStep]=useState("idle");
  const [selectedThemes,setSelectedThemes]=useState(["inheritance","geopolitical"]);
  const [loadingStep,setLoadingStep]=useState("");
  const [picksNewsItems,setPicksNewsItems]=useState([]);
  const [draftTitle,setDraftTitle]=useState("");
  const [draftBody,setDraftBody]=useState("");
  const [draftProds,setDraftProds]=useState([]);
  const [draftTheme,setDraftTheme]=useState("");
  const [publishedPicks,setPublishedPicks]=useState(null);
  const [publishedArticles,setPublishedArticles]=useState([]);  // 存到 Supabase 的文章清單
  // Messenger
  const [showMsg,setShowMsg]=useState(false);
  const [msgThread,setMsgThread]=useState([
    {id:1,type:"kate",text:"您好！我是凱特的線上顧問助理 😊 有什麼可以幫您的嗎？"},
    {id:2,type:"kate",text:"您可以直接輸入問題，或點選下方快速選項開始。"},
  ]);
  const [msgInput,setMsgInput]=useState("");
  const [msgLoading,setMsgLoading]=useState(false);
  const [showProdMenu,setShowProdMenu]=useState(false);
  const [chatHistory,setChatHistory]=useState([]);
  // QA
  const [qaThread,setQaThread]=useState([]);
  const [qaInput,setQaInput]=useState("");
  const [qaLoading,setQaLoading]=useState(false);
  // Notifs
  const [notifs,setNotifs]=useState(NOTIFS);
  const [notifSettings,setNotifSettings]=useState({stock:true,payment:true,fx:false,tax:true});
  const [notifFilter,setNotifFilter]=useState("all");
  // Onboarding
  const ONBOARDING_STEPS=[{title:"基本資料",icon:"👤"},{title:"財務狀況",icon:"💰"},{title:"目標與偏好",icon:"🎯"},{title:"其他資訊",icon:"📋"}];
  const GOAL_OPTIONS=["傳承規劃","退休規劃","資產保全","海外配置","節稅規劃","積極增值","穩健儲蓄"];
  const [showOnboarding,setShowOnboarding]=useState(false);
  const [onboardingStep,setOnboardingStep]=useState(0);
  const [onboardingData,setOnboardingData]=useState({name:"",age:"",occupation:"",annualIncome:"",assets:"",goals:[],riskLevel:"穩健",concerns:"",referral:""});
  const [onboardingDone,setOnboardingDone]=useState(false);
  const [onboardingList,setOnboardingList]=useState([]);
  const threadRef=useRef(null);
  const qaRef=useRef(null);

  useEffect(()=>{if(threadRef.current)threadRef.current.scrollTop=threadRef.current.scrollHeight;},[msgThread,msgLoading]);
  useEffect(()=>{if(qaRef.current)qaRef.current.scrollTop=qaRef.current.scrollHeight;},[qaThread,qaLoading]);
  useEffect(()=>{if(mtgResult&&mtgForm.homeValue)calcMortgage();},[mtgForm]);

  // 稅務 & 保單通知自動產生
  useEffect(()=>{
    if(!loggedIn)return;
    const today=new Date();
    const year=today.getFullYear();
    const autoNotifs=[];

    // ── 稅務行事曆通知 ──
    if(notifSettings.tax){
      TAX_CALENDAR.forEach(t=>{
        const end=new Date(year,t.endMonth-1,t.endDay);
        const start=new Date(year,t.month-1,t.day);
        const daysToEnd=Math.ceil((end-today)/(1000*60*60*24));
        const daysToStart=Math.ceil((start-today)/(1000*60*60*24));
        if((daysToStart<=t.warnDays&&daysToStart>=-1)||(today>=start&&today<=end)){
          const isActive=today>=start&&today<=end;
          const urgency=daysToEnd<=7?"urgent":daysToEnd<=14?"soon":"normal";
          autoNotifs.push({
            id:`tax_${t.key}_${year}`,
            icon:t.icon,
            cls:urgency==="urgent"?"ni-rose":urgency==="soon"?"ni-gold":"ni-green",
            title:isActive?`📌 ${t.name}進行中`:`🗓️ ${t.name}即將到來`,
            desc:isActive
              ?`${t.desc}，截止日 ${year}/${t.endMonth}/${t.endDay}（剩 ${Math.max(0,daysToEnd)} 天）`
              :`${t.desc}，開始日 ${year}/${t.month}/${t.day}（${daysToStart<=0?"今日開始":`${daysToStart} 天後`}）`,
            time:"稅務提醒",unread:true,isTax:true,
          });
        }
      });
    }

    // ── 保單繳費通知 ──
    if(notifSettings.payment){
      insuranceHoldings.forEach(h=>{
        const startYr=Number(h.startYear)||year;
        // 計算下一個繳費年度（每年同月1日，簡化為3月1日）
        let nextPayYear=year;
        const payDue=new Date(nextPayYear,2,1); // 3月1日
        if(payDue<today) nextPayYear=year+1;
        const nextDue=new Date(nextPayYear,2,1);
        const daysLeft=Math.ceil((nextDue-today)/(1000*60*60*24));
        if(daysLeft<=60){
          const urgent=daysLeft<=14;
          const prodName=h.product.split("—")[1]?.trim()||h.product;
          autoNotifs.push({
            id:`ins_${h.id}_${nextPayYear}`,
            icon:"📅",
            cls:urgent?"ni-rose":"ni-green",
            title:`${urgent?"⚠️ 緊急｜":""}保單繳費提醒`,
            desc:`${prodName}｜年繳 USD ${(h.annualPremiumUSD||0).toLocaleString()}，繳費日 ${nextPayYear}/03/01（剩 ${daysLeft} 天）`,
            time:"保單提醒",unread:true,isPayment:true,
          });
        }
      });
    }

    if(autoNotifs.length>0){
      setNotifs(prev=>{
        const manual=prev.filter(n=>!n.isTax&&!n.isPayment);
        return[...autoNotifs,...manual];
      });
    }
  },[loggedIn,notifSettings.tax,notifSettings.payment,insuranceHoldings]);

  useEffect(()=>{
    if(!loggedIn)return;
    setIndicesLoading(true);
    const runAIFallback=()=>{
      const today=new Date().toLocaleDateString("zh-TW");
      const todayISO=new Date().toISOString().slice(0,10);
      searchNews(`${todayISO} 台灣加權指數收盤 TAIEX S&P500 Nasdaq 日經225 Nikkei 今日最新收盤點數`)
        .then(raw=>generateAI(`今天是${today}。根據以下市場資訊，找出4個指數【今日】最新數據。數字必須精確，只輸出純JSON不加其他文字：
{"indices":[
  {"name":"台灣加權","val":"如36296（只填數字不加逗號）","chg":"如+2.37%","up":true},
  {"name":"S&P 500","val":"","chg":"","up":true},
  {"name":"那斯達克","val":"","chg":"","up":true},
  {"name":"日經 225","val":"","chg":"","up":true}
]}
今日資料：${raw.slice(0,3000)}`,800))
        .then(raw=>{
          try{
            const cleaned=raw.replace(/```json|```/g,"").trim();
            const parsed=JSON.parse(cleaned.slice(cleaned.indexOf("{"),cleaned.lastIndexOf("}")+1));
            if(parsed.indices?.length>0)setLiveIndices(parsed.indices.map(idx=>({...idx,loading:false})));
          }catch{}
          setIndicesLoading(false);
        })
        .catch(()=>setIndicesLoading(false));
    };
    fetchAllIndices()
      .then(data=>{
        if(data.length>0){setLiveIndices(data);setIndicesLoading(false);}
        else runAIFallback();
      })
      .catch(()=>runAIFallback());
  },[loggedIn]);

  useEffect(()=>{
    if(!loggedIn)return;
    fetchHomeNews();
    refreshMetalPrices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[loggedIn]);

  // ── 股票現價自動更新（登入後立即執行，每 5 分鐘一次）──
  useEffect(()=>{
    if(!loggedIn||!stockHoldings.length)return;
    const refresh=async()=>{
      setStockRefreshing(true);
      const codes=[...new Set(stockHoldings.map(h=>h.code))];
      const priceMap=await fetchStockPrices(codes);
      if(!priceMap.size){setStockRefreshing(false);return;}
      setStockHoldings(prev=>{
        const next=prev.map(h=>priceMap.has(h.code)?{...h,currentPrice:priceMap.get(h.code)}:h);
        if(currentUser)saveUserData(currentUser.id,"stocks",next).catch(console.error);
        return next;
      });
      showToast("✓ 股票現價已更新");
      setStockRefreshing(false);
    };
    refresh();
    const timer=setInterval(refresh,5*60*1000);
    return()=>clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[loggedIn,stockHoldings.length]);

  // ── 貴金屬持倉連動首頁金價 ──
  useEffect(()=>{
    if(!metalHoldings.length||!metalPrices.goldUSD)return;
    const updated=syncMetalHoldingPrices(metalHoldings,metalPrices,USD_TWD);
    if(updated!==metalHoldings){
      setMetalHoldings(updated);
      if(currentUser)saveUserData(currentUser.id,"metals",updated).catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[metalPrices.goldUSD]);

  const refreshMetalPrices=async()=>{
    if(metalPricesLoading)return;
    setMetalPricesLoading(true);
    try{
      // 用 Edge Function 抓貴金屬期貨
      const [goldRes,silverRes,platRes]=await Promise.allSettled([
        fetch("/api/quotes?symbols=GC%3DF,SI%3DF,PL%3DF",{signal:AbortSignal.timeout(8000)}),
      ]);
      const goldData=goldRes.status==="fulfilled"&&goldRes.value.ok?await goldRes.value.json():null;
      if(goldData?.indices?.length>=1){
        const [gc,si,pl]=goldData.indices;
        const now=new Date();
        const goldUSDNum=parseFloat(String(gc.val).replace(/,/g,""))||0;
        const goldTWDPerGram=goldUSDNum>0?Math.round(goldUSDNum/31.1035*USD_TWD).toLocaleString():"N/A";
        setMetalPrices({
          goldUSD:gc.val,goldUSDChg:gc.chg,goldUp:gc.up,
          silverUSD:si?.val||"—",silverUSDChg:si?.chg||"—",silverUp:si?.up??true,
          goldTWD:goldTWDPerGram,goldTWDChg:gc.chg,
          platinumUSD:pl?.val||"—",platinumChg:pl?.chg||"—",platinumUp:pl?.up??true,
          updatedAt:now.getHours().toString().padStart(2,"0")+":"+now.getMinutes().toString().padStart(2,"0")+" 更新"
        });
        showToast("✓ 貴金屬行情已更新");
        setMetalPricesLoading(false);
        return;
      }
    }catch{}
    // Fallback: AI search
    try{
      const raw=await searchNews("gold silver platinum price today USD per ounce latest spot price");
      const result=await generateAI(`根據以下貴金屬行情，整理最新價格與漲跌幅。只輸出純JSON：{"goldUSD":"數字加逗號","silverUSD":"數字","goldTWD":"數字","platinumUSD":"數字","goldUSDChg":"+/-百分比%","silverUSDChg":"+/-百分比%","goldTWDChg":"+/-百分比%","platinumChg":"+/-百分比%","goldUp":true或false,"silverUp":true或false,"platinumUp":true或false}\n資料：${raw.slice(0,2000)}`,400);
      const cleaned=result.replace(/\`\`\`json|\`\`\`/g,"").trim();
      const parsed=JSON.parse(cleaned.slice(cleaned.indexOf("{"),cleaned.lastIndexOf("}")+1));
      if(parsed.goldUSD){
        const now=new Date();
        const goldUSDNum=parseFloat(String(parsed.goldUSD).replace(/,/g,""))||0;
        const goldTWDPerGram=goldUSDNum>0?Math.round(goldUSDNum/31.1035*USD_TWD).toLocaleString():"N/A";
        setMetalPrices({...parsed,goldTWD:goldTWDPerGram,goldTWDChg:parsed.goldUSDChg||"",updatedAt:now.getHours().toString().padStart(2,"0")+":"+now.getMinutes().toString().padStart(2,"0")+" 更新"});
        showToast("✓ 貴金屬行情已更新");
      }
    }catch{showToast("⚠ 更新失敗");}
    setMetalPricesLoading(false);
  };

  const fetchHomeNews=async(forceRefresh=false)=>{
    // ── 6 小時快取：先檢查 Supabase，未過期直接用，不呼叫 AI ──
    const CACHE_KEY="kate_news_cache";
    const CACHE_TTL=6*60*60*1000; // 6 小時（毫秒）
    if(!forceRefresh){
      try{
        const cached=await loadUserData("00000000-0000-0000-0000-000000004b61",CACHE_KEY);
        if(cached&&cached.news?.length>0){
          const age=Date.now()-new Date(cached.cachedAt).getTime();
          if(age<CACHE_TTL){
            setLiveNews(cached.news);
            return; // 快取有效，直接用，不花 token
          }
        }
      }catch{}
    }
    setNewsLoading(true);
    try{
      const today=new Date().toLocaleDateString("zh-TW",{year:"numeric",month:"long",day:"numeric",weekday:"long"});
      const todayISO=new Date().toISOString().slice(0,10);
      // 四大主題分別搜尋
      const [rawGeo,rawInherit,rawRetire,rawInvest]=await Promise.all([
        searchNews(`${todayISO} 國際局勢 地緣政治 台海 美中關係 俄烏 中東 最新`),
        searchNews(`${todayISO} 台灣遺產稅 資產傳承 境外保險 信託 傳承規劃 最新`),
        searchNews(`${todayISO} 退休規劃 勞退 年金 台灣退休 pension 最新`),
        searchNews(`${todayISO} 美股 台股 投資 市場焦點 基金 ETF 最新`),
      ]);
      const result=await generateAI(`今天是${today}。
你是凱特資產管理的首席分析師。請根據以下真實新聞，為每個主題各寫一篇深度文章，文章要有凱特獨特觀點，結合當日時事。

輸出純JSON（不加markdown）：
{"news":[
  {
    "tag":"國際局勢",
    "cls":"tg",
    "title":"標題，必須包含今日具體事件，20字內",
    "src":"主要來源媒體名稱",
    "time":"X小時前",
    "newsUrl":"如果新聞有提到具體URL則填入，否則填空字串",
    "body":"第一段（事件背景）：描述今日具體事件，含關鍵人物、地點、數字，100-120字。\n\n第二段（深度分析）：分析此事件對台灣高資產族群的影響，包括資產安全、匯率、地緣風險等，80-100字。\n\n第三段（凱特觀點）：凱特資產管理建議，提到具體的境外資產配置策略（香港、新加坡保單、分散配置），語氣專業親切，80-100字。",
    "keyStats":[{"label":"關鍵指標","value":"具體數字"},{"label":"關鍵指標","value":"具體數字"}]
  },
  {
    "tag":"資產傳承",
    "cls":"ti",
    "title":"標題，必須包含今日具體議題，20字內",
    "src":"主要來源媒體名稱",
    "time":"X小時前",
    "newsUrl":"",
    "body":"第一段（政策/趨勢背景）：描述遺產稅、信託或傳承相關最新動態，100-120字，含具體稅率、金額。\n\n第二段（影響分析）：說明對台灣高資產家庭的衝擊，包括稅負試算、傳承工具比較，80-100字。\n\n第三段（凱特觀點）：凱特建議透過境外保險做傳承規劃的具體方案，點名適合的產品類型，80-100字。",
    "keyStats":[{"label":"關鍵數字","value":"具體數字"},{"label":"關鍵數字","value":"具體數字"}]
  },
  {
    "tag":"退休規劃",
    "cls":"tr",
    "title":"標題，必須包含今日具體議題，20字內",
    "src":"主要來源媒體名稱",
    "time":"X小時前",
    "newsUrl":"",
    "body":"第一段（現況背景）：描述台灣退休金制度或市場最新動態，100-120字，含缺口數字。\n\n第二段（影響分析）：說明對不同年齡層的影響，試算退休缺口，80-100字。\n\n第三段（凱特觀點）：建議用分紅保單補足退休缺口的具體策略，含預期報酬，80-100字。",
    "keyStats":[{"label":"退休缺口","value":"NT$ XXX萬"},{"label":"建議配置","value":"XX%"}]
  },
  {
    "tag":"投資焦點",
    "cls":"tt",
    "title":"標題，必須包含今日具體市場事件，20字內",
    "src":"主要來源媒體名稱",
    "time":"X小時前",
    "newsUrl":"",
    "body":"第一段（市場動態）：描述今日最重要的投資市場事件，含指數點位、個股漲跌、交易量，100-120字。\n\n第二段（趨勢分析）：分析背後邏輯與趨勢，對台灣投資人的啟示，80-100字。\n\n第三段（凱特觀點）：具體的資產配置建議，包括股債比例、保單搭配，80-100字。",
    "keyStats":[{"label":"關鍵指標","value":"具體數字"},{"label":"漲跌幅","value":"XX%"}]
  }
]}

國際局勢新聞：${rawGeo.slice(0,1500)}
資產傳承新聞：${rawInherit.slice(0,1500)}
退休規劃新聞：${rawRetire.slice(0,1500)}
投資焦點新聞：${rawInvest.slice(0,1500)}`,3000);
      const cleaned=result.replace(/\`\`\`json|\`\`\`/g,"").trim();
      const data=JSON.parse(cleaned.slice(cleaned.indexOf("{"),cleaned.lastIndexOf("}")+1));
      if(data.news?.length>0){
        // 嘗試為每則新聞抓 OG image
        const newsWithImages=await Promise.all(data.news.map(async(n)=>{
          try{
            if(n.newsUrl&&n.newsUrl.startsWith("http")){
              const proxyUrl=`https://api.allorigins.win/get?url=${encodeURIComponent(n.newsUrl)}`;
              const res=await fetch(proxyUrl,{signal:AbortSignal.timeout(4000)});
              const json=await res.json();
              const html=json.contents||"";
              const ogMatch=html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
                ||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
              if(ogMatch?.[1])return{...n,imgUrl:ogMatch[1]};
            }
          }catch{}
          return n;
        }));
        setLiveNews(newsWithImages);
        // 存進 Supabase 快取（用 local-kate 帳號，所有用戶共用）
        saveUserData("00000000-0000-0000-0000-000000004b61",CACHE_KEY,{news:newsWithImages,cachedAt:new Date().toISOString()}).catch(console.error);
      }
    }catch(e){console.error(e);}
    setNewsLoading(false);
  };

  const refreshIndices=()=>{
    if(indicesLoading)return;
    setIndicesLoading(true);
    const runAIFallback=()=>{
      const todayStr=new Date().toLocaleDateString("zh-TW");
      const todayISO2=new Date().toISOString().slice(0,10);
      searchNews(`${todayISO2} 台灣加權指數收盤 TAIEX S&P500 Nasdaq 日經225 Nikkei 今日最新收盤點數`)
        .then(raw=>generateAI(`今天是${todayStr}。根據以下市場資訊，找出4個指數【今日】最新數據。數字必須精確，只輸出純JSON不加其他文字：
{"indices":[
  {"name":"台灣加權","val":"只填數字如36296","chg":"如+2.37%","up":true},
  {"name":"S&P 500","val":"","chg":"","up":true},
  {"name":"那斯達克","val":"","chg":"","up":true},
  {"name":"日經 225","val":"","chg":"","up":true}
]}
今日資料：${raw.slice(0,3000)}`,800))
        .then(raw=>{
          try{
            const cleaned=raw.replace(/```json|```/g,"").trim();
            const data=JSON.parse(cleaned.slice(cleaned.indexOf("{"),cleaned.lastIndexOf("}")+1));
            if(data.indices?.length>0){setLiveIndices(data.indices.map(idx=>({...idx,loading:false})));showToast("✓ 指數已更新");}
            else showToast("⚠ 更新失敗，請稍後再試");
          }catch{showToast("⚠ 更新失敗，請稍後再試");}
          setIndicesLoading(false);
        })
        .catch(()=>{setIndicesLoading(false);showToast("⚠ 更新失敗");});
    };
    fetchAllIndices()
      .then(data=>{
        if(data.length>0){setLiveIndices(data);showToast("✓ 指數已更新");setIndicesLoading(false);}
        else runAIFallback();
      })
      .catch(()=>runAIFallback());
  };

  const handleRegister=async()=>{
    if(!acct.trim()||!pwd||loginLoading)return;
    if(pwd!==regPwd2){setLoginError("兩次密碼不一致");return;}
    if(pwd.length<6){setLoginError("密碼至少 6 個字元");return;}
    setLoginLoading(true);setLoginError("");
    try{
      const user=await registerUser(acct.trim(),pwd);
      setCurrentUser(user);setIsKate(false);setRisk("穩健");
      setInsuranceHoldings([]);setStockHoldings([]);setFixedHoldings([]);
      setLoggedIn(true);
    }catch(err){setLoginError(err.message||"註冊失敗，請重試");}
    finally{setLoginLoading(false);}
  };

  const handleSaveDisplayName=async()=>{
    if(!editNameVal.trim()||!currentUser)return;
    await updateDisplayName(currentUser.id,editNameVal.trim()).catch(console.error);
    setCurrentUser(p=>({...p,display_name:editNameVal.trim()}));
    setShowEditName(false);showToast("✓ 顯示名稱已更新");
  };

  const LOCAL_ACCOUNTS=[
    {username:"Kate",password:"kate2026",is_kate:true,display_name:"凱特",risk_level:"穩健",id:"00000000-0000-0000-0000-000000004b61"},
    {username:"kate",password:"kate2026",is_kate:true,display_name:"凱特",risk_level:"穩健",id:"00000000-0000-0000-0000-000000004b61"},
    {username:"demo",password:"demo1234",is_kate:false,display_name:"示範用戶",risk_level:"穩健",id:"00000000-0000-0000-0000-000000006465"},
  ];
  const handleLogin=async()=>{
    if(!acct||!pwd||loginLoading)return;
    setLoginLoading(true);setLoginError("");
    // 先嘗試本地帳號（避免網路限制）
    const localUser=LOCAL_ACCOUNTS.find(u=>u.username===acct.trim()&&u.password===pwd);
    if(localUser){
      setCurrentUser(localUser);setIsKate(localUser.is_kate);setRisk(localUser.risk_level||"穩健");
      // 嘗試從 Supabase 讀取資料
      try{
        const insData=await loadUserData(localUser.id,"insurance");
        const stkData=await loadUserData(localUser.id,"stocks");
        const fixData=await loadUserData(localUser.id,"fixed");
        const metalData=await loadUserData(localUser.id,"metals");
        const reData=await loadUserData(localUser.id,"realestate");
        const hlthData=await loadUserData(localUser.id,"health_score");
        const onbData=await loadUserData(localUser.id,"onboarding_clients");
        if(insData&&insData.length>0)setInsuranceHoldings(insData);
        if(stkData&&stkData.length>0)setStockHoldings(stkData);
        if(fixData&&fixData.length>0)setFixedHoldings(fixData);
        if(metalData&&metalData.length>0)setMetalHoldings(metalData);
        if(reData&&reData.length>0)setRealEstateHoldings(reData);
        if(hlthData)setHealthScore(hlthData);
        if(onbData&&onbData.length>0)setOnboardingList(onbData);
        const artData=await loadUserData(localUser.id,"kate_articles");
        if(artData&&artData.length>0){setPublishedArticles(artData);setPublishedPicks(artData[0]);}
        const prodData=await loadUserData("00000000-0000-0000-0000-000000004b61","kate_products");
        if(prodData&&prodData.length>0)setProductGroups(prodData);
      }catch(e){console.error("Supabase load error",e);}
      setLoggedIn(true);setLoginLoading(false);return;
    }
    // 嘗試 Supabase
    try{
      const user=await loginUser(acct.trim(),pwd);
      setCurrentUser(user);
      setIsKate(user.is_kate);
      setRisk(user.risk_level||"穩健");
      const insData=await loadUserData(user.id,"insurance");
      const stkData=await loadUserData(user.id,"stocks");
      const fixData=await loadUserData(user.id,"fixed");
      const hlthData=await loadUserData(user.id,"health_score");
      if(insData&&insData.length>0)setInsuranceHoldings(insData);
      else setInsuranceHoldings([]);
      if(stkData&&stkData.length>0)setStockHoldings(stkData);
      else setStockHoldings([]);
      if(fixData&&fixData.length>0)setFixedHoldings(fixData);
      else setFixedHoldings([]);
      if(hlthData)setHealthScore(hlthData);
      const metalData=await loadUserData(user.id,"metals");
      const reData=await loadUserData(user.id,"realestate");
      if(metalData&&metalData.length>0)setMetalHoldings(metalData);
      if(reData&&reData.length>0)setRealEstateHoldings(reData);
      // 讀取 Onboarding 客戶清單（Kate 帳號專用）
      if(user.is_kate){
        const onbData=await loadUserData(user.id,"onboarding_clients");
        if(onbData&&onbData.length>0)setOnboardingList(onbData);
      }
      // 讀取已發布文章
      const artData=await loadUserData(user.id,"kate_articles");
      if(artData&&artData.length>0){setPublishedArticles(artData);setPublishedPicks(artData[0]);}
      // 讀取產品資料（Kate 帳號，所有用戶共用）
      const prodData=await loadUserData("00000000-0000-0000-0000-000000004b61","kate_products");
      if(prodData&&prodData.length>0)setProductGroups(prodData);
      setLoggedIn(true);
    }catch(err){
      setLoginError("帳號或密碼錯誤");
    }finally{setLoginLoading(false);}
  };

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2500);};

  // ── Holdings helpers ──
  const calcInsTotalCost=(h)=>{
    if(h.actualCostUSD&&Number(h.actualCostUSD)>0) return Number(h.actualCostUSD);
    const m={"躉繳":1,"2年":2,"5年":5,"12年":12};
    return Number(h.annualPremiumUSD||0)*(m[h.paymentTerm]||1);
  };
  const calcStockTWD=(h)=>{const v=h.shares*h.currentPrice;return h.currency==="USD"?Math.round(v*USD_TWD):Math.round(v);};
  const calcStockCostTWD=(h)=>{const v=h.shares*h.costPerShare;return h.currency==="USD"?Math.round(v*USD_TWD):Math.round(v);};
  const calcFixedValue=(h)=>{
    if(!h.startDate)return h.amountUSD;
    const [y,m]=h.startDate.split("-").map(Number);
    const now=new Date();const months=(now.getFullYear()-y)*12+(now.getMonth()+1-m);
    return Math.round(h.amountUSD*Math.pow(1+Number(h.annualRate)/100,months/12));
  };
  const totalInsUSD=insuranceHoldings.reduce((s,h)=>s+calcInsTotalCost(h),0);
  const totalStockTWD=stockHoldings.reduce((s,h)=>s+calcStockTWD(h),0);
  const totalStockCostTWD=stockHoldings.reduce((s,h)=>s+calcStockCostTWD(h),0);
  const totalFixedUSD=fixedHoldings.reduce((s,h)=>s+calcFixedValue(h),0);
  const totalFixedCostUSD=fixedHoldings.reduce((s,h)=>s+h.amountUSD,0);
  const totalMetalUSD=metalHoldings.reduce((s,h)=>s+(h.grams*(h.currentPricePerGram||h.costPerGram||0)),0);
  const totalRealEstateUSD=realEstateHoldings.reduce((s,h)=>s+h.amountUSD,0);
  const grandTotalTWD=Math.round(totalInsUSD*USD_TWD)+totalStockTWD+Math.round(totalFixedUSD*USD_TWD)+Math.round(totalMetalUSD*USD_TWD)+Math.round(totalRealEstateUSD*USD_TWD);
  const fmtUSD=(n)=>"USD "+Number(n).toLocaleString();
  const fmtTWD=(n)=>"NT$ "+Number(n).toLocaleString();

  // ── Holdings CRUD ──
  const saveIns=()=>{
    if(!insForm.startYear)return;
    const item={...insForm,faceAmountUSD:Number(insForm.faceAmountUSD)||0,annualPremiumUSD:Number(insForm.annualPremiumUSD)||0,actualCostUSD:Number(insForm.actualCostUSD)||0,startYear:Number(insForm.startYear),lifeCoverUSD:insForm.lifeCoverUSD?Number(insForm.lifeCoverUSD):""};
    if(editInsId){setInsuranceHoldings(p=>p.map(h=>h.id===editInsId?{...h,...item}:h));}
    else{setInsuranceHoldings(p=>[...p,{id:Date.now(),...item}]);}
    setShowInsForm(false);setEditInsId(null);setInsForm(INS_BLANK);showToast("✓ 保單已儲存");
    if(currentUser)saveUserData(currentUser.id,"insurance",editInsId?insuranceHoldings.map(h=>h.id===editInsId?{...h,...item}:h):[...insuranceHoldings,{id:Date.now(),...item}]).catch(console.error);
  };
  const deleteIns=(id)=>{const next=insuranceHoldings.filter(h=>h.id!==id);setInsuranceHoldings(next);showToast("✓ 已刪除");if(currentUser)saveUserData(currentUser.id,"insurance",next).catch(console.error);};
  const editIns=(h)=>{setEditInsId(h.id);setInsForm({product:h.product,policyNo:h.policyNo||"",policyType:h.policyType||"分紅",paymentTerm:h.paymentTerm||"2年",faceAmountUSD:String(h.faceAmountUSD||""),annualPremiumUSD:String(h.annualPremiumUSD||""),actualCostUSD:String(h.actualCostUSD||""),startYear:String(h.startYear),lifeCoverUSD:String(h.lifeCoverUSD||"")});setShowInsForm(true);};
  const lookupStock=async(rawCode)=>{
    if(!rawCode.trim())return;setStockLookupLoading(true);
    const isLocal=/^\d{4,5}$/.test(rawCode.trim());
    const fullCode=isLocal?rawCode.trim()+".TW":rawCode.trim().toUpperCase();
    const isTW=fullCode.endsWith(".TW");
    try{
      const query=isTW
        ?`台股 ${rawCode.trim()} 股票名稱 今日最新股價收盤價`
        :`${fullCode} stock company name latest price today`;
      // Step 1: web search
      const searchText=await searchNews(query);
      // Step 2: AI parse result into JSON
      const raw=await generateAI(
        `根據以下資料，找出股票「${fullCode}」的公司名稱和最新股價。
只輸出純JSON，不加任何說明或markdown符號：{"name":"公司名稱","price":數字}
若找不到價格price填0。

資料：${searchText.slice(0,2000)}`,300);
      const cleaned=raw.replace(/```json|```/g,"").trim();
      const start=cleaned.indexOf("{");const end=cleaned.lastIndexOf("}")+1;
      const info=JSON.parse(cleaned.slice(start,end));
      setStockForm(p=>({
        ...p,
        code:fullCode,
        name:info.name||fullCode,
        currentPrice:(info.price&&Number(info.price)>0)?String(info.price):"",
        currency:isTW?"TWD":"USD"
      }));
      if(!info.price||Number(info.price)===0)showToast("⚠ 無法取得最新價格，請手動輸入");
    }catch{
      setStockForm(p=>({...p,code:fullCode,name:fullCode,currentPrice:"",currency:isTW?"TWD":"USD"}));
      showToast("⚠ 查詢失敗，請手動輸入");
    }
    setStockLookupLoading(false);
  };
  const saveStock=()=>{
    if(!stockForm.code||!stockForm.shares||!stockForm.costPerShare)return;
    const item={...stockForm,shares:Number(stockForm.shares),costPerShare:Number(stockForm.costPerShare),currentPrice:Number(stockForm.currentPrice)||Number(stockForm.costPerShare)};
    if(editStockId){setStockHoldings(p=>p.map(h=>h.id===editStockId?{...h,...item}:h));}
    else{setStockHoldings(p=>[...p,{id:Date.now(),...item}]);}
    setShowStockForm(false);setEditStockId(null);setStockForm({code:"",name:"",shares:"",costPerShare:"",currentPrice:"",currency:"TWD"});setStockCodeInput("");showToast("✓ 股票已儲存");
    if(currentUser){const next=editStockId?stockHoldings.map(h=>h.id===editStockId?{...h,...item}:h):[...stockHoldings,{id:Date.now(),...item}];saveUserData(currentUser.id,"stocks",next).catch(console.error);}
  };
  const deleteStock=(id)=>{const next=stockHoldings.filter(h=>h.id!==id);setStockHoldings(next);showToast("✓ 已刪除");if(currentUser)saveUserData(currentUser.id,"stocks",next).catch(console.error);};
  const editStock=(h)=>{setEditStockId(h.id);setStockCodeInput(h.code);setStockForm({code:h.code,name:h.name,shares:String(h.shares),costPerShare:String(h.costPerShare),currentPrice:String(h.currentPrice),currency:h.currency});setShowStockForm(true);};
  const saveFixed=()=>{
    if(!fixedForm.amountUSD||!fixedForm.startDate)return;
    const item={...fixedForm,amountUSD:Number(fixedForm.amountUSD),lockYears:Number(fixedForm.lockYears),annualRate:Number(fixedForm.annualRate)||6};
    if(editFixedId){setFixedHoldings(p=>p.map(h=>h.id===editFixedId?{...h,...item}:h));}
    else{setFixedHoldings(p=>[...p,{id:Date.now(),...item}]);}
    setShowFixedForm(false);setEditFixedId(null);setFixedForm({product:"萬兆豐 — 金益求兆",amountUSD:"",startDate:"",lockYears:"2",annualRate:"6"});showToast("✓ 固收已儲存");
    if(currentUser){const next=editFixedId?fixedHoldings.map(h=>h.id===editFixedId?{...h,...item}:h):[...fixedHoldings,{id:Date.now(),...item}];saveUserData(currentUser.id,"fixed",next).catch(console.error);}
  };
  const deleteFixed=(id)=>{const next=fixedHoldings.filter(h=>h.id!==id);setFixedHoldings(next);showToast("✓ 已刪除");if(currentUser)saveUserData(currentUser.id,"fixed",next).catch(console.error);};
  const editFixed=(h)=>{setEditFixedId(h.id);setFixedForm({product:h.product,amountUSD:String(h.amountUSD),startDate:h.startDate,lockYears:String(h.lockYears),annualRate:String(h.annualRate)});setShowFixedForm(true);};

  // 貴金屬 CRUD
  const saveMetal=()=>{
    if(!metalForm.grams||!metalForm.purchaseDate)return;
    const item={...metalForm,grams:Number(metalForm.grams),costPerGram:Number(metalForm.costPerGram)||0,currentPricePerGram:Number(metalForm.currentPricePerGram)||0};
    if(editMetalId){setMetalHoldings(p=>p.map(h=>h.id===editMetalId?{...h,...item}:h));}
    else{setMetalHoldings(p=>[...p,{id:Date.now(),...item}]);}
    setShowMetalForm(false);setEditMetalId(null);setMetalForm(METAL_BLANK);showToast("✓ 貴金屬已儲存");
    if(currentUser){const next=editMetalId?metalHoldings.map(h=>h.id===editMetalId?{...h,...item}:h):[...metalHoldings,{id:Date.now(),...item}];saveUserData(currentUser.id,"metals",next).catch(console.error);}
  };
  const deleteMetal=(id)=>{const next=metalHoldings.filter(h=>h.id!==id);setMetalHoldings(next);showToast("✓ 已刪除");if(currentUser)saveUserData(currentUser.id,"metals",next).catch(console.error);};
  const editMetal=(h)=>{setEditMetalId(h.id);setMetalForm({product:h.product,grams:String(h.grams),costPerGram:String(h.costPerGram),currentPricePerGram:String(h.currentPricePerGram),purchaseDate:h.purchaseDate});setShowMetalForm(true);};
  // 房地產 CRUD
  const saveRealEstate=()=>{
    if(!realEstateForm.name)return showToast("⚠ 請填寫物件名稱");
    const item={...realEstateForm,marketValue:Number(realEstateForm.marketValue)||0,govValue:Number(realEstateForm.govValue)||0,mortgage:Number(realEstateForm.mortgage)||0,purchasePrice:Number(realEstateForm.purchasePrice)||0,annualReturn:Number(realEstateForm.annualReturn)||0,amountUSD:realEstateForm.currency==="TWD"?(Number(realEstateForm.marketValue)||0)/USD_TWD:(Number(realEstateForm.marketValue)||0)};
    if(editRealEstateId){setRealEstateHoldings(p=>p.map(h=>h.id===editRealEstateId?{...h,...item}:h));}
    else{setRealEstateHoldings(p=>[...p,{id:Date.now(),...item}]);}
    setShowRealEstateForm(false);setEditRealEstateId(null);setRealEstateForm({...RE_BLANK});showToast("✓ 不動產已儲存");
    if(currentUser){const next=editRealEstateId?realEstateHoldings.map(h=>h.id===editRealEstateId?{...h,...item}:h):[...realEstateHoldings,{id:Date.now(),...item}];saveUserData(currentUser.id,"realestate",next).catch(console.error);}
  };
  const deleteRealEstate=(id)=>{const next=realEstateHoldings.filter(h=>h.id!==id);setRealEstateHoldings(next);showToast("✓ 已刪除");if(currentUser)saveUserData(currentUser.id,"realestate",next).catch(console.error);};
  const editRealEstate=(h)=>{setEditRealEstateId(h.id);setRealEstateForm({name:h.name||"",propertyType:h.propertyType||"住宅",address:h.address||"",marketValue:String(h.marketValue||""),govValue:String(h.govValue||""),mortgage:String(h.mortgage||""),purchaseYear:String(h.purchaseYear||""),purchasePrice:String(h.purchasePrice||""),annualReturn:String(h.annualReturn||""),currency:h.currency||"TWD",notes:h.notes||""});setShowRealEstateForm(true);};

  // ── Health calc ──
  const calcHealthScore=()=>{
    let s=0;const inc=Number(healthForm.monthlyIncome)||1,exp=Number(healthForm.monthlyExpense)||0,emg=Number(healthForm.emergencyFund)||0,debt=Number(healthForm.totalDebt)||0,retT=Number(healthForm.retirementTarget)||1,retC=Number(healthForm.retirementCurrent)||0;
    const em=emg/(exp||1);s+=em>=6?25:em>=3?15:em>=1?8:0;
    const dr=debt/(inc*12)||0;s+=dr<=0.3?20:dr<=0.5?12:dr<=1?6:0;
    const sv=(inc-exp)/inc;s+=sv>=0.3?20:sv>=0.2?14:sv>=0.1?8:0;
    s+=(healthForm.hasLife?7:0)+(healthForm.hasHealth?7:0)+(healthForm.hasCritical?6:0);
    const rp=retC/retT;s+=rp>=0.8?15:rp>=0.5?10:rp>=0.2?5:0;
    return Math.min(100,Math.round(s));
  };
  const submitHealthForm=()=>{const s=calcHealthScore();setHealthScore(s);setShowHealthForm(false);showToast(`✓ 健康分更新為 ${s}`);if(currentUser)saveUserData(currentUser.id,"health_score",s).catch(console.error);};

  const calcCoverage=()=>{
    const me=Number(coverageForm.monthlyExpense)||0;
    const life=Number(coverageForm.lifeInsurance)||0;
    const real=Number(coverageForm.realExpense)||0;
    const daily=Number(coverageForm.dailyHospital)||0;
    const cancer=Number(coverageForm.cancerLump)||0;

    // 壽險：保額能撐幾年（建議10年）
    const lifeYears=me>0?Math.round((life/(me*12))*10)/10:0;
    const lifeTarget=me*12*10; // 建議保額 = 年支出×10
    const lifeGap=Math.max(0,lifeTarget-life);
    const lifeScore=life>=lifeTarget?100:Math.round((life/lifeTarget)*100);

    // 實支實付：每次住院報銷（建議 50 萬以上）
    const realTarget=500000;
    const realScore=real>=realTarget?100:Math.round((real/realTarget)*100);
    const realGap=Math.max(0,realTarget-real);

    // 住院日額：每天補貼（建議 3,000 以上）
    const dailyTarget=3000;
    const dailyScore=daily>=dailyTarget?100:Math.round((daily/dailyTarget)*100);
    const dailyGap=Math.max(0,dailyTarget-daily);
    // 假設平均住院 30 天，算出總補貼
    const dailyTotal30=daily*30;

    // 癌症：一次金（建議 100 萬以上，含停工+治療）
    const cancerTarget=1000000;
    const cancerScore=cancer>=cancerTarget?100:Math.round((cancer/cancerTarget)*100);
    const cancerGap=Math.max(0,cancerTarget-cancer);
    // 停工估算：平均停工6個月
    const cancerStopWork=me*6;
    const cancerSufficient=cancer>=cancerStopWork;

    const overall=Math.round((lifeScore+realScore+dailyScore+cancerScore)/4);
    setCoverageResult({lifeYears,lifeTarget,lifeGap,lifeScore,realScore,realGap,realTarget,daily,dailyScore,dailyGap,dailyTarget,dailyTotal30,cancerScore,cancerGap,cancerTarget,cancerStopWork,cancerSufficient,overall,me});
    setShowCoverageForm(false);
    showToast("✓ 保障分析已更新");
  };

  // ── Calculators ──
  const calcMortgage=()=>{
    const hv=Number(mtgForm.homeValue)||0,lb=Number(mtgForm.loanBalance)||0;
    const r=(Number(mtgForm.rate)||2.6)/100/12,n=(Number(mtgForm.years)||20)*12,tr=(Number(mtgForm.targetRate)||6)/100;
    const origMonthly=Number(mtgForm.originalMonthly)||0;
    const equity=hv-lb,releasable=Math.max(0,Math.round(hv*0.8-lb));
    const yrs=Number(mtgForm.years)||20;
    const totalLoan=lb+releasable; // 再融資後總貸款 = 原本金 + 釋出資金

    // 方案一：整筆複利不動（總貸款重新攤還）
    const newTotalMonthly=totalLoan>0&&r>0?Math.round(totalLoan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)):0;
    const monthlyDiff=newTotalMonthly-origMonthly; // 新月供 vs 原月供差額
    const futureValue=Math.round(releasable*Math.pow(1+tr,yrs)); // 410萬複利終值（全部淨賺，無需另還）

    // 方案二：只繳息・月配補貼
    const annualReturn=Math.round(releasable*tr);
    const monthlyReturn=Math.round(annualReturn/12);
    const interestOnly=releasable>0?Math.round(releasable*r):0; // 410萬的月息
    const netAnnualInterest=Math.round(annualReturn-interestOnly*12);
    const totalMonthlyInterest=origMonthly+interestOnly;
    const afterSubsidyInterest=totalMonthlyInterest-monthlyReturn;

    setMtgResult({
      equity:Math.round(equity),releasable,totalLoan,
      origMonthly,newTotalMonthly,monthlyDiff,
      futureValue,yrs,
      annualReturn,monthlyReturn,interestOnly,netAnnualInterest,
      totalMonthlyInterest,afterSubsidyInterest,
    });
  };
  const calcRetirement=()=>{
    const ca=Number(retForm.currentAge)||30,ra=Number(retForm.retireAge)||65,cs=Number(retForm.currentSavings)||0,mc=Number(retForm.monthlyContrib)||0,r=Number(retForm.expectedReturn)/100/12,me=Number(retForm.monthlyExpense)||0;
    const months=(ra-ca)*12;
    const fvS=Math.round(cs*Math.pow(1+r,months)),fvC=r>0?Math.round(mc*(Math.pow(1+r,months)-1)/r):mc*months;
    const total=fvS+fvC,rr=Number(retForm.expectedReturn)/100/12,rm=20*12;
    const monthly=rr>0?Math.round(total*rr/(1-Math.pow(1+rr,-rm))):Math.round(total/rm);
    const gap=monthly-me;
    setRetResult({total,monthly,gap,years:ra-ca,feasible:gap>=0,shortfall:gap<0?Math.abs(gap):0});
  };

  // 複利計算機
  const calcCompound=()=>{
    const p=Number(compForm.principal)||0,r=Number(compForm.rate)/100,y=Number(compForm.years)||0,m=Number(compForm.monthly)||0;
    const fvLump=Math.round(p*Math.pow(1+r,y));
    const fvMonthly=r>0?Math.round(m*12*(Math.pow(1+r,y)-1)/r):m*12*y;
    const total=fvLump+fvMonthly;
    const gain=total-p-m*12*y;
    setCompResult({total,fvLump,fvMonthly,gain,years:y});
  };

  // 遺產稅試算（台灣 2025年）
  const calcEstate=()=>{
    const grossAsset=Number(estateForm.totalAsset)||0;
    const lifeInsRaw=Number(estateForm.lifeInsurance)||0; // 台灣壽險申報金額
    const lifeInsCap=37400000; // 114年度免納入基本所得額上限 3,740 萬
    const lifeIns=Math.min(lifeInsRaw,lifeInsCap);    // 超過上限部分仍須計入基本所得額
    const lifeInsOver=Math.max(0,lifeInsRaw-lifeInsCap); // 超過上限金額
    const asset=Math.max(0,grossAsset-lifeIns);        // 課稅遺產總額
    const exempt=13330000;                             // 免稅額 1,333 萬
    const spouseExempt=estateForm.spouse?5530000:0;    // 配偶扣除額 553 萬
    const childExempt=Number(estateForm.children)*560000; // 每位子女 56 萬
    const parentExempt=Number(estateForm.parents)*1380000; // 父母每人 138 萬
    const funeral=Number(estateForm.funeralExp)||1380000;  // 喪葬費 138 萬
    const debt=Number(estateForm.debt)||0;             // 未償債務
    const disabled=Number(estateForm.disabledCount)||0; // 重度身心障礙 每人加扣 693 萬
    const disabledExempt=disabled*6930000;
    const totalDeduct=exempt+spouseExempt+childExempt+parentExempt+funeral+debt+disabledExempt;
    const taxBase=Math.max(0,asset-totalDeduct);
    // 2025年三級累進稅率：5,621萬以下10%，5,621萬~1億1,242萬15%，超過20%
    let tax=0;
    const t1=56210000,t2=112420000;
    if(taxBase<=t1) tax=Math.round(taxBase*0.1);
    else if(taxBase<=t2) tax=Math.round(t1*0.1+(taxBase-t1)*0.15);
    else tax=Math.round(t1*0.1+(t2-t1)*0.15+(taxBase-t2)*0.2);
    const rate=taxBase<=t1?10:taxBase<=t2?15:20;
    setEstateResult({grossAsset,lifeInsRaw,lifeIns,lifeInsOver,asset,totalDeduct,taxBase,tax,rate,afterTax:grossAsset-tax,spouseExempt,childExempt,parentExempt,funeral,debt,disabledExempt});
  };

  // 回本年試算
  const calcBreakeven=()=>{
    const prem=Number(breakevenForm.premium)||0;
    const yrs=Number(breakevenForm.payYears)||2;
    const r=Number(breakevenForm.targetRate)/100;
    const totalCost=prem*yrs;
    // 找到現金價值超過總成本的年份
    let breakYr=0;
    for(let y=1;y<=30;y++){
      const cv=totalCost*Math.pow(1+r,y)*0.85; // 保守估計85%現金值
      if(cv>=totalCost){breakYr=y;break;}
    }
    setBreakevenResult({totalCost,breakYr,projections:Array.from({length:10},(_,i)=>{
      const y=i+1;
      return{yr:y,cv:Math.round(totalCost*Math.pow(1+r,y)*0.85),cost:totalCost};
    })});
  };

  // 推薦信 AI 生成
  const genLetter=async(clientName,type)=>{
    setLetterLoading(true);setLetterResult("");
    const prompts={
      referral:`幫我寫一封繁體中文的客戶推薦信，語氣專業溫暖，代表凱特資產管理顧問寫給${clientName||"新客戶"}，介紹我們的服務特色（境外保險、資產配置、財務規劃），150字內。`,
      thanks:`幫我寫一封繁體中文的感謝信，代表凱特資產管理顧問寫給${clientName||"客戶"}，感謝他們的信任與配合，提到我們會持續守護他們的財務目標，150字內。`,
      followup:`幫我寫一封繁體中文的跟進信，代表凱特資產管理顧問寫給${clientName||"客戶"}，詢問最近財務狀況，提醒可以預約回顧會議，語氣親切不生硬，100字內。`,
    };
    const result=await generateAI(prompts[type]||prompts.referral,400);
    setLetterResult(result);setLetterLoading(false);
  };

  // IRR 計算（二分法）
  const calcIRR=()=>{
    const py=Number(irrForm.payYears)||2;
    const ap=Number(irrForm.annualPremium)||0;
    if(!ap)return showToast("⚠ 請填寫年繳保費");
    const validRows=irrForm.rows.filter(r=>r.year!==""&&r.value!=="");
    if(validRows.length<1)return showToast("⚠ 請至少填寫一筆現金價值");
    // 建構現金流 map：year -> value
    const cfMap={};
    validRows.forEach(r=>{cfMap[Number(r.year)]=Number(r.value);});
    const maxYear=Math.max(...Object.keys(cfMap).map(Number));
    // 組成完整 cfs 陣列（index = 年份）
    // 年份 1..py 為繳費（負），之後為 0 直到有現金價值
    let cfs=[];
    for(let y=1;y<=maxYear;y++){
      if(y<=py) cfs.push(cfMap[y]!==undefined?cfMap[y]-ap:-ap);
      else cfs.push(cfMap[y]||0);
    }
    // 最後一筆現金價值設為正的贖回值（若用戶在某年填了值，視為該年贖回）
    // 確保最後一年有正現金流
    if(cfs[cfs.length-1]<=0)return showToast("⚠ 最後一年現金價值需大於 0");
    // 加上第0年（不需要，IRR從第1年算，所以在前面插入0作為基準）
    cfs=[0,...cfs]; // index 0 = year 0 (no cash flow at time 0 since premiums start year 1)
    // 重新：第0年 = 0, 第1..py年 = -ap, 之後 = cfMap[y] or 0
    cfs=[];
    for(let y=0;y<=maxYear;y++){
      if(y===0) cfs.push(0);
      else if(y<=py) cfs.push(cfMap[y]!==undefined?cfMap[y]-ap:-ap);
      else cfs.push(cfMap[y]||0);
    }
    // 二分法求 IRR（年化，基於年份 index）
    const npv=(r)=>cfs.reduce((sum,cf,t)=>sum+cf/Math.pow(1+r,t),0);
    let lo=-0.99,hi=10,mid=0,iters=0;
    while(hi-lo>1e-8&&iters<300){mid=(lo+hi)/2;npv(mid)>0?lo=mid:hi=mid;iters++;}
    const irr=mid;
    if(irr<-0.9||irr>9)return showToast("⚠ 無法計算，請確認數字是否正確");
    const table=cfs.map((cf,t)=>({yr:t,cf,cumPV:cfs.slice(0,t+1).reduce((s,c,i)=>s+c/Math.pow(1+irr,i),0)}));
    const totalIn=py*ap;
    setIrrResult({irr,pct:(irr*100).toFixed(2),cfs,table,totalIn,maxYear});
  };

  // 即時匯率刷新
  const refreshFxRates=async()=>{
    setFxLoading(true);
    try{
      const raw=await searchNews("USD TWD HKD SGD JPY EUR CNY latest exchange rate today");
      const result=await generateAI(`根據以下匯率資料，整理出各幣別對 USD 的最新匯率。
只輸出純JSON，不加任何說明：{"USD":1,"TWD":數字,"HKD":數字,"SGD":數字,"JPY":數字,"EUR":數字,"CNY":數字}
資料：${raw.slice(0,2000)}`,300);
      const cleaned=result.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(cleaned.slice(cleaned.indexOf("{"),cleaned.lastIndexOf("}")+1));
      if(parsed.TWD&&parsed.JPY){
        setFxRates(parsed);
        const now=new Date();
        setFxUpdatedAt(`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")} 更新`);
        showToast("✓ 匯率已更新");
      }else{showToast("⚠ 無法取得匯率，請稍後再試");}
    }catch{showToast("⚠ 更新失敗，請稍後再試");}
    setFxLoading(false);
  };

  // 房地合一表單 helper
  const renderReit2Form=(form,setForm)=>(
    <>
      {[["成交售價 (TWD)","sellPrice","例如：15000000"],["取得成本 (TWD)","buyPrice","例如：10000000"],["改良+仲介費用 (TWD)","cost","例如：500000"],["持有年數","holdYears","例如：3"]].map(([lbl,k,ph])=>(
        <div key={k}><div className="calc-lbl">{lbl}</div><input className="calc-inp" type="number" placeholder={ph} value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/></div>
      ))}
      <div className="calc-lbl">交易主體</div>
      <div style={{display:"flex",gap:8}}>
        {[["個人","true"],["公司/法人","false"]].map(([lbl,v])=>(
          <div key={v} onClick={()=>setForm(p=>({...p,isPersonal:v==="true"}))} style={{flex:1,padding:"10px",textAlign:"center",borderRadius:10,border:`1px solid ${String(form.isPersonal)===v?"rgba(154,110,32,.4)":"var(--bl)"}`,background:String(form.isPersonal)===v?"rgba(154,110,32,.1)":"transparent",fontFamily:"'Cinzel',serif",fontSize:10,color:String(form.isPersonal)===v?"#8a5e18":"var(--md)",cursor:"pointer"}}>{lbl}</div>
        ))}
      </div>
      {form.isPersonal&&(
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:14,padding:"12px 14px",background:"var(--card2)",borderRadius:10,cursor:"pointer"}} onClick={()=>setForm(p=>({...p,selfUse:!p.selfUse}))}>
          <div style={{width:20,height:20,borderRadius:6,border:`1px solid ${form.selfUse?"var(--gold)":"var(--bl)"}`,background:form.selfUse?"var(--gold)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0}}>{form.selfUse?"✓":""}</div>
          <div style={{fontSize:13,color:"var(--td)"}}>自住且設籍滿 6 年（優惠稅率 10%，獲利 400 萬內免稅）</div>
        </div>
      )}
    </>
  );

  const addMsg=(msg)=>setMsgThread(p=>[...p,{id:Date.now()+Math.random(),...msg}]);
  const handleMsgSend=async(text)=>{
    const q=text||msgInput.trim();if(!q||msgLoading)return;
    setMsgInput("");setShowProdMenu(false);addMsg({type:"user",text:q});
    const newHist=[...chatHistory,{role:"user",content:q}];setChatHistory(newHist);setMsgLoading(true);
    const reply=await aiChat(newHist,ADVISOR_SYSTEM);
    addMsg({type:"kate",text:reply});setChatHistory(p=>[...p,{role:"assistant",content:reply}]);setMsgLoading(false);
  };
  const handleQuick=(opt)=>{
    if(opt.action==="product_menu"){addMsg({type:"user",text:"我想了解產品"});addMsg({type:"kate",text:"當然！請選擇您想了解的產品，我為您詳細介紹 👇"});setShowProdMenu(true);}
    else{handleMsgSend(opt.msg);}
  };
  const handleProductSelect=async(name)=>{
    setShowProdMenu(false);addMsg({type:"user",text:`我想了解「${name}」`});
    const q=`請介紹「${name}」這個產品`;const newHist=[...chatHistory,{role:"user",content:q}];setChatHistory(newHist);setMsgLoading(true);
    const reply=await aiChat(newHist,ADVISOR_SYSTEM);
    addMsg({type:"kate",text:reply});setChatHistory(p=>[...p,{role:"assistant",content:reply}]);setMsgLoading(false);
  };

  // ── Picks ──
  const toggleTheme=(key)=>setSelectedThemes(p=>p.includes(key)?p.filter(k=>k!==key):[...p,key]);
  const handleGenerate=async()=>{
    if(!selectedThemes.length)return;
    setPicksStep("loading");
    const labels=selectedThemes.map(k=>THEMES.find(t=>t.key===k)?.label).join("、");
    const todayStr=new Date().toLocaleDateString("zh-TW",{year:"numeric",month:"long",day:"numeric",weekday:"long"});
    const todayISO=new Date().toISOString().slice(0,10);
    try{
      setLoadingStep("搜尋今日最新時事新聞…");
      const newsRaw=await searchNews(`${todayISO} 今日最新財經新聞 ${labels} 台灣 遺產稅 地緣政治 海外資產 美股 台股 最新動態`);
      setLoadingStep("整理市場動態與主題…");
      let parsed;
      try{
        const raw1=await generateAI(`今天是${todayStr}。根據以下【今日】真實新聞，整理出與「${labels}」最相關的新聞，並提煉出今日主題。只輸出純JSON，不加任何說明：
{"news":[{"tag":"分類","title":"標題20字內（必須是真實今日新聞標題）","desc":"摘要40字內","color":"gold/rose/blue/green"}],"mainTheme":"今日主題10字內","marketContext":"今日市場背景50字內，必須包含具體數字或事件"}
今日新聞資料：${newsRaw.slice(0,3000)}`,1000);
        const c1=raw1.replace(/```json|```/g,"").trim();
        parsed=JSON.parse(c1.slice(c1.indexOf("{"),c1.lastIndexOf("}")+1));
      }catch{
        parsed={news:[{tag:"市場",title:`${todayStr}財經重點`,desc:"今日市場最新動態",color:"gold"}],mainTheme:labels,marketContext:`${todayStr}，${labels}相關議題持續受到高資產客戶關注`};
      }
      setPicksNewsItems(parsed.news||[]);
      setLoadingStep("結合產品知識庫，生成今日凱特觀點…");
      let rec;
      try{
        const raw2=await generateAI(`你是凱特資產管理的頂級財富顧問。今天是${todayStr}。

今日市場主題：「${parsed.mainTheme}」
今日背景：${parsed.marketContext}
客戶關注方向：${labels}
今日相關新聞：${(parsed.news||[]).map(n=>n.title).join("、")}

產品知識庫：${buildKBText(productGroups)}

請根據【今日】真實時事，寫一篇凱特的市場觀點與產品推薦。要求：
1. 標題必須包含今日具體時事或數字
2. 內文必須結合今日新聞，有凱特的獨到觀點，語氣專業但親切
3. 推薦產品要說明為何今天特別適合配置

只輸出純JSON：{"title":"推薦標題25字內（含今日時事）","body":"凱特觀點200字內，結合今日時事，有具體建議，不要條列","theme":"主題標籤8字內","products":[{"rank":"首選","name":"產品全名","region":"地區","reason":"60字內，說明為何今日特別適合"},{"rank":"次選","name":"","region":"","reason":""},{"rank":"補充","name":"","region":"","reason":""}]}`,1500);
        const c2=raw2.replace(/```json|```/g,"").trim();
        rec=JSON.parse(c2.slice(c2.indexOf("{"),c2.lastIndexOf("}")+1));
      }catch{
        rec={
          title:`${new Date().toLocaleDateString("zh-TW",{month:"numeric",day:"numeric"})} 凱特觀點：${labels}配置策略`,
          body:`今天${todayStr}，${parsed.marketContext}。面對當前市場環境，建議高資產客戶把握時機，透過境外保單分散風險、鎖定長期報酬。境外保險不計入台灣遺產，同時提供多元貨幣配置，是當前環境下最佳的資產保全工具之一。建議分2-3年逐步布局香港與新加坡市場，以降低單一時點風險。`,
          theme:labels,
          products:[
            {rank:"首選",name:"富衛FWD — 盈聚天下 分紅儲蓄",region:"🇭🇰 香港",reason:"最快第三年回本，保監局推薦，面對市場波動提供確定性報酬。"},
            {rank:"次選",name:"安達 — 傳承守創V",region:"🇭🇰 香港",reason:"折扣最多、回本快，適合希望盡速完成傳承布局的客戶。"},
            {rank:"補充",name:"AIA友邦 — PIW百樂財富永傳",region:"🇸🇬 新加坡",reason:"新加坡監管嚴格，地緣政治風險下的理想境外配置。"}
          ]
        };
      }
      setDraftTitle(rec.title);
      setDraftBody(rec.body);
      setDraftProds(rec.products||[]);
      setDraftTheme(rec.theme||"");
      setPicksStep("draft");
    }catch(err){
      console.error("handleGenerate error",err);
      showToast("⚠ 生成失敗，請稍後再試");
      setPicksStep("idle");
    }
  };
  const handlePublishPicks=async()=>{
    // 從 selectedThemes 推斷 tag
    const themeToTag={"geopolitical":"國際局勢","inheritance":"資產傳承","retirement":"退休規劃","protection":"投資焦點","overseas":"國際局勢","tax":"資產傳承"};
    const tag=selectedThemes.map(k=>themeToTag[k]).find(Boolean)||draftTheme||"投資焦點";
    const article={id:Date.now(),title:draftTitle,body:draftBody,products:draftProds,theme:draftTheme,tag,news:picksNewsItems,publishedAt:new Date().toLocaleDateString("zh-TW"),createdAt:new Date().toISOString()};
    // 用新文章取代同主題舊文章，保持每個主題只有最新一篇
    const withoutSameTopic=publishedArticles.filter(a=>a.tag!==tag&&!a.theme?.includes(tag));
    const newArticles=[article,...withoutSameTopic];
    setPublishedPicks(article);
    setPublishedArticles(newArticles);
    setPicksStep("published");
    showToast(`✓ 「${tag}」已更新至首頁`);
    if(currentUser){
      try{await saveUserData(currentUser.id,"kate_articles",newArticles);}
      catch(e){console.error("文章儲存失敗",e);}
    }
  };
  const resetPicks=()=>{setPicksStep("idle");setPicksNewsItems([]);setDraftTitle("");setDraftBody("");setDraftProds([]);};

  // ── QA ──
  const handleAsk=async(q)=>{
    const question=q||qaInput.trim();if(!question)return;
    setQaInput("");setQaThread(p=>[...p,{type:"user",text:question}]);setQaLoading(true);
    const res=await askAI(question);
    setQaThread(p=>[...p,{type:"ai",...res}]);setQaLoading(false);
  };

  // ── Onboarding ──
  const submitOnboarding=async()=>{
    const newClient={
      id:Date.now(),
      name:onboardingData.name||"新客戶",
      date:new Date().toLocaleDateString("zh-TW"),
      status:"待跟進",
      risk:onboardingData.riskLevel,
      goals:onboardingData.goals,
      age:onboardingData.age,
      occupation:onboardingData.occupation,
      annualIncome:onboardingData.annualIncome,
      assets:onboardingData.assets,
      concerns:onboardingData.concerns,
      referral:onboardingData.referral,
      createdAt:new Date().toISOString(),
    };
    const nextList=[newClient,...onboardingList];
    setOnboardingList(nextList);
    setOnboardingDone(true);
    showToast("✓ 客戶資料已建立");
    // 儲存到 Supabase（用 kate 帳號的 id 作為 owner，或用固定 key）
    if(currentUser){
      try{
        await saveUserData(currentUser.id,"onboarding_clients",nextList);
      }catch(e){console.error("Onboarding 儲存失敗",e);}
    }
  };

  const unread=notifs.filter(n=>n.unread).length;
  const rankStyle={"首選":"r1","次選":"r2","補充":"r3"};
  const INSURANCE_PRODUCTS=[
    // 🇭🇰 香港保險
    "富邦 — 富域多元貨幣",
    "義大利忠意 — 啟航創富卓越版",
    "安達 — 傳承守創V",
    "蘇黎世 — 瑞駿IUL",
    "安盛AXA — 盛利",
    "永明 — 星河尊享2",
    "永明 — 永延壽險",
    "富衛FWD — 盈聚天下 分紅儲蓄",
    // 🇸🇬 新加坡保險
    "AIA友邦 — PIL指數型萬能壽險",
    "AIA友邦 — PIW百樂財富永傳",
    "大東方 — 定期壽險",
    // 🇧🇲 百慕達保險
    "富衛FWD — 指數萬用壽險",
  ];

  // ─── LOGIN ───
  if(!loggedIn) return(<>
    <style>{S}</style>
    <div className="app">
      <div className="login">
        <div className="lt">
          <div className="l-en">Kate Asset Management</div>
          <div className="l-brand">凱特<span>資產</span>管理</div>
          <div className="l-tag">Professional · Trustworthy · Excellence</div>
        </div>
        <div className="lb">
          {/* 登入/註冊切換 */}
          <div style={{display:"flex",gap:0,background:"var(--card2)",borderRadius:10,padding:3,marginBottom:20}}>
            {["login","register"].map(m=>(
              <div key={m} onClick={()=>{setLoginMode(m);setLoginError("");setRegPwd2("");}} style={{flex:1,padding:"9px",textAlign:"center",borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,cursor:"pointer",transition:"all .2s",background:loginMode===m?"#fff":"transparent",color:loginMode===m?"var(--td)":"var(--md)",boxShadow:loginMode===m?"0 1px 4px rgba(0,0,0,.08)":"none"}}>
                {m==="login"?"LOGIN":"REGISTER"}
              </div>
            ))}
          </div>
          <div className="l-lbl">帳號</div>
          <input className="l-inp" placeholder={loginMode==="login"?"輸入您的帳號":"設定帳號（英文/數字）"} value={acct} onChange={e=>{setAcct(e.target.value);setLoginError("");}}/>
          <div className="l-lbl">密碼</div>
          <input className="l-inp" type="password" placeholder={loginMode==="login"?"輸入您的密碼":"設定密碼（至少 6 字元）"} value={pwd} onChange={e=>{setPwd(e.target.value);setLoginError("");}} onKeyDown={e=>{if(e.key==="Enter"&&acct&&pwd&&!loginLoading){loginMode==="login"?handleLogin():handleRegister();}}}/>
          {loginMode==="register"&&(
            <>
              <div className="l-lbl">確認密碼</div>
              <input className="l-inp" type="password" placeholder="再輸入一次密碼" value={regPwd2} onChange={e=>{setRegPwd2(e.target.value);setLoginError("");}}/>
            </>
          )}
          {loginError&&<div style={{color:"var(--red)",fontSize:12,marginBottom:12,textAlign:"center"}}>{loginError}</div>}
          <button className="l-btn" onClick={loginMode==="login"?handleLogin:handleRegister} disabled={loginLoading||!acct||!pwd} style={{opacity:loginLoading||!acct||!pwd?0.5:1}}>
            {loginLoading?(loginMode==="login"?"驗證中…":"建立帳號中…"):(loginMode==="login"?"LOGIN":"建立帳號")}
          </button>

          <div className="l-foot">{loginMode==="login"?"忘記密碼？請聯絡您的專屬顧問":"註冊後即可開始管理您的資產"}</div>
        </div>
      </div>
    </div>
  </>);

  // ─── SUB-SCREENS ───
  if(screen?.type==="news"){
    const n=screen.data;
    // Split body into paragraphs, detect Kate's view section
    const paragraphs=(n.body||"").split("\n\n").filter(Boolean);
    const kateIdx=paragraphs.findIndex(p=>p.startsWith("凱特觀點"));
    const bodyParas=kateIdx>=0?paragraphs.slice(0,kateIdx):paragraphs;
    const kateText=kateIdx>=0?paragraphs[kateIdx].replace(/^凱特觀點[：:]\s*/,""):"";
    return(<><style>{S}</style>
      <div className="app"><div className="page" style={{background:"var(--ink)"}}>
        <div style={{position:"relative"}}>
          <div className="nd-hero" style={{padding:0,minHeight:260,position:"relative",overflow:"hidden",background:"#1a1008"}}>
            <img
              src={getNewsImgUrl(n.imgUrl,n.imgQuery,n.cls)}
              alt={n.title}
              style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}
              onError={e=>{e.target.style.display="none";}}
            />
            <div className="nd-ov"/>
            <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,zIndex:2,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"20px"}}>
              <div className="nd-tag">{n.tag}</div>
              <div className="nd-title">{n.title}</div>
              <div className="nd-meta"><span>{n.src}</span><span>{n.time}</span></div>
            </div>
            <div className="back-btn" style={{zIndex:3}} onClick={()=>setScreen(null)}>← 返回</div>
          </div>
        </div>
        {/* Key Stats */}
        {n.keyStats?.length>0&&(
          <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(n.keyStats.length,3)},1fr)`,gap:8,padding:"16px 16px 0"}}>
            {n.keyStats.map((s,i)=>(
              <div key={i} style={{background:"var(--card)",border:"1px solid var(--bl)",borderRadius:12,padding:"12px 14px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${i===0?"#9a7030,#c8a84b":i===1?"#2a5ea8,#5a8ad8":"#2a8a5a,#4aaa80"})`}}/>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:"var(--md)",textTransform:"uppercase",marginBottom:5}}>{s.label}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:"var(--td)"}}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
        {/* Body paragraphs */}
        <div className="nd-body" style={{paddingBottom:kateText?8:32}}>
          {bodyParas.map((p,i)=><p key={i}>{p}</p>)}
        </div>
        {/* Kate's View */}
        {kateText&&(
          <div style={{margin:"0 16px 32px",borderRadius:16,overflow:"hidden",border:"1px solid rgba(200,168,75,.25)"}}>
            <div style={{background:"linear-gradient(135deg,#1e1005,#2a1808)",padding:"14px 18px 10px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:28,height:28,borderRadius:8,background:"rgba(200,168,75,.15)",border:"1px solid rgba(200,168,75,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>✦</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:3,color:"var(--gold)",textTransform:"uppercase"}}>凱特觀點</div>
            </div>
            <div style={{background:"rgba(30,16,5,.6)",padding:"14px 18px 18px"}}>
              <p style={{fontFamily:"'Noto Serif TC',serif",fontSize:14,color:"rgba(240,230,210,.9)",lineHeight:1.9,margin:0}}>{kateText}</p>
            </div>
          </div>
        )}
      </div></div>
      {toast&&<div className="toast">{toast}</div>}
    </>);
  }
  if(screen?.type==="stock"){
    const s=screen.data;const cp=generateChartPath(s.up);
    return(<><style>{S}</style>
      <div className="app"><div className="page" style={{background:"var(--ink)"}}>
        <div className="sd-hd">
          <div className="back-btn" style={{position:"static",background:"none",border:"none",backdropFilter:"none",padding:"0 0 20px",color:"rgba(240,242,248,.38)"}} onClick={()=>setScreen(null)}>← 返回</div>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div style={{width:52,height:52,borderRadius:14,background:"var(--card2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{s.icon}</div>
            <div><div className="sd-name">{s.name}</div><div className="sd-code">{s.code}</div></div>
          </div>
          <div className="sd-price">{s.price}</div>
          <div className={`sd-chg ${s.up?"up":"dn"}`}>{s.chg} 今日</div>
        </div>
        <div className="chart-wrap">
          <div className="chart-tabs">{["1W","1M","3M","6M","1Y"].map(t=><button key={t} className={`ct ${chartTab===t?"active":""}`} onClick={()=>setChartTab(t)}>{t}</button>)}</div>
          <svg viewBox="0 0 280 120" width="100%" style={{height:140}} preserveAspectRatio="none">
            <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={s.up?"#3aaa78":"#d85868"} stopOpacity="0.25"/><stop offset="100%" stopColor={s.up?"#3aaa78":"#d85868"} stopOpacity="0.02"/></linearGradient></defs>
            <path d={cp+` L 280 120 L 0 120 Z`} fill="url(#cg)"/>
            <path d={cp} fill="none" stroke={s.up?"#3aaa78":"#d85868"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="sd-stats">
          {[["開盤",s.open],["最高",s.high],["最低",s.low],["成交量",s.vol],["市值",s.mktcap],["52W高","--"]].map(([l,v])=>(
            <div className="sd-stat" key={l}><div className="sd-stat-l">{l}</div><div className="sd-stat-v">{v}</div></div>
          ))}
        </div>
      </div></div>
    </>);
  }

  if(screen?.type==="article"){
    const k=screen.data;
    return(<><style>{S}</style>
      <div className="app"><div className="page" style={{background:"var(--ink)"}}>
        <div style={{minHeight:220,background:"linear-gradient(135deg,#0a1828 0%,#1a0a28 50%,#0a1018 100%)",position:"relative",padding:"52px 20px 24px",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          <div className="back-btn" style={{zIndex:3}} onClick={()=>setScreen(null)}>← 返回</div>
          <div className="kt-badge" style={{marginBottom:10}}>✦ {k.badge||k.theme||"凱特觀點"}</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#f0f2f8",lineHeight:1.4}}>{k.title}</div>
          <div style={{fontSize:11,color:"rgba(240,242,248,.38)",marginTop:8}}>凱特 · {k.publishedAt||new Date().toLocaleDateString("zh-TW")}</div>
        </div>
        <div className="nd-body">{(k.body||"").split("\n\n").map((p,i)=><p key={i}>{p}</p>)}</div>
        {k.products?.length>0&&(
          <div style={{padding:"0 16px 24px"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:3,color:"var(--gold)",textTransform:"uppercase",marginBottom:12,marginTop:4}}>推薦配置產品</div>
            {k.products.map((prod,i)=>(
              <div key={i} style={{background:"var(--card)",border:"1px solid var(--bl)",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,padding:"2px 8px",borderRadius:10,background:i===0?"rgba(200,168,75,.12)":i===1?"rgba(90,104,120,.12)":"rgba(176,80,96,.12)",color:i===0?"#8a5e18":i===1?"#5a6878":"#b05060",border:`1px solid ${i===0?"rgba(200,168,75,.3)":i===1?"rgba(90,104,120,.3)":"rgba(176,80,96,.3)"}`}}>{prod.rank}</div>
                  <div style={{fontFamily:"'Noto Serif TC',serif",fontSize:13,fontWeight:600,color:"var(--td)",flex:1}}>{prod.name}</div>
                </div>
                <div style={{fontSize:12,color:"var(--md)",lineHeight:1.65}}>{prod.reason}</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:"var(--md)",marginTop:8}}>{prod.region}</div>
              </div>
            ))}
          </div>
        )}
      </div></div>
    </>);
  }

  if(screen?.type==="profile"){
    return(<><style>{S}</style>
      <div className="app"><div className="page" style={{background:"var(--ink)"}}>
        <div className="prof-header">
          <div className="back-btn" onClick={()=>setScreen(null)}>← 返回</div>
          <div className="prof-avatar">👤</div>
          <div className="prof-name" style={{cursor:"pointer"}} onClick={()=>{setEditNameVal(currentUser?.display_name||"");setShowEditName(true);}}>{currentUser?.display_name||"尊榮會員"} <span style={{fontSize:14,color:"rgba(200,168,75,.5)"}}>✎</span></div>
          <div className="prof-role">尊榮會員 · 穩健型</div>
        </div>
        <div className="set-group" style={{marginTop:16}}>
          <div className="set-gl">帳戶</div>
          {[{ic:"🔑",cls:"sg",nm:"修改密碼",ds:"定期更換密碼以確保安全"},{ic:"📱",cls:"sg",nm:"綁定手機",ds:"已綁定 +886 09xx-xxx-xxx"}].map((it,i)=>(
            <div className="set-item" key={i}><div className={`set-ic ${it.cls}`}>{it.ic}</div><div><div className="set-nm">{it.nm}</div><div className="set-ds">{it.ds}</div></div><div style={{marginLeft:"auto",color:"var(--md)",fontSize:16}}>›</div></div>
          ))}
        </div>
        <div className="set-group">
          <div className="set-gl">推播通知</div>
          {NOTIF_SETTINGS.map(it=>(
            <div className="set-item" key={it.key} onClick={()=>setNotifSettings(n=>({...n,[it.key]:!n[it.key]}))}>
              <div className={`set-ic ${it.cls}`}>{it.icon}</div><div className="set-nm" style={{flex:1}}>{it.name}</div>
              <div className={`toggle ${notifSettings[it.key]?"on":"off"}`}><div className="toggle-dot"/></div>
            </div>
          ))}
        </div>
        {/* 稅務行事曆 */}
        <div className="set-group">
          <div className="set-gl">📅 稅務行事曆</div>
          {(()=>{
            const today=new Date();
            const year=today.getFullYear();
            return TAX_CALENDAR.map(t=>{
              const start=new Date(year,t.month-1,t.day);
              const end=new Date(year,t.endMonth-1,t.endDay);
              const isActive=today>=start&&today<=end;
              const daysToEnd=Math.ceil((end-today)/(1000*60*60*24));
              const daysToStart=Math.ceil((start-today)/(1000*60*60*24));
              const isPast=today>end;
              return(
                <div key={t.key} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 16px",borderBottom:"1px solid var(--bl)",opacity:isPast?0.45:1}}>
                  <div style={{width:36,height:36,borderRadius:10,background:isActive?"rgba(42,138,90,.12)":isPast?"var(--card2)":"rgba(154,110,32,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{t.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--td)",marginBottom:2}}>{t.name}</div>
                    <div style={{fontSize:11,color:"var(--md)"}}>
                      {year}/{t.month}/{t.day} — {year}/{t.endMonth}/{t.endDay}
                    </div>
                  </div>
                  <div style={{flexShrink:0,textAlign:"right"}}>
                    {isPast?(
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:"var(--md)"}}>已截止</div>
                    ):isActive?(
                      <div style={{padding:"3px 10px",borderRadius:20,background:"rgba(42,138,90,.12)",border:"1px solid rgba(42,138,90,.25)"}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#1a6e42",letterSpacing:1}}>進行中</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:"#1a6e42",textAlign:"center"}}>{daysToEnd}天</div>
                      </div>
                    ):(
                      <div style={{padding:"3px 10px",borderRadius:20,background:daysToStart<=14?"rgba(176,80,96,.08)":"rgba(154,110,32,.08)",border:`1px solid ${daysToStart<=14?"rgba(176,80,96,.2)":"rgba(154,110,32,.2)"}`}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:daysToStart<=14?"#b05060":"#8a5e18",letterSpacing:1}}>剩</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:daysToStart<=14?"#b05060":"#8a5e18",textAlign:"center"}}>{daysToStart}天</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
        <div className="set-group">
          <div className="set-gl">風險偏好</div>
          <div className="risk-row">{["保守","穩健","積極"].map(r=><button key={r} className={`risk-chip ${risk===r?"active":""}`} onClick={()=>setRisk(r)}>{r}</button>)}</div>
        </div>
        <div className="set-group">
          <div className="set-gl">其他</div>
          {[{ic:"📞",cls:"ss",nm:"聯絡凱特顧問",ds:"直接與您的專屬顧問聯繫",action:()=>setShowMsg(true)},{ic:"🚪",cls:"sr",nm:"登出",ds:"",action:()=>{setLoggedIn(false);setIsKate(false);}}].map((it,i)=>(
            <div className="set-item" key={i} onClick={it.action}><div className={`set-ic ${it.cls}`}>{it.ic}</div><div><div className="set-nm" style={it.nm==="登出"?{color:"var(--rose)"}:{}}>{it.nm}</div>{it.ds&&<div className="set-ds">{it.ds}</div>}</div><div style={{marginLeft:"auto",color:"var(--md)",fontSize:16}}>›</div></div>
          ))}
        </div>
      </div></div>
      {showMsg&&<MessengerOverlay msgThread={msgThread} msgInput={msgInput} setMsgInput={setMsgInput} msgLoading={msgLoading} showProdMenu={showProdMenu} handleMsgSend={handleMsgSend} handleQuick={handleQuick} handleProductSelect={handleProductSelect} onClose={()=>setShowMsg(false)} threadRef={threadRef} productGroups={productGroups}/>}
    </>);
  }

  // ─── MAIN APP (4 tabs) ───
  const tabs=[
    {id:"home",icon:"⬡",label:"首頁"},
    {id:"assets",icon:"◉",label:"資產"},
    {id:"calc",icon:"🧮",label:"試算"},
    {id:"advisor",icon:"✦",label:"顧問",badge:unread},
  ];

  return(<>
    <style>{S}</style>
    <div className="app">
      <div className="page">

        {/* ════ HOME ════ */}
        {tab==="home"&&(
          <div>
            <div className="home-hero">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                <div>
                  <div className="home-greeting">Welcome Back</div>
                  <div className="home-name">{currentUser?.display_name||"尊榮會員"}</div>
                  <div className="home-date">{new Date().toLocaleDateString("zh-TW",{year:"numeric",month:"long",day:"numeric",weekday:"short"})}</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginTop:4}}>
                  {isKate&&<div style={{background:"var(--gold-dim)",border:"1px solid rgba(200,168,75,.3)",borderRadius:20,padding:"6px 12px",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--gold)",cursor:"pointer"}} onClick={()=>{setTab("advisor");setAdvisorSub("kattools");}}>後台 ✦</div>}
                  <div className="avatar-btn" onClick={()=>setScreen({type:"profile"})}>👤</div>
                </div>
              </div>
            </div>

            {/* 股市指數 */}
            <div className="sec" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingRight:16}}>
              <span>市場指數{indicesLoading&&<span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:10,letterSpacing:0,color:"rgba(245,225,185,.4)",marginLeft:8}}>更新中…</span>}</span>
              <button onClick={refreshIndices} disabled={indicesLoading} style={{background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.25)",borderRadius:16,padding:"4px 12px",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:indicesLoading?"rgba(154,110,32,.4)":"#9a6e20",cursor:indicesLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:4}}>
                <span style={{display:"inline-block",animation:indicesLoading?"spin 1s linear infinite":"none"}}>↻</span> 刷新
              </button>
            </div>
            <div className="idx" style={{margin:"0 16px 12px"}}>
              {liveIndices.map((m,i)=>(
                <div className="ii" key={i}>
                  <div className="ii-n">{m.name}</div>
                  <div className="ii-v" style={{opacity:m.loading?0.35:1}}>{m.val}</div>
                  <div className={`ii-c ${m.up?"up":"dn"}`} style={{opacity:m.loading?0.35:1}}>{m.loading?"載入中…":m.chg}</div>
                </div>
              ))}
            </div>

            {/* 黃金白銀 */}
            <div className="sec" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingRight:16}}>
              <span>貴金屬行情{metalPrices.updatedAt&&<span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:10,letterSpacing:0,color:"rgba(245,225,185,.4)",marginLeft:8}}>{metalPrices.updatedAt}</span>}</span>
              <button onClick={refreshMetalPrices} disabled={metalPricesLoading} style={{background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.25)",borderRadius:16,padding:"4px 12px",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:metalPricesLoading?"rgba(154,110,32,.4)":"#9a6e20",cursor:metalPricesLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:4}}>
                <span style={{display:"inline-block",animation:metalPricesLoading?"spin 1s linear infinite":"none"}}>↻</span> 刷新
              </button>
            </div>
            <div style={{margin:"0 16px 12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {name:"黃金",unit:"USD/oz",price:metalPrices.goldUSD,chg:metalPrices.goldUSDChg,up:metalPrices.goldUp,icon:"🥇"},
                {name:"白銀",unit:"USD/oz",price:metalPrices.silverUSD,chg:metalPrices.silverUSDChg,up:metalPrices.silverUp,icon:"🥈"},
                {name:"黃金",unit:"TWD/g",price:metalPrices.goldTWD,chg:metalPrices.goldTWDChg,up:metalPrices.goldUp,icon:"💛"},
                {name:"鉑金",unit:"USD/oz",price:metalPrices.platinumUSD,chg:metalPrices.platinumChg,up:metalPrices.platinumUp,icon:"⬜"},
              ].map((m,i)=>(
                <div key={i} style={{background:"var(--card)",border:"1px solid var(--bl)",borderRadius:14,padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <span style={{fontSize:16}}>{m.icon}</span>
                    <div>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:"var(--md)",textTransform:"uppercase"}}>{m.name}</div>
                      <div style={{fontSize:10,color:"var(--md)"}}>{m.unit}</div>
                    </div>
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:"#2c1e0f"}}>{m.price}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:m.up?"#1a6e42":"#b05060",marginTop:2}}>{m.chg}</div>
                </div>
              ))}
            </div>

            {/* 凱特觀點 四大主題 */}
            {(()=>{
              const TOPICS=[
                {key:"國際局勢",icon:"🌏",cls:"tg",color:"#3a7abf",dim:"rgba(58,122,191,.1)",border:"rgba(58,122,191,.22)"},
                {key:"資產傳承",icon:"🏛️",cls:"ti",color:"#9a6e20",dim:"rgba(154,110,32,.1)",border:"rgba(154,110,32,.22)"},
                {key:"退休規劃",icon:"🏖️",cls:"tr",color:"#2a8a5a",dim:"rgba(42,138,90,.1)",border:"rgba(42,138,90,.22)"},
                {key:"投資焦點",icon:"📈",cls:"tt",color:"#7a5abf",dim:"rgba(122,90,191,.1)",border:"rgba(122,90,191,.22)"},
              ];
              // 每個主題取最新一篇
              const getLatest=(topic)=>publishedArticles.find(a=>a.tag===topic||a.theme?.includes(topic))||null;
              const anyArticle=TOPICS.some(t=>getLatest(t.key));
              if(!anyArticle)return null;
              return(
                <>
                  <div className="sec" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingRight:16}}>
                    <span>凱特觀點</span>
                  </div>
                  <div style={{padding:"0 16px 4px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {TOPICS.map(topic=>{
                      const art=getLatest(topic.key);
                      return(
                        <div key={topic.key} onClick={()=>art&&setScreen({type:"article",data:art})}
                          style={{background:"var(--card)",border:`1px solid ${art?topic.border:"var(--bl)"}`,borderRadius:14,overflow:"hidden",cursor:art?"pointer":"default",position:"relative"}}>
                          {art&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${topic.color},transparent)`}}/>}
                          <div style={{padding:"12px 13px 13px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                              <span style={{fontSize:16}}>{topic.icon}</span>
                              <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1.5,color:art?topic.color:"var(--md)",textTransform:"uppercase",flex:1}}>{topic.key}</div>
                            </div>
                            {art?(
                              <>
                                <div style={{fontSize:12,fontWeight:600,color:"var(--td)",lineHeight:1.55,marginBottom:6,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{art.title}</div>
                                <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:topic.color}}>{art.publishedAt} →</div>
                              </>
                            ):(
                              <div style={{fontSize:11,color:"var(--md)",lineHeight:1.6}}>尚未發布<br/>本主題文章</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}


            {/* 即時新聞 */}
            <div className="sec" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingRight:16}}>
              <span>即時財經新聞</span>
              <button onClick={()=>fetchHomeNews(true)} disabled={newsLoading} style={{background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.25)",borderRadius:16,padding:"4px 12px",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:newsLoading?"rgba(154,110,32,.4)":"#9a6e20",cursor:newsLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:4}}>
                <span style={{display:"inline-block",animation:newsLoading?"spin 1s linear infinite":"none"}}>↻</span>{newsLoading?"更新中":"刷新"}
              </button>
            </div>
            {newsLoading&&liveNews.length===0&&(
              <div style={{padding:"20px 16px"}}>
                {[1,2,3].map(i=>(
                  <div key={i} style={{background:"var(--card)",borderRadius:14,padding:14,marginBottom:10,display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:40,height:40,borderRadius:10,background:"var(--card2)"}}/>
                    <div style={{flex:1}}>
                      <div style={{height:10,background:"var(--card2)",borderRadius:4,marginBottom:8,width:"40%"}}/>
                      <div style={{height:14,background:"var(--card2)",borderRadius:4,marginBottom:6}}/>
                      <div style={{height:10,background:"var(--card2)",borderRadius:4,width:"60%"}}/>
                    </div>
                  </div>
                ))}
                <div style={{textAlign:"center",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"rgba(245,225,185,.3)",marginTop:8}}>正在抓取最新新聞…</div>
              </div>
            )}
            {(liveNews.length>0?liveNews:ALL_NEWS).map((n,i)=>(
              <div className="news-card" key={i} onClick={()=>setScreen({type:"news",data:n})} style={{padding:0,overflow:"hidden",flexDirection:"column",gap:0}}>
                <div style={{height:160,position:"relative",overflow:"hidden",flexShrink:0,background:"#1a1008"}}>
                  <img
                    src={getNewsImgUrl(n.imgUrl,n.imgQuery,n.cls)}
                    alt={n.title}
                    style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                    onError={e=>{e.target.style.display="none";}}
                  />
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(20,10,4,.85) 0%,rgba(20,10,4,.1) 60%,transparent 100%)"}}/>
                  <div style={{position:"absolute",bottom:10,left:12,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"rgba(240,225,190,.9)",background:"rgba(0,0,0,.35)",padding:"3px 10px",borderRadius:4,textTransform:"uppercase"}}>{n.tag}</div>
                  <div style={{position:"absolute",top:10,right:12,fontFamily:"'Noto Sans TC',sans-serif",fontSize:10,color:"rgba(240,225,190,.6)"}}>{n.time}</div>
                </div>
                <div style={{padding:"12px 14px 14px",background:"var(--card)"}}>
                  <div style={{fontSize:15,fontWeight:600,color:"var(--td)",lineHeight:1.55,marginBottom:5}}>{n.title}</div>
                  <div style={{fontSize:11,color:"var(--md)",letterSpacing:.5}}>{n.src}</div>
                </div>
              </div>
            ))}
            <div style={{height:8}}/>
          </div>
        )}

        {/* ════ ASSETS ════ */}
        {tab==="assets"&&(
          <div>
            <div className="ph">
              <div className="ph-en">My Assets</div>
              <div className="ph-t">我的資產</div>
            </div>
            <div className="sub-tabs">
              {[{id:"holdings",label:"💼 持有"},{id:"coverage",label:"🛡️ 保障"},{id:"health",label:"🏥 健檢"}].map(t=>(
                <div key={t.id} className={`st ${assetsSub===t.id?"active":""}`} onClick={()=>setAssetsSub(t.id)}>{t.label}</div>
              ))}
            </div>

            {/* ─ 持有 ─ */}
            {assetsSub==="holdings"&&(
              <>
                <div className="sec" style={{paddingTop:16}}/>
                <div className="hld-summary">
                  <div className="hld-total-lbl">總持有估值（換算台幣）</div>
                  <div className="hld-total-val">{fmtTWD(grandTotalTWD)}</div>
                  <div style={{fontSize:10,color:"rgba(240,242,248,.3)",marginTop:3,fontFamily:"'Cinzel',serif",letterSpacing:1}}>匯率 1 USD = {USD_TWD} TWD</div>
                  <div className="hld-row">
                    <div className="hld-st"><div className="hld-sl">保險</div><div className="hld-sv" style={{color:"var(--gold)",fontSize:10}}>{fmtUSD(totalInsUSD)}</div></div>
                    <div className="hld-st"><div className="hld-sl">股票</div><div className="hld-sv" style={{color:"var(--blue)",fontSize:10}}>{fmtTWD(totalStockTWD)}</div></div>
                    <div className="hld-st"><div className="hld-sl">固收</div><div className="hld-sv" style={{color:"var(--green)",fontSize:10}}>{fmtUSD(totalFixedUSD)}</div></div>
                    <div className="hld-st"><div className="hld-sl">貴金屬</div><div className="hld-sv" style={{color:"#b8902a",fontSize:10}}>{fmtUSD(totalMetalUSD)}</div></div>
                    <div className="hld-st"><div className="hld-sl">房地產</div><div className="hld-sv" style={{color:"var(--rose)",fontSize:10}}>{fmtUSD(totalRealEstateUSD)}</div></div>
                  </div>
                </div>
                {/* 刷新按鈕 */}
                {(()=>{
                  const refreshAllHoldings=async()=>{
                    setStockRefreshing(true);
                    if(stockHoldings.length){
                      const codes=[...new Set(stockHoldings.map(h=>h.code))];
                      const priceMap=await fetchStockPrices(codes);
                      if(priceMap.size){
                        setStockHoldings(prev=>{
                          const next=prev.map(h=>priceMap.has(h.code)?{...h,currentPrice:priceMap.get(h.code)}:h);
                          if(currentUser)saveUserData(currentUser.id,"stocks",next).catch(console.error);
                          return next;
                        });
                      }
                    }
                    await refreshMetalPrices();
                    setStockRefreshing(false);
                    showToast("✓ 所有持倉現價已更新");
                  };
                  return(
                    <div style={{display:"flex",justifyContent:"flex-end",padding:"4px 16px 0"}}>
                      <button onClick={refreshAllHoldings} disabled={stockRefreshing}
                        style={{background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.25)",borderRadius:16,padding:"5px 14px",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:stockRefreshing?"rgba(154,110,32,.4)":"#9a6e20",cursor:stockRefreshing?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:5}}>
                        <span style={{display:"inline-block",animation:stockRefreshing?"spin 1s linear infinite":"none"}}>↻</span>
                        {stockRefreshing?"更新中…":"刷新所有現價"}
                      </button>
                    </div>
                  );
                })()}
                <div className="htab-row" style={{overflowX:"auto"}}>
                  {[{id:"insurance",label:"🛡️ 保險"},{id:"stock",label:"📈 股票"},{id:"fixed",label:"💰 固收"},{id:"metal",label:"💎 貴金屬"},{id:"realestate",label:"🏠 房地產"}].map(t=>(
                    <div key={t.id} className={`htab ${holdingsTab===t.id?"active":""}`} onClick={()=>setHoldingsTab(t.id)} style={{flexShrink:0}}>{t.label}</div>
                  ))}
                </div>
                {/* 保險 */}
                {holdingsTab==="insurance"&&(
                  <div className="hld-list">
                    {insuranceHoldings.map(h=>{
                      const totalCost=calcInsTotalCost(h);const years=new Date().getFullYear()-Number(h.startYear);
                      const m={"躉繳":1,"2年":2,"5年":5,"12年":12};const termYrs=m[h.paymentTerm]||1;
                      const paidYrs=Math.min(years,termYrs);const paidPct=Math.round((paidYrs/termYrs)*100);
                      return(
                        <div className="hld-item" key={h.id}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                            <div style={{flex:1,minWidth:0,paddingRight:12}}>
                              <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                                <div style={{fontFamily:"'Cinzel',serif",fontSize:7,letterSpacing:2,color:"var(--gold)",background:"var(--gold-dim)",padding:"2px 8px",borderRadius:3,border:"1px solid rgba(200,168,75,.2)",textTransform:"uppercase"}}>{h.paymentTerm}</div>
                                <div style={{fontFamily:"'Cinzel',serif",fontSize:7,letterSpacing:2,color:h.policyType==="壽險"?"var(--silver)":"var(--rose)",background:h.policyType==="壽險"?"var(--silver-dim)":"var(--rose-dim)",padding:"2px 8px",borderRadius:3}}>{h.policyType}</div>
                              </div>
                              <div className="hld-item-name">{h.product}</div>
                              {h.policyNo&&<div className="hld-item-type">保單號 {h.policyNo} · {h.startYear} 年起</div>}
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"var(--gold)"}}>{fmtUSD(totalCost)}</div>
                              <div style={{fontSize:10,color:"var(--md)",marginTop:2}}>總投入</div>
                            </div>
                          </div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:"5px 14px",fontSize:11,color:"var(--md)",marginBottom:10}}>
                            {h.annualPremiumUSD>0&&<span>年繳 {fmtUSD(h.annualPremiumUSD)}</span>}
                            {h.faceAmountUSD>0&&<span>投保額 {fmtUSD(h.faceAmountUSD)}</span>}
                          </div>
                          {h.paymentTerm!=="躉繳"&&(
                            <div style={{marginBottom:8}}>
                              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--md)",marginBottom:4}}><span>繳費進度</span><span>{paidYrs}/{termYrs} 年 ({paidPct}%)</span></div>
                              <div className="hld-item-bar"><div className="hld-item-fill" style={{width:`${paidPct}%`,background:paidPct>=100?"var(--green)":"var(--gold)"}}/></div>
                            </div>
                          )}
                          <div className="hld-actions">
                            <button className="hld-edit-btn" onClick={()=>editIns(h)}>✎ 編輯</button>
                            <button className="hld-del-btn" onClick={()=>deleteIns(h.id)}>✕</button>
                          </div>
                        </div>
                      );
                    })}
                    <button className="add-btn" style={{marginBottom:24}} onClick={()=>{setEditInsId(null);setInsForm(INS_BLANK);setShowInsForm(true);}}>+ 新增保單</button>
                  </div>
                )}
                {/* 股票 */}
                {holdingsTab==="stock"&&(
                  <div className="hld-list">
                    {stockHoldings.map(h=>{
                      const cur=calcStockTWD(h),cost=calcStockCostTWD(h),pnl=cur-cost,pct=((pnl/cost)*100).toFixed(1),up=pnl>=0;
                      return(
                        <div className="hld-item" key={h.id}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                            <div>
                              <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:"var(--blue)",textTransform:"uppercase",marginBottom:4}}>📈 {h.currency==="TWD"?"台股":"美股"}</div>
                              <div className="hld-item-name">{h.name}</div>
                              <div className="hld-item-type">{h.code} · {h.shares} 股</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:up?"var(--green)":"var(--red)"}}>{up?"+":""}{fmtTWD(pnl)}</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:up?"var(--green)":"var(--red)",marginTop:2}}>{up?"+":""}{pct}%</div>
                            </div>
                          </div>
                          <div style={{fontSize:11,color:"var(--md)",marginBottom:8}}>成本 {h.currency==="TWD"?"NT$":"USD"} {h.costPerShare} · 現價 {h.currency==="TWD"?"NT$":"USD"} {h.currentPrice}</div>
                          <div className="hld-actions">
                            <button className="hld-edit-btn" onClick={()=>editStock(h)}>✎ 編輯</button>
                            <button className="hld-del-btn" onClick={()=>deleteStock(h.id)}>✕</button>
                          </div>
                        </div>
                      );
                    })}
                    <button className="add-btn" style={{marginBottom:24}} onClick={()=>setShowStockForm(true)}>+ 新增股票</button>
                  </div>
                )}
                {/* 固收 */}
                {holdingsTab==="fixed"&&(
                  <div className="hld-list">
                    {fixedHoldings.map(h=>{
                      const curVal=calcFixedValue(h);const gain=curVal-h.amountUSD;const pct=((gain/h.amountUSD)*100).toFixed(1);
                      return(
                        <div className="hld-item" key={h.id}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                            <div>
                              <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:"var(--green)",textTransform:"uppercase",marginBottom:4}}>💰 私募固收</div>
                              <div className="hld-item-name">{h.product}</div>
                              <div className="hld-item-type">{h.startDate} · {h.lockYears}年鎖定 · {h.annualRate}% p.a.</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"var(--green)"}}>USD {curVal.toLocaleString()}</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--green)",marginTop:2}}>+{pct}%</div>
                            </div>
                          </div>
                          <div style={{fontSize:11,color:"var(--md)",marginBottom:8}}>本金 USD {h.amountUSD.toLocaleString()} · 利息 USD {gain.toLocaleString()}</div>
                          <div className="hld-actions">
                            <button className="hld-edit-btn" onClick={()=>editFixed(h)}>✎ 編輯</button>
                            <button className="hld-del-btn" onClick={()=>deleteFixed(h.id)}>✕</button>
                          </div>
                        </div>
                      );
                    })}
                    <button className="add-btn" style={{marginBottom:24}} onClick={()=>{setEditFixedId(null);setShowFixedForm(true);}}>+ 新增固收</button>
                  </div>
                )}
                {/* 貴金屬 */}
                {holdingsTab==="metal"&&(
                  <div className="hld-list">
                    {metalHoldings.map(h=>{
                      const curVal=h.grams*(h.currentPricePerGram||h.costPerGram||0);
                      const cost=h.grams*h.costPerGram;
                      const pnl=curVal-cost;const pct=cost>0?((pnl/cost)*100).toFixed(1):"0.0";
                      return(
                        <div className="hld-item" key={h.id}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                            <div>
                              <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:"#b8902a",textTransform:"uppercase",marginBottom:4}}>💎 貴金屬</div>
                              <div className="hld-item-name">{h.product}</div>
                              <div className="hld-item-type">{h.grams}g · 購入 {h.purchaseDate}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:pnl>=0?"var(--green)":"var(--red)"}}>USD {curVal.toLocaleString()}</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:pnl>=0?"var(--green)":"var(--red)",marginTop:2}}>{pnl>=0?"+":""}{pct}%</div>
                            </div>
                          </div>
                          <div style={{fontSize:11,color:"var(--md)",marginBottom:8}}>成本 USD {h.costPerGram}/g · 現價 USD {h.currentPricePerGram||h.costPerGram}/g</div>
                          <div className="hld-actions">
                            <button className="hld-edit-btn" onClick={()=>editMetal(h)}>✎ 編輯</button>
                            <button className="hld-del-btn" onClick={()=>deleteMetal(h.id)}>✕</button>
                          </div>
                        </div>
                      );
                    })}
                    <button className="add-btn" style={{marginBottom:24}} onClick={()=>{setEditMetalId(null);setMetalForm({product:"萬兆豐貴金屬 — 實體黃金",grams:"",costPerGram:"",currentPricePerGram:"",purchaseDate:""});setShowMetalForm(true);}}>+ 新增貴金屬</button>
                  </div>
                )}
                {/* 房地產 */}
                {holdingsTab==="realestate"&&(
                  <div className="hld-list">
                    {realEstateHoldings.map(h=>{
                      const equity=Math.max(0,(h.marketValue||0)-(h.mortgage||0));
                      const holdYrs=h.purchaseYear?new Date().getFullYear()-Number(h.purchaseYear):null;
                      const gain=h.purchasePrice?(h.marketValue||0)-h.purchasePrice:null;
                      return(
                        <div className="hld-item" key={h.id}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                                <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:"var(--rose)",textTransform:"uppercase"}}>🏠 {h.propertyType||"不動產"}</div>
                                {holdYrs&&<div style={{fontFamily:"'Cinzel',serif",fontSize:8,color:"var(--md)"}}>持有 {holdYrs} 年</div>}
                              </div>
                              <div className="hld-item-name">{h.name}</div>
                              {h.address&&<div style={{fontSize:11,color:"var(--md)",marginTop:2}}>{h.address}</div>}
                            </div>
                            <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                              <div style={{fontSize:10,color:"var(--md)",marginBottom:2}}>市值</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"var(--rose)"}}>{h.currency==="TWD"?`NT$ ${(h.marketValue||0).toLocaleString()}`:`USD ${(h.marketValue||0).toLocaleString()}`}</div>
                            </div>
                          </div>
                          {/* 淨值/貸款/獲利 */}
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                            <div style={{padding:"6px 8px",background:"var(--card2)",borderRadius:8,textAlign:"center"}}>
                              <div style={{fontSize:10,color:"var(--md)",marginBottom:2}}>淨值</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:"#1a6e42"}}>{h.currency==="TWD"?`NT$ ${Math.round(equity/10000)}萬`:`USD ${Math.round(equity/1000)}K`}</div>
                            </div>
                            <div style={{padding:"6px 8px",background:"var(--card2)",borderRadius:8,textAlign:"center"}}>
                              <div style={{fontSize:10,color:"var(--md)",marginBottom:2}}>貸款</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#b05060"}}>{h.mortgage?`NT$ ${Math.round(h.mortgage/10000)}萬`:"無"}</div>
                            </div>
                            <div style={{padding:"6px 8px",background:"var(--card2)",borderRadius:8,textAlign:"center"}}>
                              <div style={{fontSize:10,color:"var(--md)",marginBottom:2}}>獲利</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:gain&&gain>0?"#1a6e42":gain&&gain<0?"#b05060":"var(--md)"}}>{gain!=null?(gain>0?"+":"")+`NT$ ${Math.round(gain/10000)}萬`:"—"}</div>
                            </div>
                          </div>
                          {/* 快速連結試算 */}
                          {h.purchaseYear&&h.purchasePrice&&(
                            <div style={{fontSize:11,color:"#8a5e18",marginBottom:8,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{
                              setReit2Form({sellPrice:String(h.marketValue||""),buyPrice:String(h.purchasePrice||""),cost:"",holdYears:String(holdYrs||""),isPersonal:true,selfUse:false});
                              setTab("calc");setCalcMode("realestate2");
                            }}>🏢 試算此物件房地合一稅 →</div>
                          )}
                          {h.notes&&<div style={{fontSize:11,color:"var(--md)",marginBottom:8}}>{h.notes}</div>}
                          <div className="hld-actions">
                            <button className="hld-edit-btn" onClick={()=>editRealEstate(h)}>✎ 編輯</button>
                            <button className="hld-del-btn" onClick={()=>deleteRealEstate(h.id)}>✕</button>
                          </div>
                        </div>
                      );
                    })}
                    <button className="add-btn" style={{marginBottom:24}} onClick={()=>{setEditRealEstateId(null);setRealEstateForm({...RE_BLANK});setShowRealEstateForm(true);}}>+ 新增不動產</button>
                  </div>
                )}
              </>
            )}

            {/* ─ 保障覆蓋率 ─ */}
            {assetsSub==="coverage"&&(
              <div style={{paddingTop:16,paddingBottom:24}}>
                {coverageResult?(
                  <div style={{margin:"0 16px"}}>
                    {/* 總分卡 */}
                    <div style={{background:"var(--card)",border:"1px solid var(--bl)",borderRadius:14,overflow:"hidden",marginBottom:12}}>
                      <div style={{padding:"16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid var(--bl)"}}>
                        <div>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:coverageResult.overall>=70?"#1a6e42":"#b05060",textTransform:"uppercase",marginBottom:4}}>整體保障覆蓋率</div>
                          <div style={{fontSize:13,color:"var(--md)"}}>基於您填寫的保障資料</div>
                        </div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:36,fontWeight:700,color:coverageResult.overall>=70?"#1a6e42":"#b05060"}}>{coverageResult.overall}%</div>
                      </div>
                      <div style={{padding:"12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        {[
                          {label:"壽險",icon:"💙",score:coverageResult.lifeScore,desc:`可撐 ${coverageResult.lifeYears} 年`,gap:coverageResult.lifeGap>0?`缺 NT$ ${Math.round(coverageResult.lifeGap/10000)}萬`:null},
                          {label:"實支實付",icon:"🏥",score:coverageResult.realScore,desc:`NT$ ${(Number(coverageForm.realExpense)||0).toLocaleString()}/次`,gap:coverageResult.realGap>0?`缺 NT$ ${Math.round(coverageResult.realGap/10000)}萬`:null},
                          {label:"住院日額",icon:"🛏️",score:coverageResult.dailyScore,desc:`NT$ ${(Number(coverageForm.dailyHospital)||0).toLocaleString()}/天`,gap:coverageResult.dailyGap>0?`缺 NT$ ${coverageResult.dailyGap}/天`:null},
                          {label:"癌症一次金",icon:"🎗️",score:coverageResult.cancerScore,desc:`NT$ ${(Number(coverageForm.cancerLump)||0).toLocaleString()}`,gap:coverageResult.cancerGap>0?`缺 NT$ ${Math.round(coverageResult.cancerGap/10000)}萬`:null},
                        ].map((item,i)=>(
                          <div key={i} style={{padding:"10px 12px",background:"var(--card2)",borderRadius:10,border:`1px solid ${item.score>=70?"rgba(42,138,90,.15)":"rgba(176,80,96,.15)"}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                              <div style={{fontSize:12,fontWeight:600,color:"var(--td)"}}>{item.icon} {item.label}</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:item.score>=70?"#1a6e42":"#b05060"}}>{item.score}%</div>
                            </div>
                            <div style={{height:4,background:"var(--bl)",borderRadius:2,marginBottom:6}}>
                              <div style={{height:4,borderRadius:2,width:`${item.score}%`,background:item.score>=70?"#1a6e42":"#b05060",transition:"width .4s"}}/>
                            </div>
                            <div style={{fontSize:11,color:"var(--md)"}}>{item.desc}</div>
                            {item.gap&&<div style={{fontSize:11,color:"#b05060",marginTop:2,fontWeight:600}}>⚠ {item.gap}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="calc-btn" onClick={()=>setShowCoverageForm(true)}>✎ 更新保障資料</button>
                    {coverageResult.overall<70&&(
                      <div style={{marginTop:10,padding:"12px 14px",background:"rgba(176,80,96,.06)",borderRadius:12,border:"1px solid rgba(176,80,96,.15)",cursor:"pointer"}} onClick={()=>setShowMsg(true)}>
                        <div style={{fontSize:12,color:"#b05060",lineHeight:1.7}}>⚠ 保障仍有缺口，建議諮詢凱特顧問進行完整規劃 →</div>
                      </div>
                    )}
                  </div>
                ):(
                  <div style={{margin:"0 16px",background:"var(--card)",border:"1px dashed rgba(176,80,96,.3)",borderRadius:14,padding:"24px 16px",textAlign:"center"}}>
                    <div style={{fontSize:32,marginBottom:12}}>🛡️</div>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"#b05060",textTransform:"uppercase",marginBottom:8}}>尚未填寫保障資料</div>
                    <div style={{fontSize:14,color:"var(--td)",fontWeight:600,marginBottom:6}}>了解您的保障缺口</div>
                    <div style={{fontSize:13,color:"var(--md)",lineHeight:1.7,marginBottom:16}}>壽險 · 實支實付 · 住院日額 · 癌症理賠<br/>填寫後立即看見覆蓋率與缺口分析</div>
                    <button className="calc-btn" onClick={()=>setShowCoverageForm(true)}>開始填寫保障資料 →</button>
                  </div>
                )}
              </div>
            )}

            {/* ─ 財務健檢 ─ */}
            {assetsSub==="health"&&(
              <>
                <div style={{height:14}}/>
                <div className="hd-grid">
                  <div className="hd-sc">
                    <div className="s-ring" style={{background:`conic-gradient(#4aaa80 0% ${healthScore||72}%,#cdd0d8 ${healthScore||72}% 100%)`}}><div className="s-num">{healthScore||72}</div></div>
                    <div>
                      <div className="hd-gr">{((healthScore||72)>=80?"優秀":(healthScore||72)>=60?"良好":(healthScore||72)>=40?"普通":"需改善")}</div>
                      <div className="hd-ds">{healthScore?"已更新您的財務健康分數。":"財務狀況良好，退休準備與保險配置仍有優化空間"}</div>
                    </div>
                  </div>
                  {healthItems.map((it,i)=>(
                    <div className="hm" key={i}>
                      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:it.c,borderRadius:"2px 2px 0 0"}}/>
                      <div className="hm-lb">{it.lb}</div><div className="hm-v" style={{color:it.c}}>{it.v}</div><div className="hm-s">{it.s}</div>
                      <div className="hm-bg"><div className="hm-b" style={{width:`${it.p}%`,background:it.c}}/></div>
                    </div>
                  ))}
                  <div className="hm-w">
                    {[{lb:"月支出",v:"NT$ 68K",p:55,c:"#c8a84b"},{lb:"儲蓄率",v:"32%",p:64,c:"#4aaa80"},{lb:"投資報酬",v:"+14.2%",p:71,c:"#7898c0"}].map((w,i)=>(
                      <div className="hw-i" key={i}><div className="hw-lb">{w.lb}</div><div className="hw-v" style={{color:w.c}}>{w.v}</div><div className="hw-bg"><div className="hw-b" style={{width:`${w.p}%`,background:w.c}}/></div></div>
                    ))}
                  </div>
                </div>
                <button className="health-update-btn" onClick={()=>setShowHealthForm(true)}>✎ 填寫財務健檢，更新我的分數</button>
                <div style={{height:16}}/>
              </>
            )}
          </div>
        )}

        {/* ════ CALC ════ */}
        {tab==="calc"&&(
          <div>
            <div className="ph">
              <div className="ph-en">Calculator</div>
              <div className="ph-t">財務試算</div>
            </div>
            <div className="calc-section" style={{paddingTop:8}}>
              {/* 工具選單 */}
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {[{id:"mortgage",label:"🏠 房貸活化"},{id:"retire",label:"🏖️ 退休金"},{id:"compound",label:"📈 複利"},{id:"estate",label:"📋 遺產稅"},{id:"incometax",label:"💼 綜所稅"},{id:"realestate2",label:"🏢 房地合一"},{id:"fx",label:"💱 匯率"},{id:"rule72",label:"⚡ 72法則"},{id:"inflation",label:"📉 通膨"},{id:"breakeven",label:"🔄 回本年"},{id:"irr",label:"📊 IRR 試算"},{id:"gift",label:"🎁 贈與稅"}].map(c=>(
                  <div key={c.id} onClick={()=>setCalcMode(c.id)} style={{padding:"9px 14px",borderRadius:20,border:`1px solid ${calcMode===c.id?"rgba(154,110,32,.5)":"var(--bl)"}`,background:calcMode===c.id?"rgba(154,110,32,.12)":"transparent",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:1,color:calcMode===c.id?"#8a5e18":"var(--md)",cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>{c.label}</div>
                ))}
              </div>

                {/* 房貸活化 */}
                {calcMode==="mortgage"&&(
                  <>
                    <div className="calc-card">
                      <div className="calc-title">🏠 房貸活化試算</div>
                      <div className="calc-desc">透過房屋淨值再融資，釋出資金投入高報酬商品，評估是否能產生正現金流。</div>
                      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
                        <button onClick={()=>setMtgForm({homeValue:"20000000",loanBalance:"8000000",rate:"2.6",years:"20",targetRate:"6",originalMonthly:"35000"})} style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:1,color:"#9a6e20",background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>填入範例數字</button>
                      </div>
                      {[["房屋估值 (TWD)","homeValue","例如：20000000"],["剩餘房貸 (TWD)","loanBalance","例如：8000000（無房貸填 0）"],["目前每月房貸月供 (TWD)","originalMonthly","例如：35000（無房貸填 0）"],["再融資利率 (%)","rate","例如：2.5"],["再融資年期 (年)","years","例如：20"],["目標投資年化報酬 (%)","targetRate","例如：6"]].map(([lbl,k,ph])=>(
                        <div key={k}><div className="calc-lbl">{lbl}</div><input className="calc-inp" type="number" placeholder={ph} value={mtgForm[k]} onChange={e=>setMtgForm(p=>({...p,[k]:e.target.value}))}/></div>
                      ))}
                      {(!mtgForm.homeValue||Number(mtgForm.homeValue)===0)&&<div style={{fontSize:13,color:"#b05060",marginTop:8,padding:"8px 12px",background:"rgba(176,80,96,.08)",borderRadius:8}}>⚠ 請先填入房屋估值</div>}
                      <button className="calc-btn" onClick={calcMortgage} style={{opacity:(!mtgForm.homeValue||Number(mtgForm.homeValue)===0)?0.4:1}}>試算活化效益 →</button>
                    </div>
                    {mtgResult&&(
                      <div className="calc-result" style={{border:"1px solid rgba(140,110,80,.2)"}}>
                        <div className="calc-res-hd" style={{color:"#5a3e28"}}>活化基本資訊</div>
                        {[
                          ["房屋淨值","NT$ "+mtgResult.equity.toLocaleString()],
                          ["可釋出活化資金 (80% LTV)","NT$ "+mtgResult.releasable.toLocaleString()],
                          ["再融資後總貸款","NT$ "+mtgResult.totalLoan.toLocaleString()],
                        ].map(([l,v])=>(
                          <div className="calc-res-row" key={l}><div className="calc-res-lbl">{l}</div><div className="calc-res-val">{v}</div></div>
                        ))}

                        {/* 方案一：整筆複利不動 */}
                        <div style={{margin:"16px 0 8px",padding:"16px",background:"rgba(42,138,90,.06)",border:"1px solid rgba(42,138,90,.2)",borderRadius:14}}>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"#1a6e42",textTransform:"uppercase",marginBottom:6,fontWeight:700}}>方案一：整筆複利・資產累積型</div>
                          <div style={{fontSize:12,color:"#4a6858",lineHeight:1.7,marginBottom:12}}>
                            釋出 NT$ {mtgResult.releasable.toLocaleString()} 整筆投入，{mtgResult.yrs} 年複利不動。總貸款重新攤還，到期無需另還本金。
                          </div>
                          {[
                            ["原本月供",`NT$ ${(mtgResult.origMonthly||0).toLocaleString()}/月`],
                            ["再融資後新月供（"+mtgResult.totalLoan.toLocaleString()+" 重新攤還）",`NT$ ${mtgResult.newTotalMonthly.toLocaleString()}/月`],
                          ].map(([l,v])=>(
                            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(42,138,90,.1)"}}>
                              <div style={{fontSize:13,color:"#5a6860"}}>{l}</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#2c1e0f"}}>{v}</div>
                            </div>
                          ))}
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0 0"}}>
                            <div style={{fontSize:13,color:"#5a6860",fontWeight:600}}>每月多付</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,color:mtgResult.monthlyDiff>0?"#b05060":"#1a6e42"}}>
                              {mtgResult.monthlyDiff>0?"+":""} NT$ {mtgResult.monthlyDiff.toLocaleString()}/月
                            </div>
                          </div>

                          <div style={{marginTop:12,padding:"12px 14px",background:"rgba(42,138,90,.08)",borderRadius:10}}>
                            <div style={{fontSize:12,color:"#4a6858",marginBottom:8}}>{mtgResult.yrs} 年到期成果（無需另還本金）</div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <div style={{fontSize:14,color:"#1a6e42",fontWeight:700}}>帳上淨賺資產</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:"#1a6e42"}}>NT$ {mtgResult.futureValue.toLocaleString()}</div>
                            </div>
                            <div style={{fontSize:11,color:"#4a6858",marginTop:4}}>
                              NT$ {mtgResult.releasable.toLocaleString()} × (1 + {mtgForm.targetRate}%)^{mtgResult.yrs} 年複利
                            </div>
                          </div>
                          <div style={{marginTop:10,fontSize:12,color:"#4a6858",lineHeight:1.75,padding:"10px 12px",background:"rgba(255,252,245,.6)",borderRadius:8}}>
                            💡 每月多付 NT$ {mtgResult.monthlyDiff.toLocaleString()}，{mtgResult.yrs} 年後房子還完，帳上多出 <b style={{color:"#1a6e42"}}>NT$ {mtgResult.futureValue.toLocaleString()}</b> 純資產。
                          </div>
                        </div>

                        {/* 方案二：只繳息月配補貼 */}
                        <div style={{margin:"8px 0 0",padding:"16px",background:"rgba(154,110,32,.06)",border:"1px solid rgba(154,110,32,.2)",borderRadius:14}}>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"#8a5e18",textTransform:"uppercase",marginBottom:6,fontWeight:700}}>方案二：只繳息・現金流補貼型</div>
                          <div style={{fontSize:12,color:"#7a6040",lineHeight:1.7,marginBottom:12}}>
                            釋出資金只繳 NT$ {mtgResult.releasable.toLocaleString()} 的月息，活化收益補貼，本金到期一次還清。
                          </div>
                          {[
                            ["原本月供",`NT$ ${(mtgResult.origMonthly||0).toLocaleString()}/月`],
                            ["＋ 新增再融資月息",`NT$ ${mtgResult.interestOnly.toLocaleString()}/月`],
                            ["整體月付合計",`NT$ ${mtgResult.totalMonthlyInterest.toLocaleString()}/月`],
                            ["－ 活化每月收益補貼",`- NT$ ${mtgResult.monthlyReturn.toLocaleString()}/月`],
                          ].map(([l,v])=>(
                            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(154,110,32,.1)"}}>
                              <div style={{fontSize:13,color:"#6b5040"}}>{l}</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#2c1e0f"}}>{v}</div>
                            </div>
                          ))}
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,padding:"10px 12px",background:"rgba(154,110,32,.1)",borderRadius:8}}>
                            <div style={{fontSize:14,color:"#8a5e18",fontWeight:700}}>每月實際自付</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:700,color:"#8a5e18"}}>NT$ {Math.max(0,mtgResult.afterSubsidyInterest).toLocaleString()}</div>
                          </div>
                          {mtgResult.netAnnualInterest>0&&(
                            <div style={{marginTop:8,padding:"10px 12px",background:"rgba(154,110,32,.08)",borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <div style={{fontSize:12,color:"#7a6040"}}>活化收益扣利息，每月倒賺</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,color:"#8a5e18"}}>+NT$ {Math.round(mtgResult.netAnnualInterest/12).toLocaleString()}</div>
                            </div>
                          )}
                          <div style={{marginTop:10,fontSize:12,color:"#6b5040",lineHeight:1.75,padding:"10px 12px",background:"rgba(255,252,245,.6)",borderRadius:8}}>
                            💡 本金 NT$ {mtgResult.releasable.toLocaleString()} 到期還清，<b style={{color:"#8a5e18"}}>主動權在你手上</b>。市場好繼續滾，市場差隨時退場。
                          </div>
                        </div>

                        <div className="calc-note" style={{marginTop:12,background:"rgba(154,110,32,.06)",color:"#7a5020",fontSize:12,lineHeight:1.7}}>
                          以上試算僅供參考，實際方案請諮詢凱特顧問，依個人財務與稅務狀況量身規劃。
                        </div>
                      </div>
                    )}
                  </>
                )}
                {/* 退休金 */}
                {calcMode==="retire"&&(
                  <>
                    <div className="calc-card">
                      <div className="calc-title">🏖️ 退休金試算</div>
                      <div className="calc-desc">計算退休時可累積的總資產，並估算每月可提領金額是否足夠退休生活。</div>
                      {[["目前年齡","currentAge","例如：40"],["預計退休年齡","retireAge","例如：65"],["目前已累積退休金 (TWD)","currentSavings","例如：3000000"],["每月定期儲蓄 (TWD)","monthlyContrib","例如：30000"],["預估年化報酬率 (%)","expectedReturn","例如：5"],["退休後每月需求 (TWD)","monthlyExpense","例如：80000"]].map(([lbl,k,ph])=>(
                        <div key={k}><div className="calc-lbl">{lbl}</div><input className="calc-inp" type="number" placeholder={ph} value={retForm[k]} onChange={e=>setRetForm(p=>({...p,[k]:e.target.value}))}/></div>
                      ))}
                      <button className="calc-btn" onClick={calcRetirement}>試算退休目標 →</button>
                    </div>
                    {retResult&&(
                      <div className="calc-result" style={{border:`1px solid ${retResult.feasible?"rgba(58,170,120,.3)":"rgba(216,88,104,.25)"}`}}>
                        <div className="calc-res-hd" style={{color:retResult.feasible?"var(--green)":"var(--rose)"}}>{retResult.feasible?"✓ 退休目標可達成":"⚠ 退休準備仍有缺口"}</div>
                        {[["累積年數",retResult.years+" 年"],["退休時預估總資產","NT$ "+retResult.total.toLocaleString()],["每月可提領 (20年)","NT$ "+retResult.monthly.toLocaleString()+"/月"],["每月缺口/盈餘",(retResult.feasible?"+":"-")+"NT$ "+Math.abs(retResult.gap).toLocaleString()+"/月"]].map(([l,v],i)=>(
                          <div className="calc-res-row" key={i}>
                            <div className="calc-res-lbl">{l}</div>
                            <div className="calc-res-val" style={i===3?{color:retResult.feasible?"var(--green)":"var(--red)"}:{}}>{v}</div>
                          </div>
                        ))}
                        <div className="calc-note" style={{background:retResult.feasible?"var(--green-dim)":"var(--rose-dim)",color:retResult.feasible?"var(--green)":"var(--rose)"}}>{retResult.feasible?`按目前配置，退休後每月可提領 NT$ ${retResult.monthly.toLocaleString()}，高於目標 ${retResult.gap.toLocaleString()} 元。`:`每月仍有 NT$ ${retResult.shortfall.toLocaleString()} 缺口，建議增加儲蓄或透過投資商品補足退休金。`}</div>
                      </div>
                    )}
                  </>
                )}

                {/* 複利計算機 */}
                {calcMode==="compound"&&(
                  <>
                    <div className="calc-card">
                      <div className="calc-title">📈 複利計算機</div>
                      <div className="calc-desc">計算整筆投入或定期定額的長期複利效果。</div>
                      {[["本金 (TWD)","principal","例如：1000000"],["年化報酬率 (%)","rate","例如：6"],["投資年期","years","例如：20"],["每月定期加碼 (選填)","monthly","例如：10000"]].map(([lbl,k,ph])=>(
                        <div key={k}><div className="calc-lbl">{lbl}</div><input className="calc-inp" type="number" placeholder={ph} value={compForm[k]} onChange={e=>setCompForm(p=>({...p,[k]:e.target.value}))}/></div>
                      ))}
                      <button className="calc-btn" onClick={calcCompound}>計算複利效果 →</button>
                    </div>
                    {compResult&&(
                      <div className="calc-result" style={{border:"1px solid rgba(42,138,90,.25)"}}>
                        <div className="calc-res-hd" style={{color:"#1a6e42"}}>✓ {compResult.years} 年後</div>
                        {[["本金複利終值","NT$ "+compResult.fvLump.toLocaleString()],["定期加碼累積","NT$ "+compResult.fvMonthly.toLocaleString()],["總資產","NT$ "+compResult.total.toLocaleString()],["投資獲利","NT$ "+compResult.gain.toLocaleString()]].map(([l,v],i)=>(
                          <div className="calc-res-row" key={i}>
                            <div className="calc-res-lbl">{l}</div>
                            <div className="calc-res-val" style={i===3?{color:"#1a6e42",fontSize:18}:{}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* 遺產稅試算 */}
                {calcMode==="estate"&&(
                  <>
                    <div className="calc-card">
                      <div className="calc-title">📋 遺產稅試算（台灣 2025）</div>
                      <div className="calc-desc">免稅額 1,333 萬，課稅級距 5,621 萬以下 10%、5,621 萬～1.12 億 15%、超過 20%。台灣壽險身故保險金不計入遺產總額。</div>
                      <div className="calc-lbl">遺產總額（含所有資產，TWD）</div>
                      <input className="calc-inp" type="number" placeholder="例如：50000000" value={estateForm.totalAsset} onChange={e=>setEstateForm(p=>({...p,totalAsset:e.target.value}))}/>
                      <div className="calc-lbl">台灣壽險身故保險金（TWD）</div>
                      <div style={{fontSize:12,color:"var(--md)",marginBottom:6}}>符合條件者不計入遺產，但 114 年度免稅上限為 3,740 萬，超過部分需計入個人基本所得額</div>
                      <input className="calc-inp" type="number" placeholder="例如：10000000（無則填 0）" value={estateForm.lifeInsurance} onChange={e=>setEstateForm(p=>({...p,lifeInsurance:e.target.value}))}/>
                      <div className="calc-lbl">配偶</div>
                      <div style={{display:"flex",gap:8}}>
                        {[["有","true"],["無","false"]].map(([lbl,v])=>(
                          <div key={v} onClick={()=>setEstateForm(p=>({...p,spouse:v==="true"}))} style={{flex:1,padding:"10px",textAlign:"center",borderRadius:10,border:`1px solid ${String(estateForm.spouse)===v?"rgba(154,110,32,.4)":"var(--bl)"}`,background:String(estateForm.spouse)===v?"rgba(154,110,32,.1)":"transparent",fontFamily:"'Cinzel',serif",fontSize:11,color:String(estateForm.spouse)===v?"#8a5e18":"var(--md)",cursor:"pointer"}}>{lbl}</div>
                        ))}
                      </div>
                      {[["子女人數","children","例如：2"],["父母人數","parents","例如：0"],["喪葬費用（TWD）","funeralExp","預設 138 萬"]].map(([lbl,k,ph])=>(
                        <div key={k}><div className="calc-lbl">{lbl}</div><input className="calc-inp" type="number" placeholder={ph} value={estateForm[k]} onChange={e=>setEstateForm(p=>({...p,[k]:e.target.value}))}/></div>
                      ))}
                      <div className="calc-lbl">未償債務（TWD，需有確實證明）</div>
                      <input className="calc-inp" type="number" placeholder="例如：5000000（無則填 0）" value={estateForm.debt} onChange={e=>setEstateForm(p=>({...p,debt:e.target.value}))}/>
                      <div className="calc-lbl">重度身心障礙繼承人人數（每人加扣 693 萬）</div>
                      <input className="calc-inp" type="number" placeholder="0" value={estateForm.disabledCount} onChange={e=>setEstateForm(p=>({...p,disabledCount:e.target.value}))}/>
                      <button className="calc-btn" onClick={calcEstate}>試算遺產稅 →</button>
                    </div>
                    {estateResult&&(
                      <div className="calc-result" style={{border:"1px solid rgba(176,80,96,.25)"}}>
                        <div className="calc-res-hd" style={{color:"#b05060"}}>⚠ 遺產稅試算結果</div>
                        {[
                          ["遺產總額（含保險）",`NT$ ${estateResult.grossAsset.toLocaleString()}`],
                          ...(estateResult.lifeIns>0?[["壽險身故保險金（不計入遺產）",`- NT$ ${estateResult.lifeIns.toLocaleString()}`]]:[]),
                          ["課稅遺產總額",`NT$ ${estateResult.asset.toLocaleString()}`],
                          ["免稅額",`- NT$ 13,330,000`],
                          ...(estateResult.spouseExempt>0?[["配偶扣除額",`- NT$ ${estateResult.spouseExempt.toLocaleString()}`]]:[]),
                          ...(estateResult.childExempt>0?[["子女扣除額",`- NT$ ${estateResult.childExempt.toLocaleString()}`]]:[]),
                          ...(estateResult.parentExempt>0?[["父母扣除額",`- NT$ ${estateResult.parentExempt.toLocaleString()}`]]:[]),
                          ["喪葬費",`- NT$ ${estateResult.funeral.toLocaleString()}`],
                          ...(estateResult.debt>0?[["未償債務",`- NT$ ${estateResult.debt.toLocaleString()}`]]:[]),
                          ...(estateResult.disabledExempt>0?[["身心障礙加扣",`- NT$ ${estateResult.disabledExempt.toLocaleString()}`]]:[]),
                          ["課稅遺產淨額",`NT$ ${estateResult.taxBase.toLocaleString()}`],
                          ["適用稅率",`${estateResult.rate}%`],
                        ].map(([l,v],i)=>(
                          <div className="calc-res-row" key={i} style={{opacity:v.startsWith("-")?0.75:1}}>
                            <div className="calc-res-lbl" style={{color:v.startsWith("-")?"var(--green)":"inherit"}}>{l}</div>
                            <div className="calc-res-val" style={{color:v.startsWith("-")?"var(--green)":"inherit"}}>{v}</div>
                          </div>
                        ))}
                        {estateResult.lifeInsOver>0&&(
                          <div style={{marginTop:8,padding:"10px 14px",background:"rgba(176,80,96,.06)",borderRadius:10,border:"1px solid rgba(176,80,96,.2)",fontSize:12,color:"#b05060",lineHeight:1.7}}>
                            ⚠ 壽險保險金超過 3,740 萬免稅上限，超出的 <strong>NT$ {estateResult.lifeInsOver.toLocaleString()}</strong> 需納入個人基本所得額，依最低稅負制另行計算。
                          </div>
                        )}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,padding:"12px 14px",background:"rgba(176,80,96,.08)",borderRadius:10,border:"1px solid rgba(176,80,96,.2)"}}>
                          <div style={{fontSize:14,color:"#b05060",fontWeight:700}}>應繳遺產稅</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:"#b05060"}}>NT$ {estateResult.tax.toLocaleString()}</div>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginTop:8}}>
                          <div style={{fontSize:13,color:"var(--md)"}}>稅後家族可繼承</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:"#1a6e42"}}>NT$ {estateResult.afterTax.toLocaleString()}</div>
                        </div>
                        <div className="calc-note" style={{background:"rgba(154,110,32,.08)",color:"#8a5e18"}}>透過境外保險規劃可有效降低遺產稅。壽險不計入遺產需留意實質課稅原則，建議諮詢凱特顧問。</div>
                      </div>
                    )}
                  </>
                )}

                {/* 個人綜所稅試算 */}
                {calcMode==="incometax"&&(()=>{
                  // 114年度（115年5月申報）課稅級距
                  const brackets=[
                    {max:590000,rate:0.05,diff:0},
                    {max:1330000,rate:0.12,diff:41300},
                    {max:2660000,rate:0.20,diff:147700},
                    {max:4980000,rate:0.30,diff:413700},
                    {max:Infinity,rate:0.40,diff:911700},
                  ];
                  const grossIncome=Number(itaxForm.income)||0;
                  const headCount=1+(itaxForm.spouse?1:0)+Number(itaxForm.children)+Number(itaxForm.parents);
                  const exempt=97000*headCount; // 免稅額每人9.7萬
                  const stdDeduct=itaxForm.spouse?262000:131000; // 標準扣除額
                  const salaryDeduct=itaxForm.salary?Math.min(218000,grossIncome):0; // 薪資所得特別扣除額21.8萬
                  // 幼兒學前：第1名15萬，第2名以上22.5萬
                  const youngKids=Number(itaxForm.youngKids)||0;
                  const childDeduct=youngKids>=1?150000+(Math.max(0,youngKids-1)*225000):0;
                  // 長期照顧：每人18萬
                  const ltcDeduct=(Number(itaxForm.ltc)||0)*180000;
                  // 房租支出：18萬上限
                  const rentDeduct=itaxForm.rent?180000:0;
                  const totalSpecialDeduct=salaryDeduct+childDeduct+ltcDeduct+rentDeduct;
                  const netIncome=Math.max(0,grossIncome-exempt-stdDeduct-totalSpecialDeduct);
                  const bracket=brackets.find(b=>netIncome<=b.max)||brackets[brackets.length-1];
                  const tax=Math.max(0,Math.round(netIncome*bracket.rate-bracket.diff));
                  const effRate=grossIncome>0?(tax/grossIncome*100).toFixed(1):"0";
                  const checkBox=(key,label)=>(
                    <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10,padding:"12px 14px",background:"var(--card2)",borderRadius:10,cursor:"pointer"}} onClick={()=>setItaxForm(p=>({...p,[key]:!p[key]}))}>
                      <div style={{width:20,height:20,borderRadius:6,border:`1px solid ${itaxForm[key]?"var(--gold)":"var(--bl)"}`,background:itaxForm[key]?"var(--gold)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0}}>{itaxForm[key]?"✓":""}</div>
                      <div style={{fontSize:13,color:"var(--td)"}}>{label}</div>
                    </div>
                  );
                  return(
                  <>
                    <div className="calc-card">
                      <div className="calc-title">💼 個人綜所稅試算（114年度・115年5月申報）</div>
                      <div className="calc-desc">依 114 年度適用數字試算，含幼兒學前、長照、房租等特別扣除額。</div>
                      <div className="calc-lbl">全年所得總額 (TWD)</div>
                      <input className="calc-inp" type="number" placeholder="例如：1200000" value={itaxForm.income} onChange={e=>setItaxForm(p=>({...p,income:e.target.value}))}/>
                      <div className="calc-lbl">申報方式</div>
                      <div style={{display:"flex",gap:8}}>
                        {[["單身申報","false"],["與配偶合併","true"]].map(([lbl,v])=>(
                          <div key={v} onClick={()=>setItaxForm(p=>({...p,spouse:v==="true"}))} style={{flex:1,padding:"10px",textAlign:"center",borderRadius:10,border:`1px solid ${String(itaxForm.spouse)===v?"rgba(154,110,32,.4)":"var(--bl)"}`,background:String(itaxForm.spouse)===v?"rgba(154,110,32,.1)":"transparent",fontFamily:"'Cinzel',serif",fontSize:10,color:String(itaxForm.spouse)===v?"#8a5e18":"var(--md)",cursor:"pointer"}}>{lbl}</div>
                        ))}
                      </div>
                      {[["扶養子女人數（一般）","children","0"],["扶養父母人數","parents","0"]].map(([lbl,k,ph])=>(
                        <div key={k}><div className="calc-lbl">{lbl}</div><input className="calc-inp" type="number" placeholder={ph} value={itaxForm[k]} onChange={e=>setItaxForm(p=>({...p,[k]:e.target.value}))}/></div>
                      ))}
                      {checkBox("salary","有薪資所得（薪資特別扣除額 21.8 萬）")}
                      {checkBox("rent","有租屋支出（房租特別扣除額上限 18 萬）")}
                      <div className="calc-lbl" style={{marginTop:14}}>6歲以下幼兒人數（學前特別扣除額）</div>
                      <div style={{fontSize:12,color:"var(--md)",marginBottom:6}}>第1名 15 萬・第2名以上各 22.5 萬</div>
                      <input className="calc-inp" type="number" placeholder="0" value={itaxForm.youngKids||""} onChange={e=>setItaxForm(p=>({...p,youngKids:e.target.value}))}/>
                      <div className="calc-lbl">需長照人數（長期照顧特別扣除額，每人 18 萬）</div>
                      <input className="calc-inp" type="number" placeholder="0" value={itaxForm.ltc||""} onChange={e=>setItaxForm(p=>({...p,ltc:e.target.value}))}/>
                    </div>
                    {grossIncome>0&&(
                      <div className="calc-result" style={{border:"1px solid rgba(42,94,168,.2)"}}>
                        <div className="calc-res-hd" style={{color:"#2a5ea8"}}>試算結果（114 年度・115年5月申報）</div>
                        {[
                          ["全年所得總額",`NT$ ${grossIncome.toLocaleString()}`],
                          ["免稅額",`- NT$ ${exempt.toLocaleString()}`],
                          ["標準扣除額",`- NT$ ${stdDeduct.toLocaleString()}`],
                          ...(salaryDeduct>0?[["薪資所得特別扣除額",`- NT$ ${salaryDeduct.toLocaleString()}`]]:[]),
                          ...(childDeduct>0?[["幼兒學前特別扣除額",`- NT$ ${childDeduct.toLocaleString()}`]]:[]),
                          ...(ltcDeduct>0?[["長期照顧特別扣除額",`- NT$ ${ltcDeduct.toLocaleString()}`]]:[]),
                          ...(rentDeduct>0?[["房租支出特別扣除額",`- NT$ ${rentDeduct.toLocaleString()}`]]:[]),
                          ["所得淨額",`NT$ ${netIncome.toLocaleString()}`],
                          ["適用稅率",`${(bracket.rate*100).toFixed(0)}%`],
                        ].map(([l,v],i)=>(
                          <div className="calc-res-row" key={i}>
                            <div className="calc-res-lbl">{l}</div>
                            <div className="calc-res-val">{v}</div>
                          </div>
                        ))}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,padding:"12px 14px",background:"rgba(42,94,168,.08)",borderRadius:10,border:"1px solid rgba(42,94,168,.15)"}}>
                          <div style={{fontSize:14,color:"#2a5ea8",fontWeight:700}}>估算應繳稅額</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:"#2a5ea8"}}>NT$ {tax.toLocaleString()}</div>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginTop:8}}>
                          <div style={{fontSize:13,color:"var(--md)"}}>實際有效稅率</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:"#2c1e0f"}}>{effRate}%</div>
                        </div>
                        <div style={{marginTop:12,padding:"12px 14px",background:"var(--card2)",borderRadius:10}}>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:8}}>114年度課稅級距表</div>
                          {[["59 萬以下","5%",0.05],["59～133 萬","12%",0.12],["133～266 萬","20%",0.20],["266～498 萬","30%",0.30],["498 萬以上","40%",0.40]].map(([range,rate,r],i)=>(
                            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<4?"1px solid rgba(140,110,80,.1)":"none"}}>
                              <div style={{fontSize:12,color:"#6b5040"}}>{range}</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:bracket.rate===r?"#2a5ea8":"#2c1e0f"}}>{rate}</div>
                            </div>
                          ))}
                        </div>
                        <div className="calc-note" style={{background:"rgba(42,94,168,.06)",color:"#2a5ea8",marginTop:10}}>以上僅供參考，實際稅額依個人申報情況及各項列舉扣除額而異。長照扣除額設有排富條款（稅率20%以上者不適用）。</div>
                      </div>
                    )}
                  </>
                  );
                })()}

                {/* 房地合一稅 */}
                {calcMode==="realestate2"&&(()=>{
                  const sellPrice=Number(reit2Form?.sellPrice)||0;
                  const buyPrice=Number(reit2Form?.buyPrice)||0;
                  const cost=Number(reit2Form?.cost)||0;
                  const holdYears=Number(reit2Form?.holdYears)||0;
                  const isPersonal=reit2Form?.isPersonal!==false;
                  const profit=Math.max(0,sellPrice-buyPrice-cost);
                  // 房地合一稅率（個人）
                  let rate=0,rateLabel="";
                  if(isPersonal){
                    if(holdYears<2){rate=0.45;rateLabel="45%（持有未滿2年）";}
                    else if(holdYears<5){rate=0.35;rateLabel="35%（持有2～5年）";}
                    else if(holdYears<10){rate=0.20;rateLabel="20%（持有5～10年）";}
                    else{rate=0.15;rateLabel="15%（持有10年以上）";}
                    // 自住優惠：持有且設籍6年以上可減免，最高免稅400萬
                    if(reit2Form?.selfUse&&holdYears>=6){
                      const exempt=Math.min(profit,4000000);
                      const taxable=Math.max(0,profit-exempt);
                      const tax=Math.round(taxable*0.1);
                      return(<>
                        <div className="calc-card">
                          <div className="calc-title">🏢 房地合一稅試算（2.0）</div>
                          <div className="calc-desc">2021年7月後交易適用。自住優惠：設籍並持有6年以上，獲利400萬內免稅，超過部分課10%。</div>
                          {renderReit2Form(reit2Form,setReit2Form)}
                        </div>
                        <div className="calc-result" style={{border:"1px solid rgba(42,138,90,.25)"}}>
                          <div className="calc-res-hd" style={{color:"#1a6e42"}}>✓ 自住優惠適用</div>
                          {[["售價","NT$ "+sellPrice.toLocaleString()],["取得成本","- NT$ "+buyPrice.toLocaleString()],["改良費用","- NT$ "+cost.toLocaleString()],["獲利","NT$ "+profit.toLocaleString()],["免稅額（400萬上限）","- NT$ "+exempt.toLocaleString()],["課稅所得","NT$ "+taxable.toLocaleString()],["稅率","10%"]].map(([l,v],i)=>(<div className="calc-res-row" key={i}><div className="calc-res-lbl">{l}</div><div className="calc-res-val">{v}</div></div>))}
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,padding:"12px 14px",background:"rgba(42,138,90,.08)",borderRadius:10}}>
                            <div style={{fontSize:14,color:"#1a6e42",fontWeight:700}}>應繳房地合一稅</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:"#1a6e42"}}>NT$ {tax.toLocaleString()}</div>
                          </div>
                        </div>
                      </>);
                    }
                  }
                  // 非自住或公司
                  if(!isPersonal){
                    if(holdYears<2){rate=0.45;rateLabel="45%（持有未滿2年）";}
                    else{rate=0.20;rateLabel="20%（持有2年以上）";}
                  }
                  const tax=Math.round(profit*rate);
                  return(<>
                    <div className="calc-card">
                      <div className="calc-title">🏢 房地合一稅試算（2.0）</div>
                      <div className="calc-desc">2021年7月後交易適用。依持有年數課稅：未滿2年45%、2~5年35%、5~10年20%、10年以上15%。自住6年以上優惠稅率10%。</div>
                      {renderReit2Form(reit2Form,setReit2Form)}
                    </div>
                    {sellPrice>0&&(
                      <div className="calc-result" style={{border:`1px solid ${profit>0?"rgba(176,80,96,.25)":"rgba(42,138,90,.25)"}`}}>
                        <div className="calc-res-hd" style={{color:profit>0?"#b05060":"#1a6e42"}}>{profit>0?"⚠ 有獲利需繳稅":"✓ 無獲利免稅"}</div>
                        {[["成交售價","NT$ "+sellPrice.toLocaleString()],["取得成本","- NT$ "+buyPrice.toLocaleString()],["改良/仲介費用","- NT$ "+cost.toLocaleString()],["課稅獲利","NT$ "+profit.toLocaleString()],["持有年數",holdYears+"年"],["適用稅率",rateLabel]].map(([l,v],i)=>(<div className="calc-res-row" key={i}><div className="calc-res-lbl">{l}</div><div className="calc-res-val">{v}</div></div>))}
                        {profit>0&&(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,padding:"12px 14px",background:"rgba(176,80,96,.08)",borderRadius:10}}>
                          <div style={{fontSize:14,color:"#b05060",fontWeight:700}}>應繳房地合一稅</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:"#b05060"}}>NT$ {tax.toLocaleString()}</div>
                        </div>)}
                        <div className="calc-note" style={{background:"rgba(154,110,32,.06)",color:"#8a5e18",marginTop:10}}>持有越久稅率越低。善用自住設籍規劃，可大幅降低稅負。</div>
                      </div>
                    )}
                  </>);
                })()}

                {/* 匯率換算 */}
                {calcMode==="fx"&&(
                  <div className="calc-card">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div className="calc-title" style={{marginBottom:0}}>💱 匯率換算</div>
                      <button onClick={refreshFxRates} disabled={fxLoading} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:20,border:"1px solid rgba(154,110,32,.3)",background:"rgba(154,110,32,.08)",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:1,color:"#8a5e18",cursor:fxLoading?"not-allowed":"pointer",opacity:fxLoading?0.6:1}}>
                        <span style={{display:"inline-block",animation:fxLoading?"spin 1s linear infinite":"none"}}>↻</span>
                        {fxLoading?"更新中…":"即時匯率"}
                      </button>
                    </div>
                    <div className="calc-desc">{fxUpdatedAt?`已於今日 ${fxUpdatedAt}`:`參考匯率（點擊「即時匯率」更新）`}</div>
                    <div className="calc-lbl">金額</div>
                    <input className="calc-inp" type="number" placeholder="輸入金額" value={fxAmount} onChange={e=>setFxAmount(e.target.value)}/>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginTop:12}}>
                      <select className="calc-inp" style={{flex:1}} value={fxFrom} onChange={e=>setFxFrom(e.target.value)}>
                        {Object.keys(fxRates).map(k=><option key={k} value={k}>{k}</option>)}
                      </select>
                      <div style={{fontSize:20,color:"var(--md)",flexShrink:0}}>→</div>
                      <select className="calc-inp" style={{flex:1}} value={fxTo} onChange={e=>setFxTo(e.target.value)}>
                        {Object.keys(fxRates).map(k=><option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    {fxAmount&&(
                      <div style={{marginTop:16,padding:"16px",background:"rgba(154,110,32,.08)",borderRadius:12,textAlign:"center"}}>
                        <div style={{fontSize:13,color:"var(--md)",marginBottom:6}}>{Number(fxAmount).toLocaleString()} {fxFrom} =</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:"#8a5e18"}}>
                          {(Number(fxAmount)/fxRates[fxFrom]*fxRates[fxTo]).toLocaleString(undefined,{maximumFractionDigits:2})} {fxTo}
                        </div>
                        <div style={{fontSize:11,color:"var(--md)",marginTop:6}}>參考匯率 · 實際以銀行牌告為準</div>
                      </div>
                    )}
                    <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {Object.entries(fxRates).filter(([k])=>k!=="USD").map(([k,v])=>(
                        <div key={k} style={{padding:"10px 12px",background:"var(--card2)",borderRadius:10}}>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"var(--md)",marginBottom:3}}>1 USD</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:"#2c1e0f"}}>{v} {k}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 72法則 */}
                {calcMode==="rule72"&&(
                  <div className="calc-card">
                    <div className="calc-title">⚡ 72 法則</div>
                    <div className="calc-desc">資金翻倍所需年數 = 72 ÷ 年化報酬率。快速評估投資效率。</div>
                    <div className="calc-lbl">年化報酬率 (%)</div>
                    <input className="calc-inp" type="number" placeholder="例如：6" value={rule72Rate} onChange={e=>setRule72Rate(e.target.value)}/>
                    {rule72Rate&&Number(rule72Rate)>0&&(
                      <div style={{marginTop:16}}>
                        <div style={{padding:"16px",background:"rgba(154,110,32,.08)",borderRadius:12,textAlign:"center",marginBottom:12}}>
                          <div style={{fontSize:13,color:"var(--md)",marginBottom:6}}>報酬率 {rule72Rate}%，資金翻倍需要</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:36,fontWeight:700,color:"#8a5e18"}}>{(72/Number(rule72Rate)).toFixed(1)} 年</div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          {[3,4,5,6,7,8,10,12].map(r=>(
                            <div key={r} style={{padding:"10px 12px",background:Number(rule72Rate)===r?"rgba(154,110,32,.12)":"var(--card2)",border:`1px solid ${Number(rule72Rate)===r?"rgba(154,110,32,.3)":"var(--bl)"}`,borderRadius:10,cursor:"pointer"}} onClick={()=>setRule72Rate(String(r))}>
                              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"var(--md)",marginBottom:3}}>{r}% 報酬率</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,color:"#2c1e0f"}}>{(72/r).toFixed(1)} 年翻倍</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 通膨侵蝕 */}
                {calcMode==="inflation"&&(
                  <div className="calc-card">
                    <div className="calc-title">📉 通膨侵蝕計算</div>
                    <div className="calc-desc">計算一筆錢在通膨下的實際購買力，了解不投資的隱形損失。</div>
                    {[["現在的金額 (TWD)","amount","例如：1000000"],["年通膨率 (%)","rate","例如：2"],["年數","years","例如：20"]].map(([lbl,k,ph])=>(
                      <div key={k}><div className="calc-lbl">{lbl}</div><input className="calc-inp" type="number" placeholder={ph} value={inflForm[k]} onChange={e=>setInflForm(p=>({...p,[k]:e.target.value}))}/></div>
                    ))}
                    {inflForm.amount&&inflForm.years&&(
                      <div style={{marginTop:16,padding:"16px",background:"rgba(176,80,96,.06)",borderRadius:12,border:"1px solid rgba(176,80,96,.2)"}}>
                        <div style={{fontSize:13,color:"#6b5040",marginBottom:8}}>現在 NT$ {Number(inflForm.amount).toLocaleString()} 的購買力，{inflForm.years} 年後只剩</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:"#b05060",marginBottom:8}}>
                          NT$ {Math.round(Number(inflForm.amount)/Math.pow(1+Number(inflForm.rate)/100,Number(inflForm.years))).toLocaleString()}
                        </div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#b05060"}}>
                          縮水 NT$ {Math.round(Number(inflForm.amount)-Number(inflForm.amount)/Math.pow(1+Number(inflForm.rate)/100,Number(inflForm.years))).toLocaleString()}
                        </div>
                        <div style={{marginTop:10,fontSize:12,color:"#6b5040",lineHeight:1.7,padding:"10px",background:"rgba(255,252,245,.6)",borderRadius:8}}>
                          💡 不投資，通膨每年默默侵蝕你的財富。透過年化 {Number(inflForm.rate)+2}% 以上的配置，才能真正保值。
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 回本年試算 */}
                {calcMode==="irr"&&(
                  <>
                    <div className="calc-card">
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                        <div className="calc-title" style={{marginBottom:0}}>📊 IRR 內部報酬率試算</div>
                        <button onClick={()=>{setIrrForm({mode:"insurance",payYears:"2",annualPremium:"25000",rows:[{year:"3",value:"42000"},{year:"5",value:"55000"},{year:"10",value:"82000"},{year:"15",value:"124000"},{year:"20",value:"180000"}]});setIrrResult(null);}} style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:1,color:"#9a6e20",background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",whiteSpace:"nowrap"}}>填入範例</button>
                      </div>
                      <div className="calc-desc">輸入保單繳費條件與各年現金價值，計算真實年化報酬率（IRR）。</div>
                      <div className="calc-lbl">繳費年期（年）</div>
                      <input className="calc-inp" type="number" placeholder="例如：2" value={irrForm.payYears} onChange={e=>setIrrForm(p=>({...p,payYears:e.target.value}))}/>
                      <div className="calc-lbl">年繳保費（USD）</div>
                      <input className="calc-inp" type="number" placeholder="例如：25000" value={irrForm.annualPremium} onChange={e=>setIrrForm(p=>({...p,annualPremium:e.target.value}))}/>

                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,marginBottom:8}}>
                        <div className="calc-lbl" style={{marginTop:0,marginBottom:0}}>各年現金價值（USD）</div>
                        <button onClick={()=>setIrrForm(p=>({...p,rows:[...p.rows,{year:"",value:""}]}))} style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#8a5e18",background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>＋ 新增</button>
                      </div>
                      <div style={{fontSize:12,color:"var(--md)",marginBottom:10,lineHeight:1.6}}>填入你想比較的年份與當年的保單現金價值，可跳年填入（例如只填第5、10、20年）。</div>
                      <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr auto",gap:"6px 8px",alignItems:"center",marginBottom:8}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"var(--md)",letterSpacing:1}}>  </div>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"var(--md)",letterSpacing:1}}>第幾年</div>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"var(--md)",letterSpacing:1}}>現金價值 (USD)</div>
                        <div/>
                        {irrForm.rows.map((row,i)=>(
                          <React.Fragment key={i}>
                            <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"var(--md)",textAlign:"center"}}>{i+1}</div>
                            <input className="calc-inp" type="number" placeholder="例：5" value={row.year} onChange={e=>setIrrForm(p=>({...p,rows:p.rows.map((r,j)=>j===i?{...r,year:e.target.value}:r)}))} style={{padding:"10px 12px",fontSize:14}}/>
                            <input className="calc-inp" type="number" placeholder="例：55000" value={row.value} onChange={e=>setIrrForm(p=>({...p,rows:p.rows.map((r,j)=>j===i?{...r,value:e.target.value}:r)}))} style={{padding:"10px 12px",fontSize:14}}/>
                            <button onClick={()=>setIrrForm(p=>({...p,rows:p.rows.filter((_,j)=>j!==i)}))} style={{width:28,height:28,borderRadius:8,border:"1px solid rgba(176,80,96,.2)",background:"transparent",color:"#b05060",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                          </React.Fragment>
                        ))}
                      </div>
                      <button className="calc-btn" onClick={calcIRR} style={{marginTop:8}}>計算 IRR →</button>
                    </div>

                    {irrResult&&(
                      <div className="calc-result" style={{border:`1px solid ${Number(irrResult.pct)>=5?"rgba(42,138,90,.25)":Number(irrResult.pct)>=3?"rgba(154,110,32,.25)":"rgba(176,80,96,.25)"}`}}>
                        <div style={{textAlign:"center",padding:"16px 0 12px"}}>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:3,color:"var(--md)",textTransform:"uppercase",marginBottom:8}}>年化內部報酬率 IRR</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:42,fontWeight:700,color:Number(irrResult.pct)>=5?"#1a6e42":Number(irrResult.pct)>=3?"#8a5e18":"#b05060"}}>{irrResult.pct}%</div>
                          <div style={{fontSize:12,color:"var(--md)",marginTop:6}}>{Number(irrResult.pct)>=6?"優秀 — 高於一般定存與債券":Number(irrResult.pct)>=4?"良好 — 具競爭力的長期報酬":Number(irrResult.pct)>=2?"普通 — 略優於通膨":"偏低 — 建議重新評估配置"}</div>
                        </div>
                        <div style={{height:1,background:"var(--bl)",margin:"0 0 12px"}}/>
                        <div style={{marginBottom:12}}>
                          {[
                            ["總投入",`USD ${irrResult.totalIn.toLocaleString()}`],
                            ["最終現金價值",`USD ${(irrResult.cfs[irrResult.cfs.length-1]||0).toLocaleString()}`],
                          ].map(([l,v])=>(
                            <div className="calc-res-row" key={l}><div className="calc-res-lbl">{l}</div><div className="calc-res-val">{v}</div></div>
                          ))}
                        </div>
                        <div className="calc-note" style={{background:"rgba(154,110,32,.08)",color:"#8a5e18",marginTop:12}}>IRR 為稅前估算值，實際報酬受時間、匯率及保單條款影響。建議諮詢凱特顧問進行完整試算。</div>
                      </div>
                    )}
                  </>
                )}

                {calcMode==="gift"&&(
                  <>
                    <div className="calc-card">
                      <div className="calc-title">🎁 贈與稅試算（2025）</div>
                      <div className="calc-desc">每位贈與人每年免稅額 244 萬。課稅級距：2,811 萬以下 10%、2,811～5,621 萬 15%、超過 5,621 萬 20%。</div>
                      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
                        <button onClick={()=>{setGiftForm({totalGift:"5000000",donors:"2",wedding:false,spouseGift:false});setGiftResult(null);}} style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:1,color:"#9a6e20",background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>填入範例數字</button>
                      </div>
                      <div className="calc-lbl">本年度贈與總額（TWD）</div>
                      <div style={{fontSize:12,color:"var(--md)",marginBottom:6}}>填入贈與人本年度對所有受贈人的贈與合計</div>
                      <input className="calc-inp" type="number" placeholder="例如：5000000" value={giftForm.totalGift} onChange={e=>setGiftForm(p=>({...p,totalGift:e.target.value}))}/>
                      <div className="calc-lbl">贈與人人數</div>
                      <div style={{fontSize:12,color:"var(--md)",marginBottom:6}}>免稅額以「每位贈與人」計算，夫妻各有 244 萬額度</div>
                      <div style={{display:"flex",gap:8}}>
                        {["1","2"].map(v=>(
                          <div key={v} onClick={()=>setGiftForm(p=>({...p,donors:v}))} style={{flex:1,padding:"10px",textAlign:"center",borderRadius:10,border:`1px solid ${giftForm.donors===v?"rgba(154,110,32,.4)":"var(--bl)"}`,background:giftForm.donors===v?"rgba(154,110,32,.1)":"transparent",fontFamily:"'Cinzel',serif",fontSize:11,color:giftForm.donors===v?"#8a5e18":"var(--md)",cursor:"pointer"}}>{v==="1"?"1 人（單獨贈與）":"2 人（夫妻共同贈與）"}</div>
                        ))}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,padding:"12px 14px",background:"var(--card2)",borderRadius:10,cursor:"pointer"}} onClick={()=>setGiftForm(p=>({...p,wedding:!p.wedding}))}>
                        <div style={{width:20,height:20,borderRadius:6,border:`1px solid ${giftForm.wedding?"var(--gold)":"var(--bl)"}`,background:giftForm.wedding?"var(--gold)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0}}>{giftForm.wedding?"✓":""}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,color:"var(--td)"}}>子女婚嫁加碼免稅（每位贈與人 +100 萬）</div>
                          <div style={{fontSize:11,color:"var(--md)",marginTop:2}}>婚嫁登記前後 6 個月內贈與適用</div>
                        </div>
                      </div>
                      <button className="calc-btn" onClick={()=>{
                        const total=Number(giftForm.totalGift)||0;
                        const donors=Number(giftForm.donors)||1;
                        const weddingBonus=giftForm.wedding?1000000*donors:0;
                        const exempt=2440000*donors+weddingBonus;
                        const taxBase=Math.max(0,total-exempt);
                        const t1=28110000,t2=56210000;
                        let tax=0;
                        if(taxBase<=t1) tax=Math.round(taxBase*0.1);
                        else if(taxBase<=t2) tax=Math.round(t1*0.1+(taxBase-t1)*0.15);
                        else tax=Math.round(t1*0.1+(t2-t1)*0.15+(taxBase-t2)*0.2);
                        const rate=taxBase<=t1?10:taxBase<=t2?15:20;
                        const yearsToZeroTax=total>exempt&&exempt>0?Math.ceil(total/exempt):1;
                        setGiftResult({total,exempt,taxBase,tax,rate,afterTax:total-tax,weddingBonus,donors,yearsToZeroTax,annualExempt:2440000*donors});
                      }}>試算贈與稅 →</button>
                    </div>
                    {giftResult&&(
                      <div className="calc-result" style={{border:"1px solid rgba(154,110,32,.25)"}}>
                        <div className="calc-res-hd" style={{color:"#8a5e18"}}>贈與稅試算結果</div>
                        {[
                          ["贈與總額",`NT$ ${giftResult.total.toLocaleString()}`],
                          ["年度免稅額",`- NT$ ${(2440000*giftResult.donors).toLocaleString()}`],
                          ...(giftResult.weddingBonus>0?[["婚嫁加碼免稅",`- NT$ ${giftResult.weddingBonus.toLocaleString()}`]]:[]),
                          ["課稅贈與淨額",`NT$ ${giftResult.taxBase.toLocaleString()}`],
                          ["適用稅率",`${giftResult.rate}%`],
                        ].map(([l,v],i)=>(
                          <div className="calc-res-row" key={i} style={{opacity:v.startsWith("-")?0.75:1}}>
                            <div className="calc-res-lbl" style={{color:v.startsWith("-")?"var(--green)":"inherit"}}>{l}</div>
                            <div className="calc-res-val" style={{color:v.startsWith("-")?"var(--green)":"inherit"}}>{v}</div>
                          </div>
                        ))}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,padding:"12px 14px",background:giftResult.tax===0?"rgba(42,138,90,.08)":"rgba(154,110,32,.08)",borderRadius:10,border:`1px solid ${giftResult.tax===0?"rgba(42,138,90,.2)":"rgba(154,110,32,.2)"}`}}>
                          <div style={{fontSize:14,color:giftResult.tax===0?"#1a6e42":"#8a5e18",fontWeight:700}}>應繳贈與稅</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:giftResult.tax===0?"#1a6e42":"#8a5e18"}}>NT$ {giftResult.tax.toLocaleString()}</div>
                        </div>
                        {giftResult.tax===0?(
                          <div className="calc-note" style={{background:"rgba(42,138,90,.06)",color:"#1a6e42",marginTop:10}}>✓ 未超過免稅額，本次贈與免徵贈與稅。</div>
                        ):(
                          <>
                            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginTop:8}}>
                              <div style={{fontSize:13,color:"var(--md)"}}>受贈人實得</div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:"#1a6e42"}}>NT$ {giftResult.afterTax.toLocaleString()}</div>
                            </div>
                            <div style={{marginTop:10,padding:"12px 14px",background:"rgba(154,110,32,.06)",borderRadius:10,border:"1px solid rgba(154,110,32,.15)"}}>
                              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:8}}>節稅規劃建議</div>
                              <div style={{fontSize:12,color:"var(--td)",lineHeight:1.8}}>
                                若改為每年分批贈與，每位贈與人年度免稅額 NT$ {giftResult.annualExempt.toLocaleString()}，本次贈與金額約需 <strong>{giftResult.yearsToZeroTax} 年</strong>分批可達免稅。
                              </div>
                            </div>
                            <div className="calc-note" style={{background:"rgba(154,110,32,.08)",color:"#8a5e18",marginTop:10}}>超額贈與繳 10% 贈與稅，可省下未來 20% 遺產稅，合理規劃可達節稅效果。</div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}

                {calcMode==="breakeven"&&(
                  <>
                    <div className="calc-card">
                      <div className="calc-title">🔄 回本年試算</div>
                      <div className="calc-desc">試算保單或投資在不同報酬率下的預估回本年份。</div>
                      {[["年繳保費/投入金額 (TWD)","premium","例如：25000"],["繳費年期","payYears","例如：2"],["預估年化報酬率 (%)","targetRate","例如：6"]].map(([lbl,k,ph])=>(
                        <div key={k}><div className="calc-lbl">{lbl}</div><input className="calc-inp" type="number" placeholder={ph} value={breakevenForm[k]} onChange={e=>setBreakevenForm(p=>({...p,[k]:e.target.value}))}/></div>
                      ))}
                      <button className="calc-btn" onClick={calcBreakeven}>試算回本年 →</button>
                    </div>
                    {breakevenResult&&(
                      <div className="calc-result" style={{border:"1px solid rgba(42,138,90,.25)"}}>
                        <div className="calc-res-hd" style={{color:"#1a6e42"}}>預估第 {breakevenResult.breakYr} 年回本</div>
                        <div className="calc-res-row">
                          <div className="calc-res-lbl">總投入成本</div>
                          <div className="calc-res-val">NT$ {breakevenResult.totalCost.toLocaleString()}</div>
                        </div>
                        <div style={{marginTop:12}}>
                          {breakevenResult.projections.map((p,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"var(--md)",width:36,flexShrink:0}}>第{p.yr}年</div>
                              <div style={{flex:1,height:6,background:"var(--card2)",borderRadius:3,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${Math.min(100,(p.cv/breakevenResult.totalCost)*100)}%`,background:p.cv>=breakevenResult.totalCost?"#1a6e42":"rgba(154,110,32,.5)",borderRadius:3,transition:"width .3s"}}/>
                              </div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:p.cv>=breakevenResult.totalCost?"#1a6e42":"var(--md)",width:80,textAlign:"right",flexShrink:0}}>{Math.round(p.cv/breakevenResult.totalCost*100)}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>
          </div>
        )}


        {/* ════ ADVISOR ════ */}
        {tab==="advisor"&&(
          <div>
            <div className="ph">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                <div>
                  <div className="ph-en">Kate's Advisor</div>
                  <div className="ph-t">凱特顧問</div>
                </div>
                <button onClick={()=>setShowMsg(true)} style={{marginTop:8,background:"var(--gold-dim)",border:"1px solid rgba(200,168,75,.3)",borderRadius:20,padding:"8px 16px",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--gold)",cursor:"pointer"}}>💬 線上諮詢</button>
              </div>
            </div>
            <div className="sub-tabs">
              {[{id:"qa",label:"🤖 AI 財商"},{id:"tools",label:"📋 項目資訊"},{id:"notifs",label:"🔔 通知"},...(isKate?[{id:"picks",label:"✦ 後台推薦"},{id:"prodmgr",label:"✏️ 產品管理"}]:[])].map(t=>(
                <div key={t.id} className={`st ${advisorSub===t.id?"active":""}`} onClick={()=>setAdvisorSub(t.id)} style={{position:"relative"}}>
                  {t.id==="notifs"&&notifs.filter(n=>n.unread).length>0&&<span style={{position:"absolute",top:4,right:4,minWidth:14,height:14,borderRadius:7,background:"var(--rose)",color:"#fff",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,padding:"0 3px"}}>{notifs.filter(n=>n.unread).length}</span>}
                  {t.label}
                </div>
              ))}
            </div>

            {/* ─ 通知中心 ─ */}
            {advisorSub==="notifs"&&(
              <div style={{paddingTop:8,paddingBottom:32}}>

                {/* 分類篩選 */}
                {(()=>{
                  const taxItems=notifs.filter(n=>n.isTax);
                  const payItems=notifs.filter(n=>n.isPayment);
                  const otherItems=notifs.filter(n=>!n.isTax&&!n.isPayment);
                  const filtered=notifFilter==="tax"?taxItems:notifFilter==="payment"?payItems:notifFilter==="other"?otherItems:notifs;
                  const unreadCount=filtered.filter(n=>n.unread).length;
                  return(
                    <>
                      {/* 頂部統計 */}
                      <div style={{margin:"0 16px 14px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                        {[
                          {label:"稅務提醒",count:taxItems.length,urgent:taxItems.filter(n=>n.cls==="ni-rose").length,icon:"🗓️",filter:"tax"},
                          {label:"保單繳費",count:payItems.length,urgent:payItems.filter(n=>n.cls==="ni-rose").length,icon:"📅",filter:"payment"},
                          {label:"其他通知",count:otherItems.length,urgent:0,icon:"🔔",filter:"other"},
                        ].map(item=>(
                          <div key={item.filter} onClick={()=>setNotifFilter(notifFilter===item.filter?"all":item.filter)} style={{background:notifFilter===item.filter?"rgba(154,110,32,.1)":"var(--card)",border:`1px solid ${notifFilter===item.filter?"rgba(154,110,32,.35)":"var(--bl)"}`,borderRadius:12,padding:"12px 10px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
                            <div style={{fontSize:18,marginBottom:4}}>{item.icon}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:item.urgent>0?"#b05060":"var(--td)"}}>{item.count}</div>
                            <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:"var(--md)",textTransform:"uppercase",marginTop:2,lineHeight:1.4}}>{item.label}</div>
                            {item.urgent>0&&<div style={{marginTop:4,fontFamily:"'Cinzel',serif",fontSize:7,color:"#b05060",background:"rgba(176,80,96,.1)",borderRadius:10,padding:"2px 6px"}}>⚠ {item.urgent} 緊急</div>}
                          </div>
                        ))}
                      </div>

                      {/* 全部已讀 & 篩選標題 */}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"0 16px 10px"}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase"}}>
                          {notifFilter==="all"?"所有通知":notifFilter==="tax"?"稅務提醒":notifFilter==="payment"?"保單繳費":"其他通知"}
                          {unreadCount>0&&<span style={{marginLeft:6,background:"var(--rose)",color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:8}}>{unreadCount}</span>}
                        </div>
                        <button onClick={()=>setNotifs(p=>p.map(n=>({...n,unread:false})))} style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:"#8a5e18",background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.2)",borderRadius:8,padding:"5px 10px",cursor:"pointer"}}>全部已讀</button>
                      </div>

                      {/* 通知列表 */}
                      {filtered.length===0?(
                        <div style={{margin:"40px 16px",textAlign:"center"}}>
                          <div style={{fontSize:32,marginBottom:12}}>✓</div>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"var(--md)"}}>目前沒有通知</div>
                        </div>
                      ):(
                        filtered.map((n,i)=>{
                          const isTaxActive=n.isTax&&n.title.includes("進行中");
                          const isUrgent=n.cls==="ni-rose";
                          return(
                            <div key={n.id||i} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,unread:false}:x))}
                              style={{margin:"0 16px 10px",background:n.unread?"rgba(200,168,75,.05)":"var(--card)",border:`1px solid ${isUrgent?"rgba(176,80,96,.25)":n.unread?"rgba(200,168,75,.2)":"var(--bl)"}`,borderRadius:14,padding:"14px 16px",cursor:"pointer",transition:"all .2s",position:"relative"}}>
                              {n.unread&&<div style={{position:"absolute",top:14,right:14,width:7,height:7,borderRadius:"50%",background:"var(--rose)"}}/>}
                              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                                <div style={{width:40,height:40,borderRadius:11,background:isUrgent?"rgba(176,80,96,.12)":isTaxActive?"rgba(42,138,90,.12)":"rgba(154,110,32,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{n.icon}</div>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:13,fontWeight:600,color:isUrgent?"#b05060":"var(--td)",marginBottom:4,lineHeight:1.4}}>{n.title}</div>
                                  <div style={{fontSize:12,color:"var(--md)",lineHeight:1.65}}>{n.desc}</div>
                                  <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
                                    <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:"var(--md)",textTransform:"uppercase",background:"var(--card2)",padding:"2px 8px",borderRadius:10,border:"1px solid var(--bl)"}}>{n.time}</div>
                                    {n.isTax&&<div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:"#8a5e18",background:"rgba(154,110,32,.1)",padding:"2px 8px",borderRadius:10}}>稅務</div>}
                                    {n.isPayment&&<div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:"#2a8a5a",background:"rgba(42,138,90,.1)",padding:"2px 8px",borderRadius:10}}>保單</div>}
                                  </div>
                                </div>
                              </div>
                              {/* 快速行動按鈕 */}
                              {n.isTax&&(
                                <div style={{marginTop:10,display:"flex",gap:8}}>
                                  <button onClick={e=>{e.stopPropagation();setTab("calc");setCalcMode(n.id?.includes("income")?"incometax":n.id?.includes("estate")?"estate":n.id?.includes("gift")?"gift":"incometax");}} style={{flex:1,padding:"8px",borderRadius:8,border:"1px solid rgba(154,110,32,.25)",background:"rgba(154,110,32,.08)",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:"#8a5e18",cursor:"pointer"}}>前往試算 →</button>
                                  <button onClick={e=>{e.stopPropagation();setShowMsg(true);}} style={{flex:1,padding:"8px",borderRadius:8,border:"1px solid var(--bl)",background:"transparent",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:"var(--md)",cursor:"pointer"}}>諮詢凱特</button>
                                </div>
                              )}
                              {n.isPayment&&(
                                <div style={{marginTop:10}}>
                                  <button onClick={e=>{e.stopPropagation();setTab("assets");setAssetsSub("holdings");setHoldingsTab("insurance");}} style={{width:"100%",padding:"8px",borderRadius:8,border:"1px solid rgba(42,138,90,.25)",background:"rgba(42,138,90,.08)",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:"#1a6e42",cursor:"pointer"}}>查看保單詳情 →</button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}

                      {/* 稅務年度行事曆快速預覽 */}
                      <div className="sec" style={{marginTop:8}}>年度稅務行事曆</div>
                      {(()=>{
                        const today=new Date();
                        const year=today.getFullYear();
                        return TAX_CALENDAR.map(t=>{
                          const start=new Date(year,t.month-1,t.day);
                          const end=new Date(year,t.endMonth-1,t.endDay);
                          const isActive=today>=start&&today<=end;
                          const isPast=today>end;
                          const daysToStart=Math.ceil((start-today)/(1000*60*60*24));
                          const daysToEnd=Math.ceil((end-today)/(1000*60*60*24));
                          return(
                            <div key={t.key} style={{display:"flex",gap:10,alignItems:"center",margin:"0 16px 8px",padding:"12px 14px",background:"var(--card)",border:`1px solid ${isActive?"rgba(42,138,90,.2)":"var(--bl)"}`,borderRadius:12,opacity:isPast?0.4:1}}>
                              <div style={{fontSize:20,width:32,textAlign:"center",flexShrink:0}}>{t.icon}</div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:13,fontWeight:600,color:"var(--td)",marginBottom:2}}>{t.name}</div>
                                <div style={{fontSize:11,color:"var(--md)"}}>{year}/{t.month}/{t.day} — {year}/{t.endMonth}/{t.endDay}</div>
                              </div>
                              <div style={{flexShrink:0,minWidth:48,textAlign:"center"}}>
                                {isPast?(
                                  <div style={{fontFamily:"'Cinzel',serif",fontSize:8,color:"var(--md)"}}>已截止</div>
                                ):isActive?(
                                  <div style={{background:"rgba(42,138,90,.1)",border:"1px solid rgba(42,138,90,.2)",borderRadius:8,padding:"4px 8px"}}>
                                    <div style={{fontFamily:"'Cinzel',serif",fontSize:7,color:"#1a6e42",letterSpacing:1}}>進行中</div>
                                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:"#1a6e42"}}>{daysToEnd}天</div>
                                  </div>
                                ):(
                                  <div style={{background:daysToStart<=14?"rgba(176,80,96,.08)":"var(--card2)",border:`1px solid ${daysToStart<=14?"rgba(176,80,96,.2)":"var(--bl)"}`,borderRadius:8,padding:"4px 8px"}}>
                                    <div style={{fontFamily:"'Cinzel',serif",fontSize:7,color:daysToStart<=14?"#b05060":"var(--md)",letterSpacing:1}}>還有</div>
                                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:daysToStart<=14?"#b05060":"var(--td)"}}>{daysToStart}天</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                      <div style={{height:8}}/>
                    </>
                  );
                })()}
              </div>
            )}

            {/* ─ 凱特文章 ─ */}
            {advisorSub==="articles"&&(
              <div style={{paddingTop:12,paddingBottom:24}}>
                {/* 後台：isKate 可發布新文章 */}
                {isKate&&(
                  <div style={{margin:"0 16px 14px",background:"rgba(154,110,32,.06)",border:"1px solid rgba(154,110,32,.2)",borderRadius:14,padding:"14px 16px"}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"#9a6e20",marginBottom:8,textTransform:"uppercase"}}>✦ 後台 — 發布新文章</div>
                    <button onClick={()=>{setTab("advisor");setAdvisorSub("picks");}} style={{width:"100%",padding:"10px",border:"none",borderRadius:10,background:"linear-gradient(135deg,#9a6e20,#c8a84b)",color:"#fff",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,cursor:"pointer"}}>前往 AI 生成投資建議 →</button>
                  </div>
                )}
                {/* 已發布文章 */}
                {(publishedPicks?[{id:"pub",badge:"最新發布",title:publishedPicks.title,body:publishedPicks.body,publishedAt:publishedPicks.publishedAt||"剛剛",theme:publishedPicks.theme},...katePosts.map(k=>({...k,publishedAt:"2026/04/05"}))]:katePosts.map(k=>({...k,publishedAt:"2026/04/05"}))).map((article,i)=>(
                  <div key={article.id||i} style={{margin:"0 16px 12px",background:"var(--card)",border:"1px solid var(--bl)",borderRadius:16,overflow:"hidden",cursor:"pointer"}} onClick={()=>setScreen({type:"article",data:article})}>
                    <div style={{height:3,background:i===0?"linear-gradient(90deg,#9a6e20,#c8a84b)":"linear-gradient(90deg,#2a5ea8,#4878c0)"}}/>
                    <div style={{padding:"16px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:i===0?"#9a6e20":"#2a5ea8",textTransform:"uppercase",padding:"3px 10px",background:i===0?"rgba(154,110,32,.1)":"rgba(42,94,168,.1)",borderRadius:20}}>{article.badge||article.theme||"凱特觀點"}</div>
                        <div style={{fontSize:11,color:"var(--md)"}}>{article.publishedAt}</div>
                      </div>
                      <div style={{fontFamily:"'Noto Serif TC',serif",fontSize:16,fontWeight:600,color:"var(--td)",lineHeight:1.5,marginBottom:8}}>{article.title}</div>
                      <div style={{fontSize:13,color:"var(--md)",lineHeight:1.65}}>{(article.preview||article.body||"").slice(0,80)}…</div>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:i===0?"#9a6e20":"#2a5ea8",marginTop:12}}>閱讀全文 →</div>
                    </div>
                  </div>
                ))}
                {/* 知識主題 */}
                <div className="sec">財務知識主題</div>
                {[
                  {icon:"🏠",title:"房地產稅務規劃",desc:"房地合一稅、自住優惠、節稅時機",tag:"稅務"},
                  {icon:"📋",title:"遺產傳承規劃",desc:"遺產稅計算、保險傳承、信託配置",tag:"傳承"},
                  {icon:"🌏",title:"境外資產配置",desc:"香港、新加坡保單優勢與注意事項",tag:"配置"},
                  {icon:"💰",title:"退休金準備指南",desc:"複利效果、退休缺口試算、分紅保單",tag:"退休"},
                  {icon:"⚠️",title:"地緣政治避險",desc:"台海風險下的資產分散策略",tag:"風險"},
                ].map((t,i)=>(
                  <div key={i} style={{margin:"0 16px 10px",background:"var(--card)",border:"1px solid var(--bl)",borderRadius:14,padding:"14px 16px",display:"flex",gap:12,alignItems:"center",cursor:"pointer"}} onClick={()=>{
                    const topicMsgs={
                      "房地產稅務規劃":"我想了解房地產稅務規劃",
                      "遺產傳承規劃":"我想了解遺產傳承規劃",
                      "境外資產配置":"我想了解境外資產配置",
                      "退休金準備指南":"我想了解退休金規劃",
                      "地緣政治避險":"我想了解地緣政治風險下的資產配置",
                    };
                    const topicIntros={
                      "房地產稅務規劃":`您好！在幫您介紹房地產稅務規劃之前，我想先了解一下您的狀況 😊 請問：

1️⃣ 您目前持有幾間房產？是自住、出租，還是投資用途？
2️⃣ 有考慮在近期買賣房產嗎？
3️⃣ 持有年限大概多久了？

這樣我可以針對您的情況，給您最精準的節稅建議！`,
                      "遺產傳承規劃":`您好！傳承規劃是很多高資產家庭都在關注的議題 👨‍👩‍👧‍👦 在為您量身規劃之前，想先了解幾件事：

1️⃣ 您目前大概的資產規模（房產、保單、現金）？
2️⃣ 有幾位繼承人（配偶、子女）？
3️⃣ 資產主要在台灣，還是也有海外配置？

了解後我可以幫您估算遺產稅，並推薦最適合的傳承工具！`,
                      "境外資產配置":`您好！境外配置是分散風險的重要策略 🌏 在介紹產品之前，想先了解您的需求：

1️⃣ 您考慮配置境外的主要原因是什麼？（節稅、傳承、分散風險、還是資產保全？）
2️⃣ 預計配置的金額大概是多少？
3️⃣ 對香港、新加坡、或其他地區有偏好嗎？

這樣我可以為您推薦最合適的境外保單組合！`,
                      "退休金準備指南":`您好！退休規劃越早開始越好 🏖️ 讓我先了解一下您現在的狀況：

1️⃣ 您目前幾歲？預計幾歲退休？
2️⃣ 退休後每月希望有多少生活費（台幣）？
3️⃣ 目前已累積的退休金大約多少？（勞退、保單、存款等）

填完這些資訊，我可以幫您算出退休缺口，並推薦最有效率的補足方案！`,
                      "地緣政治避險":`您好！台海局勢是很多客戶近期最關心的議題 ⚠️ 讓我先了解您目前的配置：

1️⃣ 您的資產目前主要在哪裡？（台灣房產、台股、現金、還是已有部分海外？）
2️⃣ 最擔心的風險是什麼？（資產凍結、匯率貶值、法規變動？）
3️⃣ 希望分散到哪個地區？

了解後我可以為您設計一套具體的避險配置方案！`,
                    };
                    setShowMsg(true);
                    setTimeout(()=>{
                      const userMsg=topicMsgs[t.title]||`我想了解${t.title}`;
                      const kateMsg=topicIntros[t.title]||`您好！關於${t.title}，我想先了解您的狀況，以便給您最適合的建議。`;
                      addMsg({type:"user",text:userMsg});
                      addMsg({type:"kate",text:kateMsg});
                      setChatHistory(p=>[...p,{role:"user",content:userMsg},{role:"assistant",content:kateMsg}]);
                    },100);
                  }}>
                    <div style={{width:44,height:44,borderRadius:12,background:"rgba(154,110,32,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{t.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Noto Serif TC',serif",fontSize:14,fontWeight:600,color:"var(--td)",marginBottom:3}}>{t.title}</div>
                      <div style={{fontSize:12,color:"var(--md)",lineHeight:1.5}}>{t.desc}</div>
                    </div>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#9a6e20",background:"rgba(154,110,32,.1)",padding:"3px 8px",borderRadius:10,flexShrink:0}}>{t.tag}</div>
                  </div>
                ))}
                <div style={{height:8}}/>
              </div>
            )}

            {/* ─ 投資建議後台 (isKate picks) ─ */}
            {advisorSub==="picks"&&(
              <div style={{paddingTop:4}}>
                {/* Kate 後台 */}
                {isKate&&(
                  <>
                    <div className="sec">客戶 Onboarding</div>
                    <div style={{margin:"0 16px 14px",background:"rgba(58,170,120,.05)",border:"1px solid rgba(58,170,120,.18)",borderRadius:14,padding:16}}>
                      <div style={{fontSize:12,color:"var(--md)",marginBottom:12}}>已建檔 {onboardingList.length} 位客戶</div>
                      {onboardingList.slice(0,2).map((c)=>(
                        <div className="onb-list-item" key={c.id} style={{margin:"0 0 8px",padding:"12px 14px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <div className="onb-list-name" style={{fontSize:13}}>{c.name}</div>
                            <div className={`onb-list-tag ${c.status==="完成"?"onb-tag-done":"onb-tag-pend"}`}>{c.status}</div>
                          </div>
                          <div style={{fontSize:11,color:"var(--md)",marginTop:4}}>{c.date} · {c.risk} · {c.goals?.join("、")}</div>
                        </div>
                      ))}
                      <button className="onb-new-btn" style={{width:"100%",margin:"8px 0 0"}} onClick={()=>{setOnboardingStep(0);setOnboardingData({name:"",age:"",occupation:"",annualIncome:"",assets:"",goals:[],riskLevel:"穩健",concerns:"",referral:""});setOnboardingDone(false);setShowOnboarding(true);}}>+ 新增客戶 Onboarding</button>
                    </div>
                    <div className="sec">AI 生成推薦</div>
                    <div className="kate-admin">
                      <div className="admin-title">✦ 凱特後台</div>
                      {picksStep==="idle"&&(
                        <>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                            <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"rgba(240,242,248,.4)",textTransform:"uppercase"}}>選擇今日推薦主題</div>
                            <div style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:10,color:"rgba(240,242,248,.3)"}}>{new Date().toLocaleDateString("zh-TW",{month:"numeric",day:"numeric",weekday:"short"})}</div>
                          </div>
                          <div className="theme-grid">
                            {THEMES.map(t=>(
                              <div key={t.key} className={`theme-chip ${selectedThemes.includes(t.key)?"selected":""}`} onClick={()=>toggleTheme(t.key)}>{t.icon} {t.label}</div>
                            ))}
                          </div>
                          <button className="gen-btn" onClick={handleGenerate} disabled={!selectedThemes.length}><span>✦</span> AI 搜尋今日時事並生成推薦</button>
                        </>
                      )}
                      {picksStep==="loading"&&(
                        <div className="loading-wrap"><div className="spin"/><div className="loading-step">{loadingStep}</div></div>
                      )}
                      {picksStep==="draft"&&(
                        <>
                          {picksNewsItems.length>0&&(
                            <>
                              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:10}}>搜尋到的相關時事</div>
                              {picksNewsItems.map((n,i)=>(
                                <div className="picks-news-card" key={i} style={{borderColor:n.color==="rose"?"var(--rose)":n.color==="blue"?"var(--blue)":n.color==="green"?"var(--green)":"var(--gold)"}}>
                                  <div className="pnc-tag">{n.tag}</div>
                                  <div className="pnc-title">{n.title}</div>
                                  <div className="pnc-desc">{n.desc}</div>
                                </div>
                              ))}
                            </>
                          )}
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",margin:"14px 0 10px"}}>AI 生成草稿</div>
                          <div className="draft-card" style={{margin:"0 0 12px"}}>
                            <div className="draft-badge">草稿 · 請審核後發布</div>
                            <input className="draft-title-inp" value={draftTitle} onChange={e=>setDraftTitle(e.target.value)}/>
                            <textarea className="draft-edit" value={draftBody} onChange={e=>setDraftBody(e.target.value)}/>
                          </div>
                        </>
                      )}
                      {picksStep==="published"&&(
                        <div style={{textAlign:"center",padding:"20px 0"}}>
                          <div style={{fontSize:32,marginBottom:8}}>✓</div>
                          <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"var(--green)"}}>已成功發布</div>
                        </div>
                      )}
                      {picksStep==="draft"&&(
                        <>
                          <button className="pub-btn" style={{margin:"0 0 8px",width:"100%"}} onClick={handlePublishPicks}>✓ 審核完成，發布至客戶頁面</button>
                          <button className="gen-btn" style={{margin:"0 0 8px",width:"100%",opacity:.85}} onClick={handleGenerate}>↻ 重新生成（換一個版本）</button>
                          <button className="reset-btn" style={{margin:"0",width:"100%"}} onClick={resetPicks}>← 重新選擇主題</button>
                        </>
                      )}
                      {picksStep==="published"&&<button className="gen-btn" style={{marginTop:12}} onClick={resetPicks}>重新搜尋生成</button>}
                    </div>

                    {/* 四大主題發布管理 */}
                    {(()=>{
                      const ADMIN_TOPICS=[
                        {key:"國際局勢",icon:"🌏",color:"#3a7abf",dim:"rgba(58,122,191,.1)",border:"rgba(58,122,191,.22)"},
                        {key:"資產傳承",icon:"🏛️",color:"#9a6e20",dim:"rgba(154,110,32,.1)",border:"rgba(154,110,32,.22)"},
                        {key:"退休規劃",icon:"🏖️",color:"#2a8a5a",dim:"rgba(42,138,90,.1)",border:"rgba(42,138,90,.22)"},
                        {key:"投資焦點",icon:"📈",color:"#7a5abf",dim:"rgba(122,90,191,.1)",border:"rgba(122,90,191,.22)"},
                      ];
                      const getLatest=(topic)=>publishedArticles.find(a=>a.tag===topic||a.theme?.includes(topic));
                      return(
                        <>
                          <div className="sec" style={{marginTop:8}}>四大主題管理</div>
                          <div style={{margin:"0 16px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                            {ADMIN_TOPICS.map(topic=>{
                              const art=getLatest(topic.key);
                              return(
                                <div key={topic.key} style={{background:"var(--card)",border:`1px solid ${art?topic.border:"rgba(240,242,248,.1)"}`,borderRadius:14,overflow:"hidden",position:"relative"}}>
                                  <div style={{height:2,background:art?`linear-gradient(90deg,${topic.color},transparent)`:"rgba(240,242,248,.06)"}}/>
                                  <div style={{padding:"12px 13px"}}>
                                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
                                      <span style={{fontSize:14}}>{topic.icon}</span>
                                      <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:topic.color,textTransform:"uppercase",flex:1}}>{topic.key}</div>
                                    </div>
                                    {art?(
                                      <>
                                        <div style={{fontSize:11,color:"rgba(240,230,210,.85)",lineHeight:1.5,marginBottom:8,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{art.title}</div>
                                        <div style={{fontSize:9,color:"rgba(240,230,210,.35)",marginBottom:10}}>{art.publishedAt}</div>
                                        <div style={{display:"flex",gap:6}}>
                                          <button onClick={()=>{
                                            // 設定主題並重新生成
                                            const themeMap={"國際局勢":"geopolitical","資產傳承":"inheritance","退休規劃":"retirement","投資焦點":"protection"};
                                            setSelectedThemes([themeMap[topic.key]||"inheritance"]);
                                            setPicksStep("idle");
                                            showToast(`切換到「${topic.key}」，點 AI 生成按鈕更新`);
                                          }} style={{flex:1,padding:"6px",borderRadius:8,border:`1px solid ${topic.border}`,background:topic.dim,fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:topic.color,cursor:"pointer",textAlign:"center"}}>↻ 更新</button>
                                          <button onClick={()=>{
                                            const next=publishedArticles.filter(a=>a.id!==art.id);
                                            setPublishedArticles(next);
                                            setPublishedPicks(next[0]||null);
                                            if(currentUser)saveUserData(currentUser.id,"kate_articles",next).catch(console.error);
                                            showToast("✓ 已刪除");
                                          }} style={{padding:"6px 8px",borderRadius:8,border:"1px solid rgba(176,80,96,.2)",background:"transparent",fontFamily:"'Cinzel',serif",fontSize:8,color:"#b05060",cursor:"pointer"}}>✕</button>
                                        </div>
                                      </>
                                    ):(
                                      <>
                                        <div style={{fontSize:10,color:"rgba(240,230,210,.3)",marginBottom:10,lineHeight:1.5}}>尚未發布</div>
                                        <button onClick={()=>{
                                          const themeMap={"國際局勢":"geopolitical","資產傳承":"inheritance","退休規劃":"retirement","投資焦點":"protection"};
                                          setSelectedThemes([themeMap[topic.key]||"inheritance"]);
                                          setPicksStep("idle");
                                          showToast(`切換到「${topic.key}」，點 AI 生成按鈕發布`);
                                        }} style={{width:"100%",padding:"6px",borderRadius:8,border:`1px solid ${topic.border}`,background:topic.dim,fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:topic.color,cursor:"pointer",textAlign:"center"}}>＋ 新增文章</button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}

                {/* 客戶端 */}
                <div className="sec">凱特推薦</div>
                {(publishedPicks||katePosts[0])&&(
                  <div className="kt-hero" onClick={()=>setScreen({type:"article",data:publishedPicks||katePosts[0]})}>
                    <div className="kt-glow"/><div className="kt-ov"/>
                    <div className="kt-con">
                      <div className="kt-badge">✦ {(publishedPicks||katePosts[0]).badge||"最新推薦"}</div>
                      <div className="kt-t">{(publishedPicks||katePosts[0]).title}</div>
                      <div className="kt-b">{((publishedPicks||katePosts[0]).preview||(publishedPicks||katePosts[0]).body||"").slice(0,80)}…</div>
                      <div className="kt-ac"><div className="kt-more">查看完整建議 →</div></div>
                    </div>
                  </div>
                )}
                {katePosts.slice(1).map((k,i)=>(
                  <div style={{margin:"0 16px 10px",background:"var(--card)",border:"1px solid var(--bl)",borderRadius:14,padding:16,cursor:"pointer"}} key={i} onClick={()=>setScreen({type:"article",data:k})}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:"var(--gold)",textTransform:"uppercase",marginBottom:6}}>{k.badge}</div>
                    <div style={{fontFamily:"'Noto Serif TC',serif",fontSize:14,fontWeight:500,color:"var(--td)",marginBottom:6,lineHeight:1.5}}>{k.title}</div>
                    <div style={{fontSize:12,color:"var(--md)",lineHeight:1.6}}>{k.preview}</div>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--gold)",marginTop:10}}>查看完整報告 →</div>
                  </div>
                ))}

                {/* 推薦產品 */}
                {publishedPicks?.products?.length>0&&(
                  <>
                    <div className="sec">推薦配置產品</div>
                    {publishedPicks.products.map((p,i)=>(
                      <div className="prod-rec" key={i}>
                        <div className="prod-rec-top">
                          <div className={`prod-rank ${rankStyle[p.rank]||"r1"}`}>{p.rank}推薦</div>
                          <div className="prod-name">{p.name}</div>
                          <div className="prod-meta-t">{p.region}</div>
                        </div>
                        <div className="prod-body-t">{p.reason}</div>
                        <div className="prod-action">了解更多 →</div>
                      </div>
                    ))}
                  </>
                )}
                <div style={{height:8}}/>
              </div>
            )}

            {/* ─ 投資工具總覽 ─ */}
            {/* ─ 投資工具 ─ */}
            {advisorSub==="tools"&&(
              <div style={{paddingTop:8}}>
                {productGroups.map((group,gi)=>(
                  <div key={gi}>
                    <div className="sec">{group.cat}</div>
                    {group.comingSoon?(
                      <div style={{margin:"0 16px 14px",background:"var(--card)",border:"1px dashed rgba(240,242,245,.12)",borderRadius:14,padding:"20px 16px",textAlign:"center"}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:3,color:"var(--md)",textTransform:"uppercase"}}>即將上架</div>
                      </div>
                    ):group.items.length===0?(
                      <div style={{margin:"0 16px 14px",background:"var(--card)",border:"1px dashed var(--bl)",borderRadius:14,padding:"20px 16px",textAlign:"center"}}>
                        <div style={{fontSize:11,color:"var(--md)",lineHeight:1.7}}>尚無產品</div>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",marginTop:4,opacity:.6}}>請由凱特後台新增</div>
                      </div>
                    ):(
                      group.items.map((prod,pi)=>{
                        const key=`tool-${gi}-${pi}`;const isOpen=openTerm===key;
                        return(
                          <div key={pi} style={{margin:"0 16px 10px",background:"var(--card)",border:`1px solid ${isOpen?group.border:"var(--bl)"}`,borderRadius:16,overflow:"hidden",transition:"border-color .2s",cursor:"pointer"}} onClick={()=>setOpenTerm(isOpen?null:key)}>
                            {isOpen&&<div style={{height:2,background:`linear-gradient(90deg,${group.color},transparent)`}}/>}
                            <div style={{padding:"14px 16px"}}>
                              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                                <div style={{flex:1,paddingRight:10}}>
                                  <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                                    <div style={{fontFamily:"'Cinzel',serif",fontSize:7,letterSpacing:1,color:"var(--md)",background:"var(--card2)",padding:"2px 8px",borderRadius:3,border:"1px solid var(--bl)",textTransform:"uppercase"}}>{prod.type}</div>
                                    <div style={{fontFamily:"'Cinzel',serif",fontSize:7,letterSpacing:1,color:group.color,opacity:.7}}>🌐 {prod.country}</div>
                                  </div>
                                  <div style={{fontFamily:"'Noto Serif TC',serif",fontSize:13,fontWeight:500,color:"var(--td)",lineHeight:1.4,marginBottom:2}}>{prod.company}</div>
                                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"var(--td)",lineHeight:1.4}}>{prod.name}</div>
                                </div>
                                <div style={{textAlign:"right",flexShrink:0}}>
                                  {prod.irr&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:group.color,marginBottom:2}}>{prod.irr}</div>}
                                  {prod.min&&<><div style={{fontFamily:"'Cinzel',serif",fontSize:7,letterSpacing:1,color:"var(--md)",textTransform:"uppercase",marginBottom:2}}>最低投入</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:group.color,maxWidth:90,textAlign:"right",lineHeight:1.4}}>{prod.min}</div></>}
                                </div>
                              </div>
                              {/* 繳費年期 或 撥券日/注意事項（現增） */}
                              {prod.payTerms?.length>0&&(
                                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                                  {prod.payTerms.map((pt,pti)=>(
                                    <div key={pti} style={{fontFamily:"'Cinzel',serif",fontSize:7,letterSpacing:1,color:group.color,background:group.dimColor,padding:"3px 8px",borderRadius:20,border:`1px solid ${group.border}`}}>{pt}</div>
                                  ))}
                                </div>
                              )}
                              {/* 特色標籤 */}
                              {prod.tags?.length>0&&(
                                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                                  {prod.tags.map((t,ti)=>(
                                    <div key={ti} style={{fontSize:11,color:"var(--md)",background:"var(--card2)",padding:"3px 10px",borderRadius:20,border:"1px solid var(--bl)"}}>{t}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {/* 展開詳情 */}
                            {isOpen&&(
                              <div style={{padding:"14px 16px",borderTop:"1px solid var(--bl)",background:"rgba(240,242,245,.03)"}}>
                                {group.cat?.includes("現增認購")?(
                                  /* 現增認購專屬展開欄位 */
                                  <>
                                    {[
                                      ["股票代號",prod.country],
                                      ["發行價格",prod.min],
                                      ["每千股認購",prod.breakeven],
                                      ["認股基準日",prod.irr],
                                      ["繳款期間",prod.suitable],
                                      ["匯款截止日",prod.notes],
                                    ].filter(([,v])=>v).map(([lbl,val])=>(
                                      <div key={lbl} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--bl)"}}>
                                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:group.color,textTransform:"uppercase"}}>{lbl}</div>
                                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:"var(--td)"}}>{val}</div>
                                      </div>
                                    ))}
                                    {prod.payTerms?.length>0&&(
                                      <div style={{marginTop:10,padding:"10px 12px",background:group.dimColor,borderRadius:10,border:`1px solid ${group.border}`}}>
                                        {prod.payTerms.map((t,i)=><div key={i} style={{fontSize:12,color:"var(--md)",lineHeight:1.7}}>{t}</div>)}
                                      </div>
                                    )}
                                  </>
                                ):(
                                  /* 一般產品展開欄位 */
                                  <>
                                    {prod.breakeven&&(
                                      <div style={{marginBottom:10}}>
                                        <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:group.color,textTransform:"uppercase",marginBottom:4}}>回本年期</div>
                                        <div style={{fontSize:12,color:"var(--td)",lineHeight:1.6}}>{prod.breakeven}</div>
                                      </div>
                                    )}
                                    {prod.suitable&&(
                                      <div style={{marginBottom:10}}>
                                        <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:group.color,textTransform:"uppercase",marginBottom:4}}>適合對象</div>
                                        <div style={{fontSize:12,color:"var(--md)",lineHeight:1.6}}>{prod.suitable}</div>
                                      </div>
                                    )}
                                    {prod.notes&&(
                                      <div style={{marginBottom:14}}>
                                        <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:group.color,textTransform:"uppercase",marginBottom:4}}>產品特色</div>
                                        <div style={{fontSize:12,color:"var(--md)",lineHeight:1.7}}>{prod.notes}</div>
                                      </div>
                                    )}
                                  </>
                                )}
                                <button onClick={e=>{e.stopPropagation();setShowMsg(true);}} style={{width:"100%",marginTop:8,padding:"11px",borderRadius:10,border:`1px solid ${group.border}`,background:group.dimColor,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:group.color,cursor:"pointer"}}>💬 諮詢凱特顧問</button>
                                <div style={{marginTop:12,fontSize:10,color:"rgba(240,242,248,.22)",lineHeight:1.7,letterSpacing:.3}}>{DISCLAIMER}</div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                ))}
                <div style={{height:8}}/>
              </div>
            )}

            {/* ─ AI 問答（整合財商教室）─ */}
            {/* ─ 顧問工具 ─ */}
            {advisorSub==="kattools"&&(
              <div style={{paddingTop:8,paddingBottom:24}}>

                {/* 凱特推播通知 */}
                {isKate&&(
                  <>
                    <div className="sec">推播通知給客戶</div>
                    <div style={{margin:"0 16px 14px",background:"var(--card)",border:"1px solid var(--bl)",borderRadius:14,padding:"16px"}}>
                      <div style={{fontSize:12,color:"var(--md)",marginBottom:12,lineHeight:1.7}}>選擇通知類型，系統將自動推播給所有客戶的通知中心。</div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {[
                          {icon:"💼",label:"綜所稅申報提醒（5/1～6/1）",key:"income_tax"},
                          {icon:"🏠",label:"房屋稅繳納提醒（5月）",key:"house_tax"},
                          {icon:"🌍",label:"地價稅繳納提醒（11月）",key:"land_tax"},
                          {icon:"🎁",label:"年底贈與稅額度提醒",key:"gift_tax"},
                          {icon:"📅",label:"保單繳費日提醒",key:"ins_payment"},
                        ].map(item=>(
                          <button key={item.key} onClick={()=>{
                            const newNotif={
                              id:`kate_push_${item.key}_${Date.now()}`,
                              icon:item.icon,cls:"ni-gold",
                              title:`✦ 凱特提醒｜${item.label.split("（")[0]}`,
                              desc:`${item.label}，請注意相關期限與規劃。如需試算或諮詢，點此聯繫凱特顧問。`,
                              time:"剛剛",unread:true,
                            };
                            setNotifs(p=>[newNotif,...p]);
                            showToast(`✓ 已推播「${item.label.split("（")[0]}」通知`);
                          }} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,border:"1px solid var(--bl)",background:"var(--card2)",cursor:"pointer",textAlign:"left",width:"100%"}}>
                            <span style={{fontSize:18}}>{item.icon}</span>
                            <div style={{flex:1,fontSize:13,color:"var(--td)"}}>{item.label}</div>
                            <span style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#8a5e18"}}>推播 ›</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* 繳費日管理 */}
                <div className="sec">繳費日追蹤</div>
                <div style={{margin:"0 16px 14px"}}>
                  {insuranceHoldings.map((h,i)=>{
                    const nextYear=Number(h.startYear)+Math.ceil((new Date().getFullYear()-Number(h.startYear)));
                    const nextDate=`${nextYear}-03-01`;
                    const daysLeft=Math.ceil((new Date(nextDate)-new Date())/(1000*60*60*24));
                    const urgent=daysLeft<30;
                    return(
                      <div key={i} style={{background:"var(--card)",border:`1px solid ${urgent?"rgba(176,80,96,.3)":"var(--bl)"}`,borderRadius:14,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:urgent?"#b05060":"#8a5e18",textTransform:"uppercase",marginBottom:4}}>{urgent?"⚠ 即將到期":"📅 繳費提醒"}</div>
                          <div style={{fontSize:14,fontWeight:600,color:"var(--td)",marginBottom:2}}>{h.product.split("—")[1]?.trim()||h.product}</div>
                          <div style={{fontSize:12,color:"var(--md)"}}>年繳 {h.annualPremiumUSD>0?`USD ${h.annualPremiumUSD.toLocaleString()}`:"-"}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:urgent?"#b05060":"#8a5e18"}}>{Math.abs(daysLeft)}</div>
                          <div style={{fontSize:11,color:"var(--md)"}}>{daysLeft>0?"天後":"天前"}</div>
                        </div>
                      </div>
                    );
                  })}
                  {insuranceHoldings.length===0&&<div style={{padding:"20px 16px",color:"var(--md)",fontSize:13,textAlign:"center"}}>尚無保單資料</div>}
                </div>

                {/* 客戶財務摘要卡 */}
                <div className="sec">客戶財務摘要卡</div>
                <div style={{margin:"0 16px 14px",background:"var(--card)",border:"1px solid var(--bl)",borderRadius:14,padding:"16px"}}>
                  <div style={{fontSize:13,color:"var(--md)",marginBottom:12}}>選擇客戶，一鍵生成財務摘要</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                    {onboardingList.map(c=>(
                      <div key={c.id} onClick={()=>setSummaryClientId(summaryClientId===c.id?null:c.id)} style={{padding:"12px 14px",borderRadius:10,border:`1px solid ${summaryClientId===c.id?"rgba(154,110,32,.4)":"var(--bl)"}`,background:summaryClientId===c.id?"rgba(154,110,32,.08)":"var(--card2)",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:600,color:"var(--td)"}}>{c.name}</div>
                          <div style={{fontSize:12,color:"var(--md)",marginTop:2}}>{c.risk} · {c.goals?.join("、")}</div>
                        </div>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:summaryClientId===c.id?"#8a5e18":"var(--md)"}}>{summaryClientId===c.id?"已選✓":"選擇"}</div>
                      </div>
                    ))}
                  </div>
                  {summaryClientId&&(()=>{
                    const c=onboardingList.find(x=>x.id===summaryClientId);
                    if(!c)return null;
                    return(
                      <div style={{padding:"14px",background:"linear-gradient(135deg,#faf6ee,#f2ebe0)",border:"1px solid rgba(154,110,32,.2)",borderRadius:12}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:3,color:"#9a6e20",textTransform:"uppercase",marginBottom:12}}>財務摘要 · {c.name}</div>
                        {[["建檔日期",c.date],["風險偏好",c.risk],["財務目標",c.goals?.join("、")||"-"],["保單數量",`${insuranceHoldings.length} 張`],["股票持倉",`${stockHoldings.length} 檔`],["固收投資",`${fixedHoldings.length} 筆`],["總資產估值",fmtTWD(grandTotalTWD)]].map(([l,v])=>(
                          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(154,110,32,.1)"}}>
                            <div style={{fontSize:12,color:"#6b5040"}}>{l}</div>
                            <div style={{fontSize:12,fontWeight:600,color:"#2c1e0f"}}>{v}</div>
                          </div>
                        ))}
                        <button onClick={()=>showToast("✓ 已複製摘要")} style={{width:"100%",marginTop:12,padding:"10px",border:"none",borderRadius:10,background:"linear-gradient(135deg,#9a6e20,#c8a84b)",color:"#fff",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,cursor:"pointer"}}>複製摘要</button>
                      </div>
                    );
                  })()}
                </div>

                {/* 推薦信 / 感謝信 AI 生成 */}
                <div className="sec">AI 信件生成</div>
                <div style={{margin:"0 16px 14px",background:"var(--card)",border:"1px solid var(--bl)",borderRadius:14,padding:"16px"}}>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    {[{id:"referral",label:"推薦信"},{id:"thanks",label:"感謝信"},{id:"followup",label:"跟進信"}].map(t=>(
                      <div key={t.id} onClick={()=>setLetterType(t.id)} style={{flex:1,padding:"9px",textAlign:"center",borderRadius:10,border:`1px solid ${letterType===t.id?"rgba(154,110,32,.4)":"var(--bl)"}`,background:letterType===t.id?"rgba(154,110,32,.1)":"transparent",fontFamily:"'Cinzel',serif",fontSize:10,color:letterType===t.id?"#8a5e18":"var(--md)",cursor:"pointer"}}>{t.label}</div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                    {onboardingList.map(c=>(
                      <div key={c.id} onClick={()=>genLetter(c.name,letterType)} style={{padding:"8px 14px",borderRadius:20,border:"1px solid var(--bl)",background:"var(--card2)",fontSize:12,color:"var(--td)",cursor:"pointer"}}>
                        {c.name} →
                      </div>
                    ))}
                    <div onClick={()=>genLetter("客戶",letterType)} style={{padding:"8px 14px",borderRadius:20,border:"1px dashed rgba(154,110,32,.3)",background:"transparent",fontSize:12,color:"#8a5e18",cursor:"pointer"}}>
                      + 通用版本
                    </div>
                  </div>
                  {letterLoading&&<div style={{textAlign:"center",padding:"16px",color:"var(--md)",fontSize:12}}>✦ AI 生成中…</div>}
                  {letterResult&&!letterLoading&&(
                    <div>
                      <div style={{background:"var(--card2)",borderRadius:10,padding:"14px",fontSize:13,color:"var(--td)",lineHeight:1.8,marginBottom:10,whiteSpace:"pre-wrap"}}>{letterResult}</div>
                      <button onClick={()=>{navigator.clipboard?.writeText(letterResult);showToast("✓ 已複製");}} style={{width:"100%",padding:"10px",border:"none",borderRadius:10,background:"linear-gradient(135deg,#9a6e20,#c8a84b)",color:"#fff",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,cursor:"pointer"}}>複製信件</button>
                    </div>
                  )}
                </div>

                {/* 匯出客戶資料 */}
                <div className="sec">匯出客戶資料</div>
                <div style={{margin:"0 16px 24px",background:"var(--card)",border:"1px solid var(--bl)",borderRadius:14,padding:"16px"}}>
                  <div style={{fontSize:13,color:"var(--md)",marginBottom:16,lineHeight:1.7}}>將所有客戶資料整理成 CSV 格式，可直接用 Google Sheets 或 Excel 開啟。</div>
                  {[
                    {label:"📋 匯出客戶 Onboarding 名單",desc:"姓名、年齡、職業、目標、風險偏好等",fn:()=>{
                      const headers=["姓名","建檔日期","狀態","風險偏好","財務目標","年齡","職業","年收入","可投資資產","主要擔憂","來源管道"];
                      const rows=onboardingList.map(c=>[c.name||"",c.date||"",c.status||"",c.risk||"",Array.isArray(c.goals)?c.goals.join("、"):"",c.age||"",c.occupation||"",c.annualIncome||"",c.assets||"",c.concerns||"",c.referral||""]);
                      const csv=[headers,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
                      const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
                      const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`凱特客戶名單_${new Date().toLocaleDateString("zh-TW").replace(/\//g,"-")}.csv`;a.click();
                      showToast("✓ 已下載客戶名單");
                    }},
                    {label:"🛡️ 匯出保單持倉",desc:"產品、保單號、年繳保費、投保額、起保年份等",fn:()=>{
                      const headers=["產品","保單號","保單類型","繳費年期","起保年份","年繳保費(USD)","投保額(USD)","實際投入(USD)"];
                      const rows=insuranceHoldings.map(h=>[h.product||"",h.policyNo||"",h.policyType||"",h.paymentTerm||"",h.startYear||"",h.annualPremiumUSD||"",h.faceAmountUSD||"",h.actualCostUSD||""]);
                      const csv=[headers,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
                      const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
                      const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`凱特保單持倉_${new Date().toLocaleDateString("zh-TW").replace(/\//g,"-")}.csv`;a.click();
                      showToast("✓ 已下載保單持倉");
                    }},
                    {label:"📊 匯出完整資產總覽",desc:"保險、股票、固收、貴金屬、房地產全部整合",fn:()=>{
                      const rows=[["類別","名稱/代碼","數量/重量","成本","現值","幣別","備註"]];
                      insuranceHoldings.forEach(h=>rows.push(["保險",h.product,h.paymentTerm,h.annualPremiumUSD,calcInsTotalCost(h),"USD",h.policyNo||""]));
                      stockHoldings.forEach(h=>rows.push(["股票",`${h.name}(${h.code})`,h.shares,h.costPerShare,h.currentPrice,h.currency,""]));
                      fixedHoldings.forEach(h=>rows.push(["固收",h.product,"",h.amountUSD,calcFixedValue(h),"USD",`${h.annualRate}% ${h.lockYears}年`]));
                      metalHoldings.forEach(h=>rows.push(["貴金屬",h.product,`${h.grams}g`,h.costPerGram,h.currentPricePerGram,"USD/g",h.purchaseDate||""]));
                      realEstateHoldings.forEach(h=>rows.push(["房地產",h.name,h.propertyType||"",h.purchasePrice||"",h.marketValue||"",h.currency,h.address||""]));
                      const csv=rows.map(r=>r.map(v=>`"${String(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
                      const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
                      const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`凱特資產總覽_${new Date().toLocaleDateString("zh-TW").replace(/\//g,"-")}.csv`;a.click();
                      showToast("✓ 已下載資產總覽");
                    }},
                  ].map((item,i)=>(
                    <div key={i} onClick={item.fn} style={{display:"flex",alignItems:"center",gap:12,padding:"14px",borderRadius:12,border:"1px solid var(--bl)",background:"var(--card2)",cursor:"pointer",marginBottom:10}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:600,color:"var(--td)",marginBottom:3}}>{item.label}</div>
                        <div style={{fontSize:12,color:"var(--md)"}}>{item.desc}</div>
                      </div>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#8a5e18",background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.2)",borderRadius:8,padding:"5px 12px",flexShrink:0}}>下載 CSV</div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ─ 產品管理（Kate 後台）─ */}
            {advisorSub==="prodmgr"&&isKate&&(
              <div style={{paddingTop:8,paddingBottom:40}}>
                {productGroups.map((group,gi)=>(
                  <div key={gi}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"0 16px",paddingTop:14,paddingBottom:8}}>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:3,color:"var(--gold)",textTransform:"uppercase"}}>{group.cat}</div>
                      <button onClick={()=>{
                        setProdEditorGroupIdx(gi);
                        setProdEditorItemIdx(null);
                        setProdForm({...PROD_BLANK});
                        setProdFormTagInput("");setProdFormTermInput("");
                        setShowProdEditor(true);
                      }} style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:"#2a8a5a",background:"rgba(42,138,90,.1)",border:"1px solid rgba(42,138,90,.25)",borderRadius:16,padding:"4px 12px",cursor:"pointer"}}>＋ 新增產品</button>
                    </div>
                    {(group.items||[]).length===0&&!group.comingSoon&&(
                      <div style={{margin:"0 16px 10px",padding:"14px",background:"var(--card)",border:"1px dashed var(--bl)",borderRadius:12,textAlign:"center",fontSize:12,color:"var(--md)"}}>尚無產品，點右上角新增</div>
                    )}
                    {(group.items||[]).map((prod,pi)=>(
                      <div key={pi} style={{margin:"0 16px 8px",background:"var(--card)",border:`1px solid ${group.border||"var(--bl)"}`,borderRadius:14,padding:"14px 16px"}}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:1,color:"var(--md)",marginBottom:3,textTransform:"uppercase"}}>{prod.type} · {prod.country}</div>
                            <div style={{fontFamily:"'Noto Serif TC',serif",fontSize:14,fontWeight:600,color:"var(--td)",lineHeight:1.4}}>{prod.company} — {prod.name}</div>
                            {prod.min&&<div style={{fontSize:11,color:"var(--md)",marginTop:3}}>最低：{prod.min}</div>}
                            {prod.tags?.length>0&&(
                              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
                                {prod.tags.map((t,ti)=><div key={ti} style={{fontSize:10,color:"var(--md)",background:"var(--card2)",padding:"2px 8px",borderRadius:10,border:"1px solid var(--bl)"}}>{t}</div>)}
                              </div>
                            )}
                          </div>
                          <div style={{display:"flex",gap:6,flexShrink:0}}>
                            <button onClick={()=>{
                              setProdEditorGroupIdx(gi);
                              setProdEditorItemIdx(pi);
                              setProdForm({
                                company:prod.company||"",name:prod.name||"",country:prod.country||"香港",
                                type:prod.type||"分紅保單",min:prod.min||"",
                                payTerms:[...(prod.payTerms||[])],breakeven:prod.breakeven||"",
                                irr:prod.irr||"",tags:[...(prod.tags||[])],
                                suitable:prod.suitable||"",notes:prod.notes||""
                              });
                              setProdFormTagInput("");setProdFormTermInput("");
                              setShowProdEditor(true);
                            }} style={{padding:"6px 12px",borderRadius:8,border:"1px solid rgba(154,110,32,.3)",background:"rgba(154,110,32,.08)",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:1,color:"#8a5e18",cursor:"pointer"}}>✎ 編輯</button>
                            <button onClick={()=>{
                              const next=productGroups.map((g,gii)=>gii!==gi?g:{...g,items:g.items.filter((_,pii)=>pii!==pi)});
                              setProductGroups(next);
                              saveUserData("00000000-0000-0000-0000-000000004b61","kate_products",next).catch(console.error);
                              showToast("✓ 產品已刪除");
                            }} style={{padding:"6px 10px",borderRadius:8,border:"1px solid rgba(176,80,96,.25)",background:"transparent",fontFamily:"'Cinzel',serif",fontSize:9,color:"#b05060",cursor:"pointer"}}>✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {advisorSub==="qa"&&(
              <div style={{paddingTop:16}}>
                <div className="qa-wrap">
                  <div className="qa-hero">
                    <div className="qa-hero-t">有問題，直接問凱特 AI</div>
                    <div className="qa-hero-s">財務規劃、產品比較、名詞解釋，一問就懂</div>
                  </div>
                  {qaThread.length===0&&(
                    <>
                      {/* 主題入口 */}
                      <div className="sec" style={{padding:"12px 0 8px"}}>財務主題諮詢</div>
                      {[
                        {icon:"🏠",title:"房地產稅務規劃",desc:"房地合一稅、自住優惠、節稅時機",tag:"稅務"},
                        {icon:"📋",title:"遺產傳承規劃",desc:"遺產稅計算、保險傳承、信託配置",tag:"傳承"},
                        {icon:"🌏",title:"境外資產配置",desc:"香港、新加坡保單優勢與注意事項",tag:"配置"},
                        {icon:"💰",title:"退休金準備指南",desc:"複利效果、退休缺口試算、分紅保單",tag:"退休"},
                        {icon:"⚠️",title:"地緣政治避險",desc:"台海風險下的資產分散策略",tag:"風險"},
                      ].map((t,i)=>{
                        const topicMsgs={"房地產稅務規劃":"我想了解房地產稅務規劃","遺產傳承規劃":"我想了解遺產傳承規劃","境外資產配置":"我想了解境外資產配置","退休金準備指南":"我想了解退休金規劃","地緣政治避險":"我想了解地緣政治風險下的資產配置"};
                        const topicIntros={"房地產稅務規劃":"您好！在幫您介紹房地產稅務規劃之前，想先了解您的狀況 😊\n\n1️⃣ 目前持有幾間房產？自住、出租還是投資？\n2️⃣ 有考慮近期買賣嗎？\n3️⃣ 持有年限大概多久？\n\n這樣我可以給您最精準的節稅建議！","遺產傳承規劃":"您好！傳承規劃是很多高資產家庭關注的議題 👨‍👩‍👧‍👦\n\n1️⃣ 目前大概的資產規模？\n2️⃣ 有幾位繼承人？\n3️⃣ 資產主要在台灣還是也有海外？\n\n了解後我可以幫您估算遺產稅並推薦傳承工具！","境外資產配置":"您好！境外配置是分散風險的重要策略 🌏\n\n1️⃣ 考慮配置境外的主要原因？（節稅、傳承、分散風險？）\n2️⃣ 預計配置金額大概多少？\n3️⃣ 對香港、新加坡有偏好嗎？\n\n這樣我可以為您推薦最合適的境外保單組合！","退休金準備指南":"您好！退休規劃越早開始越好 🏖️\n\n1️⃣ 目前幾歲？預計幾歲退休？\n2️⃣ 退休後每月希望多少生活費？\n3️⃣ 目前已累積的退休金大約多少？\n\n我可以幫您算出退休缺口並推薦補足方案！","地緣政治避險":"您好！台海局勢是很多客戶近期最關心的議題 ⚠️\n\n1️⃣ 資產目前主要在哪裡？\n2️⃣ 最擔心的風險是什麼？\n3️⃣ 希望分散到哪個地區？\n\n了解後我可以為您設計具體的避險配置方案！"};
                        return(
                          <div key={i} style={{marginBottom:8,background:"var(--card)",border:"1px solid var(--bl)",borderRadius:12,padding:"12px 14px",display:"flex",gap:10,alignItems:"center",cursor:"pointer"}} onClick={()=>{
                            setQaThread(p=>[...p,{type:"user",text:topicMsgs[t.title]||t.title}]);
                            setQaLoading(true);
                            askAI(topicIntros[t.title]||t.title).then(res=>{setQaThread(p=>[...p,{type:"ai",...res}]);setQaLoading(false);});
                          }}>
                            <div style={{width:40,height:40,borderRadius:10,background:"rgba(154,110,32,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{t.icon}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:600,color:"var(--td)",marginBottom:2}}>{t.title}</div>
                              <div style={{fontSize:11,color:"var(--md)"}}>{t.desc}</div>
                            </div>
                            <div style={{fontFamily:"'Cinzel',serif",fontSize:8,color:"#9a6e20",background:"rgba(154,110,32,.1)",padding:"2px 8px",borderRadius:8,flexShrink:0}}>{t.tag}</div>
                          </div>
                        );
                      })}
                      <div className="sec" style={{padding:"12px 0 8px"}}>快速問答</div>
                      <div className="qa-chips">
                        {QA_SUGGESTIONS.map((s,i)=><button key={i} className="qa-chip" onClick={()=>handleAsk(s)}>{s}</button>)}
                      </div>
                    </>
                  )}
                  <div className="qa-thread" ref={qaRef}>
                    {qaThread.map((msg,i)=>(
                      <div key={i}>
                        {msg.type==="user"&&<div className="qa-b-user">{msg.text}</div>}
                        {msg.type==="ai"&&(
                          <div className="qa-b-kate">
                            <div className="qa-key">✦ 凱特 AI {msg.keyPoint&&`— ${msg.keyPoint}`}</div>
                            <div style={{fontFamily:"'Noto Serif TC',serif",fontSize:13,color:"var(--td)",lineHeight:1.85}}>{msg.answer}</div>
                            {msg.related?.length>0&&(
                              <div className="qa-related">
                                <div className="qa-rl">你可能也想知道</div>
                                {msg.related.map((r,ri)=><span key={ri} className="qa-rc" onClick={()=>handleAsk(r)}>{r}</span>)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {qaLoading&&<div className="qa-thinking"><div className="qa-dots"><div className="qa-dot"/><div className="qa-dot"/><div className="qa-dot"/></div><div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"var(--md)"}}>凱特 AI 思考中…</div></div>}
                  </div>
                  <div className="qa-input-row">
                    <input className="qa-inp" placeholder="輸入你的問題…" value={qaInput} onChange={e=>setQaInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!qaLoading&&handleAsk()}/>
                    <button className="qa-send-btn" onClick={()=>handleAsk()} disabled={!qaInput.trim()||qaLoading}>➤</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── 通知 badge ── */}
      {tab==="advisor"&&(
        <></>
      )}

      {/* ── OVERLAYS ── */}
      {/* 保險表單 */}
      {showInsForm&&(
        <div className="holding-form-overlay" onClick={e=>e.target===e.currentTarget&&setShowInsForm(false)}>
          <div className="holding-form-sheet">
            <div className="hf-title">{editInsId?"編輯保單":"新增保單"}</div>
            <div className="hf-lbl" style={{marginTop:0}}>保險產品</div>
            <select className="hf-inp" value={insForm.product} onChange={e=>setInsForm(p=>({...p,product:e.target.value}))} style={{cursor:"pointer"}}>
              {INSURANCE_PRODUCTS.map(pr=><option key={pr} value={pr}>{pr}</option>)}
            </select>
            <div className="hf-lbl">保單類型</div>
            <div style={{display:"flex",gap:8}}>
              {["分紅","壽險"].map(t=>(<div key={t} className={`hf-type-chip ${insForm.policyType===t?"active":""}`} onClick={()=>setInsForm(p=>({...p,policyType:t}))} style={{flex:1,textAlign:"center",padding:"10px"}}>{t}</div>))}
            </div>
            <div className="hf-lbl">繳費年期</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
              {["躉繳","2年","5年","10年","12年","20年"].map(t=>(<div key={t} className={`hf-type-chip ${insForm.paymentTerm===t?"active":""}`} onClick={()=>setInsForm(p=>({...p,paymentTerm:t}))} style={{padding:"8px 14px"}}>{t}</div>))}
            </div>
            <input className="hf-inp" placeholder="或自行輸入，例如：15年、終身" value={insForm.paymentTerm} onChange={e=>setInsForm(p=>({...p,paymentTerm:e.target.value}))}/>
            <div className="hf-lbl">起保年份（選填）</div>
            <input className="hf-inp" type="number" placeholder="例如：2024（可留空）" value={insForm.startYear} onChange={e=>setInsForm(p=>({...p,startYear:e.target.value}))}/>
            <div className="hf-lbl">年繳保費（USD）</div>
            <input className="hf-inp" type="number" placeholder="例如：25000" value={insForm.annualPremiumUSD} onChange={e=>setInsForm(p=>({...p,annualPremiumUSD:e.target.value}))}/>
            <div className="hf-lbl">投保額 / Face Amount（USD）</div>
            <input className="hf-inp" type="number" placeholder="例如：500000" value={insForm.faceAmountUSD} onChange={e=>setInsForm(p=>({...p,faceAmountUSD:e.target.value}))}/>
            <div className="hf-lbl">實際投入總金額（選填）</div>
            <input className="hf-inp" type="number" placeholder="若無折扣可留空" value={insForm.actualCostUSD} onChange={e=>setInsForm(p=>({...p,actualCostUSD:e.target.value}))}/>
            <div className="hf-lbl">保單號碼（選填）</div>
            <input className="hf-inp" placeholder="例如：HRE02-00123" value={insForm.policyNo} onChange={e=>setInsForm(p=>({...p,policyNo:e.target.value}))}/>
            <button className="hf-save-btn" onClick={saveIns}>儲存</button>
            <button className="hf-cancel-btn" onClick={()=>setShowInsForm(false)}>取消</button>
          </div>
        </div>
      )}
      {/* 股票表單 */}
      {showStockForm&&(
        <div className="holding-form-overlay" onClick={e=>e.target===e.currentTarget&&setShowStockForm(false)}>
          <div className="holding-form-sheet">
            <div className="hf-title">{editStockId?"編輯股票":"新增股票"}</div>
            <div className="hf-lbl" style={{marginTop:0}}>股票代碼</div>
            <div style={{display:"flex",gap:8}}>
              <input className="hf-inp" style={{flex:1}} placeholder="例如：2330 或 TSLA" value={stockCodeInput} onChange={e=>setStockCodeInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&lookupStock(stockCodeInput)}/>
              <button onClick={()=>lookupStock(stockCodeInput)}  style={{background:"var(--gold-dim)",border:"1px solid rgba(200,168,75,.3)",borderRadius:11,padding:"0 16px",fontFamily:"'Cinzel',serif",fontSize:10,color:"var(--gold)",cursor:"pointer",whiteSpace:"nowrap"}}>{stockLookupLoading?"查詢中…":"查詢"}</button>
            </div>
            {stockForm.name&&<div style={{marginTop:10,padding:"10px 14px",background:"var(--card2)",borderRadius:10,fontSize:13,color:"var(--td)"}}>{stockForm.name} <span style={{color:"var(--md)",fontSize:11}}>{stockForm.code}</span></div>}
            <div className="hf-lbl">股數</div>
            <input className="hf-inp" type="number" placeholder="例如：100" value={stockForm.shares} onChange={e=>setStockForm(p=>({...p,shares:e.target.value}))}/>
            <div className="hf-row">
              <div style={{flex:1}}><div className="hf-lbl">成本價</div><input className="hf-inp" type="number" value={stockForm.costPerShare} onChange={e=>setStockForm(p=>({...p,costPerShare:e.target.value}))}/></div>
              <div style={{flex:1,marginLeft:8}}><div className="hf-lbl">現價</div><input className="hf-inp" type="number" value={stockForm.currentPrice} onChange={e=>setStockForm(p=>({...p,currentPrice:e.target.value}))}/></div>
            </div>
            <div className="hf-lbl">幣別</div>
            <div style={{display:"flex",gap:8}}>
              {["TWD","USD"].map(c=>(<div key={c} className={`hf-type-chip ${stockForm.currency===c?"active":""}`} onClick={()=>setStockForm(p=>({...p,currency:c}))} style={{flex:1,textAlign:"center",padding:"10px"}}>{c}</div>))}
            </div>
            <button className="hf-save-btn" onClick={saveStock}>儲存</button>
            <button className="hf-cancel-btn" onClick={()=>setShowStockForm(false)}>取消</button>
          </div>
        </div>
      )}
      {/* 固收表單 */}
      {showFixedForm&&(
        <div className="holding-form-overlay" onClick={e=>e.target===e.currentTarget&&setShowFixedForm(false)}>
          <div className="holding-form-sheet">
            <div className="hf-title">{editFixedId?"編輯固收":"新增私募固收"}</div>
            <div className="hf-lbl" style={{marginTop:0}}>產品</div>
            <select className="hf-inp" value={fixedForm.product} onChange={e=>setFixedForm(p=>({...p,product:e.target.value}))} style={{cursor:"pointer"}}>
              {["萬兆豐 — 金益求金","萬兆豐 — 金益求兆"].map(pr=><option key={pr} value={pr}>{pr}</option>)}
            </select>
            <div className="hf-lbl">投入本金（USD）</div>
            <input className="hf-inp" type="number" placeholder="例如：100000" value={fixedForm.amountUSD} onChange={e=>setFixedForm(p=>({...p,amountUSD:e.target.value}))}/>
            <div className="hf-lbl">年化利率 (%)</div>
            <input className="hf-inp" type="number" placeholder="例如：6" value={fixedForm.annualRate} onChange={e=>setFixedForm(p=>({...p,annualRate:e.target.value}))}/>
            <div className="hf-row">
              <div style={{flex:1}}><div className="hf-lbl">起始日期</div><input className="hf-inp" type="month" value={fixedForm.startDate} onChange={e=>setFixedForm(p=>({...p,startDate:e.target.value}))}/></div>
              <div style={{flex:1,marginLeft:8}}><div className="hf-lbl">鎖定期（年）</div>
                <select className="hf-inp" value={fixedForm.lockYears} onChange={e=>setFixedForm(p=>({...p,lockYears:e.target.value}))} style={{cursor:"pointer"}}>
                  {["1","2","3"].map(y=><option key={y} value={y}>{y} 年</option>)}
                </select>
              </div>
            </div>
            <button className="hf-save-btn" onClick={saveFixed}>儲存</button>
            <button className="hf-cancel-btn" onClick={()=>setShowFixedForm(false)}>取消</button>
          </div>
        </div>
      )}
      {/* 貴金屬表單 */}
      {showMetalForm&&(
        <div className="holding-form-overlay" onClick={e=>e.target===e.currentTarget&&setShowMetalForm(false)}>
          <div className="holding-form-sheet">
            <div className="hf-title">{editMetalId?"編輯貴金屬":"新增貴金屬"}</div>
            <div className="hf-lbl" style={{marginTop:0}}>產品</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {["萬兆豐貴金屬 — 實體黃金","萬兆豐 — 金盈滿堂（黃金存摺）"].map(pr=>(
                <div key={pr} onClick={()=>setMetalForm(p=>({...p,product:pr}))}
                  style={{padding:"12px 16px",borderRadius:11,border:metalForm.product===pr?"1px solid rgba(184,144,42,.6)":"1px solid var(--bl)",background:metalForm.product===pr?"rgba(184,144,42,.12)":"var(--card2)",cursor:"pointer",fontSize:14,color:"var(--td)",transition:"all .2s"}}>
                  {metalForm.product===pr&&<span style={{color:"#b8902a",marginRight:8}}>✓</span>}{pr}
                </div>
              ))}
            </div>
            <div className="hf-lbl">重量（公克）</div>
            <input className="hf-inp" type="number" placeholder="例如：1000" value={metalForm.grams} onChange={e=>setMetalForm(p=>({...p,grams:e.target.value}))}/>
            <div className="hf-row">
              <div style={{flex:1}}><div className="hf-lbl">購入單價（USD/g）</div><input className="hf-inp" type="number" placeholder="例如：95" value={metalForm.costPerGram} onChange={e=>setMetalForm(p=>({...p,costPerGram:e.target.value}))}/></div>
              <div style={{flex:1,marginLeft:8}}><div className="hf-lbl">現價（USD/g）</div><input className="hf-inp" type="number" placeholder="例如：105" value={metalForm.currentPricePerGram} onChange={e=>setMetalForm(p=>({...p,currentPricePerGram:e.target.value}))}/></div>
            </div>
            <div className="hf-lbl">購入日期</div>
            <input className="hf-inp" type="month" value={metalForm.purchaseDate} onChange={e=>setMetalForm(p=>({...p,purchaseDate:e.target.value}))}/>
            {(!metalForm.grams||!metalForm.purchaseDate)&&<div style={{fontSize:11,color:"var(--md)",marginTop:8,textAlign:"center"}}>請填寫重量與購入日期</div>}
            <button className="hf-save-btn" onClick={saveMetal} style={{opacity:(!metalForm.grams||!metalForm.purchaseDate)?0.45:1}}>儲存</button>
            <button className="hf-cancel-btn" onClick={()=>setShowMetalForm(false)}>取消</button>
          </div>
        </div>
      )}
      {/* 房地產表單 */}
      {showRealEstateForm&&(
        <div className="holding-form-overlay" onClick={e=>e.target===e.currentTarget&&setShowRealEstateForm(false)}>
          <div className="holding-form-sheet">
            <div className="hf-title">{editRealEstateId?"編輯不動產":"新增不動產"}</div>
            <div className="hf-lbl" style={{marginTop:0}}>物件名稱</div>
            <input className="hf-inp" placeholder="例如：台北市大安區自住房" value={realEstateForm.name} onChange={e=>setRealEstateForm(p=>({...p,name:e.target.value}))}/>
            <div className="hf-lbl">物件類型</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["住宅","辦公室","商舖","廠房","土地","其他"].map(t=>(
                <div key={t} className={`hf-type-chip ${realEstateForm.propertyType===t?"active":""}`} onClick={()=>setRealEstateForm(p=>({...p,propertyType:t}))} style={{padding:"8px 14px"}}>{t}</div>
              ))}
            </div>
            <div className="hf-lbl">地址（選填）</div>
            <input className="hf-inp" placeholder="例如：台北市大安區信義路四段" value={realEstateForm.address} onChange={e=>setRealEstateForm(p=>({...p,address:e.target.value}))}/>
            <div className="hf-lbl">幣別</div>
            <div style={{display:"flex",gap:8}}>
              {["TWD","USD"].map(c=>(<div key={c} className={`hf-type-chip ${realEstateForm.currency===c?"active":""}`} onClick={()=>setRealEstateForm(p=>({...p,currency:c}))} style={{flex:1,textAlign:"center",padding:"10px"}}>{c}</div>))}
            </div>
            <div className="hf-lbl">目前市值</div>
            <input className="hf-inp" type="number" placeholder={realEstateForm.currency==="TWD"?"例如：25000000":"例如：500000"} value={realEstateForm.marketValue} onChange={e=>setRealEstateForm(p=>({...p,marketValue:e.target.value}))}/>
            <div className="hf-lbl">房屋稅評定現值（選填）</div>
            <input className="hf-inp" type="number" placeholder="例如：8000000" value={realEstateForm.govValue} onChange={e=>setRealEstateForm(p=>({...p,govValue:e.target.value}))}/>
            <div className="hf-lbl">剩餘貸款（無則填 0）</div>
            <input className="hf-inp" type="number" placeholder="例如：12000000" value={realEstateForm.mortgage} onChange={e=>setRealEstateForm(p=>({...p,mortgage:e.target.value}))}/>
            <div className="hf-row">
              <div style={{flex:1}}><div className="hf-lbl">購入年份（選填）</div><input className="hf-inp" type="number" placeholder="例如：2018" value={realEstateForm.purchaseYear} onChange={e=>setRealEstateForm(p=>({...p,purchaseYear:e.target.value}))}/></div>
              <div style={{flex:1,marginLeft:8}}><div className="hf-lbl">購入價格（選填）</div><input className="hf-inp" type="number" placeholder="例如：18000000" value={realEstateForm.purchasePrice} onChange={e=>setRealEstateForm(p=>({...p,purchasePrice:e.target.value}))}/></div>
            </div>
            <div className="hf-lbl">年租金收益（選填）</div>
            <input className="hf-inp" type="number" placeholder="例如：360000（無出租填 0）" value={realEstateForm.annualReturn} onChange={e=>setRealEstateForm(p=>({...p,annualReturn:e.target.value}))}/>
            <div className="hf-lbl">備註（選填）</div>
            <input className="hf-inp" placeholder="例如：自住、出租中、待售" value={realEstateForm.notes} onChange={e=>setRealEstateForm(p=>({...p,notes:e.target.value}))}/>
            {!realEstateForm.name&&<div style={{fontSize:11,color:"var(--md)",marginTop:8,textAlign:"center"}}>請填寫物件名稱</div>}
            <button className="hf-save-btn" onClick={saveRealEstate} style={{opacity:!realEstateForm.name?0.45:1}}>儲存</button>
            <button className="hf-cancel-btn" onClick={()=>setShowRealEstateForm(false)}>取消</button>
          </div>
        </div>
      )}
      {/* 健檢問卷 */}
      {showHealthForm&&(
        <div className="health-form-overlay">
          <div className="health-form-wrap">
            <div className="hform-hdr"><div className="hform-title">財務健檢問卷</div><div className="hform-sub">填寫後即時計算您的財務健康分數</div></div>
            <div className="hform-section">
              <div className="hform-section-title">💰 收支狀況</div>
              <div className="hform-lbl">月收入 (TWD)</div><input className="hform-inp" type="number" placeholder="例如：150000" value={healthForm.monthlyIncome} onChange={e=>setHealthForm(p=>({...p,monthlyIncome:e.target.value}))}/>
              <div className="hform-lbl">月支出 (TWD)</div><input className="hform-inp" type="number" placeholder="例如：80000" value={healthForm.monthlyExpense} onChange={e=>setHealthForm(p=>({...p,monthlyExpense:e.target.value}))}/>
            </div>
            <div className="hform-section">
              <div className="hform-section-title">🏦 資產負債</div>
              <div className="hform-lbl">緊急備用金 (TWD)</div><input className="hform-inp" type="number" placeholder="例如：500000" value={healthForm.emergencyFund} onChange={e=>setHealthForm(p=>({...p,emergencyFund:e.target.value}))}/>
              <div className="hform-lbl">總負債 (房貸+車貸等)</div><input className="hform-inp" type="number" placeholder="例如：2000000" value={healthForm.totalDebt} onChange={e=>setHealthForm(p=>({...p,totalDebt:e.target.value}))}/>
            </div>
            <div className="hform-section">
              <div className="hform-section-title">🛡️ 保險配置</div>
              <div className="hform-check-row">
                {[{key:"hasLife",label:"壽險（身故保障）"},{key:"hasHealth",label:"醫療險（住院/手術）"},{key:"hasCritical",label:"重大疾病/失能險"}].map(c=>(
                  <div key={c.key} className={`hform-check ${healthForm[c.key]?"checked":""}`} onClick={()=>setHealthForm(p=>({...p,[c.key]:!p[c.key]}))}>
                    <div className="hform-check-box">{healthForm[c.key]&&"✓"}</div><div className="hform-check-lbl">{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hform-section">
              <div className="hform-section-title">🏖️ 退休準備</div>
              <div className="hform-lbl">退休目標總金額 (TWD)</div><input className="hform-inp" type="number" placeholder="例如：20000000" value={healthForm.retirementTarget} onChange={e=>setHealthForm(p=>({...p,retirementTarget:e.target.value}))}/>
              <div className="hform-lbl">目前已累積退休金 (TWD)</div><input className="hform-inp" type="number" placeholder="例如：5000000" value={healthForm.retirementCurrent} onChange={e=>setHealthForm(p=>({...p,retirementCurrent:e.target.value}))}/>
            </div>
            <button className="hform-submit" onClick={submitHealthForm}>計算我的健康分數 →</button>
            <button className="hform-cancel" onClick={()=>setShowHealthForm(false)}>取消</button>
          </div>
        </div>
      )}
      {/* 保障覆蓋率表單 */}
      {showCoverageForm&&(
        <div className="health-form-overlay">
          <div className="health-form-wrap">
            <div className="hform-hdr">
              <div className="hform-title">🛡️ 保障覆蓋率分析</div>
              <div className="hform-sub">填寫現有保障，立即看見缺口</div>
            </div>

            {/* 壽險 */}
            <div className="hform-section">
              <div className="hform-section-title">💙 壽險保障</div>
              <div className="hform-lbl">家庭每月支出 (TWD)</div>
              <input className="hform-inp" type="number" placeholder="例如：80000" value={coverageForm.monthlyExpense} onChange={e=>setCoverageForm(p=>({...p,monthlyExpense:e.target.value}))}/>
              <div style={{fontSize:12,color:"var(--md)",marginTop:4,lineHeight:1.6}}>建議壽險保額 = 月支出 × 12 × 10 年</div>
              <div className="hform-lbl">目前壽險保額合計 (TWD)</div>
              <input className="hform-inp" type="number" placeholder="例如：5000000" value={coverageForm.lifeInsurance} onChange={e=>setCoverageForm(p=>({...p,lifeInsurance:e.target.value}))}/>
              {coverageForm.monthlyExpense&&coverageForm.lifeInsurance&&(
                <div style={{marginTop:8,padding:"10px 12px",background:Number(coverageForm.lifeInsurance)>=Number(coverageForm.monthlyExpense)*120?"rgba(42,138,90,.08)":"rgba(176,80,96,.08)",borderRadius:8,fontSize:12,color:Number(coverageForm.lifeInsurance)>=Number(coverageForm.monthlyExpense)*120?"#1a6e42":"#b05060"}}>
                  {Number(coverageForm.lifeInsurance)>=Number(coverageForm.monthlyExpense)*120
                    ?`✓ 保額充足，可支撐 ${Math.round(Number(coverageForm.lifeInsurance)/(Number(coverageForm.monthlyExpense)*12)*10)/10} 年`
                    :`⚠ 建議保額 NT$ ${(Number(coverageForm.monthlyExpense)*120).toLocaleString()}，目前缺口 NT$ ${(Number(coverageForm.monthlyExpense)*120-Number(coverageForm.lifeInsurance)).toLocaleString()}`
                  }
                </div>
              )}
            </div>

            {/* 實支實付 */}
            <div className="hform-section">
              <div className="hform-section-title">🏥 實支實付醫療險</div>
              <div className="hform-lbl">每次住院最高理賠額 (TWD)</div>
              <input className="hform-inp" type="number" placeholder="例如：300000" value={coverageForm.realExpense} onChange={e=>setCoverageForm(p=>({...p,realExpense:e.target.value}))}/>
              <div style={{fontSize:12,color:"var(--md)",marginTop:4,lineHeight:1.6}}>一般手術自費耗材 10~30 萬，重大手術可達 50 萬以上。建議至少 50 萬/次</div>
            </div>

            {/* 住院日額 */}
            <div className="hform-section">
              <div className="hform-section-title">🛏️ 住院日額</div>
              <div className="hform-lbl">每日住院補貼 (TWD)</div>
              <input className="hform-inp" type="number" placeholder="例如：2000" value={coverageForm.dailyHospital} onChange={e=>setCoverageForm(p=>({...p,dailyHospital:e.target.value}))}/>
              <div style={{fontSize:12,color:"var(--md)",marginTop:4,lineHeight:1.6}}>住院 30 天補貼：NT$ {((Number(coverageForm.dailyHospital)||0)*30).toLocaleString()}。建議每日至少 3,000 元</div>
            </div>

            {/* 癌症 */}
            <div className="hform-section">
              <div className="hform-section-title">🎗️ 癌症一次金</div>
              <div className="hform-lbl">確診癌症一次理賠金 (TWD)</div>
              <input className="hform-inp" type="number" placeholder="例如：500000" value={coverageForm.cancerLump} onChange={e=>setCoverageForm(p=>({...p,cancerLump:e.target.value}))}/>
              <div style={{fontSize:12,color:"var(--md)",marginTop:4,lineHeight:1.6}}>
                平均停工 6 個月：NT$ {((Number(coverageForm.monthlyExpense)||0)*6).toLocaleString()}。
                建議癌症一次金 100 萬以上，含停工損失與標靶治療費用
              </div>
            </div>

            <button className="hform-submit" onClick={calcCoverage}>分析我的保障缺口 →</button>
            <button className="hform-cancel" onClick={()=>setShowCoverageForm(false)}>取消</button>
          </div>
        </div>
      )}
      {/* Onboarding */}
      {showOnboarding&&(
        <div className="onb-overlay">
          <div className="onb-wrap">
            {onboardingDone?(
              <div className="onb-success">
                <div className="onb-success-icon">✅</div>
                <div className="onb-success-title">客戶資料已建立</div>
                <div style={{fontSize:13,color:"var(--md)",lineHeight:1.7,marginBottom:24}}>「{onboardingData.name||"新客戶"}」的資料已儲存，您可以在後台查看並安排後續跟進。</div>
                <button className="onb-next-btn" onClick={()=>setShowOnboarding(false)}>完成</button>
              </div>
            ):(
              <>
                <div className="onb-step-title">步驟 {onboardingStep+1} / {ONBOARDING_STEPS.length}</div>
                <div className="onb-title">{ONBOARDING_STEPS[onboardingStep].icon} {ONBOARDING_STEPS[onboardingStep].title}</div>
                <div className="onb-steps">{ONBOARDING_STEPS.map((_,i)=><div key={i} className={`onb-step-dot ${i<onboardingStep?"done":i===onboardingStep?"active":""}`}/>)}</div>
                <div className="onb-card">
                  {onboardingStep===0&&(<><div className="onb-lbl">客戶姓名</div><input className="onb-inp" placeholder="例如：王大明" value={onboardingData.name} onChange={e=>setOnboardingData(p=>({...p,name:e.target.value}))}/><div className="onb-lbl">年齡</div><input className="onb-inp" type="number" placeholder="例如：45" value={onboardingData.age} onChange={e=>setOnboardingData(p=>({...p,age:e.target.value}))}/><div className="onb-lbl">職業</div><input className="onb-inp" placeholder="例如：企業主、醫師" value={onboardingData.occupation} onChange={e=>setOnboardingData(p=>({...p,occupation:e.target.value}))}/></>)}
                  {onboardingStep===1&&(<><div className="onb-lbl">年收入（約略）</div><input className="onb-inp" placeholder="例如：300萬以上" value={onboardingData.annualIncome} onChange={e=>setOnboardingData(p=>({...p,annualIncome:e.target.value}))}/><div className="onb-lbl">可投資資產（約略）</div><input className="onb-inp" placeholder="例如：1000萬-3000萬" value={onboardingData.assets} onChange={e=>setOnboardingData(p=>({...p,assets:e.target.value}))}/></>)}
                  {onboardingStep===2&&(<><div className="onb-lbl">主要財務目標</div><div className="onb-goal-grid">{GOAL_OPTIONS.map(g=>(<div key={g} className={`onb-goal-chip ${onboardingData.goals.includes(g)?"sel":""}`} onClick={()=>setOnboardingData(p=>({...p,goals:p.goals.includes(g)?p.goals.filter(x=>x!==g):[...p.goals,g]}))}>{g}</div>))}</div><div className="onb-lbl" style={{marginTop:16}}>風險偏好</div><div className="onb-risk-row">{["保守","穩健","積極"].map(r=><div key={r} className={`onb-risk-chip ${onboardingData.riskLevel===r?"sel":""}`} onClick={()=>setOnboardingData(p=>({...p,riskLevel:r}))}>{r}</div>)}</div></>)}
                  {onboardingStep===3&&(<><div className="onb-lbl">主要擔憂或問題</div><input className="onb-inp" placeholder="例如：擔心遺產稅、需要境外配置" value={onboardingData.concerns} onChange={e=>setOnboardingData(p=>({...p,concerns:e.target.value}))}/><div className="onb-lbl">來源管道</div><input className="onb-inp" placeholder="例如：朋友介紹" value={onboardingData.referral} onChange={e=>setOnboardingData(p=>({...p,referral:e.target.value}))}/></>)}
                </div>
                {onboardingStep<ONBOARDING_STEPS.length-1?<button className="onb-next-btn" onClick={()=>setOnboardingStep(s=>s+1)}>下一步 →</button>:<button className="onb-next-btn" onClick={submitOnboarding}>完成建檔 ✓</button>}
                {onboardingStep>0&&<button className="onb-back-btn" onClick={()=>setOnboardingStep(s=>s-1)}>← 上一步</button>}
                <button className="onb-back-btn" onClick={()=>setShowOnboarding(false)}>取消</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Product Editor Modal */}
      {showProdEditor&&(
        <div style={{position:"fixed",inset:0,background:"rgba(10,8,5,.85)",zIndex:200,display:"flex",alignItems:"flex-end",backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&setShowProdEditor(false)}>
          <div style={{width:"100%",maxWidth:430,margin:"0 auto",background:"var(--card)",borderRadius:"20px 20px 0 0",maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"20px 20px 0",flexShrink:0}}>
              <div style={{width:36,height:4,background:"var(--bl)",borderRadius:2,margin:"0 auto 16px"}}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:3,color:"var(--gold)",textTransform:"uppercase"}}>{prodEditorItemIdx===null?"新增產品":"編輯產品"}</div>
                <button onClick={()=>setShowProdEditor(false)} style={{width:28,height:28,borderRadius:8,border:"1px solid var(--bl)",background:"transparent",fontSize:16,color:"var(--md)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
              <div style={{fontSize:11,color:"var(--md)",marginBottom:16}}>{productGroups[prodEditorGroupIdx]?.cat}</div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
              {(()=>{
                const isSeasonedEquity=productGroups[prodEditorGroupIdx]?.cat?.includes("現增認購");
                return(<>
                  {/* 共用基本欄位 */}
                  {[["公司名稱 *","company","例如：台積電"],["產品名稱 *","name","例如：114年現金增資"]].map(([lbl,key,ph])=>(
                    <div key={key} style={{marginBottom:12}}>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:5}}>{lbl}</div>
                      <input value={prodForm[key]||""} onChange={e=>setProdForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                        style={{width:"100%",background:"var(--card2)",border:"1px solid rgba(140,110,80,.2)",borderRadius:10,padding:"11px 14px",fontSize:14,color:"var(--td)",fontFamily:"'Noto Sans TC',sans-serif",outline:"none"}}/>
                    </div>
                  ))}

                  {isSeasonedEquity?(
                    /* ── 現增認購專屬欄位 ── */
                    <>
                      {[
                        ["股票代號","country","例如：2330"],
                        ["發行價格（元）","min","例如：NT$ 580"],
                        ["每千股認購股數","breakeven","例如：每千股認購 104 股"],
                        ["認股基準日","irr","例如：115/04/24"],
                        ["繳款期間","suitable","例如：115/04/25 ～ 115/05/24"],
                        ["匯款截止日","notes","例如：115/05/24"],
                      ].map(([lbl,key,ph])=>(
                        <div key={key} style={{marginBottom:12}}>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:5}}>{lbl}</div>
                          <input value={prodForm[key]||""} onChange={e=>setProdForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                            style={{width:"100%",background:"var(--card2)",border:"1px solid rgba(140,110,80,.2)",borderRadius:10,padding:"11px 14px",fontSize:14,color:"var(--td)",fontFamily:"'Noto Sans TC',sans-serif",outline:"none"}}/>
                        </div>
                      ))}
                      {/* 撥券日 + 增資用途：用 tags 存 */}
                      <div style={{marginBottom:12}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:5}}>增資用途說明</div>
                        <textarea value={(prodForm.tags||[]).join("，")} onChange={e=>setProdForm(p=>({...p,tags:e.target.value?[e.target.value]:[]}))} placeholder="例如：充實營運資金、擴廠投資…"
                          rows={2} style={{width:"100%",background:"var(--card2)",border:"1px solid rgba(140,110,80,.2)",borderRadius:10,padding:"11px 14px",fontSize:14,color:"var(--td)",fontFamily:"'Noto Sans TC',sans-serif",outline:"none",resize:"none"}}/>
                      </div>
                      <div style={{marginBottom:20}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:5}}>撥券日 / 注意事項</div>
                        <textarea value={prodForm.payTerms?.join("\n")||""} onChange={e=>setProdForm(p=>({...p,payTerms:e.target.value?e.target.value.split("\n").filter(Boolean):[]}))} placeholder={"撥券日：115/06/15\n注意：逾期未繳視同放棄"} rows={3}
                          style={{width:"100%",background:"var(--card2)",border:"1px solid rgba(140,110,80,.2)",borderRadius:10,padding:"11px 14px",fontSize:14,color:"var(--td)",fontFamily:"'Noto Sans TC',sans-serif",outline:"none",resize:"none"}}/>
                      </div>
                    </>
                  ):(
                    /* ── 保險/其他原有欄位 ── */
                    <>
                      {[["國家/地區","country","例如：香港"],["產品類型","type","例如：分紅保單"],["最低投入","min","例如：USD 20,000/年"],["回本年期","breakeven","例如：兩年期第四年回本"],["IRR","irr","例如：6%"],["適合對象","suitable","例如：台灣客戶，小孩海外留學"]].map(([lbl,key,ph])=>(
                        <div key={key} style={{marginBottom:12}}>
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:5}}>{lbl}</div>
                          <input value={prodForm[key]||""} onChange={e=>setProdForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                            style={{width:"100%",background:"var(--card2)",border:"1px solid rgba(140,110,80,.2)",borderRadius:10,padding:"11px 14px",fontSize:14,color:"var(--td)",fontFamily:"'Noto Sans TC',sans-serif",outline:"none"}}/>
                        </div>
                      ))}
                      <div style={{marginBottom:12}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:5}}>產品說明</div>
                        <textarea value={prodForm.notes||""} onChange={e=>setProdForm(p=>({...p,notes:e.target.value}))} placeholder="產品特色說明…" rows={3}
                          style={{width:"100%",background:"var(--card2)",border:"1px solid rgba(140,110,80,.2)",borderRadius:10,padding:"11px 14px",fontSize:14,color:"var(--td)",fontFamily:"'Noto Sans TC',sans-serif",outline:"none",resize:"none"}}/>
                      </div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:5}}>特色標籤 <span style={{fontFamily:"'Noto Sans TC'",letterSpacing:0,fontSize:10}}>(按 Enter 新增)</span></div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8,minHeight:8}}>
                          {(prodForm.tags||[]).map((t,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(154,110,32,.1)",border:"1px solid rgba(154,110,32,.25)",borderRadius:20,padding:"3px 10px"}}>
                              <span style={{fontSize:12,color:"#8a5e18"}}>{t}</span>
                              <button onClick={()=>setProdForm(p=>({...p,tags:p.tags.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:"#b05060",fontSize:14,cursor:"pointer",padding:0,lineHeight:1}}>×</button>
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <input value={prodFormTagInput} onChange={e=>setProdFormTagInput(e.target.value)}
                            onKeyDown={e=>{if(e.key==="Enter"&&prodFormTagInput.trim()){setProdForm(p=>({...p,tags:[...(p.tags||[]),prodFormTagInput.trim()]}));setProdFormTagInput("");}}}
                            placeholder="例如：第四年回本"
                            style={{flex:1,background:"var(--card2)",border:"1px solid rgba(140,110,80,.2)",borderRadius:10,padding:"9px 12px",fontSize:13,color:"var(--td)",fontFamily:"'Noto Sans TC',sans-serif",outline:"none"}}/>
                          <button onClick={()=>{if(prodFormTagInput.trim()){setProdForm(p=>({...p,tags:[...(p.tags||[]),prodFormTagInput.trim()]}));setProdFormTagInput("");}}}
                            style={{padding:"9px 14px",borderRadius:10,border:"1px solid rgba(154,110,32,.3)",background:"rgba(154,110,32,.1)",fontFamily:"'Cinzel',serif",fontSize:10,color:"#8a5e18",cursor:"pointer"}}>＋</button>
                        </div>
                      </div>
                      <div style={{marginBottom:20}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)",textTransform:"uppercase",marginBottom:5}}>繳費年期 <span style={{fontFamily:"'Noto Sans TC'",letterSpacing:0,fontSize:10}}>(按 Enter 新增)</span></div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8,minHeight:8}}>
                          {(prodForm.payTerms||[]).map((t,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(90,104,120,.1)",border:"1px solid rgba(90,104,120,.3)",borderRadius:20,padding:"3px 10px"}}>
                              <span style={{fontSize:12,color:"var(--silver)"}}>{t}</span>
                              <button onClick={()=>setProdForm(p=>({...p,payTerms:p.payTerms.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:"#b05060",fontSize:14,cursor:"pointer",padding:0,lineHeight:1}}>×</button>
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <input value={prodFormTermInput} onChange={e=>setProdFormTermInput(e.target.value)}
                            onKeyDown={e=>{if(e.key==="Enter"&&prodFormTermInput.trim()){setProdForm(p=>({...p,payTerms:[...(p.payTerms||[]),prodFormTermInput.trim()]}));setProdFormTermInput("");}}}
                            placeholder="例如：2年"
                            style={{flex:1,background:"var(--card2)",border:"1px solid rgba(140,110,80,.2)",borderRadius:10,padding:"9px 12px",fontSize:13,color:"var(--td)",fontFamily:"'Noto Sans TC',sans-serif",outline:"none"}}/>
                          <button onClick={()=>{if(prodFormTermInput.trim()){setProdForm(p=>({...p,payTerms:[...(p.payTerms||[]),prodFormTermInput.trim()]}));setProdFormTermInput("");}}}
                            style={{padding:"9px 14px",borderRadius:10,border:"1px solid rgba(90,104,120,.3)",background:"rgba(90,104,120,.1)",fontFamily:"'Cinzel',serif",fontSize:10,color:"var(--silver)",cursor:"pointer"}}>＋</button>
                        </div>
                      </div>
                    </>
                  )}
                </>);
              })()}
              <button onClick={()=>{
                if(!prodForm.company.trim()||!prodForm.name.trim())return showToast("⚠ 公司名稱與產品名稱為必填");
                const newItem={...prodForm,tags:prodForm.tags||[],payTerms:prodForm.payTerms||[]};
                const next=productGroups.map((g,gi)=>{
                  if(gi!==prodEditorGroupIdx)return g;
                  const items=prodEditorItemIdx===null
                    ?[...(g.items||[]),newItem]
                    :(g.items||[]).map((it,pi)=>pi===prodEditorItemIdx?newItem:it);
                  return{...g,items};
                });
                setProductGroups(next);
                saveUserData("00000000-0000-0000-0000-000000004b61","kate_products",next).catch(console.error);
                setShowProdEditor(false);
                showToast(prodEditorItemIdx===null?"✓ 產品已新增":"✓ 產品已更新");
              }} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,background:"linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60)",color:"#07090f",fontFamily:"'Cinzel',serif",fontSize:12,fontWeight:700,letterSpacing:3,cursor:"pointer",marginBottom:8}}>
                {prodEditorItemIdx===null?"新增產品 ✓":"儲存變更 ✓"}
              </button>
              {prodEditorItemIdx!==null&&(
                <button onClick={()=>{
                  const next=productGroups.map((g,gi)=>gi!==prodEditorGroupIdx?g:{...g,items:(g.items||[]).filter((_,pi)=>pi!==prodEditorItemIdx)});
                  setProductGroups(next);
                  saveUserData("00000000-0000-0000-0000-000000004b61","kate_products",next).catch(console.error);
                  setShowProdEditor(false);
                  showToast("✓ 產品已刪除");
                }} style={{width:"100%",padding:"12px",borderRadius:13,border:"1px solid rgba(176,80,96,.25)",background:"transparent",fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:2,color:"#b05060",cursor:"pointer"}}>刪除此產品</button>
              )}
            </div>
          </div>
        </div>
      )}

      {toast&&<div className="toast">{toast}</div>}

      {/* NAV */}
      <nav className="bnav">
        {tabs.map(t=>(
          <div key={t.id} className={`ni ${tab===t.id?"active":""}`} onClick={()=>{setTab(t.id);if(t.id==="advisor")setNotifs(n=>n.map(x=>({...x,unread:false})));}}>
            {t.badge>0&&<div className="ni-badge">{t.badge}</div>}
            <span className="ni-ic">{t.icon}</span>
            <span>{t.label}</span>
          </div>
        ))}
      </nav>

      {/* Messenger */}
      {showMsg&&<MessengerOverlay msgThread={msgThread} msgInput={msgInput} setMsgInput={setMsgInput} msgLoading={msgLoading} showProdMenu={showProdMenu} handleMsgSend={handleMsgSend} handleQuick={handleQuick} handleProductSelect={handleProductSelect} onClose={()=>setShowMsg(false)} threadRef={threadRef} productGroups={productGroups}/>}
    </div>
  </>);
}

function MessengerOverlay({msgThread,msgInput,setMsgInput,msgLoading,showProdMenu,handleMsgSend,handleQuick,handleProductSelect,onClose,threadRef,productGroups}){
  const liveKB=buildKB(productGroups||DEFAULT_PRODUCT_GROUPS);
  const liveList=Object.keys(liveKB);
  return(
    <div className="msg-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="msg-sheet">
        <div className="msg-handle"/>
        <div className="msg-hdr">
          <div className="msg-av">✦</div>
          <div><div className="msg-hname">凱特線上顧問</div><div className="msg-hstatus"><div className="online-dot"/>線上服務中</div></div>
          <button className="msg-close" onClick={onClose}>×</button>
        </div>
        <div className="msg-thread" ref={threadRef}>
          <div className="b-time">今日</div>
          {msgThread.map(msg=>(
            <div key={msg.id}>
              {msg.type==="kate"&&<div className="b-kate-wrap"><div className="b-kate-av">✦</div><div className="b-kate">{msg.text}</div></div>}
              {msg.type==="user"&&<div className="b-user">{msg.text}</div>}
            </div>
          ))}
          {showProdMenu&&(
            <div className="prod-menu">
              <div className="prod-menu-lbl">請選擇想了解的產品</div>
              {liveList.map(name=>(
                <div className="prod-menu-item" key={name} onClick={()=>handleProductSelect(name)}>
                  <div><div className="prod-menu-name">{name}</div><div className="prod-menu-region">{liveKB[name]?.region||""} · {liveKB[name]?.type||""}</div></div>
                  <div style={{fontSize:14,color:"var(--md)"}}>›</div>
                </div>
              ))}
            </div>
          )}
          {msgLoading&&(
            <div className="thinking-wrap">
              <div className="thinking-av">✦</div>
              <div className="dots-wrap"><div className="dot-t"/><div className="dot-t"/><div className="dot-t"/></div>
            </div>
          )}
        </div>
        {!msgLoading&&(
          <div className="msg-quick-row">
            {QUICK_OPTIONS.map((opt,i)=><button key={i} className="msg-qc" onClick={()=>handleQuick(opt)}>{opt.label}</button>)}
          </div>
        )}
        <div className="msg-inp-row">
          <input className="msg-inp" placeholder="輸入訊息…" value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleMsgSend()}/>
          <button className="msg-send" onClick={()=>handleMsgSend()} disabled={!msgInput.trim()||msgLoading}>➤</button>
        </div>
      </div>
    </div>
  );
}
