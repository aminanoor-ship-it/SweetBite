(function(){
  const page=document.body.dataset.page||'';
  const user=SweetBiteAPI.auth.getCurrentUser();
  const navTop=[
    ['dashboard','dashboard.html','Dashboard','dashboard'],
    ['products','products.html','Products','box'],
    ['orders','orders.html','Orders Lists','list'],
    ['add-order','add-order.html','Add Orders','plus'],
    ['customers','customers.html','Customers','users'],
    ['sales','sales.html','Sales','chart'],
    ['profit-loss','profit-loss.html','Profit & Loss','trending']
  ];
  const navMid=[['about','about.html','About','info'],['contact','contact.html','Contact','mail']];
  const link=([key,href,label,icon])=>`<a class="nav-link ${page===key?'active':''}" href="${href}">${SBIcon(icon)}<span>${label}</span></a>`;
  const sidebar=document.getElementById('sidebar');
  if(sidebar) sidebar.innerHTML=`
    <aside class="sidebar">
      <a class="brand" href="dashboard.html">Sweet<span>Bite</span></a>
      <nav class="sidebar-nav">
        <div class="nav-group">${navTop.map(link).join('')}</div>
        <hr class="nav-separator">
        <div class="nav-group">${navMid.map(link).join('')}</div>
        <hr class="nav-separator">
        <div class="nav-group">
          ${link(['settings','settings.html','Settings','settings'])}
          <a class="nav-link logout" id="logoutLink" href="#">${SBIcon('logout')}<span>Logout</span></a>
        </div>
      </nav>
    </aside>`;
  const topbar=document.getElementById('topbar');
  if(topbar) topbar.innerHTML=`
    <header class="topbar">
      <button class="menu-toggle" id="menuToggle" aria-label="Open menu">${SBIcon('menu',24)}</button>
      <label class="search-box">${SBIcon('search')}<input id="globalSearch" type="search" placeholder="Search" autocomplete="off"></label>
      <div class="user-menu">
        <img id="topProfileImage" src="${user.profile_image || user.image || '../assets/images/profile/kawther.png'}" alt="Profile">
        <div class="user-meta"><strong id="topUserName"></strong><span id="topUserRole"></span></div>
      </div>
    </header>`;
  const topUserName=document.getElementById('topUserName');
  const topUserRole=document.getElementById('topUserRole');
  if(topUserName) topUserName.textContent=user.full_name || user.name || 'Kawther';
  if(topUserRole) topUserRole.textContent=user.role || 'Admin';
  document.getElementById('logoutLink')?.addEventListener('click',e=>{e.preventDefault();SweetBiteAPI.auth.logout();location.href='login.html';});
  document.getElementById('menuToggle')?.addEventListener('click',()=>document.body.classList.toggle('sidebar-open'));
  document.addEventListener('click',e=>{if(innerWidth<=900&&!e.target.closest('.sidebar')&&!e.target.closest('#menuToggle'))document.body.classList.remove('sidebar-open');});
  const search=document.getElementById('globalSearch');
  search?.addEventListener('input',SB.debounce(()=>window.dispatchEvent(new CustomEvent('sweetbite:search',{detail:search.value.trim()})),200));
})();
