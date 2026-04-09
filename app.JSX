mport { useState, useRef, useEffect } from "react";

// ── 產品知識庫 ──
const DISCLAIMER = "本頁所載產品資訊僅供參考，由凱特資產管理顧問提供，不構成任何投資建議或要約。所有產品均涉及風險，過往表現不代表未來回報。投保前請詳閱相關保單條款，並諮詢您的專屬顧問。";

const PRODUCT_GROUPS = [
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
];

const PRODUCT_KB_OBJ = {};
PRODUCT_GROUPS.forEach(g=>{
  g.items.forEach(p=>{
    PRODUCT_KB_OBJ[`${p.company} — ${p.name}`]={region:g.cat,type:p.type,summary:p.notes||p.name,suitable:p.suitable,features:p.tags};
  });
});
const PRODUCTS_LIST = Object.keys(PRODUCT_KB_OBJ);
const PRODUCT_KB_TEXT = PRODUCT_GROUPS.map(g=>
  `${g.cat}：${g.items.map(p=>`${p.company}${p.name}（${p.type}，最低${p.min||"洽詢"}，${p.tags.join("、")}）`).join("、")}`
).join("。");

const THEMES=[{key:"inheritance",label:"傳承規劃",icon:"👨‍👩‍👧‍👦"},{key:"retirement",label:"退休規劃",icon:"🏖️"},{key:"protection",label:"資產保全",icon:"🛡️"},{key:"overseas",label:"海外配置",icon:"🌏"},{key:"tax",label:"節稅規劃",icon:"📋"},{key:"geopolitical",label:"地緣政治",icon:"⚠️"}];

// ── AI helpers ──
async function searchNews(query){
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:query}]})});
  const data=await res.json();
  return data.content?.filter(b=>b.type==="text").map(b=>b.text).join("\n")||"";
}
async function generateAI(prompt,maxTokens=1500){
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})});
  const data=await res.json();
  return data.content?.[0]?.text||"";
}
async function aiChat(messages,systemPrompt){
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:systemPrompt,messages})});
  const data=await res.json();
  return data.content?.[0]?.text||"抱歉，請稍後再試。";
}

const ADVISOR_SYSTEM=`你是凱特資產管理的專屬線上顧問，代表凱特與客戶溝通。個性：專業、溫暖、親切，像一位懂得傾聽的私人財富顧問。產品知識庫：${JSON.stringify(PRODUCT_KB_OBJ)}。回答規則：1.繁體中文，語氣自然親切 2.介紹產品時只給50字摘要，問客戶想進一步了解哪個部分 3.客戶追問才提供細節，一次只說一個重點 4.數字從知識庫引用 5.不確定說「這個我幫您記下來，請凱特稍後確認」6.不要用條列式或標題，就是自然對話語氣`;

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
  {name:"台灣加權",val:"21,430",chg:"+1.20%",up:true},
  {name:"S&P 500",val:"5,218",chg:"+0.40%",up:true},
  {name:"那斯達克",val:"16,340",chg:"-0.22%",up:false},
  {name:"日經 225",val:"39,820",chg:"+0.65%",up:true},
];
const ALL_NEWS=[
  {cls:"tm",tag:"總經",emoji:"📊",title:"Fed 暗示年內仍有降息空間，美股三大指數小幅收漲",time:"2小時前",src:"Reuters",body:"美國聯準會官員在最新聲明中暗示，若通膨數據持續回落，年內仍有降息空間。\n\n凱特觀點：此訊號對股債市均屬正面，建議維持現有配置，靜待正式降息確認後再大幅調整。"},
  {cls:"tm",tag:"總經",emoji:"🏦",title:"美國 3 月 CPI 低於預期，通膨持續降溫信號明確",time:"5小時前",src:"Bloomberg",body:"美國3月消費者物價指數年增3.5%，低於市場預期的3.8%。\n\n凱特觀點：通膨持續降溫有助降息提前，建議增持成長型資產。"},
  {cls:"tt",tag:"股市",emoji:"📈",title:"標普 500 指數連四週收漲，科技股領軍帶動",time:"3小時前",src:"WSJ",body:"標普500指數連續第四週收漲，AI相關概念股漲幅居前。\n\n凱特觀點：科技股多頭趨勢完整，建議維持核心持股。"},
  {cls:"tt",tag:"股市",emoji:"💹",title:"輝達財報超預期，AI 晶片需求未見放緩跡象",time:"6小時前",src:"Reuters",body:"輝達EPS超出市場預期20%，AI GPU訂單能見度超過一年。\n\n凱特觀點：台積電、聯發科等供應鏈直接受惠，維持持有評等。"},
  {cls:"ti",tag:"個股",emoji:"💾",title:"台積電法說會：CoWoS 封裝產能 2026 年大幅擴充",time:"1小時前",src:"工商時報",body:"台積電宣布CoWoS先進封裝產能將在2026年大幅擴充。\n\n凱特觀點：維持目標價1050元，建議持有。"},
  {cls:"tb",tag:"台灣資產",emoji:"🥇",title:"黃金價格再創歷史新高，突破每盎司 3,300 美元",time:"6小時前",src:"路透社",body:"國際金價突破每盎司3,300美元，年漲幅逾25%。\n\n凱特觀點：持有實體黃金的客戶帳上報酬亮眼，可考慮鎖定部分獲利。"},
  {cls:"tm",tag:"總經",emoji:"🌏",title:"IMF 上調 2026 全球 GDP 成長預估至 3.2%",time:"8小時前",src:"FT",body:"國際貨幣基金上調今年全球經濟成長預估至3.2%。\n\n凱特觀點：全球成長前景改善，亞洲市場配置機會值得關注。"},
  {cls:"tb",tag:"台灣資產",emoji:"💱",title:"新台幣兌美元升值至 31.2，出口商適時換匯",time:"4小時前",src:"中央社",body:"新台幣兌美元匯率升至31.2元，創近三個月新高。\n\n凱特觀點：持有美元計價保單者帳上TWD價值略減，屬正常匯率波動。"},
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
  {id:1,icon:"✦",cls:"ni-gold",title:"凱特發布新推薦",desc:"半導體族群低接時機已至，重點留意台積電與聯發科",time:"10分鐘前",unread:true},
  {id:2,icon:"📈",cls:"ni-blue",title:"股票價格提醒",desc:"台積電突破 900 元，達到您設定的目標價",time:"1小時前",unread:true},
  {id:3,icon:"🔔",cls:"ni-rose",title:"現增認股開放通知",desc:"本期現增標的已開放認購，名額有限請盡早確認",time:"3小時前",unread:true},
  {id:4,icon:"✦",cls:"ni-gold",title:"凱特發布配置建議",desc:"第二季配置建議：防禦與成長各半，靜待降息訊號",time:"昨天",unread:false},
  {id:5,icon:"📅",cls:"ni-green",title:"繳費日提醒",desc:"富衛盈聚天下II 下次繳費日為 2027-03-01",time:"2天前",unread:false},
];
const NOTIF_SETTINGS=[
  {icon:"✦",cls:"ni-gold",name:"凱特推薦更新",key:"kate"},
  {icon:"📈",cls:"ni-blue",name:"股票漲跌警報",key:"stock"},
  {icon:"🔔",cls:"ni-rose",name:"新標的開放通知",key:"product"},
  {icon:"📅",cls:"ni-green",name:"繳費日提醒",key:"payment"},
  {icon:"💱",cls:"ni-blue",name:"匯率大幅波動",key:"fx"},
];
const TERMS=[
  {word:"殖利率",en:"Yield",icon:"📈",iconCls:"ti-blue",cat:"債市",simple:"你借錢給政府或公司，他們每年還你多少利息的百分比。殖利率越高，代表這筆錢幫你賺的利息越多。",detail:"殖利率是債券投資的核心指標。當市場對未來悲觀時，大家搶買債券避險，債券價格上漲，殖利率就會下降。",example:"美國10年期公債殖利率從5%降到4.28%，代表市場有更多人搶著買這張債券，認為未來情況不太妙。"},
  {word:"ETF",en:"Exchange Traded Fund",icon:"🧺",iconCls:"ti-gold",cat:"股票",simple:"把很多股票裝在一個籃子裡，你只要買這個籃子，就等於同時擁有裡面所有的股票，風險比較分散。",detail:"ETF在股票市場上交易，像買賣股票一樣方便。常見的有追蹤台灣50大企業的元大台灣50（0050）。",example:"買一張0050，等於同時持有台積電、鴻海、聯發科等台灣前50大公司的股份。"},
  {word:"升息 / 降息",en:"Rate Hike / Rate Cut",icon:"🏦",iconCls:"ti-silver",cat:"總經",simple:"升息就是央行讓借錢變貴，大家少借少花，讓物價降下來。降息則相反，讓借錢變便宜，刺激大家消費投資。",detail:"利率是整個金融市場的地基。升息通常讓股市承壓；降息則有利股市和債市。",example:"Fed把利率從5.5%降到5.25%，代表美國企業借錢成本變低，更敢擴張，股市通常有正面反應。"},
  {word:"分紅保單",en:"Participating Policy",icon:"📋",iconCls:"ti-gold",cat:"保險",simple:"保險公司把一部分投資獲利分給你，稱為「分紅」。分成保證和非保證兩部分，長期累積可以很可觀。",detail:"分為「歸原紅利」（每年公佈後保證）和「特別紅利」（非保證）兩種。",example:"富衛盈聚天下II，供款期滿後累積分紅可顯著提升保單現金價值。"},
  {word:"私募基金",en:"Private Fund",icon:"💰",iconCls:"ti-silver",cat:"投資",simple:"不在公開市場買賣的投資產品，只開放給高資產投資人。門檻較高但潛在回報也較高，流動性較低。",detail:"私募固定收益類似借錢給特定企業或項目，約定固定利率和還款期，風險比股票低但比定存高。",example:"萬兆豐金益求兆，年化報酬率約6%，資金鎖定期1-3年，適合有閒置資金的高資產客戶。"},
];

