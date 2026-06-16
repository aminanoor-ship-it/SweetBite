// This frontend is connected to the Node.js/Express API in ../backend.
// Set MOCK_MODE to true only when you intentionally want browser localStorage demo data.
window.SWEETBITE_CONFIG = {
  API_BASE_URL: 'http://localhost:5000/api',
  MOCK_MODE: false,
  TOKEN_KEY: 'sweetbite_token',
  USER_KEY: 'sweetbite_user'
};
// To use without the backend, set MOCK_MODE to true above.
// Mock mode uses localStorage so no server is needed.
