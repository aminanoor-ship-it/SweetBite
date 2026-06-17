(async function(){
  try{
  document.getElementById('qualityIcon').innerHTML=SBIcon('diamond',38);document.getElementById('passionIcon').innerHTML=SBIcon('heart',38);document.getElementById('trustIcon').innerHTML=SBIcon('trust',38);document.getElementById('customersIcon').innerHTML=SBIcon('users',38);
  const s=await SweetBiteAPI.settings.get();
  const companyInfoContainer=document.getElementById('companyInfo');
  companyInfoContainer.innerHTML='';
  const info=[['store','Company Name',s.company_name],['mail','Company Email',s.company_email],['calendar','Founded',s.founded],['phone','Phone',s.phone]];
  info.forEach(([icon,label,value])=>{
    const div=document.createElement('div');
    div.className='info-item';
    const iconSpan=document.createElement('span');
    iconSpan.className='info-icon';
    iconSpan.innerHTML=SBIcon(icon);
    const textDiv=document.createElement('div');
    const strong=document.createElement('strong');
    strong.textContent=label;
    const span=document.createElement('span');
    span.textContent=value;
    textDiv.appendChild(strong);
    textDiv.appendChild(span);
    div.appendChild(iconSpan);
    div.appendChild(textDiv);
    companyInfoContainer.appendChild(div);
  });
  }catch(err){SB.toast('Failed to load company info. Please try again.','error');}
})();
