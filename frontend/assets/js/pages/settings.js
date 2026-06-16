(async function () {
  try {
    const data = await SweetBiteAPI.settings.get();
    let imageData = data.profile.image;
    let selectedImageFile = null;

    document.getElementById('uploadIcon').innerHTML = SBIcon('upload', 19);
    document.getElementById('fullName').value = data.profile.full_name;
    document.getElementById('profileEmail').value = data.profile.email;
    document.getElementById('profilePreview').src = data.profile.image;

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
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('cancelSettings').addEventListener('click', () => location.reload());

    document.getElementById('settingsForm').addEventListener('submit', async e => {
      e.preventDefault();
      const full_name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('profileEmail').value.trim();
      const current_password = document.getElementById('currentPassword').value;
      const new_password = document.getElementById('newPassword').value;
      const confirm = document.getElementById('confirmPassword').value;

      SBValidation.clearAllErrors(e.currentTarget);
      if (!SBValidation.validateForm([
        { field: 'fullName', check: SBValidation.required(full_name), message: 'Full name is required.' },
        { field: 'profileEmail', check: SBValidation.email(email), message: 'Enter a valid email address.' }
      ])) return;

      if (new_password) {
        if (!current_password) { SBValidation.showFieldError('currentPassword', 'Enter your current password.'); return; }
        if (!SBValidation.password(new_password)) { SBValidation.showFieldError('newPassword', 'New password must have at least 8 characters.'); return; }
        if (new_password !== confirm) { SBValidation.showFieldError('confirmPassword', 'New passwords do not match.'); return; }
      }

      try {
        const result = await SweetBiteAPI.settings.updateProfile({ full_name, email, image: imageData, imageFile: selectedImageFile });
        if (new_password) await SweetBiteAPI.settings.changePassword({ current_password, new_password });
        imageData = result.image || imageData;
        document.getElementById('fullName').value = result.full_name;
        document.getElementById('profileEmail').value = result.email;
        document.getElementById('profilePreview').src = imageData;
        document.getElementById('topUserName').textContent = result.full_name;
        document.getElementById('topProfileImage').src = imageData;
        selectedImageFile = null;
        document.getElementById('profileImage').value = '';
        SB.toast('Settings updated successfully.');
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
      } catch (err) {
        SB.toast(err.message, 'error');
      }
    });
  } catch (err) {
    SB.toast('Failed to load settings. Please try again.', 'error');
  }
})();
