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

/* ===== BOARDFLOW V5 TEST ENGINE ===== */

const TEST_BANK={
Maths:{
"Real Numbers":[
["MCQ","If HCF(96,404)=4, what is their LCM?","9696",["9696","969","96","404"]],
["Short","State Euclid's division lemma.","For positive integers a and b, a=bq+r, where 0≤r<b.",[],]
],
"Polynomials":[
["MCQ","If α and β are zeroes of x²-5x+6, then α+β is:","5",["5","6","-5","-6"]],
["Short","Find the zeroes of x²-5x+6.","2 and 3",[]]
],
"Quadratic Equations":[
["MCQ","The discriminant of ax²+bx+c is:","b²-4ac",["b²+4ac","b²-4ac","4ac-b²","2b-4ac"]],
["Short","Write the quadratic formula.","x=(-b±√(b²-4ac))/(2a)",[]]
],
"Arithmetic Progressions":[
["MCQ","The common difference of 3, 7, 11, 15 is:","4",["2","3","4","5"]]
],
"Triangles":[
["MCQ","Two triangles are similar if their corresponding angles are:","Equal",["Supplementary","Equal","Complementary","Different"]]
],
"Coordinate Geometry":[
["MCQ","Distance between (0,0) and (3,4) is:","5",["3","4","5","7"]]
],
"Introduction to Trigonometry":[
["MCQ","sin²θ + cos²θ equals:","1",["0","1","2","sinθ"]]
],
"Statistics":[
["MCQ","The value occurring most frequently in a data set is called:","Mode",["Mean","Median","Mode","Range"]]
],
"Probability":[
["MCQ","Probability of a sure event is:","1",["0","1","1/2","-1"]]
]
},
Science:{
"Chemical Reactions and Equations":[
["MCQ","A reaction in which heat is released is called:","Exothermic",["Endothermic","Exothermic","Neutral","Displacement"]],
["Short","What is a balanced chemical equation?","An equation having equal numbers of atoms of each element on both sides.",[]]
],
"Acids, Bases and Salts":[
["MCQ","The pH of a neutral solution at room temperature is approximately:","7",["0","5","7","14"]]
],
"Metals and Non-metals":[
["MCQ","Which metal is liquid at room temperature?","Mercury",["Iron","Copper","Mercury","Aluminium"]]
],
"Carbon and its Compounds":[
["MCQ","The functional group of alcohols is:","-OH",["-COOH","-OH","-CHO","-CO-"]]
],
"Life Processes":[
["MCQ","The process by which green plants prepare food is:","Photosynthesis",["Respiration","Photosynthesis","Transpiration","Excretion"]]
],
"Control and Coordination":[
["MCQ","The basic unit of the nervous system is:","Neuron",["Nephron","Neuron","Alveolus","Platelet"]]
],
"How do Organisms Reproduce?":[
["MCQ","Binary fission is commonly seen in:","Amoeba",["Amoeba","Human","Rose","Mango"]]
],
"Heredity":[
["MCQ","The basic unit of heredity is:","Gene",["Cell","Gene","Tissue","Organ"]]
],
"Light – Reflection and Refraction":[
["MCQ","The SI unit of power of a lens is:","Dioptre",["Metre","Watt","Dioptre","Joule"]]
],
"The Human Eye and the Colourful World":[
["MCQ","Myopia is corrected using a:","Concave lens",["Convex lens","Concave lens","Plane mirror","Prism"]]
],
"Electricity":[
["MCQ","The SI unit of resistance is:","Ohm",["Volt","Ampere","Ohm","Watt"]],
["MCQ","Electrical power can be written as:","VI",["V/I","VI","I/V","IR"]]
],
"Magnetic Effects of Electric Current":[
["MCQ","The direction of magnetic field around a straight current-carrying conductor is given by:","Right-hand thumb rule",["Left-hand rule","Right-hand thumb rule","Fleming's left-hand rule","Ohm's law"]]
],
"Our Environment":[
["MCQ","The first trophic level generally consists of:","Producers",["Consumers","Decomposers","Producers","Carnivores"]]
]
},
SST:{
"Resources and Development":[
["MCQ","Which resource is obtained from living organisms?","Biotic resource",["Abiotic resource","Biotic resource","Non-renewable resource","Human-made resource"]]
],
"Power Sharing":[
["MCQ","Power sharing is desirable because it helps reduce:","Conflict",["Democracy","Conflict","Participation","Representation"]]
],
"Federalism":[
["MCQ","India has how many levels of government in the federal system?","Three",["One","Two","Three","Four"]]
],
"Development":[
["MCQ","Per capita income is calculated by dividing total income by:","Total population",["Area","Total population","Exports","Workers"]]
],
"Money and Credit":[
["MCQ","The modern form of money mainly includes:","Currency and deposits",["Only gold","Currency and deposits","Only coins","Land"]]
],
"Nationalism in India":[
["MCQ","The Non-Cooperation Movement was launched in:","1920",["1919","1920","1930","1942"]]
],
"Print Culture and the Modern World":[
["MCQ","The printing press in Europe is associated with:","Johannes Gutenberg",["James Watt","Johannes Gutenberg","Newton","Galileo"]]
]
},
English:{
"A Letter to God":[
["MCQ","Lencho was a:","Farmer",["Teacher","Farmer","Postmaster","Doctor"]]
],
"Nelson Mandela":[
["MCQ","Nelson Mandela became South Africa's first black president in:","1994",["1989","1990","1994","2000"]]
],
"From the Diary of Anne Frank":[
["MCQ","Anne named her diary:","Kitty",["Margot","Kitty","Helen","Anna"]]
],
"The Proposal":[
["MCQ","The Proposal is a:","Play",["Poem","Play","Novel","Essay"]]
]
},
Hindi:{
"क्षितिज / कृतिका — पाठ 1":[
["Short","इस पाठ के मुख्य विचार को अपने शब्दों में लिखिए।","उत्तर पाठ के मुख्य विचार और लेखक के संदेश के आधार पर लिखें।",[]]
],
"क्षितिज / कृतिका — पाठ 2":[
["Short","पाठ के आधार पर लेखक के दृष्टिकोण को स्पष्ट कीजिए।","उत्तर पाठ में दिए विचारों और उदाहरणों के आधार पर लिखें।",[]]
]
}
};

function ensureTests(){if(!Array.isArray(s.tests))s.tests=[];save()}

function testSubjects(){
 return Object.keys(TEST_BANK).map(x=>`<option>${x}</option>`).join("");
}

function testChapters(sub){
 return Object.keys(TEST_BANK[sub]||{}).map(x=>`<option>${esc(x)}</option>`).join("");
}

