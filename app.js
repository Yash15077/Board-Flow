const KEY="boardflow-v3";
const SUBJECTS=["Maths","Science","SST","English","Hindi"];
const BOARD="2027-02-15";
const TYPES=[
["Lecture / concept",35],["Notes",30],["NCERT practice",35],
["Question practice",40],["Oswaal / competency",40],
["PYQs",40],["Revision + active recall",25],["Chapter test",45]
];
const NORMAL=[
["06:00","06:20","Ready"],["06:30","14:20","School"],
["14:20","14:50","Lunch + shower"],["15:00","17:00","Coaching"],
["17:30","18:00","Rest"],["18:00","23:00","Study + dinner + school work"],
["23:00","23:59","Sleep"]
];
const ABSENT=[
["06:00","06:20","Ready"],["06:30","08:00","Study"],
["08:00","08:30","Breakfast"],["08:30","11:00","Deep study"],
["11:00","11:30","Break"],["11:30","13:00","NCERT + questions"],
["13:00","14:00","Lunch + rest"],["14:00","17:00","Deep study"],
["17:00","17:30","Break"],["17:30","20:00","Study"],
["20:00","21:00","Dinner"],["21:00","22:30","PYQ / test"],
["22:30","23:00","Plan tomorrow"],["23:00","23:59","Sleep"]
];
const BASE={tab:"home",day:"normal",routines:{normal:NORMAL,absent:ABSENT,custom:NORMAL},
exams:[],chapters:[],tasks:[],available:150};

