(function(){
  const error=document.getElementById('authError');

  function togglePasswords(){
    document.querySelectorAll('.toggle-password').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const target=document.getElementById(btn.dataset.target);
        if(!target)return;
        const isPassword=target.type==='password';
        target.type=isPassword?'text':'password';
        btn.classList.toggle('active',isPassword);
      });
    });
  }

  function profileUpload(){
    const wrap=document.getElementById('profileUpload');
    const input=document.getElementById('profileImage');
    const preview=document.getElementById('profilePreview');
    if(!wrap||!input)return;
    wrap.addEventListener('click',()=>input.click());
    wrap.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click();}
    });
    input.addEventListener('change',()=>{
      const file=input.files[0];
      if(!file)return;
      if(!SBValidation.image(file)){SB.toast('Image must be JPG, PNG or WebP and smaller than 2 MB.','error');input.value='';preview.removeAttribute('src');return;}
      const reader=new FileReader();
      reader.onload=e=>{preview.src=e.target.result;};
      reader.readAsDataURL(file);
    });
  }

  function showAuthError(form, err){
    const fieldMap={full_name:'fullName',new_password:'newPassword',current_password:'currentPassword'};
    if(Array.isArray(err.errors)){
      err.errors.forEach(item=>{
        const field=fieldMap[item.path||item.param]||item.path||item.param;
        if(field)SBValidation.showFieldError(field,item.msg);
      });
    }
    error.textContent=err.message||'Something went wrong.';
    error.className='auth-error';
  }

  function getResetToken(){
    const params=new URLSearchParams(window.location.search);
    return params.get('token');
  }

  if(document.body.classList.contains('auth-page')&&SweetBiteAPI.auth.isLoggedIn()&&location.pathname.endsWith('login.html')){
    location.href='dashboard.html';
    return;
  }

  const resetToken=getResetToken();
  if(location.pathname.endsWith('reset-password.html')&&!resetToken){
    location.href='forgot-password.html';
    return;
  }

  togglePasswords();
  profileUpload();

  document.getElementById('loginForm')?.addEventListener('submit',async e=>{
    e.preventDefault(); error.textContent=''; error.className='auth-error'; SBValidation.clearAllErrors(e.currentTarget);
    const email=e.currentTarget.email.value.trim(), password=e.currentTarget.password.value, remember=e.currentTarget.remember?.checked;
    if(!SBValidation.validateForm([
      {field:'email',check:SBValidation.email(email),message:'Enter a valid email address.'},
      {field:'password',check:SBValidation.required(password),message:'Password is required.'}
    ])) return;
    const btn=e.currentTarget.querySelector('button[type=submit]'); btn.disabled=true; btn.textContent='Signing In...';
    try{
      await SweetBiteAPI.auth.login({email,password,remember});
      location.href='dashboard.html';
    }catch(err){showAuthError(e.currentTarget,err);}
    finally{btn.disabled=false;btn.textContent='Sign In';}
  });

  document.getElementById('registerForm')?.addEventListener('submit',async e=>{
    e.preventDefault(); error.textContent=''; error.className='auth-error'; SBValidation.clearAllErrors(e.currentTarget);
    const fullName=e.currentTarget.fullName.value.trim(), email=e.currentTarget.email.value.trim(), username=e.currentTarget.username.value.trim(), password=e.currentTarget.password.value;
    const imageFile=document.getElementById('profileImage')?.files[0]||null;
    if(!SBValidation.validateForm([
      {field:'fullName',check:SBValidation.required(fullName),message:'Full name is required.'},
      {field:'email',check:SBValidation.email(email),message:'Enter a valid email address.'},
      {field:'username',check:SBValidation.username(username),message:'Username must be 3-50 characters (letters, numbers, underscores).'},
      {field:'password',check:SBValidation.password(password),message:'Password must have at least 8 characters.'},
      {field:'terms',check:document.getElementById('terms')?.checked,message:'You must accept the terms and conditions.'}
    ])) return;
    if(imageFile&&!SBValidation.image(imageFile)){SB.toast('Profile image must be JPG, PNG or WebP and smaller than 2 MB.','error');return;}
    const btn=e.currentTarget.querySelector('button[type=submit]'); btn.disabled=true; btn.textContent='Creating...';
    try{
      await SweetBiteAPI.auth.register({full_name:fullName,email,username,password,imageFile});
      SB.toast('Account created successfully.');
      setTimeout(()=>location.href='login.html',700);
    }catch(err){showAuthError(e.currentTarget,err);}
    finally{btn.disabled=false;btn.textContent='Sign Up';}
  });

  document.getElementById('forgotForm')?.addEventListener('submit',async e=>{
    e.preventDefault(); error.textContent=''; error.className='auth-error'; SBValidation.clearAllErrors(e.currentTarget);
    const email=e.currentTarget.email.value.trim();
    if(!SBValidation.validateForm([
      {field:'email',check:SBValidation.email(email),message:'Enter a valid email address.'}
    ])) return;
    const btn=e.currentTarget.querySelector('button[type=submit]'); btn.disabled=true; btn.textContent='Sending...';
    try{
      const result=await SweetBiteAPI.auth.forgotPassword(email);
      error.textContent=result.message||'If an account exists with that email, a reset link has been sent.';
      error.className='auth-success';
      if(result.resetUrl){
        setTimeout(()=>location.href=result.resetUrl,1500);
      }
    }catch(err){error.textContent=err.message;error.className='auth-error';}
    finally{btn.disabled=false;btn.textContent='Send Reset Link';}
  });

  document.getElementById('resetForm')?.addEventListener('submit',async e=>{
    e.preventDefault(); error.textContent=''; error.className='auth-error'; SBValidation.clearAllErrors(e.currentTarget);
    const newPassword=e.currentTarget.newPassword.value, confirmPassword=e.currentTarget.confirmPassword.value;
    if(!SBValidation.validateForm([
      {field:'newPassword',check:SBValidation.password(newPassword),message:'Password must have at least 8 characters.'},
      {field:'confirmPassword',check:newPassword===confirmPassword,message:'Passwords do not match.'}
    ])) return;
    const btn=e.currentTarget.querySelector('button[type=submit]'); btn.disabled=true; btn.textContent='Resetting...';
    try{
      await SweetBiteAPI.auth.resetPassword(resetToken,newPassword);
      SB.toast('Password reset successfully. You can now sign in.');
      setTimeout(()=>location.href='login.html',1200);
    }catch(err){error.textContent=err.message;error.className='auth-error';}
    finally{btn.disabled=false;btn.textContent='Reset Password';}
  });
})();
