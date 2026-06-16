(async function(){
  let period='year',from='',to='';
  let summaryData=null,productsData=null,monthlyData=null;

  async function loadAll(){
    try{
      const params={period};
      if(from&&to){delete params.period;params.from=from;params.to=to;}
      [summaryData,productsData,monthlyData]=await Promise.all([
        SweetBiteAPI.profitLoss.summary(params),
        SweetBiteAPI.profitLoss.products(params),
        SweetBiteAPI.profitLoss.monthly({year:new Date().getFullYear()})
      ]);
      renderStats();
      renderAlerts();
      renderTable();
      drawCharts();
    }catch(err){SB.toast('Failed to load profit & loss data.','error');}
  }

  function renderStats(){
    const s=summaryData;
    const cards=[
      {label:'Total Revenue',value:SB.money(s.revenue),color:'green',icon:'dollar'},
      {label:'Total Cost',value:SB.money(s.cost),color:'orange',icon:'bag'},
      {label:'Total Profit',value:SB.money(s.profit),color:'blue',icon:'trending'},
      {label:'Total Loss',value:SB.money(s.loss),color:'red',icon:'trash'},
      {label:'Profit Margin',value:s.margin+'%',color:'purple',icon:'chart'}
    ];
    document.getElementById('plStats').innerHTML=cards.map(c=>`<article class="card stat-card"><span class="label">${c.label}</span><div class="value">${c.value}</div><span class="stat-icon ${c.color}">${SBIcon(c.icon)}</span></article>`).join('');
  }

  function renderAlerts(){
    const alerts=[];
    if(summaryData&&summaryData.margin<10&&summaryData.margin>0){
      alerts.push({type:'warning',text:`Low profit margin: ${summaryData.margin}% — below the 10% threshold.`});
    }
    if(productsData){
      const belowCost=productsData.filter(p=>p.loss>0);
      if(belowCost.length){
        alerts.push({type:'danger',text:`${belowCost.length} product(s) sold below cost: ${belowCost.map(p=>p.name).join(', ')}.`});
      }
    }
    const el=document.getElementById('plAlerts');
    if(!alerts.length){el.innerHTML='';return;}
    el.innerHTML=alerts.map(a=>`<div class="pl-alert pl-alert-${a.type}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg><span>${a.text}</span></div>`).join('');
  }

  function renderTable(){
    const body=document.getElementById('plTableBody');
    body.innerHTML='';
    if(!productsData||!productsData.length){
      body.innerHTML='<tr><td colspan="7" class="empty-state">No data available.</td></tr>';
      return;
    }
    productsData.forEach(p=>{
      const tr=document.createElement('tr');
      const marginClass=p.margin<10?'pl-text-warning':'';
      const lossClass=p.loss>0?'pl-text-danger':'';
      tr.innerHTML=`
        <td><strong>${p.name}</strong></td>
        <td>${p.sold_quantity}</td>
        <td>${SB.money(p.revenue)}</td>
        <td>${SB.money(p.cost)}</td>
        <td class="${marginClass}">${SB.money(p.profit)}</td>
        <td class="${lossClass}">${p.loss>0?SB.money(p.loss):'—'}</td>
        <td class="${marginClass}">${p.margin}%</td>`;
      body.appendChild(tr);
    });
  }

  function drawCharts(){
    drawRevenueCostChart();
    drawProfitLossChart();
  }

  function drawRevenueCostChart(){
    const canvas=document.getElementById('revenueCostChart');
    const rect=canvas.getBoundingClientRect();
    const dpr=devicePixelRatio||1;
    canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
    const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
    const w=rect.width,h=rect.height,p={l:50,r:18,t:18,b:34};
    const innerW=w-p.l-p.r,innerH=h-p.t-p.b;
    ctx.clearRect(0,0,w,h);
    const data=monthlyData||[];
    const maxVal=Math.max(1,...data.map(d=>Math.max(d.revenue,d.cost)));
    ctx.strokeStyle='#ececec';ctx.lineWidth=1;ctx.fillStyle='#aaa';ctx.font='11px Nunito Sans';
    const steps=5;
    for(let i=0;i<=steps;i++){
      const v=Math.round(maxVal/steps*i);
      const y=p.t+innerH-(v/maxVal)*innerH;
      ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();
      ctx.fillText(v,p.l-45,y+4);
    }
    const barW=innerW/data.length*0.35;
    const gap=innerW/data.length;
    data.forEach((d,i)=>{
      const x=p.l+i*gap+gap*0.15;
      const revH=(d.revenue/maxVal)*innerH;
      const costH=(d.cost/maxVal)*innerH;
      ctx.fillStyle='rgba(8,185,159,0.7)';
      ctx.fillRect(x,p.t+innerH-revH,barW,revH);
      ctx.fillStyle='rgba(255,150,91,0.7)';
      ctx.fillRect(x+barW+3,p.t+innerH-costH,barW,costH);
      ctx.fillStyle='#aaa';ctx.textAlign='center';
      ctx.fillText(d.label,p.l+i*gap+gap/2,h-8);
      ctx.textAlign='left';
    });
    ctx.fillStyle='rgba(8,185,159,0.7)';ctx.fillRect(w-170,8,12,12);
    ctx.fillStyle='#555';ctx.font='12px Nunito Sans';ctx.fillText('Revenue',w-154,18);
    ctx.fillStyle='rgba(255,150,91,0.7)';ctx.fillRect(w-90,8,12,12);
    ctx.fillText('Cost',w-74,18);
  }

  function drawProfitLossChart(){
    const canvas=document.getElementById('profitLossChart');
    const rect=canvas.getBoundingClientRect();
    const dpr=devicePixelRatio||1;
    canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
    const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
    const w=rect.width,h=rect.height,p={l:50,r:18,t:18,b:34};
    const innerW=w-p.l-p.r,innerH=h-p.t-p.b;
    ctx.clearRect(0,0,w,h);
    const data=monthlyData||[];
    const maxVal=Math.max(1,...data.map(d=>Math.max(d.profit,d.loss)));
    ctx.strokeStyle='#ececec';ctx.lineWidth=1;ctx.fillStyle='#aaa';ctx.font='11px Nunito Sans';
    const steps=5;
    for(let i=0;i<=steps;i++){
      const v=Math.round(maxVal/steps*i);
      const y=p.t+innerH-(v/maxVal)*innerH;
      ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();
      ctx.fillText(v,p.l-45,y+4);
    }
    function drawArea(arr,fill){
      const pts=[];
      for(let i=0;i<arr.length;i++){pts.push([p.l+i*(innerW/(arr.length-1)),p.t+innerH-(arr[i]/maxVal)*innerH]);}
      const grad=ctx.createLinearGradient(0,p.t,0,p.t+innerH);
      grad.addColorStop(0,fill);grad.addColorStop(1,fill.replace('0.75','0.10'));
      ctx.beginPath();ctx.moveTo(pts[0][0],p.t+innerH);pts.forEach(pt=>ctx.lineTo(...pt));ctx.lineTo(pts[pts.length-1][0],p.t+innerH);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
    }
    drawArea(data.map(d=>d.loss),'rgba(255,81,85,0.75)');
    drawArea(data.map(d=>d.profit),'rgba(78,130,247,0.75)');
    ctx.fillStyle='#aaa';ctx.font='11px Nunito Sans';
    data.forEach((d,i)=>{
      if(i%2===0||i===data.length-1)ctx.fillText(d.label,p.l+i*(innerW/(data.length-1))-10,h-8);
    });
    ctx.fillStyle='rgba(78,130,247,0.7)';ctx.fillRect(w-140,8,12,12);
    ctx.fillStyle='#555';ctx.font='12px Nunito Sans';ctx.fillText('Profit',w-124,18);
    ctx.fillStyle='rgba(255,81,85,0.7)';ctx.fillRect(w-65,8,12,12);
    ctx.fillText('Loss',w-49,18);
  }

  document.querySelectorAll('.pl-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.pl-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      period=btn.dataset.period;from='';to='';
      document.getElementById('dateFrom').value='';
      document.getElementById('dateTo').value='';
      loadAll();
    });
  });

  document.getElementById('applyDateRange')?.addEventListener('click',()=>{
    from=document.getElementById('dateFrom').value;
    to=document.getElementById('dateTo').value;
    if(!from||!to){SB.toast('Select both start and end dates.','error');return;}
    document.querySelectorAll('.pl-filter').forEach(b=>b.classList.remove('active'));
    period='';
    loadAll();
  });

  window.addEventListener('resize',SB.debounce(()=>{if(monthlyData)drawCharts();},150));

  loadAll();
})();