function testsPage(){
 ensureTests();
 let attempts=s.tests||[];
 let avg=attempts.length?Math.round(attempts.reduce((a,b)=>a+b.percent,0)/attempts.length):0;
 return `<section class="hero">
 <div><div class="eyebrow">TEST CENTER</div><h1>Tests & PYQs</h1>
 <div class="muted">Original CBSE-pattern practice + PYQ tracking</div></div>
 </section>
 <div class="grid3">
 <div class="stat"><span>TESTS</span><b>${attempts.length}</b></div>
 <div class="stat"><span>AVERAGE</span><b>${avg}%</b></div>
 <div class="stat"><span>PYQ ATTEMPTS</span><b>${attempts.filter(x=>x.type==="PYQ").length}</b></div>
 </div>
 <section class="card">
 <div class="cardhead"><h2>Start practice</h2></div>
 <button class="primary" onclick="startTest()">📝 Chapter Test</button>
 <button class="secondary" onclick="pyqTest()">📚 PYQ Practice</button>
 </section>
 <section class="card">
 <div class="cardhead"><h2>Test history</h2></div>
 ${attempts.length?attempts.slice().reverse().map(x=>`<div class="planitem">
 <div><b>${esc(x.subject)} • ${esc(x.chapter)}</b>
 <small>${esc(x.type)} • ${x.score}/${x.total} • ${x.percent}% • ${x.date}</small></div>
 </div>`).join(""):`<div class="empty">No tests attempted yet.</div>`}
 </section>`;
}

function startTest(type="TEST"){
 ensureTests();
 modal(`<div class="modalhead"><h2>${type==="PYQ"?"PYQ Practice":"Chapter Test"}</h2>
 <button class="iconbtn" onclick="this.closest('#modal').remove()">×</button></div>
 <label>Subject<select id="tsub" onchange="changeTestChapter()">${testSubjects()}</select></label>
 <label>Chapter<select id="tchap"></select></label>
 <button class="primary" onclick="runTest('${type}')">Start</button>`);
 changeTestChapter();
}

function changeTestChapter(){
 let sub=$("#tsub").value;
 $("#tchap").innerHTML=testChapters(sub);
}

function pyqTest(){startTest("PYQ")}

function runTest(type){
 let sub=$("#tsub").value,ch=$("#tchap").value;
 let bank=(TEST_BANK[sub]&&TEST_BANK[sub][ch])||[];
 if(!bank.length){toast("No questions yet for this chapter");return}
 let qs=bank.slice(0,10);
 let html=`<div class="modalhead"><h2>${type==="PYQ"?"PYQ":"Chapter"} • ${esc(ch)}</h2></div>`;
 qs.forEach((q,i)=>{
  html+=`<div class="question"><b>Q${i+1}. ${esc(q[1])}</b>`;
  if(q[3]&&q[3].length)html+=q[3].map(o=>`<label><input type="radio" name="q${i}" value="${esc(o)}"> ${esc(o)}</label>`).join("");
  else html+=`<input class="ans" data-i="${i}" placeholder="Write your answer">`;
  html+=`</div>`;
 });
 html+=`<button class="primary" onclick="submitTest('${type}',${JSON.stringify(sub)},${JSON.stringify(ch)},${qs.length})">Submit test</button>`;
 modal(html);
 window.currentQuestions=qs;
}

function submitTest(type,sub,ch,total){
 let score=0;
 (window.currentQuestions||[]).forEach((q,i)=>{
  let val;
  if(q[3]&&q[3].length){
   let r=document.querySelector(`input[name="q${i}"]:checked`);
   val=r?r.value:"";
  }else{
   let a=document.querySelector(`.ans[data-i="${i}"]`);
   val=a?a.value.trim():"";
  }
  if(val.toLowerCase()===String(q[2]).toLowerCase())score++;
 });
 let percent=Math.round(score/total*100);
 s.tests.push({id:"test"+Date.now(),type,subject:sub,chapter:ch,score,total,percent,date:today()});
 save();
 $("#modal").remove();
 render();
 toast(`Score: ${score}/${total} • ${percent}%`);
}

function renderWithTests(){
 if(s.tab==="tests")$("#app").innerHTML=testsPage();
 render();
}

const oldRender=render;
render=function(){
 oldRender();
 if(s.tab==="tests")$("#app").innerHTML=testsPage();
 all("#nav button").forEach(b=>b.onclick=()=>{
  s.tab=b.dataset.tab;
  save();
  render();
 });
};

if(!all("#nav button").some(x=>x.dataset.tab==="tests")){
 let n=document.createElement("button");
 n.dataset.tab="tests";
 n.innerHTML="📝<span>Tests</span>";
 n.onclick=()=>{s.tab="tests";save();render()};
 $("#nav").appendChild(n);
}


/* ===== V5.1 TEST FIX ===== */

function startTest(type="TEST"){
  const subjects=Object.keys(DATA);
  modal(`
    <div class="testmodal">
      <div class="modalhead">
        <div>
          <div class="eyebrow">TEST SETUP</div>
          <h2>${type==="PYQ"?"PYQ Practice":"CBSE Competency Test"}</h2>
        </div>
        <button class="iconbtn" onclick="this.closest('#modal').remove()">×</button>
      </div>

      <label>Subject
        <select id="tsub">
          ${subjects.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("")}
        </select>
      </label>

      <label>Chapter
        <select id="tchap"></select>
      </label>

      <label>Test length
        <select id="tlength">
          <option value="5">5 questions • Quick</option>
          <option value="10" selected>10 questions • Standard</option>
          <option value="15">15 questions • Full practice</option>
        </select>
      </label>

      <div class="testnote">
        <b>CBSE competency mode</b>
        <small>
          Questions are designed around application, case-based,
          assertion/reasoning and concept-use patterns. They are
          not claimed to be predictions of the 2027 board paper.
        </small>
      </div>

      <button class="primary" onclick="launchSelectedTest('${type}')">
        🚀 Start Test
      </button>
    </div>
  `);

  const sub=$("#tsub");
  sub.onchange=changeTestChapter;
  changeTestChapter();
}

function changeTestChapter(){
  const sub=$("#tsub");
  const chap=$("#tchap");
  if(!sub||!chap)return;

  const list=Object.keys(TEST_BANK[sub.value]||{});

  chap.innerHTML=list.length
    ? list.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("")
    : `<option value="">No questions added yet</option>`;
}

function launchSelectedTest(type){
  const sub=$("#tsub")?.value;
  const ch=$("#tchap")?.value;
  const len=Number($("#tlength")?.value||10);

  if(!sub||!ch){
    toast("Select a subject and chapter first");
    return;
  }

  runTestV51(type,sub,ch,len);
}

function runTestV51(type,sub,ch,len){
  let bank=(TEST_BANK[sub]&&TEST_BANK[sub][ch])||[];

  if(!bank.length){
    toast("Questions coming for this chapter");
    return;
  }

  bank=bank.slice(0,len);

  let html=`
    <div class="testscreen">
      <div class="testtop">
        <div>
          <div class="eyebrow">${type==="PYQ"?"PYQ PRACTICE":"CBSE COMPETENCY"}</div>
          <h2>${esc(ch)}</h2>
          <small>${esc(sub)} • ${bank.length} questions</small>
        </div>
        <button class="iconbtn" onclick="this.closest('#modal').remove()">×</button>
      </div>

      <div class="question-scroll">
  `;

  bank.forEach((q,i)=>{
    html+=`
      <div class="question">
        <div class="qnumber">QUESTION ${i+1}</div>
        <b>${esc(q[1])}</b>
    `;

    if(q[3]&&q[3].length){
      html+=`
        <div class="options">
          ${q[3].map((o,j)=>`
            <label class="option">
              <input type="radio" name="q${i}" value="${esc(o)}">
              <span>${String.fromCharCode(65+j)}</span>
              ${esc(o)}
            </label>
          `).join("")}
        </div>`;
    }else{
      html+=`
        <textarea class="ans" data-i="${i}"
          placeholder="Write your answer here..."></textarea>`;
    }

    html+=`</div>`;
  });

  html+=`
      </div>

      <div class="testbottom">
        <button class="primary"
          onclick="submitTestV51('${type}',${JSON.stringify(sub)},${JSON.stringify(ch)})">
          Submit Test
        </button>
      </div>
    </div>
  `;

  modal(html);
  window.currentQuestions=bank;
}

