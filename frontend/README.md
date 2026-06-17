# SweetBite Frontend

This folder contains the SweetBite design implemented with HTML, CSS and plain JavaScript.

The frontend is connected to the backend by default:

```js
API_BASE_URL: 'http://localhost:5000/api'
MOCK_MODE: false
```

Start the backend first, then run `frontend/index.html` through VS Code Live Server.

Important files:

- `assets/js/config.js`: API address and mock-mode switch
- `assets/js/api.js`: all Fetch API requests
- `assets/js/layout.js`: reusable sidebar and top navigation
- `assets/js/pages/`: page-specific behavior
- `assets/css/main.css`: dashboard pages
- `assets/css/auth.css`: login and registration

See `../README.md` for complete database, backend and startup instructions.
