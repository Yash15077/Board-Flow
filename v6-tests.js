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

