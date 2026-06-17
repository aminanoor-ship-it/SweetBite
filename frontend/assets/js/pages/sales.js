(async function(){
  try{
  const data=await SweetBiteAPI.sales.get();
  const stats=[['Total Revenue',SB.money(data.stats.revenue),'dollar','purple'],['Total Order',data.stats.orders,'box','yellow'],['Product Sold',data.stats.sold,'bag','green'],['Total Pending',data.stats.pending,'chart','orange']];
  document.getElementById('salesStats').innerHTML=stats.map(([label,value,icon,color])=>`<article class="card stat-card"><span class="label">${label}</span><div class="value">${value}</div><span class="stat-icon ${color}">${SBIcon(icon)}</span></article>`).join('');
  const topProductsContainer=document.getElementById('topProducts');
  topProductsContainer.innerHTML='';
  data.top.forEach(p=>{
    const div=document.createElement('div');
    div.className='top-product';
    const img=document.createElement('img');
    img.src=p.image;
    img.alt=p.name;
    const infoDiv=document.createElement('div');
    const strong=document.createElement('strong');
    strong.textContent=p.name;
    const small=document.createElement('small');
    small.textContent=p.sold+' Sold';
    infoDiv.appendChild(strong);
    infoDiv.appendChild(small);
    const priceSpan=document.createElement('span');
    priceSpan.className='price';
    priceSpan.textContent=SB.money(p.price);
    div.appendChild(img);
    div.appendChild(infoDiv);
    div.appendChild(priceSpan);
    topProductsContainer.appendChild(div);
  });
  const body=document.getElementById('recentSalesBody');
  body.innerHTML='';
  data.recent.forEach(o=>{
    const tr=document.createElement('tr');
    const td1=document.createElement('td');
    td1.textContent=o.customer_name;
    const td2=document.createElement('td');
    td2.textContent=o.items.map(i=>i.name).join(', ');
    const td3=document.createElement('td');
    td3.textContent=o.payment_method;
    const td4=document.createElement('td');
    td4.textContent=SB.date(o.date);
    const td5=document.createElement('td');
    td5.textContent=SB.money(o.total);
    const td6=document.createElement('td');
    const badge=document.createElement('span');
    badge.className='badge '+SB.statusClass(o.status);
    badge.textContent=SB.statusLabel(o.status);
    td6.appendChild(badge);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    body.appendChild(tr);
  });
  function draw(){const c=document.getElementById('salesChart'),r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;const x=c.getContext('2d');x.scale(d,d);const p={l:45,r:20,t:20,b:36},w=r.width-p.l-p.r,h=r.height-p.t-p.b;x.clearRect(0,0,r.width,r.height);x.font='11px Nunito Sans';x.fillStyle='#a2a2a2';x.strokeStyle='#ececec';[20,40,60,80,100].forEach(v=>{const y=p.t+h-(v/100)*h;x.beginPath();x.moveTo(p.l,y);x.lineTo(r.width-p.r,y);x.stroke();x.fillText(v+'%',4,y+4);});const arr=data.chart,labels=data.chartLabels||[];const pts=arr.map((v,i)=>[p.l+i*(w/(arr.length-1)),p.t+h-(v/100)*h]);const g=x.createLinearGradient(0,p.t,0,p.t+h);g.addColorStop(0,'rgba(78,130,247,.28)');g.addColorStop(1,'rgba(78,130,247,.02)');x.beginPath();x.moveTo(pts[0][0],p.t+h);pts.forEach(pt=>x.lineTo(...pt));x.lineTo(pts[pts.length-1][0],p.t+h);x.closePath();x.fillStyle=g;x.fill();x.beginPath();pts.forEach((pt,i)=>i?x.lineTo(...pt):x.moveTo(...pt));x.strokeStyle='#4e82f7';x.lineWidth=2;x.stroke();const step=Math.max(1,Math.floor(labels.length/8));labels.forEach((l,i)=>{if(i%step===0||i===labels.length-1)x.fillText(l,p.l+i*(w/(arr.length-1))-8,r.height-9);});}
  draw();addEventListener('resize',SB.debounce(draw,150));window.addEventListener('sweetbite:search',e=>{const q=e.detail.toLowerCase();[...body.rows].forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'':'none');});
  }catch(err){SB.toast('Failed to load sales data. Please try again.','error');}
})();