function submitTestV51(type,sub,ch){
  const qs=window.currentQuestions||[];
  let score=0;

  qs.forEach((q,i)=>{
    let val="";

    if(q[3]&&q[3].length){
      const r=document.querySelector(`input[name="q${i}"]:checked`);
      if(r)val=r.value;
    }else{
      const a=document.querySelector(`.ans[data-i="${i}"]`);
      if(a)val=a.value.trim();
    }

    if(val.toLowerCase()===String(q[2]).toLowerCase()){
      score++;
    }
  });

  const total=qs.length;
  const percent=total?Math.round(score/total*100):0;

  if(!Array.isArray(s.tests))s.tests=[];

  s.tests.push({
    id:"test"+Date.now(),
    type,
    subject:sub,
    chapter:ch,
    score,
    total,
    percent,
    date:today()
  });

  save();

  $("#modal").innerHTML=`
    <div class="resultscreen">
      <div class="eyebrow">TEST COMPLETE</div>
      <h1>${percent}%</h1>
      <p>${score}/${total} correct</p>

      <div class="resultbar">
        <div style="width:${percent}%"></div>
      </div>

      <div class="resultinfo">
        <b>${esc(sub)}</b>
        <span>${esc(ch)}</span>
      </div>

      <button class="primary" onclick="this.closest('#modal').remove();render()">
        Done
      </button>
    </div>
  `;
}

/* Fix tests tab so it always opens setup screen */
function testsPage(){
  ensureTests();

  const attempts=s.tests||[];
  const avg=attempts.length
    ? Math.round(attempts.reduce((a,b)=>a+b.percent,0)/attempts.length)
    : 0;

  return `
    <section class="hero">
      <div>
        <div class="eyebrow">TEST CENTER</div>
        <h1>Tests & PYQs</h1>
        <div class="muted">
          CBSE competency-style preparation
        </div>
      </div>
    </section>

    <div class="grid3">
      <div class="stat">
        <span>TESTS</span>
        <b>${attempts.length}</b>
      </div>
      <div class="stat">
        <span>AVERAGE</span>
        <b>${avg}%</b>
      </div>
      <div class="stat">
        <span>PYQs</span>
        <b>${attempts.filter(x=>x.type==="PYQ").length}</b>
      </div>
    </div>

    <section class="card">
      <div class="cardhead">
        <h2>Practice</h2>
      </div>

      <button class="primary" onclick="startTest('TEST')">
        🧠 CBSE Competency Test
      </button>

      <button class="secondary" onclick="startTest('PYQ')">
        📚 Previous-Year Question Practice
      </button>
    </section>

    <section class="card">
      <div class="cardhead">
        <h2>Test History</h2>
      </div>

      ${
        attempts.length
        ? attempts.slice().reverse().map(x=>`
          <div class="planitem">
            <div>
              <b>${esc(x.subject)} • ${esc(x.chapter)}</b>
              <small>
                ${esc(x.type)} • ${x.score}/${x.total}
                • ${x.percent}% • ${x.date}
              </small>
            </div>
          </div>
        `).join("")
        : `<div class="empty">No tests attempted yet.</div>`
      }
    </section>
  `;
}

/* ================= BOARDFLOW V6 TEST SYSTEM ================= */