let s=load();
function load(){try{
 const x=JSON.parse(localStorage.getItem(KEY)||"{}");
 const old=JSON.parse(localStorage.getItem("boardflow-v2")||"{}");
 let z={...BASE,...x};
 if(!x.exams&&old.exams)z.exams=old.exams.map((e,i)=>({id:"old"+i,name:e.name,date:e.date,start:e.date,end:e.date,portions:[{subject:"General",text:e.portion||""}]}));
 return z;
}catch{return JSON.parse(JSON.stringify(BASE))}}
function save(){localStorage.setItem(KEY,JSON.stringify(s))}
const $=q=>document.querySelector(q);
const esc=x=>String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const all=q=>[...document.querySelectorAll(q)];
function today(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date())}
function ist(){return new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}).format(new Date())}
function mins(x){let[a,b]=x.split(":").map(Number);return a*60+b}
function days(a,b){return Math.ceil((new Date(b+"T00:00:00+05:30")-new Date(a+"T00:00:00+05:30"))/86400000)}
function toast(x){let t=$("#toast");t.textContent=x;t.className="show";setTimeout(()=>t.className="",1600)}
function routine(){return s.routines[s.day]||NORMAL}
function remaining(){
 let now=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"}));
 let cur=now.getHours()*60+now.getMinutes(),total=0;
 routine().forEach(x=>{
  let a=mins(x[0]),b=mins(x[1]);
  if(b>cur&&/study|revision|question|pyq|test|deep|ncert|coaching|school work/i.test(x[2]))
   total+=Math.max(0,b-Math.max(a,cur));
 });
 return total||s.available;
}
function examTasks(){
 let out=[],t=today();
 s.exams.filter(e=>(e.end||e.date)>=t).forEach(e=>{
  let u=100-Math.max(0,days(t,e.date))*4;
  (e.portions||[]).forEach(p=>{
   if(p.text)out.push({text:`${p.subject}: ${p.text}`,m:35,score:u+20,why:`${e.name} • exam ${e.date}`})
  })
 });
 return out;
}
function plan(){
 let av=remaining(),items=[...examTasks()];
 s.tasks.filter(x=>!x.done).forEach(x=>items.push({
  text:`${x.subject}: ${x.chapter} — ${x.type}`,m:x.minutes,score:x.priority*15,why:"chapter workflow"
 }));
 items.push({text:"Board PYQs — timed practice",m:35,score:30,why:"board practice"});
 items.sort((a,b)=>b.score-a.score);
 let used=0,out=[];
 items.forEach(x=>{if(used+x.m<=av){out.push(x);used+=x.m}});
 return [out,used,av];
}
function planHTML(){
 let [p,u,a]=plan();
 return p.length?p.map((x,i)=>`<div class="planitem"><span class="num">${i+1} • ${x.m}m</span><div><b>${esc(x.text)}</b><small>${esc(x.why)}</small></div></div>`).join("")+
 `<div class="meta">Planned ${u}/${a} minutes • IST ${ist()}</div>`:
 `<div class="empty">No task fits the remaining time. Add time or change today's routine.</div>`;
}
function examsHTML(){
 if(!s.exams.length)return `<div class="empty">No exams added.</div>`;
 return [...s.exams].sort((a,b)=>a.date.localeCompare(b.date)).map(e=>`
 <div class="exam"><div class="examtop"><div><b>${esc(e.name)}</b>
 <div class="meta">Exam ${e.date} • Prep ${e.start} → ${e.end}</div></div>
 <button class="iconbtn deleteExam" data-id="${e.id}">×</button></div>
 ${(e.portions||[]).map(p=>`<div class="portion">${esc(p.subject)}: ${esc(p.text)}</div>`).join("")}</div>`).join("");
}
function chaptersHTML(){
 if(!s.chapters.length)return `<div class="empty">No chapters yet. Add one to create the full workflow.</div>`;
 return s.chapters.map(c=>{
  let ts=s.tasks.filter(t=>t.chapterId===c.id),d=ts.filter(t=>t.done).length;
  return `<div class="chapter"><b>${esc(c.subject)} — ${esc(c.name)}</b><div class="meta">${d}/${ts.length} completed</div>
  ${ts.map(t=>`<label class="task ${t.done?"done":""}"><input type="checkbox" data-task="${t.id}" ${t.done?"checked":""}>${esc(t.type)} <span class="meta">• ${t.minutes}m</span></label>`).join("")}</div>`
 }).join("");
}
function routineHTML(){return routine().map(x=>`<div class="routine"><b>${x[0]}–${x[1]}</b><span>${esc(x[2])}</span></div>`).join("")}
function render(){
 let p=plan(),done=s.tasks.filter(x=>x.done).length,pct=s.tasks.length?Math.round(done/s.tasks.length*100):0;
 let date=new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",weekday:"long",day:"numeric",month:"short"}).format(new Date());
 let pages={
 home:`<section class="hero"><div><div class="eyebrow">${date}</div><h1>BoardFlow</h1><div class="muted">IST ${ist()} • ${s.day==="absent"?"Absent-school day":"Normal day"}</div></div><div class="count"><strong>${Math.max(0,days(today(),BOARD))}</strong><span>DAYS TO BOARDS</span></div></section>
 <div class="grid3"><div class="stat"><span>TIME LEFT</span><b>${p[2]}m</b></div><div class="stat"><span>PROGRESS</span><b>${pct}%</b></div><div class="stat"><span>OPEN</span><b>${s.tasks.filter(x=>!x.done).length}</b></div></div>
 <section class="card"><div class="cardhead"><div><div class="eyebrow">SMART PLAN</div><h2>What should I study now?</h2></div><button class="primary" onclick="render()">Refresh</button></div>${planHTML()}</section>
 <section class="card"><div class="cardhead"><h2>Today's routine</h2><button class="secondary" onclick="routineModal()">Change</button></div>${routineHTML()}</section>
 <section class="card"><div class="cardhead"><h2>Upcoming exams</h2><button class="secondary" onclick="examModal()">+ Add</button></div>${examsHTML()}</section>`,
 plan:`<section class="hero"><div><div class="eyebrow">ADAPTIVE PLANNER</div><h1>Today's Plan</h1><div class="muted">BoardFlow uses IST and your routine.</div></div></section><section class="card">${planHTML()}</section><section class="card"><div class="cardhead"><h2>Chapter tasks</h2><button class="secondary" onclick="chapterModal()">+ Chapter</button></div>${chaptersHTML()}</section>`,
 exams:`<section class="hero"><div><div class="eyebrow">EXAM CENTER</div><h1>Exams</h1><div class="muted">Subject-wise portions + preparation window.</div></div><button class="primary" onclick="examModal()">+ Add exam</button></section><section class="card">${examsHTML()}</section>`,
 subjects:`<section class="hero"><div><div class="eyebrow">SUBJECT WORKFLOW</div><h1>Subjects</h1><div class="muted">Lecture → Notes → NCERT → Questions → Oswaal → PYQ → Revision → Test.</div></div><button class="primary" onclick="chapterModal()">+ Add chapter</button></section><section class="card">${chaptersHTML()}</section>`,
 progress:`<section class="hero"><div><div class="eyebrow">PROGRESS</div><h1>${pct}%</h1><div class="muted">${done}/${s.tasks.length} workflow tasks done.</div></div></section><section class="card"><div class="progressbar"><div class="fill" style="width:${pct}%"></div></div></section>`,
 settings:`<section class="hero"><div><div class="eyebrow">CONTROL CENTER</div><h1>Settings</h1><div class="muted">Routine and local data.</div></div></section><section class="card"><div class="setting"><b>Today's mode</b><p>${s.day==="normal"?"Normal school day":s.day==="absent"?"Absent from school":"Custom routine"}</p><button class="secondary" onclick="routineModal()">Change routine</button></div><div class="setting"><b>IST</b><p>BoardFlow clock: ${ist()}</p></div><div class="setting"><b>Data</b><p>Saved on this device.</p><button class="secondary" onclick="resetApp()">Reset app</button></div></section>`
 };
 $("#app").innerHTML=pages[s.tab]||pages.home;
 all("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===s.tab));
 all("[data-task]").forEach(x=>x.onchange=()=>{let t=s.tasks.find(t=>String(t.id)===String(x.dataset.task));if(t)t.done=x.checked;save();render()});
 all(".deleteExam").forEach(x=>x.onclick=()=>{s.exams=s.exams.filter(e=>String(e.id)!==String(x.dataset.id));save();render();toast("Exam deleted")});
}
function modalHTML(){
 if($("#modal"))$("#modal").remove();
 let m=document.createElement("div");m.id="modal";m.innerHTML=`<div class="modalcard"><div class="modalhead"><h2>Add exam</h2><button class="iconbtn" onclick="this.closest('#modal').remove()">×</button></div>
 <label>Exam name<input id="en" placeholder="Half-yearly / Pre-board"></label>
 <label>Exam date<input id="ed" type="date"></label>
 <div class="twocol"><label>Prep start<input id="ps" type="date" value="${today()}"></label><label>Prep end<input id="pe" type="date"></label></div>
 <div id="pros"></div><button class="secondary" onclick="addPortion()">+ Subject portion</button><button class="primary" onclick="saveExam()">Save exam</button></div>`;
 document.body.appendChild(m);addPortion();$("#ed").onchange=()=>$("#pe").value=$("#ed").value;
}
function addPortion(){
 let d=document.createElement("div");d.className="portionrow";d.innerHTML=`<select>${SUBJECTS.map(x=>`<option>${x}</option>`).join("")}</select><input placeholder="Chapters / topics"><button class="iconbtn" onclick="this.parentElement.remove()">×</button>`;$("#pros").appendChild(d);
}
function examModal(){modalHTML()}
function saveExam(){
 let date=$("#ed").value,start=$("#ps").value,end=$("#pe").value;
 if(!date||start>end||end>date){toast("Use Start ≤ End ≤ Exam date");return}
 let portions=all(".portionrow").map(r=>({subject:r.querySelector("select").value,text:r.querySelector("input").value.trim()})).filter(x=>x.text);
 s.exams.push({id:"e"+Date.now(),name:$("#en").value.trim(),date,start,end,portions});
 save();$("#modal").remove();render();toast("Exam added");
}
function chapterModal(){
 let m=document.createElement("div");m.id="modal";m.innerHTML=`<div class="modalcard"><div class="modalhead"><h2>Add chapter</h2><button class="iconbtn" onclick="this.closest('#modal').remove()">×</button></div>
 <label>Subject<select id="cs">${SUBJECTS.map(x=>`<option>${x}</option>`).join("")}</select></label>
 <label>Chapter<input id="cn" placeholder="Electricity"></label>
 <div class="checkgrid">${TYPES.map((x,i)=>`<label><input class="ct" type="checkbox" value="${i}" ${i<6?"checked":""}> ${x[0]}</label>`).join("")}</div>
 <button class="primary" onclick="saveChapter()">Create workflow</button></div>`;
 document.body.appendChild(m);
}
function saveChapter(){
 let subject=$("#cs").value,name=$("#cn").value.trim(),id="c"+Date.now();
 if(!name){toast("Enter chapter");return}
 s.chapters.push({id,subject,name});
 all(".ct:checked").forEach((x,i)=>{let z=TYPES[+x.value];s.tasks.push({id:"t"+Date.now()+i,chapterId:id,subject,chapter:name,type:z[0],minutes:z[1],done:false,priority:+x.value>=5?3:2})});
 save();$("#modal").remove();render();toast("Chapter workflow created");
}
function routineModal(){
 let m=document.createElement("div");m.id="modal";m.innerHTML=`<div class="modalcard"><div class="modalhead"><h2>Today's routine</h2><button class="iconbtn" onclick="this.closest('#modal').remove()">×</button></div>
 <div class="seg"><button class="segbtn ${s.day==="normal"?"active":""}" onclick="setDay('normal')">Normal</button><button class="segbtn ${s.day==="absent"?"active":""}" onclick="setDay('absent')">Absent</button><button class="segbtn ${s.day==="custom"?"active":""}" onclick="setDay('custom')">Custom</button></div>
 <div id="rrows"></div><button class="secondary" onclick="addSlot()">+ Time block</button><button class="primary" onclick="saveRoutine()">Save routine</button></div>`;
 document.body.appendChild(m);drawRoutine();
}
function drawRoutine(){
 $("#rrows").innerHTML=routine().map((x,i)=>`<div class="routineedit"><input value="${x[0]}"><input value="${x[1]}"><input value="${esc(x[2])}"><button class="iconbtn" onclick="this.parentElement.remove()">×</button></div>`).join("");
}
function setDay(x){s.day=x;if(x==="normal")s.routines.normal=NORMAL;if(x==="absent")s.routines.absent=ABSENT;drawRoutine()}
function addSlot(){s.routines[s.day].push(["18:00","19:00","Study"]);drawRoutine()}
function saveRoutine(){
 let rows=all(".routineedit").map(r=>[r.children[0].value,r.children[1].value,r.children[2].value]).filter(x=>x.every(Boolean));
 s.routines[s.day]=rows;save();$("#modal").remove();render();toast("Routine saved");
}
function resetApp(){if(confirm("Reset BoardFlow?")){localStorage.removeItem(KEY);s=JSON.parse(JSON.stringify(BASE));save();render()}}
all("#nav button").forEach(b=>b.onclick=()=>{s.tab=b.dataset.tab;save();render()});
if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js").catch(()=>{});
setInterval(()=>{let x=$("#clock");if(x)x.textContent=ist();render()},60000);
render();
