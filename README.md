<img width="1896" height="822" alt="image" src="https://github.com/user-attachments/assets/68c96b75-1c54-4788-a7d9-fd77c579472f" />


# SweetBite Full System

This main folder contains the complete project structure:

```text
SweetBite-Full-System/
├── frontend/        HTML, CSS and plain JavaScript pages
├── backend/         Node.js, Express and MySQL REST API
├── database/        MySQL schema, sample data and backup folder
├── docs/            System planning document
├── .gitignore
└── README.md
```

## Technology

- Frontend: HTML5, CSS3, plain JavaScript and Fetch API
- Backend: Node.js and Express
- Database: MySQL
- Authentication: JWT and bcrypt
- Product/profile uploads: Multer

The frontend is already configured to use the real API:

```js
API_BASE_URL: 'http://localhost:5000/api'
MOCK_MODE: false
```

## 1. Create the MySQL database

Open MySQL Workbench or the MySQL command line and run these files in order:

1. `database/schema.sql`
2. `database/seed.sql`

Optional: create a separate MySQL account using `database/create_database_user.sql.example`. Change its password before running it.

## 2. Configure the backend

Open a terminal inside `backend`:

```bash
cd backend
copy .env.example .env
npm install
```

On macOS/Linux use:

```bash
cp .env.example .env
```

Open `.env` and make sure these values match your MySQL installation:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=sweetbite_user
DB_PASSWORD=your_mysql_password
DB_NAME=sweetbite_db
JWT_SECRET=replace_with_a_long_random_secret
```

If you do not create `sweetbite_user`, temporarily use your local MySQL account in `.env` during development.

## 3. Create the first admin account

After importing the schema and seed data, run:

```bash
npm run create-admin
```

The default values come from `.env`:

```env
ADMIN_EMAIL=admin@sweetbite.com
ADMIN_PASSWORD=replace_with_a_secure_password
```

Change the admin password after the first login. You can also update the values in `.env` before creating the account.

**Important:** Never commit `.env` to version control. The `.gitignore` file already excludes it.

## 4. Start the backend

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## 5. Start the frontend

Open the complete `SweetBite-Full-System` folder in VS Code.

1. Install the **Live Server** extension.
2. Right-click `frontend/index.html`.
3. Select **Open with Live Server**.
4. Log in using the admin account created in Step 3.

Do not open the HTML file by double-clicking it. The frontend should run from an HTTP address such as `http://127.0.0.1:5500`.

## Main frontend files

```text
frontend/index.html                 Entry page
frontend/pages/                     All website pages
frontend/assets/css/                Shared and authentication styling
frontend/assets/js/config.js        API URL and mock-mode setting
frontend/assets/js/api.js           All Fetch API requests
frontend/assets/js/pages/           Page-specific JavaScript
frontend/assets/images/             Design images and product/team assets
```

## Main backend files

```text
backend/server.js                   Starts the API
backend/src/app.js                  Express setup, security and routes
backend/src/config/db.js            MySQL connection pool
backend/src/routes/                 API endpoint definitions
backend/src/controllers/            Request and response logic
backend/src/models/                 Prepared MySQL queries
backend/src/middleware/             JWT, roles, validation, uploads and errors
backend/src/validators/             Input rules
backend/src/utils/                  Shared backend helpers
backend/uploads/                    Product, profile and team images
backend/scripts/createAdmin.js      Creates the first admin account
```

## Included API groups

- `/api/auth`
- `/api/dashboard`
- `/api/products`
- `/api/categories`
- `/api/customers`
- `/api/orders`
- `/api/sales`
- `/api/reports`
- `/api/settings`
- `/api/team`
- `/api/users`

## Setting up credentials

### Initial setup (Development)

1. **Database configuration:** Update `backend/.env` with your actual MySQL credentials:
   ```env
   DB_USER=sweetbite_user
   DB_PASSWORD=your_actual_database_password
   DB_NAME=sweetbite_db
   ```

2. **Admin account:** When you run `npm run create-admin`, a secure admin account is created. The password will be displayed in the terminal:
   ```
   Admin account created.
   Email: admin@sweetbite.com
   Password: [generated or from ADMIN_PASSWORD in .env]
   ```
   **Save this password safely** — you'll need it to log in for the first time.

3. **Change the password:** After first login, go to Settings and change the admin password immediately.

### Security guidelines

- **`.env` is not in Git:** The `.gitignore` file excludes `.env`, so your credentials are never committed to version control.
- **Never commit credentials:** Each developer should create their own `.env` file from `.env.example`.
- **Template only:** `.env.example` contains only placeholder values and can be safely committed.
- **Production secrets:** Use environment variables from your hosting platform (AWS, Heroku, etc.) in production — never hardcode credentials.

### Creating a new developer's `.env`

New developers should:
1. Copy `.env.example` to `.env`
2. Replace placeholders with their local MySQL credentials
3. Choose a secure `ADMIN_PASSWORD` or leave as placeholder for auto-generation
4. **Never commit `.env`** — it will be automatically ignored by Git

## Important notes

- The backend calculates order prices from database product prices. It does not trust totals sent by the browser.
- Order creation uses a MySQL transaction and reduces stock only after validation succeeds.
- Deleting an unfinished order restores its product stock.
- Product deletion is implemented as deactivation so old order history remains valid.
- Customer deletion is implemented as deactivation.
- Images are stored as files; MySQL stores only their paths.
- Prepared queries are used throughout the models.
- Admin-only routes use role middleware.
- Login requests use rate limiting.
- Keep `.env` outside Git and use a long JWT secret in production.

## Version control and Git

### `.gitignore` setup

The `.gitignore` file is configured to:
- ✅ Ignore `.env` (your local credentials)
- ✅ Ignore `.env.*` (all environment variants)
- ✅ **Not ignore** `.env.example` (the template)
- ✅ Ignore `node_modules/` and lock files
- ✅ Ignore logs, uploads (except `.gitkeep` files)
- ✅ Ignore IDE and OS files

### Removing a tracked `.env` file from Git

If `.env` was already committed to Git and you want to remove it without deleting your local file:

```bash
# Stop tracking the file in Git (without deleting it locally)
git rm --cached backend/.env

# Git will now ignore it in future commits
# Verify it's removed from tracking
git status
```

Then commit this change:

```bash
git add .gitignore
git commit -m "Remove .env from tracking"
```

### For team members cloning the repo

1. Clone the repository
2. Copy the template and add credentials:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your local credentials
   ```
3. Git will automatically ignore your `.env` file from now on

### Important notes for contributors

- **Never commit `.env`** — It will be automatically ignored
- **Never commit `node_modules/`** — Run `npm install` instead
- **Always keep `.env.example` up to date** — When you add new env variables, update the template
- **Test before pushing** — Make sure sensitive files aren't staged with `git status`

## Production preparation

Before deployment:

1. Set `NODE_ENV=production`.
2. Use a strong database password and a restricted MySQL user.
3. Set `CORS_ORIGINS` to the real frontend domain only.
4. Set `PUBLIC_BASE_URL` to the HTTPS backend address.
5. Use HTTPS.
6. Store uploads in persistent storage or cloud object storage.
7. Create scheduled MySQL backups.
8. Change the initial admin password.
9. Test role permissions, stock changes, validation and error responses.
