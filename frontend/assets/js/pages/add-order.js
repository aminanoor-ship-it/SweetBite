(async function(){
  try{
  const [customers, products] = await Promise.all([SweetBiteAPI.customers.list(), SweetBiteAPI.products.list()]);
  const productSelect=document.getElementById('productSelect'), customerSearch=document.getElementById('customerSearch'), suggestions=document.getElementById('customerSuggestions');
  document.getElementById('customerSearchIcon').innerHTML=SBIcon('search'); document.getElementById('productChev').innerHTML=SBIcon('chevron',16);
  document.getElementById('orderDate').value=new Date().toISOString().slice(0,10);
  productSelect.innerHTML=products.map(p=>`<option value="${p.id}" ${p.name==='Chocolate'?'selected':''}>${p.name}</option>`).join('');
  function currentProduct(){return products.find(p=>p.id==productSelect.value)||products[0];}
  function updateTotals(){const p=currentProduct(),qty=Math.max(0,Number(document.getElementById('quantity').value||0)),subtotal=p.price*qty;document.getElementById('selectedProductImage').src=p.image;document.getElementById('selectedProductName').textContent=p.name;document.getElementById('unitPrice').value=SB.money(p.price);document.getElementById('totalPrice').value=SB.money(subtotal);document.getElementById('summaryImage').src=p.image;document.getElementById('summaryName').textContent=p.name;document.getElementById('summaryQty').textContent=`Qty:${qty}`;document.getElementById('summaryLinePrice').textContent=SB.money(subtotal);document.getElementById('summarySubtotal').textContent=SB.money(subtotal);document.getElementById('summaryTotal').textContent=SB.money(subtotal);document.getElementById('category').value=p.category;}
  function showCustomers(q=''){
    const rows=customers.filter(c=>c.full_name.toLowerCase().includes(q.toLowerCase())).slice(0,6);
    suggestions.innerHTML='';
    rows.forEach(c=>{
      const div=document.createElement('div');
      div.className='suggestion-item';
      div.dataset.id=c.id;
      div.textContent=c.full_name;
      suggestions.appendChild(div);
    });
    suggestions.classList.toggle('open',rows.length>0);
  }
  customerSearch.addEventListener('focus',()=>showCustomers(customerSearch.value)); customerSearch.addEventListener('input',()=>{document.getElementById('customerId').value='';showCustomers(customerSearch.value);});
  suggestions.addEventListener('click',e=>{const item=e.target.closest('.suggestion-item');if(!item)return;const c=customers.find(x=>x.id==item.dataset.id);document.getElementById('customerId').value=c.id;customerSearch.value=c.full_name;suggestions.classList.remove('open');});
  document.addEventListener('click',e=>{if(!e.target.closest('.customer-search-wrap'))suggestions.classList.remove('open');});
  productSelect.addEventListener('change',updateTotals);document.getElementById('quantity').addEventListener('input',updateTotals);
  document.getElementById('orderStatus').addEventListener('change',e=>document.getElementById('processingLabel').textContent=SB.statusLabel(e.target.value));
  document.getElementById('cancelOrder').addEventListener('click',()=>location.href='orders.html');
  document.getElementById('orderForm').addEventListener('reset',()=>setTimeout(()=>{document.getElementById('customerId').value='';document.getElementById('orderDate').value=new Date().toISOString().slice(0,10);updateTotals();},0));
  document.getElementById('orderForm').addEventListener('submit',async e=>{e.preventDefault();const payload={customer_id:Number(document.getElementById('customerId').value),date:document.getElementById('orderDate').value,payment_method:document.getElementById('paymentMethod').value,status:document.getElementById('orderStatus').value,notes:document.getElementById('notes').value.trim(),discount:0,items:[{product_id:Number(productSelect.value),quantity:Number(document.getElementById('quantity').value)}]};SBValidation.clearAllErrors(e.currentTarget);if(!SBValidation.validateForm([{field:'customerId',check:SBValidation.positiveNumber(payload.customer_id),message:'Select a customer from the list.'},{field:'orderDate',check:SBValidation.required(payload.date),message:'Order date is required.'},{field:'quantity',check:SBValidation.positiveNumber(payload.items[0].quantity),message:'Quantity must be at least 1.'}]))return;try{await SweetBiteAPI.orders.create(payload);SB.toast('Order saved successfully.');setTimeout(()=>location.href='orders.html',700);}catch(err){SB.toast(err.message,'error');}});
  updateTotals();
  }catch(err){SB.toast('Failed to load data. Please try again.','error');}
})();
