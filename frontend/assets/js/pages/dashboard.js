(async function(){
  let data=null;
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];

  function populateMonthSelects(){
    const now=new Date();
    const opts=['<option value="">All Time</option>'];
    for(let i=0;i<12;i++){
      const d=new Date(now.getFullYear(),now.getMonth()-i,1);
      const val=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      opts.push(`<option value="${val}">${monthNames[d.getMonth()]} ${d.getFullYear()}</option>`);
    }
    document.getElementById('dashboardMonth').innerHTML=opts.join('');
    document.getElementById('revenueMonth').innerHTML=opts.join('');
  }

  async function loadDashboard(month){
    try{
      const params={};
      if(month) params.month=month;
      data=await SweetBiteAPI.dashboard.get(params);
      renderStats();
      renderDeals();
      drawAreaChart();
    }catch(err){SB.toast('Failed to load dashboard. Please try again.','error');}
  }

  function renderStats(){
    const stats=[
      ['Total Customers',data.stats.customers,'users','purple'],
      ['Total Order',data.stats.orders,'box','yellow'],
      ['Total Sales',SB.money(data.stats.sales),'chart','green'],
      ['Total Pending',data.stats.pending,'clock','orange']
    ];
    document.getElementById('dashboardStats').innerHTML=stats.map(([label,value,icon,color])=>`<article class="card stat-card"><span class="label">${label}</span><div class="value">${value}</div><span class="stat-icon ${color}">${SBIcon(icon)}</span></article>`).join('');
  }

  function renderDeals(){
    const body=document.getElementById('dealsBody');
    body.innerHTML='';
    if(!data.deals||!data.deals.length){
      body.innerHTML='<tr><td colspan="6" class="empty-state">No orders found for this period.</td></tr>';
      return;
    }
    data.deals.forEach(o=>{
      const first=o.items?.[0]||{};
      const pimg=first.name==='Gum'?'gum.png':first.name==='Lollipop'?'lollipop.png':first.name==='Chocolate'?'chocolate.png':'candy.png';
      const tr=document.createElement('tr');
      const td1=document.createElement('td');
      const productCell=document.createElement('div');
      productCell.className='product-cell';
      const img=document.createElement('img');
      img.src='../assets/images/products/'+pimg;
      img.alt=first.name||'';
      const span=document.createElement('span');
      span.textContent=first.name||'—';
      productCell.appendChild(img);
      productCell.appendChild(span);
      td1.appendChild(productCell);
      const td2=document.createElement('td');
      td2.textContent=o.location||'—';
      const td3=document.createElement('td');
      td3.textContent=SB.date(o.date)+' - '+(o.payment_method||'');
      const td4=document.createElement('td');
      td4.textContent=first.quantity||0;
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
  }

  function drawAreaChart(){
    const canvas=document.getElementById('revenueChart');
    const rect=canvas.getBoundingClientRect();
    const dpr=devicePixelRatio||1;
    canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
    const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
    const w=rect.width,h=rect.height,p={l:50,r:18,t:18,b:34};
    const innerW=w-p.l-p.r,innerH=h-p.t-p.b;
    ctx.clearRect(0,0,w,h);

    const rev=data.revenue||[];
    if(!rev.length){
      ctx.fillStyle='#aaa';ctx.font='14px Nunito Sans';ctx.textAlign='center';
      ctx.fillText('No revenue data for this period',w/2,h/2);
      ctx.textAlign='left';return;
    }
    const maxRev=Math.max(1,...rev);
    const maxVal=Math.ceil(maxRev*1.2);
    const steps=5;
    ctx.strokeStyle='#ececec';ctx.lineWidth=1;ctx.fillStyle='#a5a5a5';ctx.font='11px Nunito Sans';
    for(let i=0;i<=steps;i++){
      const v=Math.round(maxVal/steps*i);
      const y=p.t+innerH-(v/maxVal)*innerH;
      ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();
      ctx.fillText(v,p.l-45,y+4);
    }
    const sales=rev.map(v=>v/maxVal*innerH);
    const profit=rev.map((v,i)=>v*0.45/maxVal*innerH);
    const xStep = rev.length > 1 ? innerW / (rev.length - 1) : 0;
    function area(arr,fill){
      const pts=[];
      for(let i=0;i<arr.length;i++){pts.push([p.l+i*xStep,p.t+innerH-arr[i]]);}
      const grad=ctx.createLinearGradient(0,p.t,0,p.t+innerH);
      grad.addColorStop(0,fill);grad.addColorStop(1,fill.replace('0.75','0.10'));
      ctx.beginPath();
      if(pts.length===1){
        ctx.moveTo(p.l,p.t+innerH);ctx.lineTo(p.l,pts[0][1]);ctx.lineTo(w-p.r,pts[0][1]);ctx.lineTo(w-p.r,p.t+innerH);
      }else{
        ctx.moveTo(pts[0][0],p.t+innerH);pts.forEach(pt=>ctx.lineTo(...pt));ctx.lineTo(pts[pts.length-1][0],p.t+innerH);
      }
      ctx.closePath();ctx.fillStyle=grad;ctx.fill();
    }
    area(profit,'rgba(210,143,246,0.75)');
    area(sales,'rgba(255,139,112,0.75)');
    const labels=data.revenueLabels||[];
    const step=Math.max(1,Math.floor(labels.length/10));
    ctx.fillStyle='#aaa';
    labels.forEach((l,i)=>{
      const x = rev.length > 1 ? p.l + i * (innerW / (labels.length - 1)) - 10 : p.l + innerW / 2;
      if(i%step===0||i===labels.length-1)ctx.fillText(l,x,h-10);
    });
  }

  populateMonthSelects();

  document.getElementById('dashboardMonth').addEventListener('change',e=>{
    loadDashboard(e.target.value);
  });
  document.getElementById('revenueMonth').addEventListener('change',e=>{
    loadDashboard(e.target.value);
  });

  window.addEventListener('sweetbite:search',e=>{
    const q=e.detail.toLowerCase();
    const body=document.getElementById('dealsBody');
    [...body.rows].forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'':'none');
  });

  addEventListener('resize',SB.debounce(()=>{if(data)drawAreaChart();},150));

  loadDashboard();
})();