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

