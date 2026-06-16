(function(){
  let search='',category='all',status='',products=[];
  const grid=document.getElementById('productsGrid');
  async function load(){try{products=await SweetBiteAPI.products.list({search,category,status});render();}catch(err){SB.toast('Failed to load products. Please try again.','error');}}
  function render(){
    grid.innerHTML='';
    if(!products.length){
      const div=document.createElement('div');
      div.className='empty-state card';
      div.textContent='No products found.';
      grid.appendChild(div);
      return;
    }
    products.forEach(p=>{
      const article=document.createElement('article');
      article.className='card product-card';
      article.dataset.id=p.id;
      const badge=document.createElement('span');
      badge.className='badge product-status '+(p.stock>0?'available':'out-of-stock');
      badge.textContent=p.stock>0?'Available':'Run out';
      const productImageDiv=document.createElement('div');
      productImageDiv.className='product-image';
      const img=document.createElement('img');
      img.src=p.image||'../assets/images/products/candy.png';
      img.alt=p.name;
      productImageDiv.appendChild(img);
      const h3=document.createElement('h3');
      h3.textContent=p.name;
      const priceDiv=document.createElement('div');
      priceDiv.className='product-price';
      priceDiv.textContent=SB.money(p.price);
      const actionsDiv=document.createElement('div');
      actionsDiv.className='product-actions';
      const viewBtn=document.createElement('button');
      viewBtn.className='btn btn-blue view-product';
      viewBtn.dataset.id=p.id;
      viewBtn.textContent='View';
      const editBtn=document.createElement('button');
      editBtn.className='btn btn-beige edit-product';
      editBtn.dataset.id=p.id;
      editBtn.textContent='Edit';
      actionsDiv.appendChild(viewBtn);
      actionsDiv.appendChild(editBtn);
      article.appendChild(badge);
      article.appendChild(productImageDiv);
      article.appendChild(h3);
      article.appendChild(priceDiv);
      article.appendChild(actionsDiv);
      grid.appendChild(article);
    });
  }
  function resetForm(){document.getElementById('productForm').reset();document.getElementById('productId').value='';document.getElementById('productModalTitle').textContent='New Product';document.getElementById('deleteProductBtn').style.display='none';document.getElementById('imagePreview').src='';}
  document.getElementById('addProductBtn').addEventListener('click',()=>{resetForm();SB.openModal('productModal');});
  document.getElementById('categoryFilter').addEventListener('change',e=>{category=e.target.value;load();});
  document.getElementById('statusFilter')?.addEventListener('change',e=>{status=e.target.value;load();});
  window.addEventListener('sweetbite:search',e=>{search=e.detail;load();});
  document.getElementById('imageUploadArea')?.addEventListener('click',()=>document.getElementById('productImage').click());
  document.getElementById('productImage')?.addEventListener('change',function(){
    const file=this.files[0]; if(!file)return;
    if(!SBValidation.image(file)){SB.toast('Image must be JPG, PNG or WebP and smaller than 2 MB.','error');this.value='';return;}
    const reader=new FileReader();reader.onload=e=>{document.getElementById('imagePreview').src=e.target.result;};reader.readAsDataURL(file);
  });
  grid.addEventListener('click',e=>{
    const view=e.target.closest('.view-product'),edit=e.target.closest('.edit-product');
    if(view){
      const p=products.find(x=>x.id==view.dataset.id);
      const productDetails=document.getElementById('productDetails');
      productDetails.innerHTML='';
      const container=document.createElement('div');
      container.style.display='grid';
      container.style.gridTemplateColumns='180px 1fr';
      container.style.gap='24px';
      container.style.alignItems='center';
      const img=document.createElement('img');
      img.src=p.image;
      img.style.width='180px';
      img.style.height='160px';
      img.style.objectFit='contain';
      img.alt=p.name;
      const infoDiv=document.createElement('div');
      const h2=document.createElement('h2');
      h2.style.margin='0';
      h2.style.color='var(--navy)';
      h2.textContent=p.name;
      const p1=document.createElement('p');
      p1.innerHTML='<strong>Category:</strong> ';
      p1.appendChild(document.createTextNode(p.category));
      const p2=document.createElement('p');
      p2.innerHTML='<strong>SKU:</strong> ';
      p2.appendChild(document.createTextNode(p.sku));
      const p3=document.createElement('p');
      p3.innerHTML='<strong>Price:</strong> ';
      p3.appendChild(document.createTextNode(SB.money(p.price)));
      const p4=document.createElement('p');
      p4.innerHTML='<strong>Stock:</strong> ';
      p4.appendChild(document.createTextNode(p.stock));
      const p5=document.createElement('p');
      p5.textContent=p.description||'';
      infoDiv.appendChild(h2);
      infoDiv.appendChild(p1);
      infoDiv.appendChild(p2);
      infoDiv.appendChild(p3);
      infoDiv.appendChild(p4);
      infoDiv.appendChild(p5);
      container.appendChild(img);
      container.appendChild(infoDiv);
      productDetails.appendChild(container);
      SB.openModal('viewProductModal');
    }
    if(edit){const p=products.find(x=>x.id==edit.dataset.id);document.getElementById('productId').value=p.id;document.getElementById('productName').value=p.name;document.getElementById('productCategory').value=p.category;document.getElementById('productSku').value=p.sku;document.getElementById('productPrice').value=p.price;document.getElementById('productStock').value=p.stock;document.getElementById('productDescription').value=p.description||'';document.getElementById('productModalTitle').textContent='Edit Product';document.getElementById('deleteProductBtn').style.display='';document.getElementById('imagePreview').src=p.image||'';SB.openModal('productModal');}
  });
  document.getElementById('productForm').addEventListener('submit',async e=>{
    e.preventDefault();const id=document.getElementById('productId').value;const file=document.getElementById('productImage').files[0];
    if(file&&!SBValidation.image(file)){SB.toast('Image must be JPG, PNG or WebP and smaller than 2 MB.','error');return;}
    const existing=products.find(p=>p.id==id);let image=existing?.image||'../assets/images/products/candy.png';if(file)image=await new Promise(r=>{const reader=new FileReader();reader.onload=()=>r(reader.result);reader.readAsDataURL(file);});
    const payload={name:document.getElementById('productName').value.trim(),category:document.getElementById('productCategory').value,sku:document.getElementById('productSku').value.trim(),price:Number(document.getElementById('productPrice').value),stock:Number(document.getElementById('productStock').value),description:document.getElementById('productDescription').value.trim(),image,imageFile:file||null};
    SBValidation.clearAllErrors(e.currentTarget);
    if(!SBValidation.validateForm([{field:'productName',check:SBValidation.required(payload.name),message:'Product name is required.'},{field:'productCategory',check:SBValidation.required(payload.category),message:'Category is required.'},{field:'productSku',check:SBValidation.required(payload.sku),message:'SKU is required.'},{field:'productPrice',check:SBValidation.positiveNumber(payload.price),message:'Price must be greater than zero.'},{field:'productStock',check:SBValidation.nonNegativeNumber(payload.stock),message:'Stock cannot be negative.'}]))return;
    try{id?await SweetBiteAPI.products.update(id,payload):await SweetBiteAPI.products.create(payload);SB.closeModal('productModal');SB.toast(id?'Product updated.':'Product added.');load();}catch(err){SB.toast(err.message,'error');}
  });
  document.getElementById('deleteProductBtn').addEventListener('click',async()=>{
    const id=document.getElementById('productId').value;
    if(!id)return;
    const confirmed=await SB.confirm('This product will be permanently removed.',{title:'Delete Product?'});
    if(!confirmed)return;
    try{await SweetBiteAPI.products.remove(id);SB.closeModal('productModal');SB.toast('Product deleted.');load();}catch(err){SB.toast(err.message,'error');}
  });
  load();
})();
