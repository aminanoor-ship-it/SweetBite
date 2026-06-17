(function(){
  window.SB = {
    money(value){ return '$' + Number(value || 0).toLocaleString(undefined,{minimumFractionDigits:Number(value)%1?2:0,maximumFractionDigits:2}); },
    date(value){ if(!value)return ''; const d=new Date(value+'T00:00:00'); return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); },
    statusLabel(value){ return String(value||'').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()); },
    statusClass(value){ return String(value||'').replaceAll('_','-'); },
    toast(message,type='success'){
      let root=document.querySelector('.toast-container');
      if(!root){root=document.createElement('div');root.className='toast-container';document.body.appendChild(root);}
      const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;root.appendChild(el);setTimeout(()=>el.remove(),3200);
    },
    async confirm(message, { title='Are you sure?', okText='Delete' }={}){
      const modal=document.getElementById('confirmModal');
      if(!modal) return window.confirm(message);
      const t=document.getElementById('confirmTitle');
      const m=document.getElementById('confirmMessage');
      const ok=document.getElementById('confirmOk');
      const cancel=document.getElementById('confirmCancel');
      const icon=document.getElementById('confirmIcon');
      if(t) t.textContent=title;
      if(m) m.textContent=message;
      if(ok) ok.textContent=okText;
      if(icon) icon.innerHTML='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></svg>';
      return new Promise(resolve=>{
        SB.openModal('confirmModal');
        const cleanup=val=>{SB.closeModal('confirmModal');ok.removeEventListener('click',onOk);cancel.removeEventListener('click',onCancel);resolve(val);};
        const onOk=()=>cleanup(true);
        const onCancel=()=>cleanup(false);
        ok.addEventListener('click',onOk);
        cancel.addEventListener('click',onCancel);
      });
    },
    openModal(id){ document.getElementById(id)?.classList.add('open'); document.body.style.overflow='hidden'; },
    closeModal(id){ document.getElementById(id)?.classList.remove('open'); document.body.style.overflow=''; },
    protect(){ if(!SweetBiteAPI.auth.isLoggedIn()){ location.href='login.html'; return false;} return true; },
    debounce(fn,wait=250){let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),wait);};},
    async apiCall(fn, { loadingEl, loadingText = 'Loading...', onError } = {}) {
      let original = '';
      if (loadingEl) { original = loadingEl.textContent; loadingEl.textContent = loadingText; loadingEl.disabled = true; }
      try { return await fn(); }
      catch (err) { const msg = err.message || 'Something went wrong.'; SB.toast(msg, 'error'); if (onError) onError(err); throw err; }
      finally { if (loadingEl) { loadingEl.textContent = original; loadingEl.disabled = false; } }
    }
  };
  document.addEventListener('click',e=>{ const close=e.target.closest('[data-close-modal]'); if(close)SB.closeModal(close.dataset.closeModal); if(e.target.classList.contains('modal-overlay'))SB.closeModal(e.target.id); });
})();
