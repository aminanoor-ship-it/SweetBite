(async function(){
  try{
  const team=await SweetBiteAPI.team.list();
  const teamGrid=document.getElementById('teamGrid');
  teamGrid.innerHTML='';
  team.forEach(m=>{
    const article=document.createElement('article');
    article.className='card team-card';
    const photo=document.createElement('div');
    photo.className='team-photo';
    const img=document.createElement('img');
    img.src=m.image;
    img.alt=m.name;
    photo.appendChild(img);
    const body=document.createElement('div');
    body.className='team-body';
    const h3=document.createElement('h3');
    h3.textContent=m.name;
    const p=document.createElement('p');
    p.textContent=m.email;
    const a=document.createElement('a');
    a.className='btn btn-light';
    a.href='mailto:'+m.email;
    a.innerHTML=SBIcon('mail',17)+' Message';
    body.appendChild(h3);
    body.appendChild(p);
    body.appendChild(a);
    article.appendChild(photo);
    article.appendChild(body);
    teamGrid.appendChild(article);
  });
  window.addEventListener('sweetbite:search',e=>{const q=e.detail.toLowerCase();document.querySelectorAll('.team-card').forEach(c=>c.style.display=c.textContent.toLowerCase().includes(q)?'':'none');});
  }catch(err){SB.toast('Failed to load team members. Please try again.','error');}
})();