(function(){

const V6={
tests:Array.isArray(s.tests)?s.tests:[],
wrong:Array.isArray(s.wrong)?s.wrong:[],
};

const TYPES=[
["MCQ","Concept + application"],
["Assertion–Reason","Reasoning"],
["Case Study","Interpret + apply"],
["Competency","Real-world application"],
["Short Answer","Recall + explain"],
["Long Answer","Analyse + explain"],
["HOTS","Higher-order thinking"],
["Numerical","Calculation + application"]
];

function v6Save(){
 s.tests=V6.tests;
 s.wrong=V6.wrong;
 save();
}

function v6Chapters(sub){
 return Object.keys(DATA[sub]||{});
}

/*
 Original practice framework.
 Actual CBSE/PYQ material is kept separate and
 should be linked/cited by year rather than copied
 wholesale into the app.
*/

const PRACTICE={

Maths:{
"Real Numbers":[
["MCQ","A student finds the HCF of two numbers using Euclid's algorithm. Which quantity is guaranteed to be the final non-zero remainder?","HCF"],
["Competency","A shop has 96 red and 404 blue items. They must be packed into identical groups with no item left. What is the greatest possible number of groups?","4"],
["HOTS","Explain why the product of two positive integers can be written using their HCF and LCM.","Product = HCF × LCM"],
["Short Answer","State Euclid's division lemma.","a = bq + r, 0 ≤ r < b"]
],
"Polynomials":[
["MCQ","If the zeroes of a quadratic polynomial have sum 5 and product 6, which polynomial can represent them?","x² - 5x + 6"],
["Competency","A polynomial has zeroes 2 and 3. Determine the polynomial when its leading coefficient is 1.","x² - 5x + 6"],
["HOTS","Explain the relationship between the coefficients and zeroes of ax²+bx+c.","Sum = -b/a, product = c/a"]
],
"Pair of Linear Equations in Two Variables":[
["MCQ","Two linear equations have exactly one solution when their corresponding coefficient ratios are unequal.","Unique solution"],
["Competency","Two taxi plans have different fixed charges and different per-kilometre charges. Explain how their intersection represents the distance at which both cost the same.","Point of intersection"],
["HOTS","Explain geometrically what it means if two linear equations have infinitely many solutions.","Coincident lines"]
],
"Quadratic Equations":[
["MCQ","For ax²+bx+c=0, which expression determines the nature of roots?","b² - 4ac"],
["Competency","A ball's height is represented by a quadratic expression. Explain how the roots can represent the times when it reaches the ground.","Times at which height is zero"],
["HOTS","Explain the condition for equal roots.","b² - 4ac = 0"]
],
"Arithmetic Progressions":[
["MCQ","For an AP with first term a and common difference d, the nth term is:","a+(n-1)d"],
["Competency","A staircase has 5, 8, 11, 14... tiles in successive rows. Find the number of tiles in the 20th row.","62"],
["HOTS","Explain how the sum formula can be used to calculate the total number of objects arranged in equally increasing rows.","Sn=n/2[2a+(n-1)d]"]
],
"Triangles":[
["MCQ","If two triangles have their corresponding angles equal, they are:","Similar"],
["Competency","Two triangular frames have proportional corresponding sides. Explain why their shape can be considered the same.","They are similar"],
["HOTS","Explain how similarity can be used to calculate the height of an object that cannot be measured directly.","Use proportional corresponding sides"]
],
"Coordinate Geometry":[
["MCQ","The distance between (0,0) and (3,4) is:","5"],
["Competency","A map represents two locations by coordinates (2,3) and (8,11). Explain how their straight-line distance can be calculated.","Distance formula"],
["HOTS","Explain how the section formula locates a point dividing a line segment in a given ratio.","Weighted coordinate average"]
],
"Introduction to Trigonometry":[
["MCQ","sin²θ + cos²θ is equal to:","1"],
["Competency","A ladder forms a right triangle with a wall. Explain which trigonometric ratio could determine its angle with the ground if height and ladder length are known.","sin θ"],
["HOTS","Explain why trigonometric ratios depend on the angle rather than the size of a similar right triangle.","Corresponding sides remain proportional"]
],
"Statistics":[
["MCQ","The value occurring most frequently in a data set is called:","Mode"],
["Competency","A teacher wants the most common score in a class. Which measure is useful and why?","Mode"],
["HOTS","Explain why mean, median and mode may give different information about the same data.","They measure different aspects of distribution"]
],
"Probability":[
["MCQ","The probability of a sure event is:","1"],
["Competency","A fair die is thrown once. Explain why the probability of getting a number from 1 to 6 is 1.","It is a sure event"],
["HOTS","Explain why the probability of an impossible event is zero.","It has no favourable outcomes"]
]
},

Science:{
"Chemical Reactions and Equations":[
["MCQ","A reaction in which heat is released is called:","Exothermic"],
["Competency","A substance changes colour and releases gas after reacting with another substance. Give two observations that indicate a chemical reaction.","Colour change and gas formation"],
["HOTS","Explain why balancing a chemical equation is necessary.","Atoms must be conserved"]
],
"Acids, Bases and Salts":[
["MCQ","A neutral solution has pH approximately:","7"],
["Competency","A farmer tests soil and finds it strongly acidic. Explain why adding a suitable base can help.","It neutralises excess acidity"],
["HOTS","Explain how pH affects biological systems.","Biological processes require suitable pH ranges"]
],
"Metals and Non-metals":[
["MCQ","Which metal is liquid at room temperature?","Mercury"],
["Competency","Explain why metals are generally suitable for making electrical wires.","They are good conductors and ductile"],
["HOTS","Explain why ionic compounds generally have high melting points.","Strong electrostatic forces"]
],
"Carbon and its Compounds":[
["MCQ","The functional group of alcohols is:","-OH"],
["Competency","Explain why carbon forms a very large number of compounds.","Tetravalency and catenation"],
["HOTS","Differentiate saturated and unsaturated carbon compounds.","Single bonds vs multiple bonds"]
],
"Life Processes":[
["MCQ","Green plants prepare food mainly by:","Photosynthesis"],
["Competency","Explain why the small intestine is well adapted for absorption.","Large surface area and rich blood supply"],
["HOTS","Explain why respiration is essential even in plants.","It releases usable energy"]
],
"Control and Coordination":[
["MCQ","The basic unit of the nervous system is:","Neuron"],
["Competency","Explain how a reflex action helps protect the body.","It produces a rapid automatic response"],
["HOTS","Compare nervous and hormonal coordination.","Speed, pathway and duration differ"]
],
"Heredity":[
["MCQ","The basic unit of heredity is:","Gene"],
["Competency","Explain why offspring resemble parents but are not always identical.","Genes are inherited with variation"],
["HOTS","Explain how dominant and recessive traits are expressed.","Dominant allele can mask recessive allele"]
],
"Light – Reflection and Refraction":[
["MCQ","The SI unit of lens power is:","Dioptre"],
["Competency","Explain why a convex lens can form different types of images depending on object position.","Image nature depends on object distance"],
["HOTS","Explain the relationship between focal length and power.","P=1/f in metres"]
],
"The Human Eye and the Colourful World":[
["MCQ","Myopia is corrected using a:","Concave lens"],
["Competency","A student cannot see distant objects clearly. Identify the defect and correction.","Myopia; concave lens"],
["HOTS","Explain accommodation of the human eye.","Lens changes curvature to focus"]
],
"Electricity":[
["MCQ","The SI unit of resistance is:","Ohm"],
["Competency","A device operates at a known voltage and current. Explain how its power can be calculated.","P=VI"],
["Numerical","A 100 W appliance runs for 5 hours. Find the electrical energy consumed in kWh.","0.5 kWh"],
["HOTS","Explain why household appliances are connected in parallel.","Independent operation and same potential difference"]
],
"Magnetic Effects of Electric Current":[
["MCQ","The direction of magnetic field around a straight conductor can be found using:","Right-hand thumb rule"],
["Competency","Explain what happens to the magnetic field when current through a conductor increases.","Field strength increases"],
["HOTS","Explain the working principle of an electric motor.","Force on a current-carrying conductor in magnetic field"]
],
"Our Environment":[
["MCQ","The first trophic level generally consists of:","Producers"],
["Competency","Explain why energy decreases at successive trophic levels.","Much energy is lost during life processes"],
["HOTS","Explain why biodegradable waste is generally easier for ecosystems to handle.","Microorganisms can decompose it"]
]
},

SST:{
"Power Sharing":[
["MCQ","Power sharing is important in a democracy mainly because it reduces the possibility of:","Conflict"],
["Case Study","A country has several linguistic communities. Explain why sharing power among communities can strengthen democracy.","It accommodates diversity and reduces conflict"],
["HOTS","Explain the difference between prudential and moral reasons for power sharing.","Prudential reduces conflict; moral reflects democratic values"]
],
"Federalism":[
["MCQ","India has how many broad levels of government?","Three"],
["Competency","Explain why constitutional division of powers is important in a federation.","It prevents concentration of power"],
["HOTS","Explain how language policy supported federalism in India.","It accommodated linguistic diversity"]
],
"Development":[
["MCQ","Per capita income is calculated by dividing total income by:","Population"],
["Competency","Two states have the same average income but different health and education outcomes. Explain why income alone cannot measure development.","Development includes multiple quality-of-life indicators"],
["HOTS","Explain why different people can have different development goals.","Goals depend on circumstances and priorities"]
],
"Money and Credit":[
["MCQ","Modern money commonly includes currency and:","Deposits"],
["Competency","Explain why collateral can make formal borrowing difficult for some households.","They may not own acceptable assets"],
["HOTS","Differentiate formal and informal sources of credit.","Regulated institutions vs often unregulated lenders"]
],
"Nationalism in India":[
["MCQ","The Non-Cooperation Movement began in:","1920"],
["Case Study","Explain how mass participation transformed the national movement.","Different groups joined with diverse grievances"],
["HOTS","Explain why the movement was withdrawn after Chauri Chaura.","The incident involved violence and conflicted with the movement's stated methods"]
]
}
};

function allV6Questions(sub,ch){
 let base=(PRACTICE[sub]&&PRACTICE[sub][ch])||[];
 let out=[];
 base.forEach((q,i)=>{
   out.push({
     type:q[0],
     q:q[1],
     answer:q[2],
     level:i%3===0?"Easy":i%3===1?"Medium":"Hard"
   });
 });
 return out;
}

function v6TestsPage(){
 let arr=V6.tests;
 let avg=arr.length?Math.round(arr.reduce((a,b)=>a+b.percent,0)/arr.length):0;

 return `
 <section class="hero">
  <div>
   <div class="eyebrow">BOARDFLOW V6</div>
   <h1>Worksheet Lab</h1>
   <div class="muted">CBSE-pattern • competency • PYQ practice</div>
  </div>
 </section>

 <div class="grid3">
  <div class="stat"><span>ATTEMPTS</span><b>${arr.length}</b></div>
  <div class="stat"><span>AVERAGE</span><b>${avg}%</b></div>
  <div class="stat"><span>WRONG</span><b>${V6.wrong.length}</b></div>
 </div>

 <section class="card">
  <div class="cardhead"><h2>Start worksheet</h2></div>

  <button class="primary" id="v6start">🧠 CBSE Competency Worksheet</button>
  <button class="secondary" id="v6pyq">📚 Previous-Year Practice</button>
  <button class="secondary" id="v6mistakes">❌ Retry My Mistakes</button>
 </section>

 <section class="card">
  <div class="cardhead"><h2>Recent attempts</h2></div>
  ${arr.length?arr.slice(-10).reverse().map(x=>`
   <div class="planitem">
    <div>
     <b>${esc(x.subject)} • ${esc(x.chapter)}</b>
     <small>${esc(x.mode)} • ${x.score}/${x.total} • ${x.percent}% • ${x.date}</small>
    </div>
   </div>`).join(""):`<div class="empty">No attempts yet.</div>`}
 </section>`;
}

function v6Setup(mode){
 let subjects=Object.keys(DATA);

 modal(`
 <div class="v6setup">
  <div class="modalhead">
   <div>
    <div class="eyebrow">${mode==="PYQ"?"PYQ PRACTICE":"COMPETENCY PRACTICE"}</div>
    <h2>Build your worksheet</h2>
   </div>
   <button class="iconbtn" id="v6close">×</button>
  </div>

  <label>Subject
   <select id="v6sub">
    ${subjects.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("")}
   </select>
  </label>

  <label>Chapter
   <select id="v6chap"></select>
  </label>

  <label>Question count
   <select id="v6count">
    <option value="5">5 • Quick</option>
    <option value="10" selected>10 • Standard</option>
    <option value="20">20 • Deep practice</option>
    <option value="30">30 • Full worksheet</option>
   </select>
  </label>

  <label>Difficulty
   <select id="v6level">
    <option value="all">All levels</option>
    <option value="Easy">Easy</option>
    <option value="Medium">Medium</option>
    <option value="Hard">Hard</option>
   </select>
  </label>

  <div class="v6types">
   ${TYPES.map(x=>`<span>${x[0]}</span>`).join("")}
  </div>

  <button class="primary" id="v6begin">🚀 Start Worksheet</button>
 </div>`);

 const sub=$("#v6sub"),chap=$("#v6chap");
 function update(){
   chap.innerHTML=v6Chapters(sub.value).map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");
 }
 sub.onchange=update;
 update();

 $("#v6close").onclick=()=>$("#modal").remove();

 $("#v6begin").onclick=()=>{
   v6Run(mode,sub.value,chap.value,+$("#v6count").value,$("#v6level").value);
 };
}

function v6Run(mode,sub,ch,count,level){
 let q=allV6Questions(sub,ch);

 if(level!=="all")q=q.filter(x=>x.level===level);

 if(!q.length){
   toast("No questions available for this selection yet.");
   return;
 }

 let final=[];
 for(let i=0;i<count;i++)final.push(q[i%q.length]);

 window.v6Current=final;

 let html=`
 <div class="v6paper">
  <div class="v6paperhead">
   <div>
    <div class="eyebrow">${mode==="PYQ"?"PREVIOUS-YEAR PRACTICE":"CBSE-PATTERN WORKSHEET"}</div>
    <h2>${esc(ch)}</h2>
    <small>${esc(sub)} • ${final.length} questions</small>
   </div>
   <button class="iconbtn" id="v6exit">×</button>
  </div>

  <div class="v6questions">`;

 final.forEach((x,i)=>{
  html+=`
   <article class="v6question">
    <div class="v6qmeta">Q${i+1} • ${esc(x.type)} • ${x.level}</div>
    <h3>${esc(x.q)}</h3>
    <textarea data-v6q="${i}" placeholder="Write your answer..."></textarea>
   </article>`;
 });

 html+=`
  </div>
  <div class="v6submitbar">
   <button class="primary" id="v6submit">Submit Worksheet</button>
  </div>
 </div>`;

 modal(html);

 $("#v6exit").onclick=()=>$("#modal").remove();
 $("#v6submit").onclick=()=>v6Submit(sub,ch,mode);
}

function v6Submit(sub,ch,mode){
 let qs=window.v6Current||[];
 let score=0;

 qs.forEach((q,i)=>{
   let box=document.querySelector(`[data-v6q="${i}"]`);
   let ans=(box?.value||"").trim().toLowerCase();

   if(ans && (
      ans===String(q.answer).toLowerCase() ||
      ans.includes(String(q.answer).toLowerCase())
   )){
      score++;
   }else if(ans){
      V6.wrong.push({
       subject:sub,
       chapter:ch,
       question:q.q,
       answer:q.answer,
       date:today()
      });
   }
 });

 let total=qs.length;
 let percent=Math.round(score/total*100);

 V6.tests.push({
  subject:sub,
  chapter:ch,
  mode,
  score,
  total,
  percent,
  date:today()
 });

 v6Save();

 $("#modal").innerHTML=`
 <div class="v6result">
  <div class="eyebrow">WORKSHEET COMPLETE</div>
  <h1>${percent}%</h1>
  <h2>${score}/${total}</h2>
  <p>${percent>=80?"Strong work 🔥":percent>=60?"Good — revise the mistakes.":"Let's revise this chapter and retry."}</p>

  <div class="v6resultbuttons">
   <button class="primary" id="v6done">Done</button>
   <button class="secondary" id="v6retry">Retry</button>
  </div>
 </div>`;

 $("#v6done").onclick=()=>{ $("#modal").remove();render(); };
 $("#v6retry").onclick=()=>v6Run(mode,sub,ch,Math.min(10,total),"all");
}

/* Override test page */
const __oldRender=render;

render=function(){
 __oldRender();

 if(s.tab==="tests"){
   $("#app").innerHTML=v6TestsPage();

   $("#v6start").onclick=()=>v6Setup("TEST");
   $("#v6pyq").onclick=()=>v6Setup("PYQ");

   $("#v6mistakes").onclick=()=>{
    if(!V6.wrong.length){
      toast("No mistakes recorded yet.");
      return;
    }

    let x=V6.wrong[V6.wrong.length-1];
    v6Run("MISTAKES",x.subject,x.chapter,5,"all");
   };
 }
};

})();


