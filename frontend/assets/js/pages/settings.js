(async function () {
  try {
    const data = await SweetBiteAPI.settings.get();
    let imageData = data.profile.image;
    let selectedImageFile = null;
    let profileEditing = false;
    let passwordExpanded = false;

    const profileSection = document.getElementById('profileSection');
    const displayFullName = document.getElementById('displayFullName');
    const displayEmail = document.getElementById('displayEmail');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('profileEmail');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelProfileEdit = document.getElementById('cancelProfileEdit');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    const passwordSection = document.getElementById('passwordSection');
    const showPasswordBtn = document.getElementById('showPasswordBtn');
    const hidePasswordBtn = document.getElementById('hidePasswordBtn');

    function renderProfile() {
      displayFullName.textContent = data.profile.full_name;
      displayEmail.textContent = data.profile.email;
      fullNameInput.value = data.profile.full_name;
      emailInput.value = data.profile.email;
      document.getElementById('profilePreview').src = imageData;
    }

    function setProfileEditing(editing) {
      profileEditing = editing;
      profileSection.classList.toggle('editing', editing);
      if (!editing) {
        fullNameInput.value = data.profile.full_name;
        emailInput.value = data.profile.email;
        SBValidation.clearAllErrors(document.getElementById('settingsForm'));
      }
    }

    function togglePasswordSection(show) {
      passwordExpanded = show;
      passwordSection.classList.toggle('expanded', show);
      if (!show) {
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        SBValidation.clearAllErrors(document.getElementById('settingsForm'));
      }
    }

    renderProfile();

    document.getElementById('uploadIcon').innerHTML = SBIcon('upload', 19);

    editProfileBtn.addEventListener('click', () => setProfileEditing(true));
    cancelProfileEdit.addEventListener('click', () => setProfileEditing(false));

    showPasswordBtn.addEventListener('click', () => togglePasswordSection(true));
    hidePasswordBtn.addEventListener('click', () => togglePasswordSection(false));

    document.getElementById('changeImageBtn').addEventListener('click', () => document.getElementById('profileImage').click());

    document.getElementById('profileImage').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      selectedImageFile = file;
      if (!SBValidation.image(file)) {
        SB.toast('Image must be JPG, PNG or WebP and smaller than 2 MB.', 'error');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        imageData = reader.result;
        document.getElementById('profilePreview').src = imageData;
        if (!profileEditing) setProfileEditing(true);
      };
      reader.readAsDataURL(file);
    });

    async function saveProfile() {
      const full_name = fullNameInput.value.trim();
      const email = emailInput.value.trim();

      SBValidation.clearAllErrors(document.getElementById('settingsForm'));
      if (!SBValidation.validateForm([
        { field: 'fullName', check: SBValidation.required(full_name), message: 'Full name is required.' },
        { field: 'profileEmail', check: SBValidation.email(email), message: 'Enter a valid email address.' }
      ])) return;

      try {
        const result = await SweetBiteAPI.settings.updateProfile({ full_name, email, image: imageData, imageFile: selectedImageFile });
        data.profile.full_name = result.full_name;
        data.profile.email = result.email;
        data.profile.image = result.image || imageData;
        imageData = data.profile.image;
        selectedImageFile = null;
        document.getElementById('profileImage').value = '';
        renderProfile();
        setProfileEditing(false);
        document.getElementById('topUserName').textContent = result.full_name;
        document.getElementById('topProfileImage').src = imageData;
        SB.toast('Profile updated successfully.');
      } catch (err) {
        SB.toast(err.message, 'error');
      }
    }

    saveProfileBtn.addEventListener('click', saveProfile);

    async function savePassword() {
      const current_password = document.getElementById('currentPassword').value;
      const new_password = document.getElementById('newPassword').value;
      const confirm = document.getElementById('confirmPassword').value;

      const anyPasswordFilled = current_password || new_password || confirm;
      if (!anyPasswordFilled) return false;

      SBValidation.clearAllErrors(document.getElementById('settingsForm'));
      if (!current_password) { SBValidation.showFieldError('currentPassword', 'Enter your current password.'); return false; }
      if (!SBValidation.password(new_password)) { SBValidation.showFieldError('newPassword', 'New password must have at least 8 characters.'); return false; }
      if (new_password !== confirm) { SBValidation.showFieldError('confirmPassword', 'New passwords do not match.'); return false; }

      try {
        await SweetBiteAPI.settings.changePassword({ current_password, new_password });
        togglePasswordSection(false);
        SB.toast('Password changed successfully.');
        return true;
      } catch (err) {
        SB.toast(err.message, 'error');
        return false;
      }
    }

    document.getElementById('settingsForm').addEventListener('submit', async e => {
      e.preventDefault();
      if (profileEditing) await saveProfile();
      if (passwordExpanded) await savePassword();
    });
  } catch (err) {
    SB.toast('Failed to load settings. Please try again.', 'error');
  }
})();
