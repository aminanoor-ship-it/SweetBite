(function(){
  let search='',orders=[]; const body=document.getElementById('ordersBody');
  document.getElementById('resetFilter').innerHTML=SBIcon('reset')+'Reset Filter';
  async function load(){try{orders=await SweetBiteAPI.orders.list({search,status:document.getElementById('statusFilter').value,date:document.getElementById('dateFilter').value});render();}catch(err){SB.toast('Failed to load orders. Please try again.','error');}}
  function render(){
    body.innerHTML='';
    if(!orders.length){
      const tr=document.createElement('tr');
      const td=document.createElement('td');
      td.colSpan='6';
      td.className='empty-state';
      td.textContent='No orders found.';
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }
    orders.forEach(o=>{
      const tr=document.createElement('tr');
      tr.dataset.id=o.id;
      tr.style.cursor='pointer';
      const td1=document.createElement('td');
      td1.textContent=o.order_number;
      const td2=document.createElement('td');
      td2.textContent=o.customer_name;
      const td3=document.createElement('td');
      td3.textContent=o.address;
      const td4=document.createElement('td');
      td4.textContent=SB.date(o.date);
      const td5=document.createElement('td');
      td5.textContent=o.items.map(i=>i.name).join(', ');
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
  document.getElementById('statusFilter').addEventListener('change',load); document.getElementById('dateFilter').addEventListener('change',load);
  document.getElementById('resetFilter').addEventListener('click',()=>{document.getElementById('statusFilter').value='all';document.getElementById('dateFilter').value='';search='';document.getElementById('globalSearch').value='';load();});
  window.addEventListener('sweetbite:search',e=>{search=e.detail;load();});
  body.addEventListener('click',e=>{const row=e.target.closest('tr[data-id]');if(!row)return;const o=orders.find(x=>x.id==row.dataset.id);const orderDetails=document.getElementById('orderDetails');orderDetails.innerHTML='';const container=document.createElement('div');container.style.display='grid';container.style.gap='13px';const p1=document.createElement('p');p1.innerHTML='<strong>Order ID:</strong> ';p1.appendChild(document.createTextNode(o.order_number));const p2=document.createElement('p');p2.innerHTML='<strong>Customer:</strong> ';p2.appendChild(document.createTextNode(o.customer_name));const p3=document.createElement('p');p3.innerHTML='<strong>Address:</strong> ';p3.appendChild(document.createTextNode(o.address));const p4=document.createElement('p');p4.innerHTML='<strong>Date:</strong> ';p4.appendChild(document.createTextNode(SB.date(o.date)));const p5=document.createElement('p');p5.innerHTML='<strong>Payment:</strong> ';p5.appendChild(document.createTextNode(o.payment_method));const p6=document.createElement('p');p6.innerHTML='<strong>Status:</strong> ';const statusSpan=document.createElement('span');statusSpan.className='badge '+SB.statusClass(o.status);statusSpan.textContent=SB.statusLabel(o.status);p6.appendChild(statusSpan);container.appendChild(p1);container.appendChild(p2);container.appendChild(p3);container.appendChild(p4);container.appendChild(p5);container.appendChild(p6);const hr1=document.createElement('hr');hr1.style.border='0';hr1.style.borderTop='1px solid #eee';hr1.style.width='100%';container.appendChild(hr1);o.items.forEach(i=>{const itemDiv=document.createElement('div');itemDiv.style.display='flex';itemDiv.style.justifyContent='space-between';const span=document.createElement('span');span.appendChild(document.createTextNode(i.name+' × '+i.quantity));const strong=document.createElement('strong');strong.textContent=SB.money(i.quantity*i.unit_price);itemDiv.appendChild(span);itemDiv.appendChild(strong);container.appendChild(itemDiv);});const hr2=document.createElement('hr');hr2.style.border='0';hr2.style.borderTop='1px solid #eee';hr2.style.width='100%';container.appendChild(hr2);const totalDiv=document.createElement('div');totalDiv.style.display='flex';totalDiv.style.justifyContent='space-between';totalDiv.style.fontSize='18px';const totalLabel=document.createElement('strong');totalLabel.textContent='Total';const totalValue=document.createElement('strong');totalValue.textContent=SB.money(o.total);totalDiv.appendChild(totalLabel);totalDiv.appendChild(totalValue);container.appendChild(totalDiv);orderDetails.appendChild(container);SB.openModal('orderModal');});
  load();
})();