async function askAI(question){
  const raw=await generateAI(`你是凱特資產管理的財商教育顧問。用繁體中文回答問題，格式：先用一句話說重點，然後用150字內詳細解釋，最後提出3個相關問題。
回答格式（純JSON，不加任何說明）：{"answer":"詳細解答","keyPoint":"一句話重點","related":["問題1","問題2","問題3"]}
問題：${question}`,1000);
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
    --ink:#08090e;--card:#f0f2f5;--card2:#e8eaee;--card3:#dde0e6;
    --gold:#c8a84b;--gold2:#deba60;--gold-dim:rgba(200,168,75,0.13);
    --silver:#94a8c0;--silver-dim:rgba(148,168,192,0.13);
    --rose:#c47880;--rose-dim:rgba(196,120,128,0.12);
    --green:#3aaa78;--green-dim:rgba(58,170,120,0.12);
    --red:#d85868;--blue:#4878c0;--blue-dim:rgba(72,120,192,0.12);
    --td:#1a1e28;--tm:#4a5268;--tl:#f0f2f8;
    --md:#6a7890;--bl:rgba(200,210,224,0.42);
  }
  html,body{background:var(--ink);}
  .app{max-width:430px;margin:0 auto;min-height:100vh;font-family:'Noto Sans TC',sans-serif;color:var(--tl);position:relative;}
  .page{padding-bottom:90px;min-height:100vh;}

  /* ── LOGIN ── */
  .login{min-height:100vh;display:flex;flex-direction:column;}
  .lt{flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:64px 36px 44px;background:linear-gradient(170deg,#08090e 0%,#0c1320 65%,#090e18 100%);position:relative;overflow:hidden;}
  .lt::before{content:'';position:absolute;top:-80px;left:-60px;width:320px;height:320px;background:radial-gradient(circle,rgba(200,168,75,.09) 0%,transparent 70%);}
  .lb{background:var(--card);padding:36px 32px 52px;border-radius:26px 26px 0 0;}
  .l-en{font-family:'Cinzel',serif;font-size:10px;letter-spacing:6px;color:var(--gold);opacity:.7;margin-bottom:14px;text-transform:uppercase;}
  .l-brand{font-family:'Noto Serif TC',serif;font-size:42px;font-weight:600;color:#f0f2f8;line-height:1.2;letter-spacing:4px;margin-bottom:8px;}
  .l-brand span{color:var(--gold);}
  .l-tag{font-family:'Cinzel',serif;font-size:11px;letter-spacing:5px;color:rgba(240,242,248,.3);}
  .l-lbl{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;color:var(--md);text-transform:uppercase;margin-bottom:8px;}
  .l-inp{width:100%;background:#fff;border:1px solid var(--bl);border-radius:12px;padding:15px 18px;color:var(--td);font-size:15px;font-family:'Noto Sans TC',sans-serif;margin-bottom:18px;outline:none;transition:border-color .25s;}
  .l-inp:focus{border-color:var(--gold);}
  .l-btn{width:100%;padding:17px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:5px;cursor:pointer;}
  .l-foot{text-align:center;font-size:11px;color:var(--md);margin-top:18px;}

  /* ── NAV (4 tabs) ── */
  .bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:rgba(8,9,14,.97);backdrop-filter:blur(24px);border-top:1px solid rgba(240,242,245,.07);display:flex;padding:10px 0 24px;z-index:100;}
  .ni{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;color:rgba(240,242,248,.38);font-size:11px;letter-spacing:.5px;transition:color .2s;font-family:'Cinzel',serif;position:relative;font-weight:500;}
  .ni.active{color:var(--gold);}
  .ni.active::before{content:'';position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:20px;height:2px;background:var(--gold);border-radius:2px;}
  .ni-ic{font-size:22px;}
  .ni-badge{position:absolute;top:-2px;right:50%;transform:translateX(140%);width:15px;height:15px;background:var(--red);border-radius:50%;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff;}

  /* ── SHARED ── */
  .ph{padding:52px 22px 24px;background:linear-gradient(165deg,#0c1420 0%,#08090e 100%);position:relative;overflow:hidden;}
  .ph::after{content:'';position:absolute;top:-50px;right:-50px;width:220px;height:220px;background:radial-gradient(circle,rgba(200,168,75,.07) 0%,transparent 65%);pointer-events:none;}
  .ph-en{font-family:'Cinzel',serif;font-size:9px;letter-spacing:5px;color:var(--gold);opacity:.6;text-transform:uppercase;margin-bottom:8px;}
  .ph-t{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#f0f2f8;letter-spacing:1px;}
  .ph-s{font-size:11px;color:rgba(240,242,248,.38);letter-spacing:1.5px;margin-top:5px;}
  .sec{font-family:'Cinzel',serif;font-size:9px;letter-spacing:4px;color:rgba(240,242,248,.28);text-transform:uppercase;padding:18px 18px 10px;display:flex;align-items:center;gap:12px;}
  .sec::after{content:'';flex:1;height:1px;background:rgba(240,242,245,.07);}
  .back-btn{display:inline-flex;align-items:center;gap:6px;position:absolute;top:52px;left:16px;z-index:10;background:rgba(8,9,14,.6);backdrop-filter:blur(8px);border:1px solid rgba(240,242,248,.12);border-radius:20px;padding:6px 14px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:rgba(240,242,248,.6);cursor:pointer;}
  .toast{position:fixed;bottom:110px;left:50%;transform:translateX(-50%);background:rgba(19,24,36,.95);backdrop-filter:blur(12px);border:1px solid rgba(240,242,245,.1);border-radius:14px;padding:14px 20px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:var(--tl);z-index:400;white-space:nowrap;animation:fadeup .3s ease;}
  @keyframes fadeup{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  .add-btn{margin:12px 16px 0;width:calc(100% - 32px);background:transparent;border:1px dashed rgba(200,168,75,.25);border-radius:12px;padding:13px;font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:rgba(200,168,75,.4);cursor:pointer;transition:all .2s;display:block;}
  .add-btn:hover{border-color:var(--gold);color:var(--gold);}

  /* ── SUB-TABS ── */
  .sub-tabs{display:flex;background:rgba(240,242,245,.04);border-bottom:1px solid rgba(240,242,245,.07);overflow-x:auto;}
  .sub-tabs::-webkit-scrollbar{display:none;}
  .st{flex-shrink:0;padding:13px 18px;font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:rgba(240,242,248,.32);cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;text-transform:uppercase;}
  .st.active{color:var(--gold);border-bottom-color:var(--gold);}

  /* ── HOME ── */
  .home-hero{padding:52px 20px 20px;background:linear-gradient(165deg,#0c1420 0%,#08090e 100%);position:relative;overflow:hidden;}
  .home-hero::before{content:'';position:absolute;top:-60px;right:-40px;width:280px;height:280px;background:radial-gradient(circle,rgba(200,168,75,.08) 0%,transparent 65%);pointer-events:none;}
  .home-greeting{font-family:'Cinzel',serif;font-size:9px;letter-spacing:4px;color:rgba(200,168,75,.6);text-transform:uppercase;margin-bottom:4px;}
  .home-name{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#f0f2f8;margin-bottom:2px;}
  .home-date{font-size:11px;color:rgba(240,242,248,.3);letter-spacing:1.5px;margin-bottom:20px;}

  /* 總資產大卡 */
  .asset-card{background:linear-gradient(135deg,rgba(200,168,75,.12) 0%,rgba(200,168,75,.04) 100%);border:1px solid rgba(200,168,75,.22);border-radius:20px;padding:20px;position:relative;overflow:hidden;}
  .asset-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#9a7030,#deba60,#9a7030);}
  .asset-lbl{font-family:'Cinzel',serif;font-size:8px;letter-spacing:3px;color:rgba(200,168,75,.6);text-transform:uppercase;margin-bottom:6px;}
  .asset-val{font-family:'JetBrains Mono',monospace;font-size:30px;font-weight:700;color:#f0f2f8;letter-spacing:-1px;margin-bottom:4px;}
  .asset-chg{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--green);font-weight:700;}
  .asset-breakdown{display:flex;gap:0;margin-top:16px;padding-top:14px;border-top:1px solid rgba(200,168,75,.12);}
  .ab-item{flex:1;padding:0 10px;}
  .ab-item:first-child{padding-left:0;}
  .ab-item+.ab-item{border-left:1px solid rgba(200,168,75,.12);}
  .ab-lbl{font-family:'Cinzel',serif;font-size:7px;letter-spacing:1.5px;color:rgba(200,168,75,.5);text-transform:uppercase;margin-bottom:4px;}
  .ab-val{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;}

  /* 健康分小卡 */
  .health-mini{display:flex;align-items:center;gap:14px;background:rgba(58,170,120,.08);border:1px solid rgba(58,170,120,.2);border-radius:14px;padding:14px 16px;cursor:pointer;transition:all .2s;}
  .health-mini:hover{background:rgba(58,170,120,.12);}
  .hm-ring{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;flex-shrink:0;}
  .hm-info{flex:1;}
  .hm-title{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--green);text-transform:uppercase;margin-bottom:3px;}
  .hm-desc{font-size:12px;color:rgba(240,242,248,.5);}
  .hm-arr{color:rgba(240,242,248,.2);font-size:16px;}

  /* 凱特今日建議卡 */
  .kate-suggest{background:linear-gradient(135deg,rgba(72,120,192,.1) 0%,rgba(72,120,192,.04) 100%);border:1px solid rgba(72,120,192,.22);border-radius:16px;padding:16px;cursor:pointer;transition:all .2s;}
  .kate-suggest:hover{border-color:rgba(72,120,192,.38);}
  .ks-head{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
  .ks-badge{font-family:'Cinzel',serif;font-size:7px;letter-spacing:2px;color:var(--blue);background:rgba(72,120,192,.15);border:1px solid rgba(72,120,192,.25);border-radius:3px;padding:2px 8px;text-transform:uppercase;}
  .ks-title{font-family:'Noto Serif TC',serif;font-size:14px;font-weight:500;color:#f0f2f8;line-height:1.5;margin-bottom:8px;}
  .ks-preview{font-size:12px;color:rgba(240,242,248,.45);line-height:1.6;}
  .ks-action{display:flex;align-items:center;justify-content:space-between;margin-top:12px;}
  .ks-more{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--blue);}

  /* 新聞精選 */
  .news-card{display:flex;gap:12px;margin:0 16px 10px;padding:14px;background:var(--card);border-radius:14px;border:1px solid var(--bl);cursor:pointer;transition:all .2s;}
  .news-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.1);}
  .nc-emoji{font-size:26px;flex-shrink:0;width:40px;height:40px;display:flex;align-items:center;justify-content:center;}
  .nc-tag{font-family:'Cinzel',serif;font-size:7px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:4px;}
  .nc-title{font-size:13px;color:var(--td);font-weight:500;line-height:1.5;margin-bottom:4px;}
  .nc-meta{font-size:11px;color:var(--md);}

  /* 指數 */
  .idx{display:flex;margin:0 16px 0;background:var(--card);border:1px solid var(--bl);border-radius:14px;overflow:hidden;}
  .ii{flex:1;padding:11px 8px;}
  .ii+.ii{border-left:1px solid var(--bl);}
  .ii-n{font-family:'Cinzel',serif;font-size:7px;letter-spacing:1px;color:var(--md);text-transform:uppercase;margin-bottom:4px;}
  .ii-v{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--td);}
  .ii-c{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;margin-top:2px;}
  .up{color:var(--green);}
  .dn{color:var(--red);}

  /* ── ASSETS TAB ── */
  /* 持有摘要 */
  .hld-summary{margin:0 16px 14px;background:var(--card);border:1px solid var(--bl);border-radius:18px;padding:18px;position:relative;overflow:hidden;}
  .hld-summary::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#9a7030,#deba60,#9a7030);}
  .hld-total-lbl{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:6px;}
  .hld-total-val{font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:700;color:var(--td);margin-bottom:3px;}
  .hld-row{display:flex;gap:0;margin-top:12px;padding-top:12px;border-top:1px solid var(--bl);}
  .hld-st{flex:1;padding:0 10px;}
  .hld-st:first-child{padding-left:0;}
  .hld-st+.hld-st{border-left:1px solid var(--bl);}
  .hld-sl{font-family:'Cinzel',serif;font-size:7px;letter-spacing:1.5px;color:var(--md);text-transform:uppercase;margin-bottom:4px;}
  .hld-sv{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;}
  /* 持有列表 */
  .hld-list{margin:0 16px;}
  .hld-item{background:var(--card);border:1px solid var(--bl);border-radius:14px;padding:16px;margin-bottom:10px;}
  .hld-item-name{font-family:'Noto Serif TC',serif;font-size:14px;font-weight:500;color:var(--td);}
  .hld-item-type{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--md);margin-top:3px;text-transform:uppercase;}
  .hld-item-bar{height:3px;background:var(--card3);border-radius:3px;margin-top:10px;}
  .hld-item-fill{height:3px;border-radius:3px;}
  .hld-actions{display:flex;gap:6px;margin-top:10px;}
  .hld-edit-btn{flex:1;padding:7px;border-radius:8px;border:1px solid var(--bl);background:transparent;font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--md);cursor:pointer;transition:all .2s;}
  .hld-edit-btn:hover{border-color:var(--gold);color:var(--gold);}
  .hld-del-btn{padding:7px 12px;border-radius:8px;border:1px solid rgba(216,88,104,.2);background:transparent;font-family:'Cinzel',serif;font-size:9px;color:var(--rose);cursor:pointer;}
  /* 持有分類tab */
  .htab-row{display:flex;margin:0 16px 14px;background:var(--card);border:1px solid var(--bl);border-radius:12px;overflow:hidden;}
  .htab{flex:1;padding:11px 4px;text-align:center;font-family:'Cinzel',serif;font-size:8px;letter-spacing:1px;cursor:pointer;transition:all .2s;color:var(--md);border-bottom:2px solid transparent;}
  .htab.active{background:var(--gold-dim);color:var(--gold);border-bottom-color:var(--gold);}

  /* 健檢 */
  .hd-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px 4px;}
  .hd-sc{grid-column:1/-1;background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:16px;display:flex;align-items:center;gap:14px;}
  .s-ring{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .s-num{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:700;color:var(--td);}
  .hd-gr{font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:var(--td);margin-bottom:4px;}
  .hd-ds{font-size:11px;color:var(--md);line-height:1.5;}
  .hm{background:var(--card);border:1px solid var(--bl);border-radius:12px;padding:14px;position:relative;overflow:hidden;}
  .hm-lb{font-family:'Cinzel',serif;font-size:8px;letter-spacing:1.5px;color:var(--md);text-transform:uppercase;margin-bottom:6px;}
  .hm-v{font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;margin-bottom:3px;}
  .hm-s{font-size:10px;color:var(--md);margin-bottom:8px;}
  .hm-bg{height:3px;background:var(--card3);border-radius:3px;}
  .hm-b{height:3px;border-radius:3px;}
  .hm-w{grid-column:1/-1;background:var(--card);border:1px solid var(--bl);border-radius:12px;padding:14px;display:flex;gap:0;}
  .hw-i{flex:1;padding:0 10px;}
  .hw-i:first-child{padding-left:0;}
  .hw-i+.hw-i{border-left:1px solid var(--bl);}
  .hw-lb{font-family:'Cinzel',serif;font-size:7px;letter-spacing:1px;color:var(--md);text-transform:uppercase;margin-bottom:5px;}
  .hw-v{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:var(--td);margin-bottom:5px;}
  .hw-bg{height:3px;background:var(--card3);border-radius:3px;}
  .hw-b{height:3px;border-radius:3px;}
  .health-update-btn{margin:14px 16px 0;width:calc(100% - 32px);padding:14px;border:1px solid rgba(58,170,120,.25);border-radius:12px;background:var(--green-dim);font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:var(--green);cursor:pointer;display:block;}

  /* 試算 */
  .calc-section{padding:0 16px 32px;}
  .calc-card{background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:20px;margin-bottom:14px;}
  .calc-title{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:14px;}
  .calc-desc{font-size:12px;color:var(--md);margin-bottom:16px;line-height:1.7;}
  .calc-lbl{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:7px;margin-top:12px;}
  .calc-lbl:first-of-type{margin-top:0;}
  .calc-inp{width:100%;background:var(--card2);border:1px solid var(--bl);border-radius:11px;padding:12px 16px;color:var(--td);font-size:14px;font-family:'Noto Sans TC',sans-serif;outline:none;transition:border-color .2s;}
  .calc-inp:focus{border-color:var(--gold);}
  .calc-btn{width:100%;margin-top:16px;padding:15px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:12px;font-weight:600;letter-spacing:4px;cursor:pointer;}
  .calc-result{background:var(--card);border-radius:16px;padding:20px;margin-top:14px;}
  .calc-res-hd{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;}
  .calc-res-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--bl);}
  .calc-res-row:last-child{border-bottom:none;}
  .calc-res-lbl{font-size:12px;color:var(--md);}
  .calc-res-val{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:var(--td);}
  .calc-note{margin-top:12px;padding:12px 14px;border-radius:10px;font-size:12px;line-height:1.7;}

  /* ── EXPLORE TAB (市場) ── */
  .news-feat{margin:0 16px 12px;position:relative;border-radius:18px;overflow:hidden;cursor:pointer;}
  .news-feat-img{width:100%;height:180px;display:flex;align-items:center;justify-content:center;font-size:72px;}
  .news-feat-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,9,14,.95) 0%,rgba(8,9,14,.2) 60%,transparent 100%);padding:20px;display:flex;flex-direction:column;justify-content:flex-end;}
  .nf-tag{display:inline-block;font-family:'Cinzel',serif;font-size:8px;padding:3px 10px;border-radius:3px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;background:var(--gold-dim);color:var(--gold);border:1px solid rgba(200,168,75,.22);}
  .nf-tt{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;line-height:1.45;color:#f4f2ee;}
  .nf-mt{font-size:11px;color:rgba(240,242,248,.38);display:flex;gap:10px;margin-top:6px;}
  .news-list-item{display:flex;gap:12px;margin:0 16px 10px;padding:14px;background:var(--card);border-radius:14px;border:1px solid var(--bl);cursor:pointer;}
  .nli-emoji{font-size:22px;width:36px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
  .nli-tag{font-family:'Cinzel',serif;font-size:7px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:3px;}
  .nli-title{font-size:13px;color:var(--td);font-weight:500;line-height:1.45;}
  .nli-meta{font-size:11px;color:var(--md);margin-top:3px;}
  .si{display:flex;align-items:center;gap:12px;margin:0 16px 10px;padding:14px;background:var(--card);border:1px solid var(--bl);border-radius:14px;cursor:pointer;}
  .si-ic{font-size:22px;width:38px;height:38px;background:var(--card2);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .si-nm{font-size:14px;color:var(--td);font-weight:500;}
  .si-cd{font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--md);margin-top:2px;}
  .si-r{margin-left:auto;text-align:right;}
  .si-p{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:var(--td);}
  .si-c{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;margin-top:2px;}
  /* 股票詳情 */
  .sd-hd{padding:52px 20px 20px;background:linear-gradient(165deg,#0c1420 0%,#08090e 100%);}
  .sd-name{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#f0f2f8;}
  .sd-code{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--md);margin-top:3px;}
  .sd-price{font-family:'JetBrains Mono',monospace;font-size:32px;font-weight:700;color:#f0f2f8;margin-top:12px;}
  .sd-chg{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;margin-top:4px;}
  .chart-wrap{margin:0 16px;background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:14px;}
  .chart-tabs{display:flex;gap:0;margin-bottom:12px;}
  .ct{flex:1;padding:6px;text-align:center;border:none;background:transparent;font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--md);cursor:pointer;border-radius:8px;transition:all .2s;}
  .ct.active{background:var(--gold-dim);color:var(--gold);}
  .sd-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:14px 16px 24px;}
  .sd-stat{background:var(--card);border:1px solid var(--bl);border-radius:12px;padding:12px;}
  .sd-stat-l{font-family:'Cinzel',serif;font-size:8px;letter-spacing:1px;color:var(--md);text-transform:uppercase;margin-bottom:5px;}
  .sd-stat-v{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:var(--td);}

  /* ── ADVISOR TAB ── */
  /* 推薦hero */
  .kt-hero{margin:0 16px 14px;border-radius:20px;overflow:hidden;position:relative;cursor:pointer;min-height:200px;background:linear-gradient(135deg,#0a1828 0%,#1a0a28 50%,#0a1018 100%);}
  .kt-glow{position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:radial-gradient(circle,rgba(200,168,75,.15) 0%,transparent 70%);pointer-events:none;}
  .kt-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,9,14,.85) 0%,transparent 60%);}
  .kt-con{position:absolute;bottom:0;left:0;right:0;padding:20px;}
  .kt-badge{display:inline-flex;align-items:center;gap:5px;font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--gold);background:var(--gold-dim);border:1px solid rgba(200,168,75,.25);border-radius:3px;padding:3px 10px;text-transform:uppercase;margin-bottom:10px;}
  .kt-t{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#f0f2f8;line-height:1.4;margin-bottom:6px;}
  .kt-b{font-size:12px;color:rgba(240,242,248,.45);line-height:1.6;}
  .kt-ac{display:flex;align-items:center;justify-content:space-between;margin-top:12px;}
  .kt-more{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--gold);}
  /* 產品推薦卡 */
  .prod-rec{margin:0 16px 10px;background:var(--card);border:1px solid var(--bl);border-radius:14px;padding:16px;}
  .prod-rec-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
  .prod-rank{font-family:'Cinzel',serif;font-size:7px;letter-spacing:2px;padding:3px 10px;border-radius:3px;text-transform:uppercase;}
  .r1{background:rgba(200,168,75,.15);color:#a07830;border:1px solid rgba(200,168,75,.25);}
  .r2{background:var(--silver-dim);color:var(--silver);border:1px solid rgba(148,168,192,.2);}
  .r3{background:var(--card2);color:var(--md);border:1px solid var(--bl);}
  .prod-name{font-family:'Noto Serif TC',serif;font-size:14px;font-weight:500;color:var(--td);flex:1;}
  .prod-meta-t{font-size:11px;color:var(--md);}
  .prod-body-t{font-size:12px;color:var(--md);line-height:1.6;}
  .prod-action{display:inline-block;margin-top:8px;font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--gold);cursor:pointer;}
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
  .term-word{font-family:'Noto Serif TC',serif;font-size:15px;font-weight:500;color:var(--td);}
  .term-en{font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--md);margin-top:2px;}
  .term-arr{color:var(--md);font-size:16px;transition:transform .2s;}
  .term-arr.open{transform:rotate(180deg);}
  .term-body{padding:0 16px 16px;border-top:1px solid var(--bl);}
  .term-slbl{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;margin:12px 0 6px;}
  .term-simple{font-family:'Noto Serif TC',serif;font-size:13px;color:var(--td);line-height:1.7;}
  .term-detail{font-size:12px;color:var(--md);line-height:1.7;margin-top:8px;}
  .term-ex{background:var(--card2);border-radius:10px;padding:12px;margin-top:10px;}
  .term-exl{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:5px;}
  .term-ext{font-size:12px;color:var(--tm);line-height:1.6;}

  /* 後台 */
  .kate-admin{margin:0 16px 14px;background:rgba(200,168,75,.06);border:1px solid rgba(200,168,75,.2);border-radius:14px;padding:16px;}
  .admin-title{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:14px;}
  .theme-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
  .theme-chip{padding:8px 14px;border-radius:20px;border:1px solid var(--bl);background:transparent;font-size:12px;color:var(--md);cursor:pointer;transition:all .2s;}
  .theme-chip.selected{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}
  .gen-btn{width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;}
  .gen-btn:disabled{opacity:.4;cursor:not-allowed;}
  .draft-card{margin:0 16px 12px;background:var(--card);border:1px solid var(--bl);border-radius:14px;padding:16px;}
  .draft-badge{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--rose);text-transform:uppercase;margin-bottom:10px;}
  .draft-title-inp{width:100%;background:transparent;border:none;outline:none;font-family:'Playfair Display',serif;font-size:16px;color:var(--td);font-weight:700;margin-bottom:10px;border-bottom:1px solid var(--bl);padding-bottom:8px;}
  .draft-edit{width:100%;background:var(--card2);border:1px solid var(--bl);border-radius:10px;padding:12px;color:var(--td);font-size:13px;font-family:'Noto Serif TC',serif;outline:none;min-height:100px;resize:vertical;line-height:1.7;}
  .pub-btn{width:calc(100% - 32px);margin:0 16px 8px;padding:15px;border:none;border-radius:13px;background:linear-gradient(135deg,#2a6a50,#3aaa78);color:#fff;font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:3px;cursor:pointer;}
  .reset-btn{width:calc(100% - 32px);margin:0 16px 24px;padding:12px;border:1px solid rgba(240,242,245,.1);border-radius:12px;background:transparent;font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:rgba(240,242,248,.3);cursor:pointer;}
  .loading-wrap{padding:24px;text-align:center;}
  .spin{width:32px;height:32px;border:2px solid rgba(200,168,75,.2);border-top-color:var(--gold);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 12px;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .loading-step{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;color:var(--gold);}
  /* picks news */
  .picks-news-card{margin:0 16px 8px;background:var(--card);border-radius:12px;padding:14px;border-left:3px solid var(--gold);}
  .pnc-tag{font-family:'Cinzel',serif;font-size:7px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;margin-bottom:4px;}
  .pnc-title{font-size:13px;color:var(--td);font-weight:500;margin-bottom:3px;}
  .pnc-desc{font-size:11px;color:var(--md);}

  /* AI 問答 */
  .qa-wrap{padding:0 16px 24px;}
  .qa-hero{background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:16px;margin-bottom:16px;text-align:center;}
  .qa-hero-t{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--td);margin-bottom:4px;}
  .qa-hero-s{font-size:12px;color:var(--md);}
  .qa-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
  .qa-chip{padding:8px 14px;border-radius:20px;border:1px solid var(--bl);background:transparent;font-size:12px;color:var(--md);cursor:pointer;transition:all .2s;}
  .qa-chip:hover{border-color:rgba(200,168,75,.3);color:var(--gold);}
  .qa-thread{max-height:360px;overflow-y:auto;margin-bottom:12px;}
  .qa-b-user{background:var(--gold-dim);border:1px solid rgba(200,168,75,.2);border-radius:14px 14px 4px 14px;padding:12px 14px;font-size:13px;color:#a07830;margin-bottom:10px;text-align:right;}
  .qa-b-kate{background:var(--card2);border:1px solid var(--bl);border-radius:14px 14px 14px 4px;padding:14px;margin-bottom:10px;}
  .qa-key{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--gold);margin-bottom:8px;text-transform:uppercase;}
  .qa-related{margin-top:12px;padding-top:10px;border-top:1px solid var(--bl);}
  .qa-rl{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:8px;}
  .qa-rc{display:inline-block;margin:4px 4px 0 0;padding:6px 12px;border-radius:16px;border:1px solid var(--bl);font-size:11px;color:var(--md);cursor:pointer;}
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
  .msg-overlay{position:fixed;inset:0;background:rgba(8,9,14,.7);backdrop-filter:blur(8px);z-index:300;display:flex;align-items:flex-end;}
  .msg-sheet{background:var(--ink);border-radius:24px 24px 0 0;width:100%;max-width:430px;margin:0 auto;max-height:88vh;display:flex;flex-direction:column;border-top:1px solid rgba(240,242,245,.1);}
  .msg-handle{width:36px;height:4px;background:rgba(240,242,248,.15);border-radius:2px;margin:12px auto 0;}
  .msg-hdr{display:flex;align-items:center;gap:12px;padding:14px 16px 12px;border-bottom:1px solid rgba(240,242,245,.07);}
  .msg-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .msg-hname{font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:var(--tl);}
  .msg-hstatus{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--green);margin-top:2px;}
  .online-dot{width:6px;height:6px;border-radius:50%;background:var(--green);}
  .msg-close{margin-left:auto;background:rgba(240,242,248,.08);border:none;border-radius:50%;width:28px;height:28px;color:var(--md);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;}
  .msg-thread{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px;}
  .b-time{text-align:center;font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:rgba(240,242,248,.2);margin:4px 0;}
  .b-kate-wrap{display:flex;gap:8px;align-items:flex-end;}
  .b-kate-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;}
  .b-kate{background:rgba(240,242,248,.06);border:1px solid rgba(240,242,248,.08);border-radius:14px 14px 14px 4px;padding:11px 14px;font-size:13px;color:rgba(240,242,248,.75);line-height:1.6;max-width:80%;}
  .b-user{background:var(--gold-dim);border:1px solid rgba(200,168,75,.2);border-radius:14px 14px 4px 14px;padding:11px 14px;font-size:13px;color:#a07830;max-width:80%;align-self:flex-end;}
  .prod-menu{background:rgba(240,242,248,.04);border:1px solid rgba(240,242,248,.08);border-radius:14px;overflow:hidden;}
  .prod-menu-lbl{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--md);text-transform:uppercase;padding:10px 14px 8px;}
  .prod-menu-item{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-top:1px solid rgba(240,242,248,.05);cursor:pointer;transition:background .15s;}
  .prod-menu-item:hover{background:rgba(240,242,248,.04);}
  .prod-menu-name{font-size:13px;color:rgba(240,242,248,.7);}
  .prod-menu-region{font-size:10px;color:var(--md);margin-top:2px;}
  .thinking-wrap{display:flex;align-items:center;gap:8px;padding:4px 0;}
  .thinking-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;}
  .dots-wrap{display:flex;gap:4px;padding:10px 14px;background:rgba(240,242,248,.06);border-radius:14px;}
  .dot-t{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:blink 1.2s ease infinite;}
  .dot-t:nth-child(2){animation-delay:.2s;}
  .dot-t:nth-child(3){animation-delay:.4s;}
  .msg-quick-row{padding:10px 16px;border-top:1px solid rgba(240,242,245,.06);overflow-x:auto;display:flex;gap:8px;flex-shrink:0;}
  .msg-quick-row::-webkit-scrollbar{display:none;}
  .msg-qc{flex-shrink:0;padding:8px 14px;border-radius:20px;border:1px solid rgba(240,242,245,.12);background:rgba(240,242,245,.04);font-size:12px;color:rgba(240,242,248,.5);cursor:pointer;white-space:nowrap;font-family:'Noto Sans TC',sans-serif;transition:all .2s;}
  .msg-qc:hover{border-color:rgba(200,168,75,.3);color:var(--gold);}
  .msg-inp-row{display:flex;gap:10px;padding:12px 16px 28px;background:rgba(8,9,14,.97);border-top:1px solid rgba(240,242,245,.07);flex-shrink:0;}
  .msg-inp{flex:1;background:var(--card2);border:1px solid var(--bl);border-radius:22px;padding:12px 18px;color:var(--td);font-size:14px;font-family:'Noto Sans TC',sans-serif;outline:none;}
  .msg-inp:focus{border-color:var(--silver);}
  .msg-send{width:44px;height:44px;border-radius:50%;border:none;background:linear-gradient(135deg,#9a7030,#deba60);color:#07090f;font-size:18px;cursor:pointer;flex-shrink:0;}
  .msg-send:disabled{opacity:.35;cursor:not-allowed;}

  /* 通知 */
  .notif-item{display:flex;align-items:flex-start;gap:12px;margin:0 16px 10px;padding:14px;background:var(--card);border-radius:14px;border:1px solid var(--bl);cursor:pointer;transition:background .15s;}
  .notif-item.unread{background:rgba(200,168,75,.05);border-color:rgba(200,168,75,.15);}
  .n-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .ni-gold{background:var(--gold-dim);}
  .ni-blue{background:var(--blue-dim);}
  .ni-rose{background:var(--rose-dim);}
  .ni-green{background:var(--green-dim);}
  .n-title{font-size:13px;color:var(--td);font-weight:500;margin-bottom:3px;}
  .n-desc{font-size:12px;color:var(--md);line-height:1.5;}
  .n-time{font-size:10px;color:var(--md);margin-top:4px;}
  .n-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:4px;}
  .ns-group{margin:0 16px 16px;background:var(--card);border:1px solid var(--bl);border-radius:14px;overflow:hidden;}
  .ns-hd{padding:12px 16px;font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--md);text-transform:uppercase;border-bottom:1px solid var(--bl);}
  .ns-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--bl);cursor:pointer;}
  .ns-item:last-child{border-bottom:none;}
  .ns-ic{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
  .ns-name{flex:1;font-size:13px;color:var(--td);}
  .toggle{width:40px;height:22px;border-radius:11px;position:relative;cursor:pointer;flex-shrink:0;transition:background .2s;}
  .toggle.on{background:var(--green);}
  .toggle.off{background:rgba(240,242,245,.12);}
  .toggle-dot{position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s;}
  .toggle.on .toggle-dot{left:21px;}
  .toggle.off .toggle-dot{left:3px;}

  /* Profile */
  .prof-header{padding:52px 20px 28px;background:linear-gradient(165deg,#0c1420 0%,#08090e 100%);text-align:center;}
  .prof-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px;}
  .prof-name{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#f0f2f8;margin-bottom:4px;}
  .prof-role{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:rgba(200,168,75,.6);text-transform:uppercase;}
  .set-group{margin:0 16px 12px;background:var(--card);border:1px solid var(--bl);border-radius:14px;overflow:hidden;}
  .set-gl{padding:10px 16px;font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--md);text-transform:uppercase;border-bottom:1px solid var(--bl);}
  .set-item{display:flex;align-items:center;gap:12px;padding:13px 16px;border-bottom:1px solid var(--bl);cursor:pointer;}
  .set-item:last-child{border-bottom:none;}
  .set-ic{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
  .sg{background:var(--gold-dim);}
  .ss{background:var(--blue-dim);}
  .sr{background:var(--rose-dim);}
  .set-nm{font-size:14px;color:var(--td);}
  .set-ds{font-size:11px;color:var(--md);margin-top:2px;}
  .risk-row{display:flex;gap:8px;padding:12px 16px;}
  .risk-chip{flex:1;padding:10px;border-radius:10px;border:1px solid var(--bl);background:transparent;font-family:'Cinzel',serif;font-size:10px;letter-spacing:1px;color:var(--md);cursor:pointer;text-align:center;transition:all .2s;}
  .risk-chip.active{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}

  /* 新聞詳情 */
  .nd-hero{min-height:240px;display:flex;flex-direction:column;justify-content:flex-end;position:relative;padding:20px;overflow:hidden;}
  .nd-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,9,14,.95),transparent 60%);}
  .nd-hcon{position:relative;z-index:1;}
  .nd-tag{display:inline-block;font-family:'Cinzel',serif;font-size:8px;padding:3px 10px;border-radius:3px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;background:var(--gold-dim);color:var(--gold);border:1px solid rgba(200,168,75,.22);}
  .nd-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#f4f2ee;line-height:1.4;}
  .nd-meta{display:flex;gap:12px;font-size:11px;color:rgba(240,242,248,.4);margin-top:8px;}
  .nd-body{padding:20px 20px 32px;background:var(--card);}
  .nd-body p{font-family:'Noto Serif TC',serif;font-size:14px;color:var(--td);line-height:1.9;margin-bottom:16px;}

  /* 保單+股票+固收表單 */
  .holding-form-overlay{position:fixed;inset:0;background:rgba(8,9,14,.88);backdrop-filter:blur(8px);z-index:350;display:flex;align-items:flex-end;}
  .holding-form-sheet{background:var(--card);border-radius:24px 24px 0 0;width:100%;max-width:430px;margin:0 auto;padding:24px 20px 40px;max-height:90vh;overflow-y:auto;}
  .hf-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--td);margin-bottom:20px;}
  .hf-lbl{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:7px;margin-top:14px;}
  .hf-inp{width:100%;background:var(--card2);border:1px solid var(--bl);border-radius:11px;padding:13px 16px;color:var(--td);font-size:14px;font-family:'Noto Sans TC',sans-serif;outline:none;transition:border-color .2s;}
  .hf-inp:focus{border-color:var(--gold);}
  .hf-row{display:flex;gap:8px;}
  .hf-type-chip{padding:7px 14px;border-radius:20px;border:1px solid var(--bl);background:transparent;font-size:12px;color:var(--md);cursor:pointer;transition:all .2s;}
  .hf-type-chip.active{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}
  .hf-save-btn{width:100%;margin-top:20px;padding:16px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:12px;font-weight:600;letter-spacing:4px;cursor:pointer;}
  .hf-cancel-btn{width:100%;margin-top:8px;padding:13px;border:1px solid rgba(240,242,245,.1);border-radius:12px;background:transparent;font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:rgba(240,242,248,.3);cursor:pointer;}

  /* 健檢問卷 */
  .health-form-overlay{position:fixed;inset:0;background:rgba(8,9,14,.9);backdrop-filter:blur(10px);z-index:350;overflow-y:auto;}
  .health-form-wrap{max-width:430px;margin:0 auto;padding:40px 20px 60px;}
  .hform-hdr{margin-bottom:28px;}
  .hform-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#f0f2f8;margin-bottom:6px;}
  .hform-sub{font-size:12px;color:rgba(240,242,248,.38);letter-spacing:1px;}
  .hform-section{background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:18px;margin-bottom:14px;}
  .hform-section-title{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:16px;}
  .hform-lbl{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:7px;margin-top:12px;}
  .hform-lbl:first-of-type{margin-top:0;}
  .hform-inp{width:100%;background:var(--card2);border:1px solid var(--bl);border-radius:11px;padding:12px 16px;color:var(--td);font-size:14px;font-family:'Noto Sans TC',sans-serif;outline:none;}
  .hform-check-row{display:flex;flex-direction:column;gap:10px;margin-top:4px;}
  .hform-check{display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--bl);transition:all .2s;}
  .hform-check.checked{border-color:rgba(200,168,75,.3);background:var(--gold-dim);}
  .hform-check-box{width:20px;height:20px;border-radius:6px;border:1px solid var(--bl);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .hform-check.checked .hform-check-box{background:var(--gold);border-color:var(--gold);color:#07090f;font-size:12px;}
  .hform-check-lbl{font-size:14px;color:var(--td);}
  .hform-submit{width:100%;padding:17px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:4px;cursor:pointer;margin-top:8px;}
  .hform-cancel{width:100%;padding:13px;border:1px solid rgba(240,242,245,.1);border-radius:12px;background:transparent;font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:rgba(240,242,248,.3);cursor:pointer;margin-top:8px;}

  /* Onboarding */
  .onb-overlay{position:fixed;inset:0;background:rgba(8,9,14,.95);backdrop-filter:blur(12px);z-index:350;overflow-y:auto;}
  .onb-wrap{max-width:430px;margin:0 auto;padding:40px 20px 60px;min-height:100vh;}
  .onb-steps{display:flex;gap:6px;margin-bottom:24px;}
  .onb-step-dot{flex:1;height:3px;border-radius:3px;background:rgba(240,242,245,.1);}
  .onb-step-dot.done{background:var(--gold);}
  .onb-step-dot.active{background:rgba(200,168,75,.5);}
  .onb-step-title{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:6px;}
  .onb-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#f0f2f8;margin-bottom:20px;}
  .onb-card{background:var(--card);border:1px solid var(--bl);border-radius:16px;padding:20px;margin-bottom:14px;}
  .onb-lbl{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--md);text-transform:uppercase;margin-bottom:7px;margin-top:14px;}
  .onb-lbl:first-of-type{margin-top:0;}
  .onb-inp{width:100%;background:var(--card2);border:1px solid var(--bl);border-radius:11px;padding:13px 16px;color:var(--td);font-size:14px;font-family:'Noto Sans TC',sans-serif;outline:none;}
  .onb-goal-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;}
  .onb-goal-chip{padding:8px 16px;border-radius:20px;border:1px solid var(--bl);background:transparent;font-size:13px;color:var(--md);cursor:pointer;}
  .onb-goal-chip.sel{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}
  .onb-risk-row{display:flex;gap:8px;margin-top:4px;}
  .onb-risk-chip{flex:1;padding:10px;border-radius:10px;border:1px solid var(--bl);background:transparent;font-family:'Cinzel',serif;font-size:10px;color:var(--md);cursor:pointer;text-align:center;}
  .onb-risk-chip.sel{background:var(--gold-dim);border-color:rgba(200,168,75,.4);color:#a07830;}
  .onb-next-btn{width:100%;padding:16px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:12px;font-weight:600;letter-spacing:4px;cursor:pointer;}
  .onb-back-btn{width:100%;padding:13px;border:1px solid rgba(240,242,245,.1);border-radius:12px;background:transparent;font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:rgba(240,242,248,.3);cursor:pointer;margin-top:8px;}
  .onb-success{text-align:center;padding:60px 20px;}
  .onb-success-icon{font-size:56px;margin-bottom:16px;}
  .onb-success-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--green);margin-bottom:10px;}
  .onb-new-btn{width:calc(100% - 32px);margin:0 16px 16px;padding:14px;border:none;border-radius:13px;background:linear-gradient(135deg,#9a7030,#c8a84b 45%,#deba60);color:#07090f;font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:3px;cursor:pointer;}
  .onb-list-item{background:var(--card);border:1px solid var(--bl);border-radius:14px;padding:14px;margin:0 16px 10px;cursor:pointer;}
  .onb-list-name{font-family:'Noto Serif TC',serif;font-size:15px;font-weight:500;color:var(--td);margin-bottom:4px;}
  .onb-list-tag{font-family:'Cinzel',serif;font-size:8px;letter-spacing:1px;padding:3px 10px;border-radius:20px;text-transform:uppercase;}
  .onb-tag-done{background:var(--green-dim);color:var(--green);}
  .onb-tag-pend{background:var(--gold-dim);color:#a07830;}

  /* avatar btn */
  .avatar-btn{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#9a7030,#deba60);display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;flex-shrink:0;}
`;

// ─────────── SUPABASE ───────────
const SUPA_URL="https://orsrkollpofjoewriopu.supabase.co";
const SUPA_KEY="sb_publishable_wwg7Nw2n29nCWbL062gTmQ_JGLAghN-";

async function supaFetch(path,opts={}){
  const res=await fetch(`${SUPA_URL}/rest/v1${path}`,{
    headers:{"apikey":SUPA_KEY,"Authorization":`Bearer ${SUPA_KEY}`,"Content-Type":"application/json","Prefer":"return=representation",...(opts.headers||{})},
    ...opts
  });
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
async function saveUserData(userId,key,value){
  await supaFetch(`/kate_user_data`,{
    method:"POST",
    headers:{"Prefer":"resolution=merge-duplicates"},
    body:JSON.stringify({user_id:userId,data_key:key,data_value:value,updated_at:new Date().toISOString()})
  });
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
  const [tab,setTab]=useState("home");      // home | assets | explore | advisor
  const [assetsSub,setAssetsSub]=useState("holdings");  // holdings | health | calc
  const [exploreSub,setExploreSub]=useState("news");    // news | stocks
  const [advisorSub,setAdvisorSub]=useState("picks");   // picks | tools | qa
  const [liveNews,setLiveNews]=useState([]);
  const [newsLoading,setNewsLoading]=useState(false);
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
  const [insuranceHoldings,setInsuranceHoldings]=useState([
    {id:1,product:"安達 — 傳承守創V",policyNo:"HRE02-00123",policyType:"分紅",paymentTerm:"2年",faceAmountUSD:500000,annualPremiumUSD:25000,actualCostUSD:48000,startYear:2024,lifeCoverUSD:""},
    {id:2,product:"富衛 — 盈聚天下II",policyNo:"GFC2-00456",policyType:"壽險",paymentTerm:"5年",faceAmountUSD:300000,annualPremiumUSD:10000,actualCostUSD:49000,startYear:2024,lifeCoverUSD:800000},
  ]);
  const [showInsForm,setShowInsForm]=useState(false);
  const [editInsId,setEditInsId]=useState(null);
  const [insForm,setInsForm]=useState(INS_BLANK);
  const [stockHoldings,setStockHoldings]=useState([
    {id:1,code:"2330.TW",name:"台積電",shares:100,costPerShare:880,currentPrice:905,currency:"TWD"},
    {id:2,code:"TSLA",name:"Tesla",shares:50,costPerShare:179.1,currentPrice:175.2,currency:"USD"},
  ]);
  const [showStockForm,setShowStockForm]=useState(false);
  const [editStockId,setEditStockId]=useState(null);
  const [stockForm,setStockForm]=useState({code:"",name:"",shares:"",costPerShare:"",currentPrice:"",currency:"TWD"});
  const [stockCodeInput,setStockCodeInput]=useState("");
  const [stockLookupLoading,setStockLookupLoading]=useState(false);
  const [fixedHoldings,setFixedHoldings]=useState([
    {id:1,product:"萬兆豐 — 金益求兆",amountUSD:100000,startDate:"2024-01",lockYears:2,annualRate:6},
  ]);
  const [showFixedForm,setShowFixedForm]=useState(false);
  const [editFixedId,setEditFixedId]=useState(null);
  const [fixedForm,setFixedForm]=useState({product:"萬兆豐 — 金益求金",amountUSD:"",startDate:"",lockYears:"1",annualRate:"6"});
  // 貴金屬
  const [metalHoldings,setMetalHoldings]=useState([]);
  const [showMetalForm,setShowMetalForm]=useState(false);
  const [editMetalId,setEditMetalId]=useState(null);
  const METAL_BLANK={product:"萬兆豐貴金屬 — 實體黃金",grams:"",costPerGram:"",currentPricePerGram:"",purchaseDate:""};
  const [metalForm,setMetalForm]=useState(METAL_BLANK);
  // 房地產
  const [realEstateHoldings,setRealEstateHoldings]=useState([]);
  const [showRealEstateForm,setShowRealEstateForm]=useState(false);
  const [editRealEstateId,setEditRealEstateId]=useState(null);
  const RE_BLANK={product:"萬兆豐 — 瓦努阿圖預售屋",amountUSD:"",purchaseDate:"",annualReturn:"",notes:""};
  const [realEstateForm,setRealEstateForm]=useState(RE_BLANK);
  // Health
  const [showHealthForm,setShowHealthForm]=useState(false);
  const [healthForm,setHealthForm]=useState({monthlyIncome:"",monthlyExpense:"",emergencyFund:"",totalDebt:"",hasLife:false,hasHealth:false,hasCritical:false,retirementTarget:"",retirementCurrent:""});
  const [healthScore,setHealthScore]=useState(null);
  // Calculators
  const [calcMode,setCalcMode]=useState("mortgage"); // mortgage | retire
  const [mtgForm,setMtgForm]=useState({homeValue:"",loanBalance:"",rate:"2.5",years:"20",targetRate:"6"});
  const [mtgResult,setMtgResult]=useState(null);
  const [retForm,setRetForm]=useState({currentAge:"",retireAge:"65",currentSavings:"",monthlyContrib:"",expectedReturn:"5",monthlyExpense:""});
  const [retResult,setRetResult]=useState(null);
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
  const [notifSettings,setNotifSettings]=useState({kate:true,stock:true,product:true,payment:true,fx:false});
  // Onboarding
  const ONBOARDING_STEPS=[{title:"基本資料",icon:"👤"},{title:"財務狀況",icon:"💰"},{title:"目標與偏好",icon:"🎯"},{title:"其他資訊",icon:"📋"}];
  const GOAL_OPTIONS=["傳承規劃","退休規劃","資產保全","海外配置","節稅規劃","積極增值","穩健儲蓄"];
  const [showOnboarding,setShowOnboarding]=useState(false);
  const [onboardingStep,setOnboardingStep]=useState(0);
  const [onboardingData,setOnboardingData]=useState({name:"",age:"",occupation:"",annualIncome:"",assets:"",goals:[],riskLevel:"穩健",concerns:"",referral:""});
  const [onboardingDone,setOnboardingDone]=useState(false);
  const [onboardingList,setOnboardingList]=useState([
    {id:1,name:"陳小雯",date:"2026/04/05",status:"完成",risk:"穩健",goals:["傳承規劃","退休規劃"]},
    {id:2,name:"林志豪",date:"2026/04/04",status:"待跟進",risk:"積極",goals:["海外配置","積極增值"]},
  ]);
  const threadRef=useRef(null);
  const qaRef=useRef(null);

  useEffect(()=>{if(threadRef.current)threadRef.current.scrollTop=threadRef.current.scrollHeight;},[msgThread,msgLoading]);
  useEffect(()=>{
    if(!loggedIn)return;
    setNewsLoading(true);
    searchNews("今日最新財經新聞台灣股市美股黃金保險傳承 5則重要新聞標題和摘要")
      .then(raw=>generateAI(`根據以下新聞整理5則，純JSON（不加markdown）：{"news":[{"tag":"分類","emoji":"📊","title":"標題20字內","src":"來源","time":"幾小時前","body":"詳細說明100字內\n\n凱特觀點：簡短觀點"}]}\n新聞：${raw.slice(0,2000)}`,1500))
      .then(raw=>{
        try{
          const cleaned=raw.replace(/\`\`\`json|\`\`\`/g,"").trim();
          const data=JSON.parse(cleaned.slice(cleaned.indexOf("{"),cleaned.lastIndexOf("}")+1));
          if(data.news?.length>0)setLiveNews(data.news);
        }catch{}
        setNewsLoading(false);
      })
      .catch(()=>setNewsLoading(false));
  },[loggedIn]);
  useEffect(()=>{if(qaRef.current)qaRef.current.scrollTop=qaRef.current.scrollHeight;},[qaThread,qaLoading]);

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

  const handleLogin=async()=>{
    if(!acct||!pwd||loginLoading)return;
    setLoginLoading(true);setLoginError("");
    try{
      const user=await loginUser(acct.trim(),pwd);
      setCurrentUser(user);
      setIsKate(user.is_kate);
      setRisk(user.risk_level||"穩健");
      // 載入用戶資料
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
      setLoggedIn(true);
    }catch(err){
      setLoginError(err.message||"登入失敗，請重試");
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
      const raw=await generateAI(`股票代碼「${fullCode}」的公司中文名稱和最近收盤價是多少？只輸出純JSON：{"name":"公司中文名稱","price":數字}，不要其他文字。`,200);
      const cleaned=raw.replace(/```json|```/g,"").trim();
      const info=JSON.parse(cleaned.slice(cleaned.indexOf("{"),cleaned.lastIndexOf("}")+1));
      setStockForm(p=>({...p,code:fullCode,name:info.name||fullCode,currentPrice:String(info.price||""),currency:isTW?"TWD":"USD"}));
    }catch{
      setStockForm(p=>({...p,code:fullCode,name:fullCode,currency:isTW?"TWD":"USD"}));
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
    if(!realEstateForm.amountUSD||!realEstateForm.purchaseDate)return;
    const item={...realEstateForm,amountUSD:Number(realEstateForm.amountUSD),annualReturn:Number(realEstateForm.annualReturn)||0};
    if(editRealEstateId){setRealEstateHoldings(p=>p.map(h=>h.id===editRealEstateId?{...h,...item}:h));}
    else{setRealEstateHoldings(p=>[...p,{id:Date.now(),...item}]);}
    setShowRealEstateForm(false);setEditRealEstateId(null);setRealEstateForm(RE_BLANK);showToast("✓ 房地產已儲存");
    if(currentUser){const next=editRealEstateId?realEstateHoldings.map(h=>h.id===editRealEstateId?{...h,...item}:h):[...realEstateHoldings,{id:Date.now(),...item}];saveUserData(currentUser.id,"realestate",next).catch(console.error);}
  };
  const deleteRealEstate=(id)=>{const next=realEstateHoldings.filter(h=>h.id!==id);setRealEstateHoldings(next);showToast("✓ 已刪除");if(currentUser)saveUserData(currentUser.id,"realestate",next).catch(console.error);};
  const editRealEstate=(h)=>{setEditRealEstateId(h.id);setRealEstateForm({product:h.product,amountUSD:String(h.amountUSD),purchaseDate:h.purchaseDate,annualReturn:String(h.annualReturn),notes:h.notes||""});setShowRealEstateForm(true);};

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

  // ── Calculators ──
  const calcMortgage=()=>{
    const hv=Number(mtgForm.homeValue)||0,lb=Number(mtgForm.loanBalance)||0;
    const r=Number(mtgForm.rate)/100/12,n=Number(mtgForm.years)*12,tr=Number(mtgForm.targetRate)/100;
    const equity=hv-lb,releasable=Math.max(0,Math.round(hv*0.65-lb));
    const newMonthly=releasable>0&&r>0?Math.round(releasable*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)):0;
    const annualReturn=Math.round(releasable*tr),netAnnual=Math.round(annualReturn-newMonthly*12);
    setMtgResult({equity:Math.round(equity),releasable,newMonthly,annualReturn,netAnnual,feasible:netAnnual>0});
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

  // ── Messenger ──
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
    if(!selectedThemes.length)return;setPicksStep("loading");
    const labels=selectedThemes.map(k=>THEMES.find(t=>t.key===k)?.label).join("、");
    setLoadingStep("搜尋相關時事新聞…");
    const newsRaw=await searchNews(`Search for the latest news today related to: ${labels}, 台灣遺產稅, 傳承規劃, 地緣政治風險, 退休金, 海外資產配置, 節稅. Include both global and Taiwan news. Summarize 4-5 most relevant recent news items in Traditional Chinese.`);
    setLoadingStep("整理市場動態…");
    let parsed;
    try{parsed=JSON.parse((await generateAI(`根據以下新聞整理成JSON（只輸出JSON）：{"news":[{"tag":"分類","title":"標題20字內","desc":"摘要40字內","color":"gold/rose/blue/green"}],"mainTheme":"主題10字內","marketContext":"背景50字內"}\n新聞：${newsRaw.slice(0,2000)}`)).replace(/```json|```/g,"").trim());}
    catch{parsed={news:[{tag:"傳承",title:"台灣遺產稅改革討論持續",desc:"立法院就遺產稅率調整展開討論",color:"gold"},{tag:"地緣政治",title:"台海情勢牽動亞太資金流向",desc:"不確定性促使高淨值客戶加速資產分散",color:"rose"}],mainTheme:"傳承與地緣政治避險",marketContext:"高資產客戶面臨稅改與地緣政治雙重壓力"};}
    setPicksNewsItems(parsed.news||[]);setLoadingStep("結合產品知識庫生成凱特建議…");
    let rec;
    try{rec=JSON.parse((await generateAI(`你是凱特資產管理的頂級財富顧問。今日主題：「${parsed.mainTheme}」。背景：${parsed.marketContext}。客戶關注：${labels}。\n${PRODUCT_KB_TEXT}\n\n輸出純JSON：{"title":"推薦標題25字內","body":"凱特觀點180字內，結合時事，不要列點","theme":"主題標籤8字內","products":[{"rank":"首選","name":"產品名稱","region":"地區","reason":"50字內"},{"rank":"次選","name":"","region":"","reason":""},{"rank":"補充","name":"","region":"","reason":""}]}`)).replace(/```json|```/g,"").trim());}
    catch{rec={title:"遺產稅改革在即，境外傳承規劃刻不容緩",body:"台灣遺產稅改革討論持續升溫，疊加台海地緣政治不確定性，越來越多高資產家庭選擇將資產提前配置於境外，透過香港或新加坡的分紅終身壽險進行傳承規劃。保單身故保障在多數地區不計入遺產，可有效規避稅務風險。建議以2-3年為配置周期，分批布局香港與新加坡市場。",theme:"傳承・地緣政治",products:[{rank:"首選",name:"富衛 — 盈聚天下II",region:"🇧🇲 百慕達",reason:"8種貨幣配置分散地緣風險，富傳家3代傳承，2026年推廣折扣最高19%。"},{rank:"次選",name:"安達 — 傳承守創V",region:"🇭🇰 香港",reason:"2年繳清，第3年回本，護家保200%保障，快速完成傳承布局。"},{rank:"補充",name:"AIA — 百樂財富永傳",region:"🇸🇬 新加坡",reason:"新加坡監管完善，地緣政治避險的理想境外配置地點。"}]};}
    setDraftTitle(rec.title);setDraftBody(rec.body);setDraftProds(rec.products||[]);setDraftTheme(rec.theme||"");setPicksStep("draft");
  };
  const handlePublishPicks=()=>{setPublishedPicks({title:draftTitle,body:draftBody,products:draftProds,theme:draftTheme,news:picksNewsItems,publishedAt:new Date().toLocaleDateString("zh-TW")});setPicksStep("published");showToast("✓ 已發布至客戶推薦頁");};
  const resetPicks=()=>{setPicksStep("idle");setPicksNewsItems([]);setDraftTitle("");setDraftBody("");setDraftProds([]);};

  // ── QA ──
  const handleAsk=async(q)=>{
    const question=q||qaInput.trim();if(!question)return;
    setQaInput("");setQaThread(p=>[...p,{type:"user",text:question}]);setQaLoading(true);
    const res=await askAI(question);
    setQaThread(p=>[...p,{type:"ai",...res}]);setQaLoading(false);
  };

  // ── Onboarding ──
  const submitOnboarding=()=>{
    setOnboardingList(p=>[{id:Date.now(),name:onboardingData.name||"新客戶",date:new Date().toLocaleDateString("zh-TW"),status:"待跟進",risk:onboardingData.riskLevel,goals:onboardingData.goals},...p]);
    setOnboardingDone(true);showToast("✓ 客戶資料已建立");
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
    return(<><style>{S}</style>
      <div className="app"><div className="page" style={{background:"var(--ink)"}}>
        <div style={{position:"relative"}}>
          <div className="nd-hero" style={{background:n.cls==="tm"?"linear-gradient(135deg,#0a1828,#1a2a0a)":n.cls==="ti"?"linear-gradient(135deg,#100a1a,#0a1028)":"linear-gradient(135deg,#1a0a0a,#0a1028)"}}>
            <span style={{fontSize:80,position:"relative",zIndex:1}}>{n.emoji}</span>
            <div className="nd-ov"/>
            <div className="nd-hcon"><div className="nd-tag">{n.tag}</div><div className="nd-title">{n.title}</div><div className="nd-meta"><span>{n.src}</span><span>{n.time}</span></div></div>
          </div>
          <div className="back-btn" onClick={()=>setScreen(null)}>← 返回</div>
        </div>
        <div className="nd-body">{n.body.split("\n\n").map((p,i)=><p key={i}>{p}</p>)}</div>
      </div></div>
      {/* 貴金屬表單 */}
      {showMetalForm&&(
        <div className="holding-form-overlay" onClick={e=>e.target===e.currentTarget&&setShowMetalForm(false)}>
          <div className="holding-form-sheet">
            <div className="hf-title">{editMetalId?"編輯貴金屬":"新增貴金屬"}</div>
            <div className="hf-lbl" style={{marginTop:0}}>產品</div>
            <select className="hf-inp" value={metalForm.product} onChange={e=>setMetalForm(p=>({...p,product:e.target.value}))} style={{appearance:"none",cursor:"pointer"}}>
              {["萬兆豐貴金屬 — 實體黃金","萬兆豐 — 金盈滿堂（黃金存摺）"].map(pr=><option key={pr} value={pr}>{pr}</option>)}
            </select>
            <div className="hf-lbl">重量（公克）</div>
            <input className="hf-inp" type="number" placeholder="例如：1000" value={metalForm.grams} onChange={e=>setMetalForm(p=>({...p,grams:e.target.value}))}/>
            <div className="hf-row">
              <div style={{flex:1}}><div className="hf-lbl">購入單價（USD/g）</div><input className="hf-inp" type="number" placeholder="例如：95" value={metalForm.costPerGram} onChange={e=>setMetalForm(p=>({...p,costPerGram:e.target.value}))}/></div>
              <div style={{flex:1,marginLeft:8}}><div className="hf-lbl">現價（USD/g）</div><input className="hf-inp" type="number" placeholder="例如：105" value={metalForm.currentPricePerGram} onChange={e=>setMetalForm(p=>({...p,currentPricePerGram:e.target.value}))}/></div>
            </div>
            <div className="hf-lbl">購入日期</div>
            <input className="hf-inp" type="month" value={metalForm.purchaseDate} onChange={e=>setMetalForm(p=>({...p,purchaseDate:e.target.value}))}/>
            <button className="hf-save-btn" onClick={saveMetal}>儲存</button>
            <button className="hf-cancel-btn" onClick={()=>setShowMetalForm(false)}>取消</button>
          </div>
        </div>
      )}
      {/* 房地產表單 */}
      {showRealEstateForm&&(
        <div className="holding-form-overlay" onClick={e=>e.target===e.currentTarget&&setShowRealEstateForm(false)}>
          <div className="holding-form-sheet">
            <div className="hf-title">{editRealEstateId?"編輯房地產":"新增房地產"}</div>
            <div className="hf-lbl" style={{marginTop:0}}>產品</div>
            <select className="hf-inp" value={realEstateForm.product} onChange={e=>setRealEstateForm(p=>({...p,product:e.target.value}))} style={{appearance:"none",cursor:"pointer"}}>
              {["萬兆豐 — 瓦努阿圖預售屋"].map(pr=><option key={pr} value={pr}>{pr}</option>)}
            </select>
            <div className="hf-lbl">投入金額（USD）</div>
            <input className="hf-inp" type="number" placeholder="例如：400000" value={realEstateForm.amountUSD} onChange={e=>setRealEstateForm(p=>({...p,amountUSD:e.target.value}))}/>
            <div className="hf-row">
              <div style={{flex:1}}><div className="hf-lbl">購入日期</div><input className="hf-inp" type="month" value={realEstateForm.purchaseDate} onChange={e=>setRealEstateForm(p=>({...p,purchaseDate:e.target.value}))}/></div>
              <div style={{flex:1,marginLeft:8}}><div className="hf-lbl">預計年化報酬（%）</div><input className="hf-inp" type="number" placeholder="例如：8" value={realEstateForm.annualReturn} onChange={e=>setRealEstateForm(p=>({...p,annualReturn:e.target.value}))}/></div>
            </div>
            <div className="hf-lbl">備註（選填）</div>
            <input className="hf-inp" placeholder="例如：已取得黃金護照" value={realEstateForm.notes} onChange={e=>setRealEstateForm(p=>({...p,notes:e.target.value}))}/>
            <button className="hf-save-btn" onClick={saveRealEstate}>儲存</button>
            <button className="hf-cancel-btn" onClick={()=>setShowRealEstateForm(false)}>取消</button>
          </div>
        </div>
      )}
      {showEditName&&(
        <div style={{position:"fixed",inset:0,background:"rgba(8,9,14,.88)",backdropFilter:"blur(8px)",zIndex:400,display:"flex",alignItems:"flex-end"}} onClick={e=>e.target===e.currentTarget&&setShowEditName(false)}>
          <div style={{background:"var(--card)",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,margin:"0 auto",padding:"24px 20px 40px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--td)",marginBottom:16}}>修改顯示名稱</div>
            <div className="hf-lbl" style={{marginTop:0}}>新的顯示名稱</div>
            <input className="hf-inp" placeholder="例如：王大明 先生" value={editNameVal} onChange={e=>setEditNameVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSaveDisplayName()} autoFocus/>
            <button className="hf-save-btn" onClick={handleSaveDisplayName} style={{marginTop:16}}>儲存</button>
            <button className="hf-cancel-btn" onClick={()=>setShowEditName(false)}>取消</button>
          </div>
        </div>
      )}
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
          <div className="back-btn" onClick={()=>setScreen(null)}>← 返回</div>
          <div className="kt-badge" style={{marginBottom:10}}>✦ {k.badge}</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#f0f2f8",lineHeight:1.4}}>{k.title}</div>
          <div style={{fontSize:11,color:"rgba(240,242,248,.38)",marginTop:8}}>凱特 · 2026年4月5日</div>
        </div>
        <div className="nd-body">{k.body.split("\n\n").map((p,i)=><p key={i}>{p}</p>)}</div>
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
      {showMsg&&<MessengerOverlay msgThread={msgThread} msgInput={msgInput} setMsgInput={setMsgInput} msgLoading={msgLoading} showProdMenu={showProdMenu} handleMsgSend={handleMsgSend} handleQuick={handleQuick} handleProductSelect={handleProductSelect} onClose={()=>setShowMsg(false)} threadRef={threadRef}/>}
    </>);
  }

  // ─── MAIN APP (4 tabs) ───
  const tabs=[
    {id:"home",icon:"⬡",label:"首頁"},
    {id:"assets",icon:"◉",label:"資產"},
    {id:"explore",icon:"◎",label:"市場"},
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
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:0}}>
                <div>
                  <div className="home-greeting">Welcome Back</div>
                  <div className="home-name">{currentUser?.display_name||"尊榮會員"}</div>
                  <div className="home-date">2026年 4月 9日</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginTop:4}}>
                  {isKate&&<div style={{background:"var(--gold-dim)",border:"1px solid rgba(200,168,75,.3)",borderRadius:20,padding:"6px 12px",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--gold)",cursor:"pointer"}} onClick={()=>{setTab("advisor");setAdvisorSub("picks");}}>後台 ✦</div>}
                  <div className="avatar-btn" onClick={()=>setScreen({type:"profile"})}>👤</div>
                </div>
              </div>
            </div>

            {/* 總資產大卡 */}
            <div style={{margin:"0 16px 12px"}}>
              <div className="asset-card">
                <div className="asset-lbl">總資產估值</div>
                <div className="asset-val">{fmtTWD(grandTotalTWD)}</div>
                <div className="asset-chg">▲ +42,300　今日 +1.11%</div>
                <div className="asset-breakdown">
                  <div className="ab-item"><div className="ab-lbl">保險</div><div className="ab-val" style={{color:"var(--gold)",fontSize:11}}>{fmtUSD(totalInsUSD)}</div></div>
                  <div className="ab-item"><div className="ab-lbl">股票</div><div className="ab-val" style={{color:"var(--blue)",fontSize:11}}>{fmtTWD(totalStockTWD)}</div></div>
                  <div className="ab-item"><div className="ab-lbl">固收</div><div className="ab-val" style={{color:"var(--green)",fontSize:11}}>{fmtUSD(totalFixedUSD)}</div></div>
                  <div className="ab-item"><div className="ab-lbl">現金</div><div className="ab-val" style={{color:"var(--silver)",fontSize:11}}>20%</div></div>
                </div>
              </div>
            </div>

            {/* 財務健康分 */}
            <div style={{margin:"0 16px 12px"}}>
              <div className="health-mini" onClick={()=>{setTab("assets");setAssetsSub("health");}}>
                <div className="hm-ring" style={{background:`conic-gradient(#4aaa80 0% ${healthScore||72}%,rgba(240,242,245,.1) ${healthScore||72}% 100%)`}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:"var(--green)"}}>{healthScore||72}</div>
                </div>
                <div className="hm-info">
                  <div className="hm-title">財務健康分</div>
                  <div className="hm-desc">{(healthScore||72)>=80?"優秀，繼續保持！":(healthScore||72)>=60?"良好，退休與保險配置仍有空間":"建議填寫健檢，了解改善方向"}</div>
                </div>
                <div className="hm-arr">›</div>
              </div>
            </div>

            {/* 凱特今日建議 */}
            <div className="sec">凱特今日建議</div>
            <div style={{margin:"0 16px 12px"}}>
              <div className="kate-suggest" onClick={()=>{setTab("advisor");setAdvisorSub("picks");}}>
                <div className="ks-head">
                  <div className="ks-badge">✦ 本週精選</div>
                </div>
                <div className="ks-title">{publishedPicks?.title||katePosts[0].title}</div>
                <div className="ks-preview">{publishedPicks?.body?.slice(0,80)||katePosts[0].preview}…</div>
                <div className="ks-action">
                  <div className="ks-more">查看完整建議 →</div>
                </div>
              </div>
            </div>

            {/* 市場指數 */}
            <div className="sec">市場概況</div>
            <div className="idx" style={{margin:"0 16px 12px"}}>
              {indices.map((m,i)=><div className="ii" key={i}><div className="ii-n">{m.name}</div><div className="ii-v">{m.val}</div><div className={`ii-c ${m.up?"up":"dn"}`}>{m.chg}</div></div>)}
            </div>

            {/* 即時新聞 */}
            <div className="sec">今日要聞</div>
            {newsLoading?(
              <div style={{margin:"0 16px 12px",padding:"16px",background:"var(--card)",borderRadius:14,display:"flex",alignItems:"center",gap:12}}>
                <div className="spin" style={{width:20,height:20,borderWidth:"1.5px"}}/>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"var(--md)"}}>載入最新新聞…</div>
              </div>
            ):(liveNews.length>0?liveNews:ALL_NEWS).slice(0,2).map((n,i)=>(
              <div className="news-card" key={i} onClick={()=>setScreen({type:"news",data:n})}>
                <div className="nc-emoji">{n.emoji||"📰"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="nc-tag">{n.tag}</div>
                  <div className="nc-title">{n.title}</div>
                  <div className="nc-meta">{n.src} · {n.time}</div>
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
              {[{id:"holdings",label:"💼 持有"},{id:"health",label:"🏥 財務健檢"},{id:"calc",label:"🧮 試算"}].map(t=>(
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
                    <button className="add-btn" style={{marginBottom:24}} onClick={()=>{setEditMetalId(null);setMetalForm(METAL_BLANK);setShowMetalForm(true);}}>+ 新增貴金屬</button>
                  </div>
                )}
                {/* 房地產 */}
                {holdingsTab==="realestate"&&(
                  <div className="hld-list">
                    {realEstateHoldings.map(h=>(
                      <div className="hld-item" key={h.id}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                          <div>
                            <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:2,color:"var(--rose)",textTransform:"uppercase",marginBottom:4}}>🏠 房地產</div>
                            <div className="hld-item-name">{h.product}</div>
                            <div className="hld-item-type">{h.purchaseDate} · {h.annualReturn}% p.a.</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"var(--rose)"}}>USD {Number(h.amountUSD).toLocaleString()}</div>
                          </div>
                        </div>
                        {h.notes&&<div style={{fontSize:11,color:"var(--md)",marginBottom:8}}>{h.notes}</div>}
                        <div className="hld-actions">
                          <button className="hld-edit-btn" onClick={()=>editRealEstate(h)}>✎ 編輯</button>
                          <button className="hld-del-btn" onClick={()=>deleteRealEstate(h.id)}>✕</button>
                        </div>
                      </div>
                    ))}
                    <button className="add-btn" style={{marginBottom:24}} onClick={()=>{setEditRealEstateId(null);setRealEstateForm(RE_BLANK);setShowRealEstateForm(true);}}>+ 新增房地產</button>
                  </div>
                )}
                                <button className="add-btn" style={{marginBottom:24}} onClick={()=>{setEditFixedId(null);setShowFixedForm(true);}}>+ 新增固收</button>
                  </div>
                )}
              </>
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

            {/* ─ 試算 ─ */}
            {assetsSub==="calc"&&(
              <div className="calc-section" style={{paddingTop:16}}>
                {/* 試算切換 */}
                <div style={{display:"flex",gap:10,marginBottom:16}}>
                  {[{id:"mortgage",label:"🏠 房貸活化"},{id:"retire",label:"🏖️ 退休金"}].map(c=>(
                    <div key={c.id} onClick={()=>setCalcMode(c.id)} style={{flex:1,padding:"11px",textAlign:"center",borderRadius:12,border:`1px solid ${calcMode===c.id?"rgba(200,168,75,.4)":"var(--bl)"}`,background:calcMode===c.id?"var(--gold-dim)":"transparent",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:1,color:calcMode===c.id?"var(--gold)":"var(--md)",cursor:"pointer",transition:"all .2s"}}>{c.label}</div>
                  ))}
                </div>
                {/* 房貸活化 */}
                {calcMode==="mortgage"&&(
                  <>
                    <div className="calc-card">
                      <div className="calc-title">🏠 房貸活化試算</div>
                      <div className="calc-desc">透過房屋淨值再融資，釋出資金投入高報酬商品，評估是否能產生正現金流。</div>
                      {[["房屋估值 (TWD)","homeValue","例如：20000000"],["剩餘房貸 (TWD)","loanBalance","例如：8000000"],["目前房貸利率 (%)","rate","例如：2.5"],["再融資年期 (年)","years","例如：20"],["目標投資年化報酬 (%)","targetRate","例如：6"]].map(([lb,k,ph])=>(
                        <div key={k}><div className="calc-lbl">{lb}</div><input className="calc-inp" type="number" placeholder={ph} value={mtgForm[k]} onChange={e=>setMtgForm(p=>({...p,[k]:e.target.value}))}/></div>
                      ))}
                      <button className="calc-btn" onClick={calcMortgage}>試算活化效益 →</button>
                    </div>
                    {mtgResult&&(
                      <div className="calc-result" style={{border:`1px solid ${mtgResult.feasible?"rgba(58,170,120,.3)":"rgba(216,88,104,.25)"}`}}>
                        <div className="calc-res-hd" style={{color:mtgResult.feasible?"var(--green)":"var(--rose)"}}>{mtgResult.feasible?"✓ 活化方案可行":"⚠ 活化方案需謹慎評估"}</div>
                        {[["房屋淨值","NT$ "+mtgResult.equity.toLocaleString()],["可釋出資金 (65% LTV)","NT$ "+mtgResult.releasable.toLocaleString()],["新增月供估算","NT$ "+mtgResult.newMonthly.toLocaleString()+"/月"],["年化預期收益","NT$ "+mtgResult.annualReturn.toLocaleString()+"/年"],["扣除月供後淨收益","NT$ "+mtgResult.netAnnual.toLocaleString()+"/年"]].map(([l,v],i)=>(
                          <div className="calc-res-row" key={i}>
                            <div className="calc-res-lbl">{l}</div>
                            <div className="calc-res-val" style={i===4?{color:mtgResult.feasible?"var(--green)":"var(--red)"}:{}}>{v}</div>
                          </div>
                        ))}
                        <div className="calc-note" style={{background:mtgResult.feasible?"var(--green-dim)":"var(--rose-dim)",color:mtgResult.feasible?"var(--green)":"var(--rose)"}}>{mtgResult.feasible?`每年可產生約 NT$ ${mtgResult.netAnnual.toLocaleString()} 正現金流，建議搭配分紅保單等穩健商品配置。`:`扣除月供後每年仍有 NT$ ${Math.abs(mtgResult.netAnnual).toLocaleString()} 缺口，需確認資金承受能力再決策。`}</div>
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
                      {[["目前年齡","currentAge","例如：40"],["預計退休年齡","retireAge","例如：65"],["目前已累積退休金 (TWD)","currentSavings","例如：3000000"],["每月定期儲蓄 (TWD)","monthlyContrib","例如：30000"],["預估年化報酬率 (%)","expectedReturn","例如：5"],["退休後每月需求 (TWD)","monthlyExpense","例如：80000"]].map(([lb,k,ph])=>(
                        <div key={k}><div className="calc-lbl">{lb}</div><input className="calc-inp" type="number" placeholder={ph} value={retForm[k]} onChange={e=>setRetForm(p=>({...p,[k]:e.target.value}))}/></div>
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
                        <div className="calc-note" style={{background:retResult.feasible?"var(--green-dim)":"var(--rose-dim)",color:retResult.feasible?"var(--green)":"var(--rose)"}}>{retResult.feasible?`按目前配置，退休後每月可提領 NT$ ${retResult.monthly.toLocaleString()}，高於目標 ${retResult.gap.toLocaleString()} 元。`:`每月仍有 NT$ ${retResult.shortfall.toLocaleString()} 缺口，建議增加儲蓄或以分紅保單補足退休金。`}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ EXPLORE (市場) ════ */}
        {tab==="explore"&&(
          <div>
            <div className="ph">
              <div className="ph-en">Market Explorer</div>
              <div className="ph-t">市場探索</div>
            </div>
            <div className="sub-tabs">
              {[{id:"news",label:"📰 財經新聞"},{id:"stocks",label:"📈 個股追蹤"}].map(t=>(
                <div key={t.id} className={`st ${exploreSub===t.id?"active":""}`} onClick={()=>setExploreSub(t.id)}>{t.label}</div>
              ))}
            </div>
            {exploreSub==="news"&&(
              <div style={{paddingTop:12}}>
                {newsLoading?(
                  <div style={{margin:"0 16px 14px",padding:"20px",background:"var(--card)",borderRadius:16,display:"flex",alignItems:"center",gap:12}}>
                    <div className="spin" style={{width:24,height:24,borderWidth:"2px"}}/>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:2,color:"var(--md)"}}>載入即時新聞…</div>
                  </div>
                ):(()=>{const newsToShow=liveNews.length>0?liveNews:ALL_NEWS;return(<>
                  <div className="news-feat" onClick={()=>setScreen({type:"news",data:newsToShow[0]})}>
                    <div className="news-feat-img" style={{background:"linear-gradient(135deg,#0a1828,#1a2a0a)"}}>{newsToShow[0]?.emoji||"📰"}</div>
                    <div className="news-feat-ov">
                      <div className="nf-tag">{newsToShow[0]?.tag}</div>
                      <div className="nf-tt">{newsToShow[0]?.title}</div>
                      <div className="nf-mt"><span>{newsToShow[0]?.src}</span><span>{newsToShow[0]?.time}</span></div>
                    </div>
                  </div>
                  {newsToShow.slice(1).map((n,i)=>(
                    <div className="news-list-item" key={i} onClick={()=>setScreen({type:"news",data:n})}>
                      <div className="nli-emoji">{n.emoji||"📰"}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div className="nli-tag">{n.tag}</div>
                        <div className="nli-title">{n.title}</div>
                        <div className="nli-meta">{n.src} · {n.time}</div>
                      </div>
                    </div>
                  ))}
                </>);})()}
                <div style={{height:8}}/>
              </div>
            )}
            {exploreSub==="stocks"&&(
              <div style={{paddingTop:12}}>
                <div className="idx" style={{margin:"0 16px 14px"}}>
                  {indices.map((m,i)=><div className="ii" key={i}><div className="ii-n">{m.name}</div><div className="ii-v">{m.val}</div><div className={`ii-c ${m.up?"up":"dn"}`}>{m.chg}</div></div>)}
                </div>
                {stocks.map((s,i)=>(
                  <div className="si" key={i} onClick={()=>setScreen({type:"stock",data:s})}>
                    <div className="si-ic">{s.icon}</div>
                    <div><div className="si-nm">{s.name}</div><div className="si-cd">{s.code}</div></div>
                    <div className="si-r"><div className="si-p">{s.price}</div><div className={`si-c ${s.up?"up":"dn"}`}>{s.chg}</div></div>
                  </div>
                ))}
                <button className="add-btn" style={{marginBottom:24}}>+ 新增追蹤股票</button>
              </div>
            )}
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
              {[{id:"picks",label:"✦ 投資建議"},{id:"tools",label:"📋 投資工具"},{id:"qa",label:"🤖 AI 問答"}].map(t=>(
                <div key={t.id} className={`st ${advisorSub===t.id?"active":""}`} onClick={()=>setAdvisorSub(t.id)}>{t.label}</div>
              ))}
            </div>

            {/* ─ 投資建議 ─ */}
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
                          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:"rgba(240,242,248,.4)",textTransform:"uppercase",marginBottom:10}}>選擇今日推薦主題</div>
                          <div className="theme-grid">
                            {THEMES.map(t=>(
                              <div key={t.key} className={`theme-chip ${selectedThemes.includes(t.key)?"selected":""}`} onClick={()=>toggleTheme(t.key)}>{t.icon} {t.label}</div>
                            ))}
                          </div>
                          <button className="gen-btn" onClick={handleGenerate} disabled={!selectedThemes.length}><span>✦</span> AI 搜尋時事並生成推薦</button>
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
                          <button className="pub-btn" style={{margin:"0 0 8px",width:"100%"}} onClick={handlePublishPicks}>審核完成，發布至客戶頁面</button>
                          <button className="reset-btn" style={{margin:"0",width:"100%"}} onClick={resetPicks}>重新搜尋生成</button>
                        </>
                      )}
                      {picksStep==="published"&&<button className="gen-btn" style={{marginTop:12}} onClick={resetPicks}>重新搜尋生成</button>}
                    </div>
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
                {PRODUCT_GROUPS.map((group,gi)=>(
                  <div key={gi}>
                    <div className="sec">{group.cat}</div>
                    {group.comingSoon?(
                      <div style={{margin:"0 16px 14px",background:"var(--card)",border:"1px dashed rgba(240,242,245,.12)",borderRadius:14,padding:"20px 16px",textAlign:"center"}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:3,color:"var(--md)",textTransform:"uppercase"}}>即將上架</div>
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
                              {/* 繳費年期 */}
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
                                <button onClick={e=>{e.stopPropagation();setShowMsg(true);}} style={{width:"100%",padding:"11px",borderRadius:10,border:`1px solid ${group.border}`,background:group.dimColor,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:2,color:group.color,cursor:"pointer"}}>💬 諮詢凱特顧問</button>
                                {/* 免責聲明 */}
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
            {advisorSub==="qa"&&(
              <div style={{paddingTop:16}}>
                <div className="qa-wrap">
                  <div className="qa-hero">
                    <div className="qa-hero-t">有問題，直接問凱特 AI</div>
                    <div className="qa-hero-s">財務規劃、產品比較、名詞解釋，一問就懂</div>
                  </div>
                  {qaThread.length===0&&(
                    <div className="qa-chips">
                      {QA_SUGGESTIONS.map((s,i)=><button key={i} className="qa-chip" onClick={()=>handleAsk(s)}>{s}</button>)}
                    </div>
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
            <select className="hf-inp" value={insForm.product} onChange={e=>setInsForm(p=>({...p,product:e.target.value}))} style={{appearance:"none",cursor:"pointer"}}>
              {INSURANCE_PRODUCTS.map(pr=><option key={pr} value={pr}>{pr}</option>)}
            </select>
            <div className="hf-lbl">保單類型</div>
            <div style={{display:"flex",gap:8}}>
              {["分紅","壽險"].map(t=>(<div key={t} className={`hf-type-chip ${insForm.policyType===t?"active":""}`} onClick={()=>setInsForm(p=>({...p,policyType:t}))} style={{flex:1,textAlign:"center",padding:"10px"}}>{t}</div>))}
            </div>
            <div className="hf-lbl">繳費年期</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["躉繳","2年","5年","12年"].map(t=>(<div key={t} className={`hf-type-chip ${insForm.paymentTerm===t?"active":""}`} onClick={()=>setInsForm(p=>({...p,paymentTerm:t}))} style={{padding:"8px 14px"}}>{t}</div>))}
            </div>
            <div className="hf-lbl">起保年份</div>
            <input className="hf-inp" type="number" placeholder="例如：2024" value={insForm.startYear} onChange={e=>setInsForm(p=>({...p,startYear:e.target.value}))}/>
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
            <select className="hf-inp" value={fixedForm.product} onChange={e=>setFixedForm(p=>({...p,product:e.target.value}))} style={{appearance:"none",cursor:"pointer"}}>
              {["萬兆豐 — 金益求金","萬兆豐 — 金益求兆"].map(pr=><option key={pr} value={pr}>{pr}</option>)}
            </select>
            <div className="hf-lbl">投入本金（USD）</div>
            <input className="hf-inp" type="number" placeholder="例如：100000" value={fixedForm.amountUSD} onChange={e=>setFixedForm(p=>({...p,amountUSD:e.target.value}))}/>
            <div className="hf-lbl">年化利率 (%)</div>
            <input className="hf-inp" type="number" placeholder="例如：6" value={fixedForm.annualRate} onChange={e=>setFixedForm(p=>({...p,annualRate:e.target.value}))}/>
            <div className="hf-row">
              <div style={{flex:1}}><div className="hf-lbl">起始日期</div><input className="hf-inp" type="month" value={fixedForm.startDate} onChange={e=>setFixedForm(p=>({...p,startDate:e.target.value}))}/></div>
              <div style={{flex:1,marginLeft:8}}><div className="hf-lbl">鎖定期（年）</div>
                <select className="hf-inp" value={fixedForm.lockYears} onChange={e=>setFixedForm(p=>({...p,lockYears:e.target.value}))} style={{appearance:"none",cursor:"pointer"}}>
                  {["1","2","3"].map(y=><option key={y} value={y}>{y} 年</option>)}
                </select>
              </div>
            </div>
            <button className="hf-save-btn" onClick={saveFixed}>儲存</button>
            <button className="hf-cancel-btn" onClick={()=>setShowFixedForm(false)}>取消</button>
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
      {showMsg&&<MessengerOverlay msgThread={msgThread} msgInput={msgInput} setMsgInput={setMsgInput} msgLoading={msgLoading} showProdMenu={showProdMenu} handleMsgSend={handleMsgSend} handleQuick={handleQuick} handleProductSelect={handleProductSelect} onClose={()=>setShowMsg(false)} threadRef={threadRef}/>}
    </div>
  </>);
}

function MessengerOverlay({msgThread,msgInput,setMsgInput,msgLoading,showProdMenu,handleMsgSend,handleQuick,handleProductSelect,onClose,threadRef}){
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
              {PRODUCTS_LIST.map(name=>(
                <div className="prod-menu-item" key={name} onClick={()=>handleProductSelect(name)}>
                  <div><div className="prod-menu-name">{name}</div><div className="prod-menu-region">{PRODUCT_KB_OBJ[name].region} · {PRODUCT_KB_OBJ[name].type}</div></div>
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
