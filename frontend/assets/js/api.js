(function () {
  const config = window.SWEETBITE_CONFIG;
  const DB_KEY = 'sweetbite_mock_db_v1';

  const seed = {
    users: [
      { id: 1, full_name: 'Kawther', username: 'kawther', email: 'kawther.admin@sweetbite.com', password: 'password123', role: 'Admin', status: 'active', profile_image: '../assets/images/profile/kawther.png' }
    ],
    products: [
      { id: 1, name: 'Candy', category: 'Candy', sku: 'CAN-001', price: 0.5, stock: 84, low_stock_limit: 10, image: '../assets/images/products/candy.png', status: 'available', description: 'Colorful fruit-flavoured bubble candy.' },
      { id: 2, name: 'Candy', category: 'Candy', sku: 'CAN-002', price: 0.5, stock: 62, low_stock_limit: 10, image: '../assets/images/products/candy.png', status: 'available', description: 'Sweet and chewy candy for every occasion.' },
      { id: 3, name: 'Candy', category: 'Candy', sku: 'CAN-003', price: 0.5, stock: 50, low_stock_limit: 10, image: '../assets/images/products/candy.png', status: 'available', description: 'Classic bubble candy in bright wrappers.' },
      { id: 4, name: 'Candy', category: 'Candy', sku: 'CAN-004', price: 0.5, stock: 31, low_stock_limit: 10, image: '../assets/images/products/candy.png', status: 'available', description: 'Popular candy pack.' },
      { id: 5, name: 'Gum', category: 'Gum', sku: 'GUM-001', price: 0.6, stock: 0, low_stock_limit: 10, image: '../assets/images/products/gum.png', status: 'out_of_stock', description: 'Long-lasting classic bubble gum.' },
      { id: 6, name: 'Candy', category: 'Candy', sku: 'CAN-005', price: 0.5, stock: 22, low_stock_limit: 10, image: '../assets/images/products/candy.png', status: 'available', description: 'Mixed candy pack.' },
      { id: 7, name: 'Chocolate', category: 'Chocolate', sku: 'CHO-001', price: 2, stock: 40, low_stock_limit: 8, image: '../assets/images/products/chocolate.png', status: 'available', description: 'Creamy milk chocolate bar.' },
      { id: 8, name: 'Lollipop', category: 'Lollipop', sku: 'LOL-001', price: 0.75, stock: 28, low_stock_limit: 8, image: '../assets/images/products/lollipop.png', status: 'available', description: 'Colorful lollipops.' }
    ],
    customers: [
      { id: 1, full_name: 'Amira Salman', phone: '061xxxxxxx', email: 'customer@email.com', location: 'Wabary', address: '089 Kutch Green Apt. 448' },
      { id: 2, full_name: 'Maram Majed', phone: '061xxxxxx2', email: 'maram@email.com', location: 'Wabary', address: '979 Immanuel Ferry Suite 526' },
      { id: 3, full_name: 'Sumaya Axmed', phone: '061xxxxxx3', email: 'sumaya@email.com', location: 'Hodan', address: '8587 Frida Ports' },
      { id: 4, full_name: 'Muna Noor', phone: '061xxxxxx4', email: 'muna@email.com', location: 'Wabary', address: '089 Kutch Green Apt. 448' },
      { id: 5, full_name: 'Kawther Jamec', phone: '061xxxxxx5', email: 'kawtherj@email.com', location: 'Hodan', address: '979 Immanuel Ferry Suite 526' },
      { id: 6, full_name: 'Ismacil Abdirazak', phone: '061xxxxxx6', email: 'ismacil@email.com', location: 'Wadajir', address: '8587 Frida Ports' },
      { id: 7, full_name: 'Asiya Ibrahim', phone: '061xxxxxx7', email: 'asiya@email.com', location: 'Waberi', address: '768 Destiny Lake Suite 600' },
      { id: 8, full_name: 'Malyun Abdullahi', phone: '061xxxxxx8', email: 'malyun@email.com', location: 'Hodan', address: '042 Mylene Throughway' },
      { id: 9, full_name: 'Maryama Ali', phone: '061xxxxxx9', email: 'maryama@email.com', location: 'Karaan', address: '543 Weimann Mountain' }
    ],
    orders: [
      { id: 1, order_number:'00001', customer_id:4, customer_name:'Muna Noor', address:'089 Kutch Green Apt. 448', date:'2026-09-04', items:[{product_id:1,name:'Candy',quantity:10,unit_price:.7}], subtotal:7, discount:0, total:7, payment_method:'EVC', status:'completed', notes:'' },
      { id: 2, order_number:'00002', customer_id:5, customer_name:'Kawther Jamec', address:'979 Immanuel Ferry Suite 526', date:'2026-05-28', items:[{product_id:5,name:'Gum',quantity:43,unit_price:.6}], subtotal:25.8, discount:0, total:26, payment_method:'eDahab', status:'processing', notes:'' },
      { id: 3, order_number:'00003', customer_id:6, customer_name:'Ismacil Abdirazak', address:'8587 Frida Ports', date:'2026-11-23', items:[{product_id:8,name:'Lollipop',quantity:15,unit_price:.75}], subtotal:11.25, discount:.25, total:11, payment_method:'EVC', status:'rejected', notes:'' },
      { id: 4, order_number:'00004', customer_id:7, customer_name:'Asiya Ibrahim', address:'768 Destiny Lake Suite 600', date:'2026-02-05', items:[{product_id:7,name:'Chocolate',quantity:3,unit_price:2}], subtotal:6, discount:1, total:5, payment_method:'EVC', status:'completed', notes:'' },
      { id: 5, order_number:'00005', customer_id:8, customer_name:'Malyun Abdullahi', address:'042 Mylene Throughway', date:'2026-07-29', items:[{product_id:5,name:'Gum',quantity:7,unit_price:.6}], subtotal:4.2, discount:.2, total:4, payment_method:'EVC', status:'processing', notes:'' },
      { id: 6, order_number:'00006', customer_id:9, customer_name:'Maryama Ali', address:'543 Weimann Mountain', date:'2026-08-15', items:[{product_id:7,name:'Chocolate',quantity:22,unit_price:2}], subtotal:44, discount:0, total:44, payment_method:'EVC', status:'completed', notes:'' },
      { id: 7, order_number:'00007', customer_id:1, customer_name:'Abdi Majed', address:'New Scottieberg', date:'2026-12-21', items:[{product_id:7,name:'Chocolate',quantity:3,unit_price:2}], subtotal:6, discount:0, total:6, payment_method:'Cash', status:'processing', notes:'' },
      { id: 8, order_number:'00008', customer_id:2, customer_name:'Warda maxamed', address:'New Jon', date:'2026-04-30', items:[{product_id:7,name:'Chocolate',quantity:4,unit_price:2}], subtotal:8, discount:0, total:8, payment_method:'EVC', status:'on_hold', notes:'' },
      { id: 9, order_number:'00009', customer_id:3, customer_name:'Dunya Axmed', address:'124 Lyla Forge Suite 975', date:'2026-01-09', items:[{product_id:5,name:'Gum',quantity:6,unit_price:.6}], subtotal:3.6, discount:0, total:3.6, payment_method:'eDahab', status:'in_transit', notes:'' }
    ],
    team: [
      { id:1, name:'Amina Noor Abdi', email:'Amina22@gmail.com', image:'../assets/images/team/amina.png' },
      { id:2, name:'Kawther Jamec', email:'Amina22@gmail.com', image:'../assets/images/team/kawther.png' },
      { id:3, name:'Malyun Abdullahi', email:'Amina22@gmail.com', image:'../assets/images/team/malyun.png' },
      { id:4, name:'Ismacil Abdirizak', email:'Amina22@gmail.com', image:'../assets/images/team/ismacil.png' },
      { id:5, name:'Abdigani Garad', email:'Amina22@gmail.com', image:'../assets/images/team/abdigani.png' }
    ],
    settings: {
      company_name:'SweetBite', company_email:'Amina22@gmail.com', phone:'0613647017', founded:'March 2026',
      profile:{ full_name:'Kawther', email:'kawther.admin@sweetbite.com', image:'../assets/images/profile/kawther.png' }
    }
  };

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function loadDB(){
    const stored = localStorage.getItem(DB_KEY);
    if (!stored) { localStorage.setItem(DB_KEY, JSON.stringify(seed)); return clone(seed); }
    try { return JSON.parse(stored); } catch { localStorage.setItem(DB_KEY, JSON.stringify(seed)); return clone(seed); }
  }
  function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }
  function delay(value){ return new Promise(resolve => setTimeout(() => resolve(clone(value)), 120)); }
  function qs(params={}){
    const clean = Object.entries(params).filter(([,v]) => v !== undefined && v !== null && v !== '');
    return clean.length ? '?' + new URLSearchParams(clean).toString() : '';
  }
  function toFormData(payload){ const fd=new FormData(); Object.entries(payload).forEach(([key,value])=>{ if(value===undefined||value===null||key==='image')return; if(key==='imageFile'){ if(value)fd.append('image',value); } else fd.append(key,typeof value==='object'?JSON.stringify(value):value); }); return fd; }
  async function request(path, options={}){
    const token = localStorage.getItem(config.TOKEN_KEY) || sessionStorage.getItem(config.TOKEN_KEY);
    const headers = { ...(options.body instanceof FormData ? {} : {'Content-Type':'application/json'}), ...(options.headers||{}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || 15000);
    try {
      const response = await fetch(`${config.API_BASE_URL}${path}`, { ...options, headers, signal: controller.signal });
      clearTimeout(timeout);
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 && token) {
        window.SweetBiteAPI?.auth?.logout?.();
        location.href = 'login.html';
        throw new Error('Session expired. Please sign in again.');
      }
      if (!response.ok) {
        const error = new Error(data.message || `Request failed (${response.status})`);
        error.errors = data.errors;
        throw error;
      }
      return data.data ?? data;
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') throw new Error('Server is not responding. Please check your connection and try again.');
      if (err.message === 'Failed to fetch') throw new Error('Cannot connect to the server. Make sure the backend is running.');
      throw err;
    }
  }

  const api = {
    auth: {
      async login(payload){
        const remember = payload.remember;
        const storage = remember ? localStorage : sessionStorage;
        if (!config.MOCK_MODE) {
          const result = await request('/auth/login',{method:'POST',body:JSON.stringify({email:payload.email,password:payload.password,remember})});
          storage.setItem(config.TOKEN_KEY,result.token);
          storage.setItem(config.USER_KEY,JSON.stringify(result.user));
          if (!remember) { localStorage.removeItem(config.TOKEN_KEY); localStorage.removeItem(config.USER_KEY); }
          else { localStorage.setItem(config.TOKEN_KEY,result.token); localStorage.setItem(config.USER_KEY,JSON.stringify(result.user)); }
          return result;
        }
        if (!payload.email || !payload.password) throw new Error('Email and password are required.');
        const db=loadDB();
        const user=db.users.find(u=>u.email.toLowerCase()===payload.email.toLowerCase());
        const passwordMatches = user && (user.password === payload.password || (user.password === undefined && payload.password === 'password123'));
        if (!passwordMatches) throw new Error('Email or password is incorrect.');
        if (user.status && user.status !== 'active') throw new Error('This account is not active.');
        const token='mock-jwt-'+Date.now();
        storage.setItem(config.TOKEN_KEY,token);
        storage.setItem(config.USER_KEY,JSON.stringify(user));
        const otherStorage = remember ? sessionStorage : localStorage;
        otherStorage.removeItem(config.TOKEN_KEY);
        otherStorage.removeItem(config.USER_KEY);
        return delay({token,user});
      },
      async register(payload){
        if (!config.MOCK_MODE) {
          const body = payload.imageFile ? toFormData(payload) : JSON.stringify(payload);
          return request('/auth/register',{method:'POST',body});
        }
        const db=loadDB();
        if(db.users.some(u=>u.email.toLowerCase()===payload.email.toLowerCase())) throw new Error('This email is already registered.');
        if(db.users.some(u=>String(u.username||'').toLowerCase()===payload.username.toLowerCase())) throw new Error('This username is already taken.');
        db.users.push({id:Date.now(),full_name:payload.full_name||payload.username,username:payload.username,email:payload.email,password:payload.password,role:'Staff',status:'active',profile_image:'../assets/images/profile/kawther.png'});
        saveDB(db); return delay({message:'Account created successfully.'});
      },
      async forgotPassword(email){
        if (!config.MOCK_MODE) return request('/auth/forgot-password',{method:'POST',body:JSON.stringify({email})});
        const db=loadDB();
        const user=db.users.find(u=>u.email.toLowerCase()===email.toLowerCase());
        if(!user) throw new Error('No account found with that email address.');
        return delay({message:'A password reset link has been sent to your email.',resetUrl:`reset-password.html?token=mock-reset-${Date.now()}`});
      },
      async resetPassword(token,new_password){
        if (!config.MOCK_MODE) return request('/auth/reset-password',{method:'POST',body:JSON.stringify({token,new_password})});
        if(!token) throw new Error('Reset token is required.');
        return delay({message:'Your password has been reset successfully. You can now sign in.'});
      },
      logout(){ localStorage.removeItem(config.TOKEN_KEY); localStorage.removeItem(config.USER_KEY); sessionStorage.removeItem(config.TOKEN_KEY); sessionStorage.removeItem(config.USER_KEY); },
      isLoggedIn(){ return Boolean(localStorage.getItem(config.TOKEN_KEY) || sessionStorage.getItem(config.TOKEN_KEY)); },
      getCurrentUser(){
        try{ return JSON.parse(localStorage.getItem(config.USER_KEY) || sessionStorage.getItem(config.USER_KEY)) || loadDB().settings.profile; }catch{return loadDB().settings.profile;}
      }
    },
    dashboard: {
      async get(params={}){
        if(!config.MOCK_MODE) return request('/dashboard'+qs(params));
        const db=loadDB(); const completed=db.orders.filter(o=>['completed','delivered'].includes(o.status));
        return delay({
          stats:{customers:db.customers.length,orders:db.orders.length,sales:completed.reduce((s,o)=>s+Number(o.total),0),pending:db.orders.filter(o=>o.status==='processing').length},
          deals:db.orders.slice(0,5), revenue:[20,34,31,28,55,38,50,52,34,66,41,58], revenueLabels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        });
      }
    },
    products: {
      async list(params={}){
        if(!config.MOCK_MODE) return request('/products'+qs(params));
        let rows=loadDB().products;
        if(params.search){const q=params.search.toLowerCase(); rows=rows.filter(p=>[p.name,p.category,p.sku].some(v=>String(v).toLowerCase().includes(q)));}
        if(params.category && params.category!=='all') rows=rows.filter(p=>p.category===params.category);
        if(params.status) rows=rows.filter(p=>p.status===params.status);
        return delay(rows);
      },
      async create(payload){ if(!config.MOCK_MODE) return request('/products',{method:'POST',body:payload.imageFile?toFormData(payload):JSON.stringify(payload)}); const db=loadDB(); const {imageFile,...clean}=payload; const row={...clean,id:Date.now(),status:Number(payload.stock)>0?'available':'out_of_stock'}; db.products.unshift(row); saveDB(db); return delay(row); },
      async update(id,payload){ if(!config.MOCK_MODE) return request(`/products/${id}`,{method:'PUT',body:payload.imageFile?toFormData(payload):JSON.stringify(payload)}); const db=loadDB(); const i=db.products.findIndex(p=>p.id==id); if(i<0)throw new Error('Product not found.'); const {imageFile,...clean}=payload; db.products[i]={...db.products[i],...clean,status:Number(payload.stock)>0?'available':'out_of_stock'}; saveDB(db); return delay(db.products[i]); },
      async remove(id){ if(!config.MOCK_MODE) return request(`/products/${id}`,{method:'DELETE'}); const db=loadDB(); db.products=db.products.filter(p=>p.id!=id); saveDB(db); return delay({success:true}); }
    },
    customers: {
      async list(params={}){ if(!config.MOCK_MODE)return request('/customers'+qs(params)); let rows=loadDB().customers; if(params.search){const q=params.search.toLowerCase();rows=rows.filter(c=>[c.full_name,c.email,c.phone,c.location].some(v=>String(v).toLowerCase().includes(q)));} return delay(rows); },
      async create(payload){ if(!config.MOCK_MODE)return request('/customers',{method:'POST',body:JSON.stringify(payload)}); const db=loadDB(); if(db.customers.some(c=>c.phone===payload.phone))throw new Error('Phone number already exists.'); const row={...payload,id:Date.now()}; db.customers.unshift(row); saveDB(db); return delay(row); },
      async update(id,payload){ if(!config.MOCK_MODE)return request(`/customers/${id}`,{method:'PUT',body:JSON.stringify(payload)}); const db=loadDB(); const i=db.customers.findIndex(c=>c.id==id); if(i<0)throw new Error('Customer not found.'); db.customers[i]={...db.customers[i],...payload}; saveDB(db); return delay(db.customers[i]); },
      async remove(id){ if(!config.MOCK_MODE)return request(`/customers/${id}`,{method:'DELETE'}); const db=loadDB(); db.customers=db.customers.filter(c=>c.id!=id); saveDB(db); return delay({success:true}); }
    },
    orders: {
      async list(params={}){ if(!config.MOCK_MODE)return request('/orders'+qs(params)); let rows=loadDB().orders; if(params.search){const q=params.search.toLowerCase(); rows=rows.filter(o=>[o.order_number,o.customer_name,o.address,o.items.map(i=>i.name).join(' ')].some(v=>String(v).toLowerCase().includes(q)));} if(params.status&&params.status!=='all')rows=rows.filter(o=>o.status===params.status); if(params.date)rows=rows.filter(o=>o.date===params.date); return delay(rows); },
      async create(payload){
        if(!config.MOCK_MODE)return request('/orders',{method:'POST',body:JSON.stringify(payload)});
        const db=loadDB(); const customer=db.customers.find(c=>c.id==payload.customer_id); if(!customer)throw new Error('Customer is required.');
        const items=payload.items.map(item=>{const p=db.products.find(x=>x.id==item.product_id); if(!p)throw new Error('Product not found.'); if(Number(item.quantity)>Number(p.stock))throw new Error(`Only ${p.stock} ${p.name} items are available.`); p.stock-=Number(item.quantity); p.status=p.stock>0?'available':'out_of_stock'; return{product_id:p.id,name:p.name,quantity:Number(item.quantity),unit_price:Number(p.price)};});
        const subtotal=items.reduce((s,i)=>s+i.quantity*i.unit_price,0); const discount=Number(payload.discount||0); const row={id:Date.now(),order_number:String(db.orders.length+1).padStart(5,'0'),customer_id:customer.id,customer_name:customer.full_name,address:customer.address||customer.location,date:payload.date,items,subtotal,discount,total:Math.max(0,subtotal-discount),payment_method:payload.payment_method,status:payload.status||'processing',notes:payload.notes||''}; db.orders.unshift(row); saveDB(db); return delay(row);
      }
    },
    sales: {
      async get(){ if(!config.MOCK_MODE)return request('/sales/summary'); const db=loadDB(); const completed=db.orders.filter(o=>['completed','delivered'].includes(o.status)); const sold=db.orders.flatMap(o=>o.items).reduce((s,i)=>s+i.quantity,0); const count={}; db.orders.flatMap(o=>o.items).forEach(i=>{count[i.product_id]=(count[i.product_id]||0)+i.quantity;}); const top=Object.entries(count).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([id,qty])=>({...db.products.find(p=>p.id==id),sold:qty})); return delay({stats:{revenue:completed.reduce((s,o)=>s+o.total,0),orders:db.orders.length,sold,pending:db.orders.filter(o=>o.status==='processing').length},top,recent:db.orders.slice(0,7),chart:[20,28,30,35,50,42,40,55,32,45,38,50,44,55,39,48,56,46,52,60,65,24,33,34,29,50,49,45,77,62,69,65,55,54,61,44,59,51,60,53,58],chartLabels:['Jan 01','Jan 02','Jan 03','Jan 04','Jan 05','Jan 06','Jan 07','Jan 08','Jan 09','Jan 10','Jan 11','Jan 12','Jan 13','Jan 14','Jan 15','Jan 16','Jan 17','Jan 18','Jan 19','Jan 20','Jan 21','Jan 22','Jan 23','Jan 24','Jan 25','Jan 26','Jan 27','Jan 28','Jan 29','Jan 30','Jan 31','Feb 01','Feb 02','Feb 03','Feb 04','Feb 05','Feb 06','Feb 07','Feb 08','Feb 09','Feb 10']}); }
    },
    team: { async list(){ if(!config.MOCK_MODE)return request('/team'); return delay(loadDB().team); } },
    settings: {
      async get(){ if(!config.MOCK_MODE)return request('/settings'); return delay(loadDB().settings); },
      async updateProfile(payload){
        if(!config.MOCK_MODE){
          const body = toFormData(payload);
          const result=await request('/auth/profile',{method:'PUT',body});
          const user=api.auth.getCurrentUser();
          const updatedUser={...user,full_name:result.full_name,email:result.email,profile_image:result.image||user.profile_image};
          const storage = localStorage.getItem(config.TOKEN_KEY) ? localStorage : sessionStorage;
          storage.setItem(config.USER_KEY,JSON.stringify(updatedUser));
          return result;
        }
        const db=loadDB(); const {imageFile,...clean}=payload; db.settings.profile={...db.settings.profile,...clean}; saveDB(db); const user=api.auth.getCurrentUser(); localStorage.setItem(config.USER_KEY,JSON.stringify({...user,full_name:payload.full_name,email:payload.email,profile_image:payload.image||user.profile_image})); return delay(db.settings.profile);
      },
      async changePassword(payload){ if(!config.MOCK_MODE)return request('/auth/change-password',{method:'PUT',body:JSON.stringify(payload)}); if(!payload.current_password||!payload.new_password)throw new Error('Enter the current and new password.'); return delay({success:true}); }
    },
    profitLoss: {
      async summary(params={}){
        if(!config.MOCK_MODE)return request('/reports/profit-loss/summary'+qs(params));
        const db=loadDB(); const completed=db.orders.filter(o=>['completed','delivered'].includes(o.status));
        const items=completed.flatMap(o=>o.items); const revenue=items.reduce((s,i)=>s+i.unit_price*i.quantity,0);
        const cost=items.reduce((s,i)=>s+i.unit_price*0.55*i.quantity,0);
        const profit=Math.max(0,revenue-cost); const loss=Math.max(0,cost-revenue);
        const margin=revenue>0?Math.round(profit/revenue*10000)/100:0;
        return delay({revenue:Math.round(revenue*100)/100,cost:Math.round(cost*100)/100,profit:Math.round(profit*100)/100,loss:Math.round(loss*100)/100,margin});
      },
      async products(params={}){
        if(!config.MOCK_MODE)return request('/reports/profit-loss/products'+qs(params));
        const db=loadDB(); const completed=db.orders.filter(o=>['completed','delivered'].includes(o.status));
        const count={}; completed.flatMap(o=>o.items).forEach(i=>{count[i.product_id]=(count[i.product_id]||0)+i.quantity;});
        const rows=db.products.filter(p=>count[p.id]).map(p=>{const qty=count[p.id]||0;const revenue=p.price*qty;const cost=p.price*0.55*qty;const profit=Math.max(0,revenue-cost);const loss=Math.max(0,cost-revenue);const margin=revenue>0?Math.round(profit/revenue*10000)/100:0;return{name:p.name,sold_quantity:qty,revenue:Math.round(revenue*100)/100,cost:Math.round(cost*100)/100,profit:Math.round(profit*100)/100,loss:Math.round(loss*100)/100,margin};});
        return delay(rows.sort((a,b)=>b.loss-a.loss||b.profit-a.profit));
      },
      async monthly(params={}){
        if(!config.MOCK_MODE)return request('/reports/profit-loss/monthly'+qs(params));
        const labels=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const months=labels.map((label,i)=>{const revenue=20+i*5+Math.random()*20;const cost=revenue*0.55;const profit=Math.max(0,revenue-cost);const loss=0;return{month:i+1,label,revenue:Math.round(revenue*100)/100,cost:Math.round(cost*100)/100,profit:Math.round(profit*100)/100,loss:Math.round(loss*100)/100};});
        return delay(months);
      }
    },
    resetMock(){ localStorage.removeItem(DB_KEY); return loadDB(); }
  };
  window.SweetBiteAPI=api;
})();
