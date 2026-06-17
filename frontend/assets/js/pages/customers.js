(function(){
  let search='',customers=[],orders=[];const body=document.getElementById('customersBody'),drawer=document.getElementById('customerDrawer');
  document.getElementById('customerIcon').innerHTML=SBIcon('user');document.getElementById('phoneIcon').innerHTML=SBIcon('phone');document.getElementById('emailIcon').innerHTML=SBIcon('mail');document.getElementById('locationIcon').innerHTML=SBIcon('location');
  function openDrawer(customer=null){document.getElementById('customerForm').reset();document.getElementById('customerIdEdit').value=customer?.id||'';document.getElementById('drawerTitle').textContent=customer?'Edit Customer':'New Customer';if(customer){document.getElementById('customerName').value=customer.full_name;document.getElementById('customerPhone').value=customer.phone;document.getElementById('customerEmail').value=customer.email||'';document.getElementById('customerLocation').value=customer.location;document.getElementById('customerAddress').value=customer.address||'';}drawer.classList.add('open');document.body.style.overflow='hidden';}
  function closeDrawer(){drawer.classList.remove('open');document.body.style.overflow='';}
  async function load(){try{[customers,orders]=await Promise.all([SweetBiteAPI.customers.list({search}),SweetBiteAPI.orders.list()]);if(document.getElementById('customerSort').value==='name')customers.sort((a,b)=>a.full_name.localeCompare(b.full_name));render();}catch(err){SB.toast('Failed to load customers. Please try again.','error');}}
  function render(){
    body.innerHTML='';
    if(!customers.length){
      const tr=document.createElement('tr');
      const td=document.createElement('td');
      td.colSpan='6';
      td.className='empty-state';
      td.textContent='No customers found.';
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }
    customers.forEach(c=>{
      const tr=document.createElement('tr');
      const td1=document.createElement('td');
      td1.textContent=c.full_name;
      const td2=document.createElement('td');
      td2.textContent=c.phone;
      const td3=document.createElement('td');
      td3.textContent=c.email||'-';
      const td4=document.createElement('td');
      td4.textContent=c.location;
      const td5=document.createElement('td');
      td5.textContent=orders.filter(o=>o.customer_id==c.id).length;
      const td6=document.createElement('td');
      const div=document.createElement('div');
      div.className='action-icons';
      const editBtn=document.createElement('button');
      editBtn.className='edit';
      editBtn.dataset.edit=c.id;
      editBtn.setAttribute('aria-label','Edit');
      editBtn.innerHTML=SBIcon('edit');
      editBtn.addEventListener('click',e=>{e.preventDefault();openDrawer(customers.find(x=>x.id==editBtn.dataset.edit));});
      const deleteBtn=document.createElement('button');
      deleteBtn.className='delete';
      deleteBtn.dataset.delete=c.id;
      deleteBtn.setAttribute('aria-label','Delete');
      deleteBtn.innerHTML=SBIcon('trash');
      deleteBtn.addEventListener('click',async e=>{e.preventDefault();if(await SB.confirm('Delete this customer?')){try{await SweetBiteAPI.customers.remove(deleteBtn.dataset.delete);SB.toast('Customer deleted.');load();}catch(err){SB.toast(err.message,'error');}}});
      div.appendChild(editBtn);
      div.appendChild(deleteBtn);
      td6.appendChild(div);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      body.appendChild(tr);
    });
  }
  document.getElementById('newCustomerBtn').addEventListener('click',()=>openDrawer());document.getElementById('closeDrawer').addEventListener('click',closeDrawer);document.getElementById('cancelDrawer').addEventListener('click',closeDrawer);drawer.addEventListener('click',e=>{if(e.target===drawer)closeDrawer();});document.getElementById('customerSort').addEventListener('change',load);window.addEventListener('sweetbite:search',e=>{search=e.detail;load();});

  document.getElementById('customerForm').addEventListener('submit',async e=>{e.preventDefault();const id=document.getElementById('customerIdEdit').value,payload={full_name:document.getElementById('customerName').value.trim(),phone:document.getElementById('customerPhone').value.trim(),email:document.getElementById('customerEmail').value.trim(),location:document.getElementById('customerLocation').value.trim(),address:document.getElementById('customerAddress').value.trim()};SBValidation.clearAllErrors(e.currentTarget);if(!SBValidation.validateForm([{field:'customerName',check:SBValidation.required(payload.full_name),message:'Name is required.'},{field:'customerPhone',check:SBValidation.phone(payload.phone),message:'Enter a valid phone number.'},{field:'customerLocation',check:SBValidation.required(payload.location),message:'Location is required.'},{field:'customerEmail',check:!payload.email||SBValidation.email(payload.email),message:'Enter a valid email address.'}]))return;try{id?await SweetBiteAPI.customers.update(id,payload):await SweetBiteAPI.customers.create(payload);closeDrawer();SB.toast(id?'Customer updated.':'Customer added.');load();}catch(err){SB.toast(err.message,'error');}});
  load();
})();