/* =========================================================
   BOARDFLOW FINAL V7 — STUDY OS LAYER
   ========================================================= */

(function(){

/* ---------- FINAL STATE ---------- */

s.streak=s.streak||0;
s.bestStreak=s.bestStreak||0;
s.lastStudyDay=s.lastStudyDay||"";
s.studyDays=s.studyDays||[];
s.weekStats=s.weekStats||{};
s.mastery=s.mastery||{};
s.quickNote=s.quickNote||"";
save();

/* ---------- DAY SYNC ---------- */

function finalSyncDay(){
  const d=today();

  if(s.finalDay!==d){
    s.finalDay=d;
    s.doneToday=false;
    s.freeUntil=0;
    s.busy=false;
    save();
  }
}

/* ---------- STREAK ---------- */

function updateStreak(){
  finalSyncDay();

  const completed=s.tasks.some(t=>t.done);

  if(!completed)return;

  const d=today();

  if(s.lastStudyDay!==d){
    s.studyDays.push(d);

    const yesterday=new Date();
    yesterday.setDate(yesterday.getDate()-1);

    const y=new Intl.DateTimeFormat("en-CA",{
      timeZone:"Asia/Kolkata"
    }).format(yesterday);

    if(s.lastStudyDay===y){
      s.streak++;
    }else{
      s.streak=1;
    }

    s.bestStreak=Math.max(s.bestStreak,s.streak);
    s.lastStudyDay=d;

    save();
  }
}

/* ---------- CHAPTER MASTERY ---------- */

function masteryFor(subject,chapter){
  const ts=s.tasks.filter(
    x=>x.subject===subject&&x.chapter===chapter
  );

  if(!ts.length)return 0;

  const completed=ts.filter(x=>x.done).length;

  let score=Math.round(completed/ts.length*100);

  const tests=(s.tests||[]).filter(
    x=>x.subject===subject&&x.chapter===chapter
  );

  if(tests.length){
    const avg=Math.round(
      tests.reduce((a,b)=>a+b.percent,0)/tests.length
    );

    score=Math.round(score*.7+avg*.3);
  }

  return Math.min(100,score);
}

/* ---------- SMART PRIORITY ---------- */

function smartPriority(){
  finalSyncDay();

  const open=s.tasks.filter(x=>!x.done);

  if(!open.length){
    return {
      title:"Everything planned is complete 🎉",
      sub:"Use this time for revision or a practice test."
    };
  }

  const exams=(s.exams||[])
    .filter(x=>x.date>=today())
    .sort((a,b)=>a.date.localeCompare(b.date));

  if(exams.length){
    const exam=exams[0];

    if(exam.portions&&exam.portions.length){
      const p=exam.portions[0];

      return {
        title:`${p.subject} • ${p.chapter}`,
        sub:`Prepare for ${exam.name} • Exam ${exam.date}`
      };
    }
  }

  const weak=open.sort(
    (a,b)=>(b.priority||1)-(a.priority||1)
  )[0];

  return {
    title:`${weak.subject} • ${weak.chapter}`,
    sub:`Next step: ${weak.step}`
  };
}

/* ---------- WEEKLY STATS ---------- */

function weeklyStats(){
  const now=new Date();
  const arr=[];

  for(let i=6;i>=0;i--){
    const d=new Date(now);
    d.setDate(now.getDate()-i);

    const key=new Intl.DateTimeFormat("en-CA",{
      timeZone:"Asia/Kolkata"
    }).format(d);

    arr.push({
      day:key.slice(5),
      done:s.studyDays.includes(key)
    });
  }

  return arr;
}

/* ---------- FINAL HOME ---------- */

function finalHome(){

  updateStreak();

  const smart=smartPriority();
  const pct=s.tasks.length
    ?Math.round(
      s.tasks.filter(x=>x.done).length/
      s.tasks.length*100
    ):0;

  const week=weeklyStats();

  return `
  <section class="hero">
    <div>
      <div class="eyebrow">${today()} • IST</div>
      <h1>Good ${new Date().getHours()<12?"morning":"evening"}.</h1>
      <div class="muted">
        ${clock()} • ${daysLeft()} days to boards
      </div>
    </div>

    <div class="count">
      <strong>${s.streak}</strong>
      <span>DAY STREAK</span>
    </div>
  </section>

  <div class="grid3">

    <div class="stat">
      <span>TODAY</span>
      <b>${available()}m</b>
    </div>

    <div class="stat">
      <span>PROGRESS</span>
      <b>${pct}%</b>
    </div>

    <div class="stat">
      <span>BEST STREAK</span>
      <b>${s.bestStreak}</b>
    </div>

  </div>

  <section class="card smart-card">

    <div class="eyebrow">SMART NEXT STEP</div>

    <h2>${esc(smart.title)}</h2>

    <div class="muted">
      ${esc(smart.sub)}
    </div>

    <div class="quick">

      <button onclick="free(20)">🟢 20m</button>
      <button onclick="free(30)">🟢 30m</button>
      <button onclick="free(45)">🟢 45m</button>
      <button onclick="free(60)">🟢 1h</button>

      <button onclick="busy(20)">🔴 Busy 20m</button>

      <button onclick="finish()">😴 Done today</button>

    </div>

  </section>

  <section class="card">

    <div class="cardhead">
      <h2>Today's plan</h2>
      <button class="secondary"
        onclick="s.tab='plan';save();render()">
        View all
      </button>
    </div>

    ${planHTML()}

  </section>

  <section class="card">

    <div class="cardhead">
      <h2>This week</h2>
    </div>

    <div class="weekstrip">

      ${week.map(x=>`
        <div class="weekday ${x.done?"done":""}">
          <span>${x.day}</span>
          <b>${x.done?"✓":"·"}</b>
        </div>
      `).join("")}

    </div>

  </section>

  <section class="card">

    <div class="cardhead">
      <h2>Quick actions</h2>
    </div>

    <div class="quick">

      <button onclick="chapterModal()">
        📚 Add chapter
      </button>

      <button onclick="examModal()">
        📅 Add exam
      </button>

      <button onclick="s.tab='tests';save();render()">
        📝 Tests
      </button>

      <button onclick="s.tab='progress';save();render()">
        📊 Progress
      </button>

    </div>

  </section>
  `;
}

/* ---------- FINAL PROGRESS ---------- */

function finalProgress(){

  updateStreak();

  const subjects=Object.keys(DATA);

  return `
  <section class="hero">

    <div>
      <div class="eyebrow">YOUR DASHBOARD</div>
      <h1>Progress</h1>
      <div class="muted">
        ${s.streak} day streak • Best ${s.bestStreak}
      </div>
    </div>

  </section>

  ${subjects.map(sub=>{

    const chapters=Object.keys(DATA[sub]);

    const values=chapters.map(ch=>
      masteryFor(sub,ch)
    );

    const avg=values.length
      ?Math.round(values.reduce((a,b)=>a+b,0)/values.length)
      :0;

    return `
    <section class="card">

      <div class="cardhead">
        <h2>${esc(sub)}</h2>
        <b>${avg}%</b>
      </div>

      <div class="progressbar">
        <div class="fill"
          style="width:${avg}%"></div>
      </div>

      ${chapters.map(ch=>{

        const p=masteryFor(sub,ch);

        return `
        <div class="chapterline">
          <span>${esc(ch)}</span>
          <span>${p}%</span>
        </div>
        `;

      }).join("")}

    </section>
    `;

  }).join("")}

  <section class="card">

    <div class="cardhead">
      <h2>Mistake review</h2>
      <b>${(s.wrong||[]).length}</b>
    </div>

    ${
      (s.wrong||[]).length
      ?`
      <p class="muted">
        You have ${s.wrong.length} questions to revise.
      </p>
      <button class="primary"
        onclick="s.tab='tests';save();render()">
        Retry mistakes
      </button>
      `
      :`
      <div class="empty">
        No mistakes recorded yet. Keep going 🔥
      </div>
      `
    }

  </section>
  `;
}

/* ---------- FINAL RENDER OVERRIDE ---------- */

const FINAL_BASE_RENDER=render;

render=function(){

  finalSyncDay();

  FINAL_BASE_RENDER();

  if(s.tab==="home"){
    $("#app").innerHTML=finalHome();
  }

  if(s.tab==="progress"){
    $("#app").innerHTML=finalProgress();
  }

  all("#nav button").forEach(b=>{
    b.onclick=()=>{
      s.tab=b.dataset.tab;
      save();
      render();
    };
  });

};

/* ---------- EXTRA NAV ---------- */

function finalEnsureTestsNav(){

  const nav=$("#nav");

  if(!nav)return;

  if(![...nav.querySelectorAll("button")]
      .some(x=>x.dataset.tab==="tests")){

    const b=document.createElement("button");

    b.dataset.tab="tests";

    b.innerHTML="📝<span>Tests</span>";

    b.onclick=()=>{
      s.tab="tests";
      save();
      render();
    };

    nav.appendChild(b);
  }
}

/* ---------- MIDNIGHT AUTO RESET ---------- */

setInterval(()=>{

  const before=s.finalDay;

  finalSyncDay();

  if(before!==s.finalDay){
    render();
  }

},10000);

/* ---------- UPDATE STREAK EVERY MINUTE ---------- */

setInterval(()=>{
  updateStreak();
},60000);

/* ---------- START ---------- */

finalEnsureTestsNav();
updateStreak();
render();

})();


