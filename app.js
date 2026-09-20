const KEY="boardflow-v4",BOARD="2027-02-15";
const DATA={
Maths:["Real Numbers","Polynomials","Pair of Linear Equations in Two Variables","Quadratic Equations","Arithmetic Progressions","Triangles","Coordinate Geometry","Introduction to Trigonometry","Some Applications of Trigonometry","Circles","Areas Related to Circles","Surface Areas and Volumes","Statistics","Probability"],
Science:["Chemical Reactions and Equations","Acids, Bases and Salts","Metals and Non-metals","Carbon and its Compounds","Life Processes","Control and Coordination","How do Organisms Reproduce?","Heredity","Light – Reflection and Refraction","The Human Eye and the Colourful World","Electricity","Magnetic Effects of Electric Current","Our Environment"],
SST:["Resources and Development","Forest and Wildlife Resources","Water Resources","Agriculture","Manufacturing Industries","Lifelines of National Economy","Power Sharing","Federalism","Gender, Religion and Caste","Political Parties","Outcomes of Democracy","Challenges to Democracy","Development","Sectors of the Indian Economy","Money and Credit","Globalisation and the Indian Economy","Consumer Rights","The Rise of Nationalism in Europe","Nationalism in India","The Making of a Global World","The Age of Industrialisation","Print Culture and the Modern World"],
English:["A Letter to God","Nelson Mandela","Two Stories about Flying","From the Diary of Anne Frank","Glimpses of India","Mijbil the Otter","Madam Rides the Bus","The Sermon at Benares","The Proposal","A Triumph of Surgery","The Thief's Story","The Midnight Visitor","A Question of Trust","Footprints without Feet","The Making of a Scientist","The Necklace","Bholi","The Book That Saved the Earth"],
Hindi:["क्षितिज / कृतिका — पाठ 1","क्षितिज / कृतिका — पाठ 2","क्षितिज / कृतिका — पाठ 3","क्षितिज / कृतिका — पाठ 4","क्षितिज / कृतिका — पाठ 5","क्षितिज / कृतिका — पाठ 6","क्षितिज / कृतिका — पाठ 7","क्षितिज / कृतिका — पाठ 8","क्षितिज / कृतिका — पाठ 9","क्षितिज / कृतिका — पाठ 10"]
};
const STEPS=[["Lecture / Concept",30],["Notes",25],["NCERT",30],["Question Practice",35],["Oswaal / Competency",35],["PYQs",35],["Revision",25],["Chapter Test",40]];
const NORMAL=[["06:00","06:20","Ready"],["06:30","14:20","School"],["14:20","14:50","Lunch + shower"],["15:00","17:00","Coaching"],["17:30","18:00","Rest"],["18:00","23:00","Study"],["23:00","24:00","Sleep"]];
const ABSENT=[["06:00","08:00","Study"],["08:00","08:30","Breakfast"],["08:30","11:00","Deep Study"],["11:00","11:30","Break"],["11:30","13:00","NCERT + Questions"],["13:00","14:00","Lunch"],["14:00","17:00","Deep Study"],["17:00","17:30","Break"],["17:30","20:00","Study"],["20:00","21:00","Dinner"],["21:00","22:30","PYQ / Test"],["22:30","23:00","Tomorrow Plan"],["23:00","24:00","Sleep"]];
const base={tab:"home",mode:"normal",routines:{normal:NORMAL,absent:ABSENT,custom:NORMAL},chapters:[],tasks:[],exams:[],freeUntil:0,doneToday:false};
let s=load();
function load(){try{return {...base,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return JSON.parse(JSON.stringify(base))}}
function save(){localStorage.setItem(KEY,JSON.stringify(s))}
const $=q=>document.querySelector(q),all=q=>[...document.querySelectorAll(q)];
const esc=x=>String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function today(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata"}).format(new Date())}
function clock(){return new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date())}
function nowMin(){let p=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date()),h=+p.find(x=>x.type==="hour").value,m=+p.find(x=>x.type==="minute").value;return h*60+m}
function toast(x){let t=$("#toast");t.textContent=x;t.className="show";setTimeout(()=>t.className="",1500)}
function resetDay(){let d=today();if(s.dayStamp!==d){s.dayStamp=d;s.freeUntil=0;s.doneToday=false;save()}}
function daysLeft(){return Math.max(0,Math.ceil((new Date(BOARD+"T00:00:00+05:30")-new Date(today()+"T00:00:00+05:30"))/86400000))}
function routine(){return s.routines[s.mode]||NORMAL}
function available(){
 resetDay();
 if(s.doneToday)return 0;
 if(s.freeUntil)return Math.max(0,Math.ceil((s.freeUntil-Date.now())/60000));
 let n=nowMin(),total=0;
 routine().forEach(x=>{let a=time(x[0]),b=time(x[1]);if(b>n&&/study|deep|question|pyq|test|ncert/i.test(x[2]))total+=Math.max(0,b-Math.max(a,n))});
 return total;
}
function time(x){let [h,m]=x.split(":").map(Number);return h*60+m}
function tasks(){
 let out=[];
 s.tasks.filter(t=>!t.done).forEach(t=>out.push({id:t.id,text:`${t.subject} • ${t.chapter} — ${t.step}`,m:t.minutes,score:t.priority*20,why:"chapter workflow"}));
 s.exams.filter(e=>e.date>=today()).forEach(e=>(e.portions||[]).forEach(p=>out.push({text:`${p.subject} • ${p.chapter}`,m:35,score:90-Math.min(70,daysLeft()),why:`${e.name} • exam ${e.date}`})));
 out.push({text:"Board-pattern PYQ practice",m:35,score:30,why:"board preparation"});
 return out;
}
function plan(){
 let a=available(),u=0,o=[];
 tasks().sort((x,y)=>y.score-x.score).forEach(x=>{if(u+x.m<=a){o.push(x);u+=x.m}});
 return [o,u,a];
}
function planHTML(){
 let [x,u,a]=plan();
 return x.length?x.map((q,i)=>`<div class="planitem"><span class="num">${i+1} • ${q.m}m</span><div><b>${esc(q.text)}</b><small>${esc(q.why)}</small></div></div>`).join("")+`<div class="meta">Planned ${u}/${a} min • IST ${clock()}</div>`:`<div class="empty">No task fits right now.</div>`;
}
function examHTML(){return s.exams.length?s.exams.map(e=>`<div class="exam"><b>${esc(e.name)}</b><div class="meta">Prep ${e.start} → ${e.end} • Exam ${e.date}</div>${e.portions.map(p=>`<div class="portion">${esc(p.subject)} • ${esc(p.chapter)}</div>`).join("")}</div>`).join(""):`<div class="empty">No exams added.</div>`}
function chapterHTML(){
 return Object.keys(DATA).map(sub=>`<div class="setting"><b>${sub}</b><div class="meta">${DATA[sub].length} NCERT chapters</div>${DATA[sub].map(ch=>{let ts=s.tasks.filter(t=>t.subject===sub&&t.chapter===ch),d=ts.length?Math.round(ts.filter(t=>t.done).length/ts.length*100):0;return `<div class="chapterline"><span>${esc(ch)}</span><span>${d}%</span></div>`}).join("")}</div>`).join("");
}
function render(){
 resetDay();
 let done=s.tasks.filter(x=>x.done).length,pct=s.tasks.length?Math.round(done/s.tasks.length*100):0;
 let pages={
 home:`<section class="hero"><div><div class="eyebrow">${today()}</div><h1>BoardFlow</h1><div class="muted">IST ${clock()} • ${s.mode==="absent"?"Absent day":"Normal day"}</div></div><div class="count"><strong>${daysLeft()}</strong><span>DAYS TO BOARDS</span></div></section>
 <div class="grid3"><div class="stat"><span>AVAILABLE NOW</span><b>${available()}m</b></div><div class="stat"><span>PROGRESS</span><b>${pct}%</b></div><div class="stat"><span>OPEN</span><b>${s.tasks.filter(x=>!x.done).length}</b></div></div>
 <section class="card"><div class="cardhead"><div><div class="eyebrow">RIGHT NOW</div><h2>What can you do?</h2></div></div><div class="quick"><button onclick="free(20)">🟢 20m</button><button onclick="free(30)">🟢 30m</button><button onclick="free(45)">🟢 45m</button><button onclick="free(60)">🟢 1 hour</button><button onclick="busy(20)">🔴 Busy 20m</button><button onclick="busy(60)">🔴 Busy 1h</button><button onclick="finish()">😴 Done today</button></div></section>
 <section class="card"><div class="cardhead"><h2>Smart plan</h2><button class="secondary" onclick="render()">Refresh</button></div>${planHTML()}</section>
 <section class="card"><div class="cardhead"><h2>Exams</h2><button class="secondary" onclick="examModal()">+ Add</button></div>${examHTML()}</section>`,
 plan:`<section class="hero"><div><div class="eyebrow">ADAPTIVE PLANNER</div><h1>Today's Plan</h1><div class="muted">The planner uses IST + your current availability.</div></div></section><section class="card">${planHTML()}</section><section class="card"><div class="cardhead"><h2>Chapter workflows</h2><button class="primary" onclick="chapterModal()">+ Add</button></div>${chapterHTML()}</section>`,
 exams:`<section class="hero"><div><div class="eyebrow">EXAM CENTER</div><h1>Exams</h1><div class="muted">Select CBSE chapters directly.</div></div><button class="primary" onclick="examModal()">+ Add exam</button></section><section class="card">${examHTML()}</section>`,
 subjects:`<section class="hero"><div><div class="eyebrow">CBSE ROADMAP</div><h1>Subjects</h1><div class="muted">NCERT chapter-by-chapter tracking.</div></div></section><section class="card">${chapterHTML()}</section>`,
 progress:`<section class="hero"><div><div class="eyebrow">PROGRESS</div><h1>${pct}%</h1><div class="muted">${done}/${s.tasks.length} workflow tasks completed.</div></div></section><section class="card"><div class="progressbar"><div class="fill" style="width:${pct}%"></div></div></section>`,
 settings:`<section class="hero"><div><div class="eyebrow">SETTINGS</div><h1>Control Center</h1><div class="muted">Current IST: ${clock()}</div></div></section><section class="card"><div class="setting"><b>Day mode</b><p>${s.mode}</p><button class="secondary" onclick="modeModal()">Change</button></div><div class="setting"><b>Quick availability</b><p>Free now or busy temporarily.</p><button class="secondary" onclick="free(30)">I'm free for 30m</button></div><div class="setting"><b>Reset</b><p>Delete BoardFlow V4 data.</p><button class="secondary" onclick="resetApp()">Reset</button></div></section>`};
 $("#app").innerHTML=pages[s.tab]||pages.home;
 all("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===s.tab));
 all("[data-task]").forEach(x=>x.onchange=()=>{let t=s.tasks.find(t=>String(t.id)===x.dataset.task);if(t)t.done=x.checked;save();render()});
}
function modal(html){let old=$("#modal");if(old)old.remove();let d=document.createElement("div");d.id="modal";d.innerHTML=`<div class="modalcard">${html}</div>`;document.body.appendChild(d)}
function examModal(){
 modal(`<div class="modalhead"><h2>Add exam</h2><button class="iconbtn" onclick="this.closest('#modal').remove()">×</button></div>
 <label>Exam name<input id="en" placeholder="Half-yearly / Pre-board"></label>
 <div class="twocol"><label>Prep start<input id="es" type="date" value="${today()}"></label><label>Prep end<input id="ee" type="date"></label></div>
 <label>Exam date<input id="ed" type="date"></label><div id="ep"></div>
 <button class="secondary" onclick="addExamSub()">+ Select subject/chapter</button><button class="primary" onclick="saveExam()">Save exam</button>`);
 addExamSub();$("#ed").onchange=()=>$("#ee").value=$("#ed").value;
}
function addExamSub(){
 let d=document.createElement("div");d.className="portionrow";d.innerHTML=`<select class="esub">${Object.keys(DATA).map(x=>`<option>${x}</option>`).join("")}</select><select class="echap"></select><button class="iconbtn" onclick="this.parentElement.remove()">×</button>`;$("#ep").appendChild(d);
 let a=d.querySelector(".esub"),b=d.querySelector(".echap");function f(){b.innerHTML=DATA[a.value].map(x=>`<option>${x}</option>`).join("")}a.onchange=f;f();
}
function saveExam(){
 let rows=all(".portionrow").map(r=>({subject:r.querySelector(".esub").value,chapter:r.querySelector(".echap").value}));
 if(!$("#en").value||!$("#ed").value||$("#es").value>$("#ee").value||$("#ee").value>$("#ed").value){toast("Check exam dates");return}
 s.exams.push({id:"e"+Date.now(),name:$("#en").value,date:$("#ed").value,start:$("#es").value,end:$("#ee").value,portions:rows});save();$("#modal").remove();render();toast("Exam saved");
}
function chapterModal(){
 modal(`<div class="modalhead"><h2>Add chapter workflow</h2><button class="iconbtn" onclick="this.closest('#modal').remove()">×</button></div><label>Subject<select id="cs">${Object.keys(DATA).map(x=>`<option>${x}</option>`).join("")}</select></label><label>Chapter<select id="cc"></select></label><div id="steps">${STEPS.map((x,i)=>`<label><input type="checkbox" class="st" value="${i}" ${i<6?"checked":""}> ${x[0]} • ${x[1]}m</label>`).join("")}</div><button class="primary" onclick="saveChapter()">Create workflow</button>`);
 let a=$("#cs"),b=$("#cc");function f(){b.innerHTML=DATA[a.value].map(x=>`<option>${x}</option>`).join("")}a.onchange=f;f();
}
function saveChapter(){
 let sub=$("#cs").value,ch=$("#cc").value,id="c"+Date.now();
 all(".st:checked").forEach((x,i)=>{let z=STEPS[+x.value];s.tasks.push({id:"t"+Date.now()+i,subject:sub,chapter:ch,step:z[0],minutes:z[1],priority:+x.value>=5?3:2,done:false})});
 s.chapters.push({id,subject:sub,chapter:ch});save();$("#modal").remove();render();toast("Workflow created");
}
function modeModal(){modal(`<div class="modalhead"><h2>Day mode</h2><button class="iconbtn" onclick="this.closest('#modal').remove()">×</button></div><button class="primary" onclick="setMode('normal')">Normal school day</button><button class="secondary" onclick="setMode('absent')">Absent from school</button><button class="secondary" onclick="setMode('custom')">Custom routine</button>`)}
function setMode(x){s.mode=x;save();$("#modal").remove();render()}
function free(m){s.freeUntil=Date.now()+m*60000;s.doneToday=false;save();render();toast(`Free for ${m} minutes`)}
function busy(m){s.freeUntil=Date.now()+m*60000;s.busy=true;save();render();toast(`Planner paused for ${m} minutes`)}
function finish(){s.doneToday=true;s.freeUntil=0;save();render();toast("Done for today")}
function resetApp(){if(confirm("Reset BoardFlow?")){localStorage.removeItem(KEY);location.reload()}}
all("#nav button").forEach(b=>b.onclick=()=>{s.tab=b.dataset.tab;save();render()});
if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js?v=4").catch(()=>{});
setInterval(()=>render(),60000);
render();