/* =========================================================
   BOARDFLOW EXAM SELECTOR V8
   Mobile-safe chapter selection + smart exam planning
   ========================================================= */

(function(){

  window.BFExamV8 = true;

  const oldExamModal = window.examModal;

  /* ---------- CHAPTER SELECTOR ---------- */

  window.examModal = function(editId=null){

    const old = editId
      ? (s.exams||[]).find(x=>x.id===editId)
      : null;

    const selected = {};

    if(old && old.portions){
      old.portions.forEach(p=>{
        selected[p.subject] = selected[p.subject] || [];
        selected[p.subject].push(p.chapter);
      });
    }

    Object.keys(DATA).forEach(sub=>{
      selected[sub]=selected[sub]||[];
    });

    function renderSubjects(){

      return Object.keys(DATA).map(subject=>{

        const chapters=Object.keys(DATA[subject]);
        const count=selected[subject].length;

        return `
        <div class="exam-subject">

          <div class="exam-subject-head card">

            <strong>${esc(subject)}</strong>

            <div>
              <span class="muted">${count} selected</span>
              <button type="button"
                onclick="BFExamV8SelectAll('${escAttr(subject)}')">
                All
              </button>
              <button type="button"
                onclick="BFExamV8Clear('${escAttr(subject)}')">
                Clear
              </button>
            </div>

          </div>

          <div>

            ${chapters.map(ch=>{

              const checked=selected[subject].includes(ch);

              return `
              <label class="chapter-check">

                <input
                  type="checkbox"
                  ${checked?"checked":""}
                  onchange="BFExamV8Toggle('${escAttr(subject)}','${escAttr(ch)}',this.checked)"
                >

                <span>${esc(ch)}</span>

              </label>
              `;

            }).join("")}

          </div>

        </div>
        `;

      }).join("");

    }

    window.__BFExamSelected=selected;

    openModal(`
      <div class="modal-card exam-modal">

        <div class="cardhead">

          <div>
            <div class="eyebrow">
              ${old?"EDIT EXAM":"NEW EXAM"}
            </div>

            <h2>${old?"Edit exam":"Add exam"}</h2>
          </div>

          <button onclick="closeModal()">✕</button>

        </div>

        <label>Exam name</label>

        <input
          id="bfExamName"
          value="${old?escAttr(old.name):""}"
          placeholder="e.g. Science Half Yearly"
        >

        <label>Exam date</label>

        <input
          id="bfExamDate"
          type="date"
          value="${old?old.date:""}"
        >

        <div class="grid2">

          <div>
            <label>Prep starts</label>
            <input
              id="bfPrepStart"
              type="date"
              value="${old?.prepStart||today()}"
            >
          </div>

          <div>
            <label>Prep ends</label>
            <input
              id="bfPrepEnd"
              type="date"
              value="${old?.prepEnd||""}"
            >
          </div>

        </div>

        <div class="card">

          <div class="cardhead">

            <div>
              <div class="eyebrow">PORTION</div>
              <h3>Select chapters</h3>
            </div>

            <span id="bfTotalSelected">0 selected</span>

          </div>

          <p class="muted">
            Tick only the chapters actually included in this exam.
            BoardFlow will build the study plan from these selections.
          </p>

          <div class="exam-selector">
            ${renderSubjects()}
          </div>

        </div>

        <div class="exam-bottom-bar">

          <div class="selected-count"
            id="bfSelectedBottom">
            0 chapters selected
          </div>

          <div class="select-actions">

            <button class="secondary"
              onclick="BFExamV8SelectAllSubjects()">
              Select all
            </button>

            <button class="secondary"
              onclick="BFExamV8ClearAllSubjects()">
              Clear all
            </button>

            <button class="primary"
              onclick="BFExamV8Save('${editId||""}')">
              ${old?"Save changes":"Create exam"}
            </button>

          </div>

        </div>

      </div>
    `);

    BFExamV8UpdateCount();
  };

  /* ---------- ESCAPE ---------- */

  window.escAttr=function(v){
    return String(v||"")
      .replace(/&/g,"&amp;")
      .replace(/'/g,"&#39;")
      .replace(/"/g,"&quot;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");
  };

  /* ---------- SELECT ---------- */

  window.BFExamV8Toggle=function(subject,chapter,checked){

    const data=window.__BFExamSelected;

    if(!data)return;

    data[subject]=data[subject]||[];

    if(checked){

      if(!data[subject].includes(chapter)){
        data[subject].push(chapter);
      }

    }else{

      data[subject]=data[subject]
        .filter(x=>x!==chapter);

    }

    BFExamV8UpdateCount();
  };

  window.BFExamV8SelectAll=function(subject){

    const data=window.__BFExamSelected;

    data[subject]=Object.keys(DATA[subject]);

    renderExamSelectorInPlace();

  };

  window.BFExamV8Clear=function(subject){

    window.__BFExamSelected[subject]=[];

    renderExamSelectorInPlace();

  };

  window.BFExamV8SelectAllSubjects=function(){

    Object.keys(DATA).forEach(sub=>{
      window.__BFExamSelected[sub]=Object.keys(DATA[sub]);
    });

    renderExamSelectorInPlace();

  };

  window.BFExamV8ClearAllSubjects=function(){

    Object.keys(DATA).forEach(sub=>{
      window.__BFExamSelected[sub]=[];
    });

    renderExamSelectorInPlace();

  };

  function renderExamSelectorInPlace(){

    const data=window.__BFExamSelected;

    Object.keys(DATA).forEach(subject=>{

      const checks=document.querySelectorAll(
        `[onchange^="BFExamV8Toggle('${CSS.escape(subject)}'"]`
      );

      checks.forEach(input=>{

        const label=input.closest(".chapter-check");

        const chapter=label
          ?label.querySelector("span")?.textContent
          :"";

        input.checked=
          data[subject]?.includes(chapter)||false;

      });

      const head=document.querySelector(
        `.exam-subject-head`
      );

    });

    BFExamV8UpdateCount();

  }

  function BFExamV8UpdateCount(){

    const data=window.__BFExamSelected||{};

    const total=Object.values(data)
      .reduce((a,b)=>a+b.length,0);

    const a=$("#bfTotalSelected");
    const b=$("#bfSelectedBottom");

    if(a)a.textContent=`${total} selected`;
    if(b)b.textContent=`${total} chapter${total===1?"":"s"} selected`;

  }

  /* ---------- SAVE EXAM ---------- */

  window.BFExamV8Save=function(editId){

    const name=$("#bfExamName")?.value.trim();
    const date=$("#bfExamDate")?.value;
    const prepStart=$("#bfPrepStart")?.value||today();
    const prepEnd=$("#bfPrepEnd")?.value||date;

    if(!name||!date){
      toast("Enter exam name and exam date.");
      return;
    }

    const portions=[];

    Object.entries(window.__BFExamSelected||{})
      .forEach(([subject,chapters])=>{
        chapters.forEach(chapter=>{
          portions.push({
            subject,
            chapter
          });
        });
      });

    if(!portions.length){
      toast("Select at least one chapter.");
      return;
    }

    if(editId){

      const ex=s.exams.find(x=>x.id===editId);

      if(ex){
        ex.name=name;
        ex.date=date;
        ex.prepStart=prepStart;
        ex.prepEnd=prepEnd;
        ex.portions=portions;
      }

    }else{

      s.exams.push({
        id:"exam_"+Date.now(),
        name,
        date,
        prepStart,
        prepEnd,
        portions,
        createdAt:Date.now()
      });

    }

    /* Create/update realistic study tasks */

    BFExamV8BuildTasks({
      name,
      date,
      prepStart,
      prepEnd,
      portions
    });

    save();
    closeModal();
    render();

    toast("Exam saved. Smart plan updated.");

  };

  /* ---------- SMART EXAM TASK BUILDER ---------- */

  function BFExamV8BuildTasks(exam){

    const days=Math.max(
      1,
      Math.ceil(
        (new Date(exam.date+"T00:00:00")-
         new Date(today()+"T00:00:00"))
        /86400000
      )
    );

    const urgent=days<=2;

    exam.portions.forEach((p,index)=>{

      const existing=s.tasks.find(t=>
        t.exam===exam.name &&
        t.subject===p.subject &&
        t.chapter===p.chapter
      );

      if(existing){

        existing.priority=urgent?10:8;
        existing.due=exam.date;
        existing.exam=exam.name;

        return;
      }

      const steps=[
        "Lecture / Concept",
        "Notes",
        "NCERT",
        "Question Practice",
        "Competency Practice",
        "PYQ / Revision",
        "Chapter Test"
      ];

      steps.forEach((step,si)=>{

        const minutes=
          step==="Chapter Test"?30:
          step==="NCERT"?25:
          step==="Question Practice"?30:
          step==="Competency Practice"?30:
          step==="PYQ / Revision"?25:
          20;

        const priority=
          urgent?10:
          days<=5?9:
          8;

        s.tasks.push({

          id:"exam_"+Date.now()+"_"+index+"_"+si,

          subject:p.subject,
          chapter:p.chapter,
          step,

          minutes,

          priority,

          exam:exam.name,

          due:exam.date,

          createdAt:Date.now(),

          done:false

        });

      });

    });

    /* ---------- EXAM-ONLY MODE ---------- */

    if(urgent){

      s.examOnly=true;
      s.examOnlyUntil=exam.date;

    }else{

      const future=(s.exams||[])
        .filter(x=>x.date>=today())
        .sort((a,b)=>a.date.localeCompare(b.date));

      s.examOnly=
        future.length&&
        Math.ceil(
          (new Date(future[0].date)-
           new Date(today()))
          /86400000
        )<=2;

    }

  }

  /* ---------- SMART PLANNER OVERRIDE ---------- */

  const oldAvailable=window.available;

  window.available=function(){

    if(s.examOnly){

      const exam=s.exams
        .filter(x=>x.date>=today())
        .sort((a,b)=>a.date.localeCompare(b.date))[0];

      if(exam){

        const days=Math.ceil(
          (new Date(exam.date)-
           new Date(today()))
          /86400000
        );

        if(days<=1){

          const normal=
            typeof oldAvailable==="function"
            ?oldAvailable()
            :60;

          return Math.max(20,normal);

        }

      }

    }

    return typeof oldAvailable==="function"
      ?oldAvailable()
      :60;

  };

  /* ---------- EXAM-AWARE PLAN ---------- */

  window.planHTML=function(){

    const availableM=available();

    if(availableM<=0){

      return `
      <div class="empty">
        ${s.examOnly
          ?"Exam focus is active. Your available study time is finished for now."
          :"You're marked busy/done for now."}
      </div>
      `;

    }

    let tasks=(s.tasks||[])
      .filter(x=>!x.done);

    const upcoming=(s.exams||[])
      .filter(x=>x.date>=today())
      .sort((a,b)=>a.date.localeCompare(b.date));

    const nearest=upcoming[0];

    if(nearest){

      const days=Math.ceil(
        (new Date(nearest.date)-
         new Date(today()))
        /86400000
      );

      if(days<=2){

        tasks=tasks.filter(x=>
          x.exam===nearest.name
        );

      }else if(days<=5){

        const examTasks=tasks.filter(x=>
          x.exam===nearest.name
        );

        if(examTasks.length){
          tasks=[
            ...examTasks,
            ...tasks.filter(x=>x.exam!==nearest.name)
          ];
        }

      }

    }

    tasks.sort((a,b)=>{

      const pa=a.priority||1;
      const pb=b.priority||1;

      const da=a.due||"9999";
      const db=b.due||"9999";

      if(pa!==pb)return pb-pa;

      return da.localeCompare(db);

    });

    let remaining=availableM;
    const chosen=[];

    for(const t of tasks){

      if(remaining<=0)break;

      const mins=Math.min(
        t.minutes||20,
        remaining
      );

      chosen.push({
        ...t,
        plannedMinutes:mins
      });

      remaining-=mins;

      if(chosen.length>=4)break;

    }

    if(!chosen.length){

      return `
      <div class="empty">
        No suitable task fits the available time.
        Use Tests or revision.
      </div>
      `;

    }

    return chosen.map(t=>`

      <div class="planitem">

        <div>

          <div class="eyebrow">
            ${esc(t.subject)} • ${esc(t.step)}
          </div>

          <strong>${esc(t.chapter)}</strong>

          <div class="muted">
            ${t.plannedMinutes} min
            ${t.exam
              ?` • ${esc(t.exam)}`
              :""}
          </div>

        </div>

        <button
          class="primary"
          onclick="toggleTask('${escAttr(t.id)}')">
          ✓
        </button>

      </div>

    `).join("");

  };

  /* ---------- RESET EXAM ONLY MODE ---------- */

  window.checkExamOnly=function(){

    if(!s.examOnly)return;

    const exam=s.exams
      .filter(x=>x.date>=today())
      .sort((a,b)=>a.date.localeCompare(b.date))[0];

    if(!exam){
      s.examOnly=false;
      save();
      return;
    }

    const days=Math.ceil(
      (new Date(exam.date)-
       new Date(today()))
      /86400000
    );

    s.examOnly=days<=2;

    save();

  };

  checkExamOnly();

})();
