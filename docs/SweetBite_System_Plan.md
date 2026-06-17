# SweetBite Website System Plan

**Project type:** Sweet snacks sales and order management system  
**Frontend:** HTML, CSS, Plain JavaScript  
**Backend:** Node.js + Express.js  
**Database:** MySQL  
**Important rule:** No React, Vue, Angular, or frontend framework.

---

# 1. Project Overview

SweetBite is a sweet snacks sales and order management website. From the provided designs, the system is mainly an admin dashboard where an admin or staff member can manage products, customers, orders, sales, reports, settings, profile, and team/contact information.

The system should work dynamically. This means the frontend should not use fixed or random text. Data should come from MySQL through backend API routes.

---

# 2. Design Style Analysis

The design uses a clean dashboard style with rounded cards, soft shadows, light backgrounds, and strong navy text.

| Element | Value |
|---|---|
| Main dark color | Navy blue |
| Main accent color | Beige / tan |
| Background color | Light cream |
| Secondary colors | Green, yellow, red, blue, purple |
| Font | Nunito Sans |
| UI style | Rounded cards, soft shadows, dashboard layout |

Suggested CSS variables:

```css
:root {
  --primary: #062B52;
  --accent: #D8B98D;
  --background: #F3EFEA;
  --white: #FFFFFF;
  --success: #10BFA5;
  --warning: #FFC247;
  --danger: #FF5252;
  --info: #4F83F1;
  --purple: #CDB7FF;
}
```

These colors should be used consistently for buttons, badges, cards, sidebar active states, forms, and dashboard charts.

---

# 3. Detailed Image and Page Analysis

## 3.1 Login Page

### Page purpose

The login page allows admin and staff users to access the dashboard system.

### Visible sections and components

| Component | Description |
|---|---|
| Background | Beige abstract background |
| Login card | White rounded card in the center |
| Title | “Login to Account” |
| Subtitle | “Please enter your email and password to continue” |
| Email input | User enters email address |
| Password input | User enters password |
| Forget Password link | Used for password recovery |
| Remember Password checkbox | Saves login session/token locally |
| Sign In button | Sends login request |
| Create Account link | Goes to registration page |

### Dynamic behavior

When the user clicks **Sign In**:

1. Frontend collects email and password.
2. Frontend sends data to the backend login API.
3. Backend checks if the user exists.
4. Backend compares password using bcrypt.
5. Backend checks if the user is active.
6. Backend returns token and user data.
7. Frontend saves token and redirects to dashboard.

### Database data needed

Data comes from the `users` table:

- email
- password_hash
- role_id
- status
- profile_image

### Validation needed

| Field | Validation |
|---|---|
| Email | Required and valid email format |
| Password | Required |
| Remember password | Optional |
| Login attempts | Rate limited |

### Page connections

Login connects to:

- Register page
- Forgot password page
- Dashboard page

---

## 3.2 Register Page

### Page purpose

The register page creates a new user account.

### Visible sections and components

| Component | Description |
|---|---|
| Background | Same beige abstract background |
| Register card | White rounded card |
| Title | “Create an Account” |
| Email input | User email |
| Username input | User display name |
| Password input | User password |
| Terms checkbox | User accepts terms |
| Sign Up button | Creates account |
| Login link | Goes back to login |

### Dynamic behavior

When the user clicks **Sign Up**:

1. Frontend validates form fields.
2. Frontend sends registration data to backend.
3. Backend checks duplicate email or username.
4. Backend hashes password.
5. Backend saves the new user.
6. Backend returns success message.

For a real admin system, new users should not automatically become admin. New users should be created as `staff` and their status can be `inactive` until an admin activates them.

### Database data needed

- `users`
- `roles`

### Validation needed

| Field | Validation |
|---|---|
| Email | Required, valid, unique |
| Username | Required, 3–50 characters |
| Password | Required, minimum 8 characters |
| Terms | Must be checked |

### Page connections

Register connects to:

- Login page
- User management page
- Dashboard after approval/login

---

## 3.3 Dashboard Page

### Page purpose

The dashboard is the main page after login. It gives a quick overview of the system.

### Visible sections and components

| Component | Description |
|---|---|
| Sidebar | Main navigation menu |
| Logo | SweetBite logo |
| Top search bar | Search products, customers, or orders |
| User profile | Avatar, name, role |
| Dashboard title | Current page title |
| Statistic cards | Total customers, total orders, total sales, total pending |
| Deals Details table | Recent product/order data |
| Revenue chart | Sales and profit chart |

### Dynamic behavior

The dashboard should load live data from backend:

- Total customers from `customers`
- Total orders from `orders`
- Total sales from completed orders/payments
- Total pending from pending/processing orders
- Deals table from recent orders
- Revenue chart from order totals grouped by date/month

### Database data needed

| Section | Tables |
|---|---|
| Statistic cards | customers, orders, order_items, payments |
| Deals table | orders, products, customers |
| Revenue chart | orders, order_items, payments |
| Profile | users |

### User actions

The user can:

- Search globally
- Navigate to pages
- Filter dashboard by month
- Open profile/settings

### Validation needed

- Search text should be sanitized.
- Month/date filters should be valid.

### Page connections

Dashboard connects to:

- Products
- Orders
- Add Orders
- Customers
- Sales
- Reports
- Settings
- About
- Contact

---

## 3.4 Products Page

### Page purpose

The products page displays and manages sweet snack products.

### Visible sections and components

| Component | Description |
|---|---|
| Sidebar | Main navigation |
| Search bar | Search products |
| User profile | Logged-in user info |
| Products title | Page heading |
| Category/status filter | Dropdown such as “All” |
| Product cards | Product image, name, price, status |
| Status badge | Available / Run out |
| View button | View product details |
| Edit button | Edit product |

### Dynamic behavior

Products should come from MySQL through backend API.

Each card should show:

- Product image
- Product name
- Price
- Stock status

Status should be calculated dynamically:

- If stock quantity > 0: Available
- If stock quantity = 0: Run out

### Database data needed

- `products`
- `categories`
- optional `product_images`

### User actions

Admin/staff can:

- Search products
- Filter products
- View product details
- Add product
- Edit product
- Delete product depending on role

### Validation needed

| Field | Validation |
|---|---|
| Product name | Required, unique or semi-unique |
| Price | Required and positive |
| Quantity | Required and cannot be negative |
| Image | JPG, PNG, WebP only, limited size |
| Category | Required |
| Status | Calculated from stock |

### Page connections

Products connects to:

- Add Product modal/page
- Edit Product modal/page
- Product Details page
- Add Orders page

---

## 3.5 Customers Page

### Page purpose

The customers page manages customer records.

### Visible sections and components

| Component | Description |
|---|---|
| Customers title | Page heading |
| Add customer button | Opens modal form |
| Filter dropdown | Example: “last customer” |
| Customer table | Customer list |
| Columns | Name, phone number, email, location, orders, action |
| Edit icon | Edits selected customer |
| Delete icon | Deletes selected customer |
| New Customer modal | Customer form |
| Modal close icon | Closes popup |
| Inputs | Name, phone number, email, location |

### Dynamic behavior

- Customer table loads data from backend.
- Orders count is calculated from `orders` table.
- Add button opens popup/modal.
- Save sends new customer data to backend.
- Edit icon loads selected customer data into modal.
- Delete icon asks for confirmation before deleting.

### Database data needed

- `customers`
- `orders`

### User actions

- Add customer
- Edit customer
- Delete customer
- Search customers
- Filter customers

### Validation needed

| Field | Validation |
|---|---|
| Customer name | Required |
| Phone number | Required, unique, valid format |
| Email | Optional or required, valid format, unique if used |
| Location | Required |
| Delete | Prevent delete if customer has orders, or use soft delete |

### Page connections

Customers connects to:

- Add Orders page
- Orders page
- Customer Details page

---

## 3.6 Add Orders Page

### Page purpose

The add orders page creates a new order for a customer.

### Visible sections and components

| Component | Description |
|---|---|
| Customer Name input | Search/dropdown customer selection |
| Customer dropdown list | Shows matching customers |
| Category dropdown | Select product category |
| Label input/dropdown | Product label or type |
| Order Date input | Date picker |
| Unit Price input | Auto-filled from selected product |
| Payment Method dropdown | EVC, eDahab, Cash, etc. |
| Item Name dropdown | Select product |
| Quantity input | Number input |
| Total Price input | Auto-calculated |
| Order Status dropdown | Processing, completed, rejected, etc. |
| Notes textarea | Extra order note |
| Order Summary card | Selected item, quantity, subtotal, discount, total |
| Processing button | Shows current order status |
| Cancel button | Cancel form |
| Reset button | Clear form |
| Save button | Save order |

### Dynamic behavior

- Customer search fetches matching customers from backend.
- Product dropdown fetches products from backend.
- When a product is selected, unit price fills automatically.
- When quantity changes, total price updates.
- Order summary updates immediately.
- Save creates the order and order items.
- Stock decreases after successful order.

### Database data needed

- `customers`
- `products`
- `categories`
- `orders`
- `order_items`
- `payments`

### User actions

- Select customer
- Select category
- Select product
- Enter quantity
- Select payment method
- Add notes
- Save order
- Reset form
- Cancel form

### Validation needed

| Field | Validation |
|---|---|
| Customer | Required and must exist |
| Product | Required and must exist |
| Quantity | Required, positive number |
| Quantity stock | Cannot exceed available stock |
| Date | Required, valid date |
| Payment method | Required |
| Status | Required |
| Total price | Auto-calculated by backend |
| Notes | Optional, length limit |

### Page connections

Add Orders connects to:

- Customers page
- Products page
- Orders List page
- Sales page
- Invoice page

---

## 3.7 Order Lists Page

### Page purpose

The order lists page displays all orders.

### Visible sections and components

| Component | Description |
|---|---|
| Order Lists title | Page heading |
| Date filter | Filter by order date |
| Order Status filter | Completed, Processing, Rejected, On Hold, In Transit |
| Reset Filter button | Clears filters |
| Orders table | Displays order data |
| Columns | ID, Name, Address, Date, Items, Status |
| Status badges | Colored order statuses |

### Dynamic behavior

Orders should load from backend with pagination.

Filters should call backend with query parameters, for example:

```text
GET /api/orders?status=completed&date=2026-09-04
```

Status badges should match the order status from the database.

### Database data needed

- `orders`
- `customers`
- `order_items`
- `products`

### User actions

- Filter by date
- Filter by status
- Reset filter
- View order details
- Update order status

### Validation needed

| Field | Validation |
|---|---|
| Date filter | Must be a valid date |
| Status filter | Must be an allowed status |
| Order status update | Only allowed statuses |
| Delete order | Admin only |

### Page connections

Order Lists connects to:

- Order Details page
- Add Orders page
- Sales page
- Reports page

---

## 3.8 Sales Page

### Page purpose

The sales page shows sales performance and recent sales.

### Visible sections and components

| Component | Description |
|---|---|
| Sales title | Page heading |
| Statistic cards | Total revenue, total orders, product sold, total pending |
| Sales Overview chart | Line/area chart |
| Month filter | “This month” dropdown |
| Top Products card | Product images, names, sold amount, price |
| Recent Sales table | Customer, product, payment, date, amount, status |

### Dynamic behavior

Backend calculates:

- Total revenue
- Total orders
- Total sold products
- Pending orders
- Sales chart grouped by day/month
- Top products grouped by product sales
- Recent sales table from latest orders/payments

### Database data needed

- `orders`
- `order_items`
- `products`
- `customers`
- `payments`

### User actions

- Filter by month
- View top products
- View recent sales
- Export sales report if needed

### Validation needed

- Month filter must be valid.
- Revenue access can be admin-only if needed.

### Page connections

Sales connects to:

- Reports page
- Orders page
- Products page

---

## 3.9 About Page

### Page purpose

The about page shows information about SweetBite.

### Visible sections and components

| Component | Description |
|---|---|
| Page title | About SweetBite |
| Brand card | SweetBite logo |
| Story section | Company description |
| Feature cards | Quality, Passion, Trust, Customers |
| Company info | Company name, email, founded date, phone |

### Dynamic behavior

This can be static, but in a real system it is better if company information comes from the database.

Admin can update company information from Settings.

### Database data needed

- `settings`
- `company_profile`

### User actions

- View company information
- Admin can edit from Settings page

### Validation needed

If editable:

- Company email must be valid
- Phone must be valid
- Text must have length limits

### Page connections

About connects to:

- Contact page
- Settings page

---

## 3.10 Contact / Team Page

### Page purpose

The contact page shows team members or contact people.

### Visible sections and components

| Component | Description |
|---|---|
| Contact title | Page heading |
| Team cards | Image, name, email |
| Message button | Button with mail icon |
| Sidebar | Navigation |

### Dynamic behavior

Team cards should come from the database.

The message button can:

- Open email client using `mailto:email`
- Or open internal contact/message modal

### Database data needed

- `team_members`

### User actions

- View team member
- Send email/message

### Validation needed

If messages are sent through system:

- Name required
- Email required and valid
- Message required

### Page connections

Contact connects to:

- About page
- Settings page
- Messages page if added later

---

## 3.11 Settings Page

### Page purpose

The settings page allows the logged-in user to update profile and password.

### Visible sections and components

| Component | Description |
|---|---|
| Profile Setting card | Full name and email address |
| Profile image | Current user image |
| Change image button | Upload new image |
| Password card | Current password, new password, confirm password |
| Cancel button | Cancel changes |
| Update button | Save changes |

### Dynamic behavior

When page loads:

1. Frontend calls `/api/auth/profile`.
2. Inputs are filled with logged-in user data.
3. User can update name, email, image, or password.
4. Backend checks current password before changing password.
5. Backend hashes new password before saving.

### Database data needed

- `users`

### User actions

- Update full name
- Update email
- Change profile image
- Change password

### Validation needed

| Field | Validation |
|---|---|
| Full name | Required |
| Email | Required, valid, unique |
| Current password | Required when changing password |
| New password | Minimum 8 characters |
| Confirm password | Must match new password |
| Image | JPG, PNG, WebP, size limit |

### Page connections

Settings connects to:

- Dashboard
- Login after logout
- Profile menu

---

# 4. Complete Website Page Structure

## Correct page order

1. Landing/Home page
2. Login page
3. Register page
4. Dashboard page
5. Products page
6. Customers page
7. Add Orders page
8. Orders List page
9. Sales page
10. Reports page
11. About page
12. Contact/Team page
13. Settings page
14. Users/Admin Management page
15. Logout flow

---

# 5. Page Structure Table

| Page | Purpose | Access | Main Elements | Backend APIs | DB Tables |
|---|---|---|---|---|---|
| Landing/Home | Public intro to SweetBite | Public | Hero, products preview, login button | GET products preview | products, settings |
| Login | User authentication | Public | Email, password, remember me | POST auth/login | users |
| Register | Create account | Public/Admin controlled | Email, username, password | POST auth/register | users, roles |
| Dashboard | System overview | Admin/Staff | Stats, tables, charts | GET dashboard/stats | orders, customers, products |
| Products | Manage products | Admin/Staff | Product cards, filter, edit | CRUD products | products, categories |
| Customers | Manage customers | Admin/Staff | Table, add modal | CRUD customers | customers |
| Add Orders | Create order | Admin/Staff | Order form, summary | POST orders | orders, order_items |
| Orders List | View orders | Admin/Staff | Table, filters | GET orders | orders, customers |
| Sales | Sales analytics | Admin/Staff | Revenue, chart, top products | GET reports/sales | orders, payments |
| Reports | Export reports | Admin mostly | Date filters, export buttons | GET reports | orders, products |
| About | Company info | Public/Admin | Story, values | GET settings/about | settings |
| Contact/Team | Team contacts | Public/Admin | Team cards | GET team | team_members |
| Settings | Profile/password | Logged-in users | Profile form | PUT profile/password | users |
| Users Management | Manage staff/admins | Admin only | User table, roles | CRUD users | users, roles |

---

# 6. Frontend and Backend Connection

The frontend uses JavaScript to send requests to the backend.

## Request flow

1. User fills a form or clicks a button.
2. JavaScript collects input values.
3. JavaScript sends data using Fetch API or Axios.
4. Express receives the request.
5. Backend validates the data.
6. Backend uses MySQL prepared queries.
7. MySQL saves or returns data.
8. Backend sends JSON response.
9. Frontend updates the page dynamically.

Example frontend request idea:

```js
fetch("http://localhost:5000/api/products")
```

Example backend response:

```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "name": "Candy",
      "price": 0.5,
      "stock_quantity": 20
    }
  ]
}
```

---

# 7. Authentication Flow

## Recommended login method

Use JWT authentication.

### Login flow

1. User enters email and password.
2. Backend checks email.
3. Backend compares password using bcrypt.
4. Backend creates JWT token.
5. Frontend saves token in localStorage or secure cookie.
6. Every protected request sends the token.
7. Backend middleware checks token.
8. If token is valid, user can access the page.
9. If token is missing or expired, user is redirected to login.

## Protected pages

These pages require login:

- Dashboard
- Products
- Customers
- Orders
- Add Orders
- Sales
- Reports
- Settings
- Users Management

## Public pages

These pages can be public:

- Landing/Home
- Login
- Register
- About
- Contact

---

# 8. Professional Folder Structure

## Main project structure

```text
sweetbite-system/
│
├── frontend/
│   ├── pages/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── components/
│   └── index.html
│
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── backup/
│
└── README.md
```

## Frontend folder structure

```text
frontend/
│
├── index.html
│
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── products.html
│   ├── product-form.html
│   ├── customers.html
│   ├── orders.html
│   ├── add-order.html
│   ├── sales.html
│   ├── reports.html
│   ├── about.html
│   ├── contact.html
│   ├── settings.html
│   └── users.html
│
├── css/
│   ├── main.css
│   ├── variables.css
│   ├── layout.css
│   ├── sidebar.css
│   ├── forms.css
│   ├── tables.css
│   ├── cards.css
│   ├── buttons.css
│   ├── dashboard.css
│   └── responsive.css
│
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── validation.js
│   ├── dashboard.js
│   ├── products.js
│   ├── customers.js
│   ├── orders.js
│   ├── sales.js
│   ├── reports.js
│   ├── settings.js
│   └── main.js
│
├── components/
│   ├── sidebar.js
│   ├── topbar.js
│   ├── modal.js
│   ├── productCard.js
│   ├── customerTable.js
│   ├── orderTable.js
│   └── toast.js
│
└── assets/
    ├── images/
    │   ├── logo.png
    │   ├── avatars/
    │   ├── products/
    │   └── backgrounds/
    │
    └── icons/
```

## Important frontend files

| File | Purpose |
|---|---|
| `api.js` | Stores backend base URL and reusable API request functions |
| `auth.js` | Handles login, logout, token checking, protected pages |
| `validation.js` | Stores frontend validation rules |
| `sidebar.js` | Reusable sidebar component |
| `topbar.js` | Reusable top search/profile bar |
| `products.js` | Loads products and handles product actions |
| `customers.js` | Loads customers and handles customer actions |
| `orders.js` | Handles order creation and order listing |
| `settings.js` | Handles profile and password update |

## Backend folder structure

```text
backend/
│
├── server.js
├── package.json
├── .env
│
├── src/
│   ├── app.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── products.routes.js
│   │   ├── categories.routes.js
│   │   ├── customers.routes.js
│   │   ├── orders.routes.js
│   │   ├── sales.routes.js
│   │   ├── reports.routes.js
│   │   ├── settings.routes.js
│   │   └── team.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── products.controller.js
│   │   ├── customers.controller.js
│   │   ├── orders.controller.js
│   │   ├── sales.controller.js
│   │   ├── reports.controller.js
│   │   ├── settings.controller.js
│   │   └── team.controller.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── customer.model.js
│   │   ├── order.model.js
│   │   ├── sale.model.js
│   │   └── settings.model.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── product.validator.js
│   │   ├── customer.validator.js
│   │   ├── order.validator.js
│   │   └── user.validator.js
│   │
│   ├── utils/
│   │   ├── password.js
│   │   ├── token.js
│   │   ├── response.js
│   │   └── invoice.js
│   │
│   └── uploads/
│       ├── products/
│       └── profiles/
│
└── logs/
```

## Database folder structure

```text
database/
│
├── schema.sql
├── seed.sql
├── procedures.sql
├── views.sql
│
└── backup/
    ├── sweetbite_backup_2026_01_01.sql
    └── README.md
```

---

# 9. MySQL Database Structure

## 9.1 `roles` table

Purpose: Stores user roles.

| Column | Type | Rule |
|---|---|---|
| role_id | INT | Primary key, auto increment |
| role_name | VARCHAR(50) | Unique, not null |
| description | VARCHAR(255) | Optional |

Relationship:

One role has many users.

---

## 9.2 `users` table

Purpose: Stores admin and staff accounts.

| Column | Type | Rule |
|---|---|---|
| user_id | INT | Primary key, auto increment |
| role_id | INT | Foreign key to roles |
| full_name | VARCHAR(100) | Not null |
| username | VARCHAR(50) | Unique |
| email | VARCHAR(100) | Unique, not null |
| password_hash | VARCHAR(255) | Not null |
| profile_image | VARCHAR(255) | Optional |
| status | ENUM('active','inactive','blocked') | Default inactive |
| created_at | DATETIME | Default current timestamp |
| updated_at | DATETIME | Optional |

Relationship:

One user can create many products and orders.

---

## 9.3 `categories` table

Purpose: Stores product categories.

| Column | Type | Rule |
|---|---|---|
| category_id | INT | Primary key |
| category_name | VARCHAR(100) | Unique, not null |
| description | TEXT | Optional |
| status | ENUM('active','inactive') | Default active |

Examples:

- Candy
- Gum
- Chocolate
- Lollipop

---

## 9.4 `products` table

Purpose: Stores sweet snack products.

| Column | Type | Rule |
|---|---|---|
| product_id | INT | Primary key, auto increment |
| category_id | INT | Foreign key |
| product_name | VARCHAR(150) | Not null |
| sku | VARCHAR(50) | Unique |
| description | TEXT | Optional |
| price | DECIMAL(10,2) | Not null |
| cost_price | DECIMAL(10,2) | Optional |
| stock_quantity | INT | Default 0 |
| low_stock_limit | INT | Default 5 |
| product_image | VARCHAR(255) | Optional |
| status | ENUM('available','out_of_stock','inactive') | Default available |
| created_by | INT | Foreign key to users |
| created_at | DATETIME | Default current timestamp |

Image rule:

Store image files in backend `uploads/products/` and store only the image path in MySQL.

---

## 9.5 `customers` table

Purpose: Stores customer information.

| Column | Type | Rule |
|---|---|---|
| customer_id | INT | Primary key |
| full_name | VARCHAR(100) | Not null |
| phone | VARCHAR(20) | Unique, not null |
| email | VARCHAR(100) | Unique, optional |
| location | VARCHAR(150) | Not null |
| address | TEXT | Optional |
| status | ENUM('active','inactive') | Default active |
| created_at | DATETIME | Default current timestamp |

Relationship:

One customer can have many orders.

---

## 9.6 `payment_methods` table

Purpose: Stores payment methods.

| Column | Type | Rule |
|---|---|---|
| payment_method_id | INT | Primary key |
| method_name | VARCHAR(50) | Unique |
| status | ENUM('active','inactive') | Default active |

Examples:

- EVC
- eDahab
- Cash
- Bank Transfer

---

## 9.7 `orders` table

Purpose: Stores order header information.

| Column | Type | Rule |
|---|---|---|
| order_id | INT | Primary key |
| order_number | VARCHAR(50) | Unique |
| customer_id | INT | Foreign key |
| user_id | INT | Foreign key, user who created order |
| order_date | DATE | Not null |
| subtotal | DECIMAL(10,2) | Not null |
| discount | DECIMAL(10,2) | Default 0 |
| total_amount | DECIMAL(10,2) | Not null |
| payment_method_id | INT | Foreign key |
| payment_status | ENUM('unpaid','paid','partial') | Default unpaid |
| order_status | ENUM('processing','completed','rejected','on_hold','in_transit','delivered') | Default processing |
| notes | TEXT | Optional |
| created_at | DATETIME | Default current timestamp |

Relationships:

- One customer has many orders.
- One order has many order items.
- One user creates many orders.

---

## 9.8 `order_items` table

Purpose: Stores products inside each order.

| Column | Type | Rule |
|---|---|---|
| order_item_id | INT | Primary key |
| order_id | INT | Foreign key |
| product_id | INT | Foreign key |
| quantity | INT | Not null |
| unit_price | DECIMAL(10,2) | Not null |
| total_price | DECIMAL(10,2) | Not null |

Relationship:

This table connects orders and products.

One order can have many products, and one product can appear in many orders.

---

## 9.9 `payments` table

Purpose: Stores payment records.

| Column | Type | Rule |
|---|---|---|
| payment_id | INT | Primary key |
| order_id | INT | Foreign key |
| payment_method_id | INT | Foreign key |
| amount_paid | DECIMAL(10,2) | Not null |
| payment_date | DATETIME | Default current timestamp |
| transaction_reference | VARCHAR(100) | Optional |
| status | ENUM('success','failed','pending') | Default success |

---

## 9.10 `stock_movements` table

Purpose: Tracks product stock changes.

| Column | Type | Rule |
|---|---|---|
| movement_id | INT | Primary key |
| product_id | INT | Foreign key |
| movement_type | ENUM('in','out','adjustment') | Not null |
| quantity | INT | Not null |
| reason | VARCHAR(255) | Optional |
| reference_id | INT | Optional order ID |
| created_by | INT | Foreign key to users |
| created_at | DATETIME | Default current timestamp |

This table helps track why product stock increased or decreased.

---

## 9.11 `settings` table

Purpose: Stores system settings.

| Column | Type | Rule |
|---|---|---|
| setting_id | INT | Primary key |
| setting_key | VARCHAR(100) | Unique |
| setting_value | TEXT | Not null |
| setting_group | VARCHAR(50) | Optional |

Examples:

- company_name
- company_email
- company_phone
- currency
- tax_rate
- invoice_prefix
- low_stock_alert_value

---

## 9.12 `team_members` table

Purpose: Stores contact/team page members.

| Column | Type | Rule |
|---|---|---|
| member_id | INT | Primary key |
| full_name | VARCHAR(100) | Not null |
| email | VARCHAR(100) | Not null |
| image | VARCHAR(255) | Optional |
| role_title | VARCHAR(100) | Optional |
| status | ENUM('active','inactive') | Default active |

---

## 9.13 `activity_logs` table

Purpose: Tracks important user actions.

| Column | Type | Rule |
|---|---|---|
| log_id | INT | Primary key |
| user_id | INT | Foreign key |
| action | VARCHAR(100) | Not null |
| table_name | VARCHAR(100) | Optional |
| record_id | INT | Optional |
| description | TEXT | Optional |
| created_at | DATETIME | Default current timestamp |

---

# 10. Database Relationships

## One-to-many relationships

| Relationship | Meaning |
|---|---|
| roles to users | One role can belong to many users |
| customers to orders | One customer can make many orders |
| users to orders | One admin/staff can create many orders |
| categories to products | One category has many products |
| orders to order_items | One order has many items |
| products to stock_movements | One product has many stock records |

## Many-to-many relationship

Orders and products are many-to-many.

One order can contain many products.

One product can appear in many orders.

This is solved using the `order_items` table.

---

# 11. API Route Structure

## 11.1 Authentication routes

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/auth/register` | POST | Create account | Public/Admin controlled |
| `/api/auth/login` | POST | Login user | Public |
| `/api/auth/logout` | POST | Logout user | Logged-in |
| `/api/auth/profile` | GET | Get current user | Logged-in |
| `/api/auth/change-password` | PUT | Change password | Logged-in |

Example login data sent from frontend:

```json
{
  "email": "admin@sweetbite.com",
  "password": "Password123"
}
```

Example backend response:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Kawther",
    "role": "Admin"
  }
}
```

Validation:

- Email required
- Password required
- User must be active

---

## 11.2 Users routes

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/users` | GET | List users | Admin |
| `/api/users` | POST | Add user | Admin |
| `/api/users/:id` | GET | Get one user | Admin |
| `/api/users/:id` | PUT | Update user | Admin |
| `/api/users/:id` | DELETE | Delete/deactivate user | Admin |

---

## 11.3 Products routes

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/products` | GET | List products | Admin/Staff |
| `/api/products/:id` | GET | Get product details | Admin/Staff |
| `/api/products` | POST | Add product | Admin |
| `/api/products/:id` | PUT | Update product | Admin |
| `/api/products/:id` | DELETE | Delete product | Admin |

Query example:

```text
GET /api/products?search=candy&category=1&status=available&page=1
```

Validation:

- Product name required
- Price positive
- Stock not negative
- Image valid

---

## 11.4 Customers routes

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/customers` | GET | List customers | Admin/Staff |
| `/api/customers/search` | GET | Search customers | Admin/Staff |
| `/api/customers/:id` | GET | Get one customer | Admin/Staff |
| `/api/customers` | POST | Add customer | Admin/Staff |
| `/api/customers/:id` | PUT | Update customer | Admin/Staff |
| `/api/customers/:id` | DELETE | Delete customer | Admin |

Validation:

- Name required
- Phone unique
- Email valid

---

## 11.5 Orders routes

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/orders` | GET | List orders | Admin/Staff |
| `/api/orders/:id` | GET | View one order | Admin/Staff |
| `/api/orders` | POST | Create order | Admin/Staff |
| `/api/orders/:id` | PUT | Update order | Admin/Staff |
| `/api/orders/:id/status` | PATCH | Update status | Admin/Staff |
| `/api/orders/:id` | DELETE | Delete/cancel order | Admin |

Example order data from frontend:

```json
{
  "customer_id": 1,
  "order_date": "2026-02-24",
  "payment_method_id": 1,
  "discount": 0,
  "status": "processing",
  "notes": "Deliver today",
  "items": [
    {
      "product_id": 2,
      "quantity": 4
    }
  ]
}
```

Important:

Backend should calculate the total price itself. Do not trust the total price sent from frontend.

---

## 11.6 Sales routes

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/sales/summary` | GET | Sales cards | Admin/Staff |
| `/api/sales/chart` | GET | Chart data | Admin/Staff |
| `/api/sales/top-products` | GET | Top products | Admin/Staff |
| `/api/sales/recent` | GET | Recent sales table | Admin/Staff |

---

## 11.7 Reports routes

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/reports/sales` | GET | Sales report | Admin |
| `/api/reports/products` | GET | Product report | Admin |
| `/api/reports/customers` | GET | Customer report | Admin |
| `/api/reports/stock` | GET | Stock report | Admin |
| `/api/reports/export` | GET | Export CSV/PDF | Admin |

---

## 11.8 Settings routes

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/settings` | GET | Get settings | Admin |
| `/api/settings` | PUT | Update settings | Admin |
| `/api/settings/company` | GET | Company info | Public/Admin |
| `/api/settings/company` | PUT | Update company info | Admin |

---

## 11.9 Team routes

| Route | Method | Purpose | Access |
|---|---|---|---|
| `/api/team` | GET | List team members | Public/Admin |
| `/api/team` | POST | Add team member | Admin |
| `/api/team/:id` | PUT | Update team member | Admin |
| `/api/team/:id` | DELETE | Delete team member | Admin |

---

# 12. Validation Plan

Validation must happen in both frontend and backend.

Frontend validation gives fast feedback.

Backend validation protects the system, database, and security.

Never trust frontend validation only.

## Frontend validation

Use `validation.js`.

| Area | Rule |
|---|---|
| Login | Email and password required |
| Register | Email valid, password strong |
| Product | Name, category, price, quantity required |
| Customer | Name, phone, location required |
| Order | Customer, item, quantity, payment required |
| Settings | Email valid, password confirmed |
| Image | File type and size checked before upload |

## Backend validation

Use `express-validator` or `joi`.

Backend must validate:

- Required fields
- Data types
- Unique values
- Allowed statuses
- File upload safety
- Role access

Allowed order statuses:

```text
processing
completed
rejected
on_hold
in_transit
delivered
```

---

# 13. Security Requirements

| Security Area | Requirement |
|---|---|
| Passwords | Hash using bcrypt |
| Authentication | Use JWT or secure session |
| Authorization | Role-based access control |
| SQL injection | Use mysql2 prepared statements |
| Environment variables | Store secrets in `.env` |
| CORS | Allow only your frontend domain |
| Headers | Use Helmet |
| Login protection | Use rate limiting |
| Uploads | Validate file type and file size |
| Errors | Do not expose database errors to users |
| Backup | Backup MySQL regularly |
| Database user | Do not use root user in production |
| Tokens | Use expiration time |
| HTTPS | Use SSL certificate in production |

## Recommended roles

| Role | Permissions |
|---|---|
| Admin | Full access |
| Staff | Manage customers/orders, view products/sales |
| Viewer | View only reports/dashboard, optional |

Admin should manage users, settings, deleting records, and reports.

Staff should create orders and customers but should not delete important system data.

---

# 14. Required Packages

## Backend required packages

Install inside the backend folder:

```bash
npm install express mysql2 dotenv bcrypt jsonwebtoken cors helmet express-rate-limit express-validator multer
```

Development package:

```bash
npm install --save-dev nodemon
```

| Package | Purpose |
|---|---|
| express | Create backend server and API routes |
| mysql2 | Connect Node.js to MySQL |
| dotenv | Use `.env` variables |
| bcrypt | Hash passwords |
| jsonwebtoken | Login token authentication |
| cors | Allow frontend to call backend |
| helmet | Add security headers |
| express-rate-limit | Protect login from repeated attacks |
| express-validator | Validate request data |
| multer | Upload product/profile images |
| nodemon | Auto restart server during development |

## Optional frontend libraries

| Library | Purpose |
|---|---|
| SweetAlert2 | Beautiful alerts and confirmation messages |
| Chart.js | Dashboard and sales charts |
| DataTables | Search, filter, pagination tables |
| Font Awesome | Icons |
| Bootstrap Icons | Simple icon set |
| Axios | Alternative to Fetch API |

Recommended optional libraries:

- Chart.js
- SweetAlert2
- Bootstrap Icons or Font Awesome

## Helpful VS Code extensions

| Extension | Purpose |
|---|---|
| Live Server | Preview frontend pages |
| Prettier | Format code |
| ESLint | Detect JavaScript problems |
| MySQL | Manage database from VS Code |
| Thunder Client | Test APIs like Postman |
| DotENV | Better `.env` file highlighting |
| Auto Rename Tag | Helps with HTML |
| Path Intellisense | Helps with file paths |

---

# 15. Real-World Dynamic Features

## Authentication

- Login
- Logout
- Register
- Remember me
- Password change
- Protected pages

## Dashboard

- Live total customers
- Live total orders
- Live sales total
- Pending orders count
- Recent deals
- Revenue chart

## Products

- Add product
- Edit product
- Delete product
- View product
- Search product
- Filter products
- Upload image
- Track stock
- Low stock alerts

## Customers

- Add customer
- Edit customer
- Delete customer
- Search customer
- Filter customers
- View customer orders

## Orders

- Create order
- Select customer
- Select product
- Calculate total
- Save order
- Update status
- Decrease stock

## Sales

- Revenue cards
- Top products
- Recent sales
- Monthly chart

## Reports

- Sales report
- Product report
- Customer report
- Stock report
- Export to CSV/PDF

## Settings

- Profile update
- Password change
- Company info
- Invoice settings
- Currency settings

## Responsive design

The current design is desktop-first.

For tablet and mobile:

- Sidebar should become collapsible.
- Tables should become horizontally scrollable.
- Cards should stack vertically.
- Forms should use one column.

---

# 16. Development Starting Plan

## Step 1: Prepare project folders

Create:

- `frontend`
- `backend`
- `database`

This keeps the project organized.

## Step 2: Create database design

Create these tables first:

- roles
- users
- categories
- products
- customers
- orders
- order_items
- payments
- settings

Backend APIs need this structure before saving data.

## Step 3: Create backend server

Create Express server, database connection, and test route.

Example test route:

```text
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "SweetBite API is running"
}
```

## Step 4: Build authentication first

Create:

- Register
- Login
- Profile
- Logout

Authentication comes first because dashboard pages are protected.

## Step 5: Create frontend login/register pages

Connect them to backend using Fetch API.

After successful login, redirect to dashboard.

## Step 6: Create shared layout

Build reusable:

- Sidebar
- Topbar
- Page container
- Buttons
- Cards
- Forms

All dashboard pages use the same layout.

## Step 7: Build Dashboard page

Connect dashboard statistics to backend.

Use Chart.js for revenue chart.

## Step 8: Build Products module

Create:

- Product list
- Add product
- Edit product
- Delete product
- Image upload

Products are needed before orders.

## Step 9: Build Customers module

Create customer table and add/edit modal.

Customers are needed before orders.

## Step 10: Build Add Orders page

Connect customers and products.

Calculate totals.

Save order.

Update stock.

## Step 11: Build Orders List page

Show orders with filters and statuses.

Add status update.

## Step 12: Build Sales and Reports

Create charts, summary cards, recent sales, and exports.

## Step 13: Build Settings, About, Contact

Settings should update user profile and company info.

About and contact can be partly dynamic from settings/team tables.

## Step 14: Add validation and security

Add:

- Frontend validation
- Backend validation
- Role checks
- Rate limit
- Helmet
- CORS

## Step 15: Test everything

Test:

- Login
- Products
- Customers
- Orders
- Stock update
- Reports
- Roles
- Validation

---

# 17. Best Page Creation Order

Create pages in this order:

1. Login page
2. Register page
3. Dashboard layout
4. Products page
5. Customers page
6. Add Orders page
7. Orders List page
8. Sales page
9. Reports page
10. Settings page
11. About page
12. Contact page

Reason:

Products and customers must exist before orders can work.

Orders must exist before sales and reports can show real data.

---

# 18. Deployment and Real-Life Setup

## Local development setup

You need:

- Node.js
- MySQL Server
- VS Code
- Browser
- Postman or Thunder Client

Frontend can run with Live Server.

Backend can run on:

```text
http://localhost:5000
```

MySQL runs locally.

## Environment variables

Backend `.env` file should contain:

```text
PORT=5000
DB_HOST=localhost
DB_USER=sweetbite_user
DB_PASSWORD=your_password
DB_NAME=sweetbite_db
JWT_SECRET=your_long_secret_key
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5500
```

Never upload `.env` to GitHub.

## Production setup

| Part | Example |
|---|---|
| Backend hosting | Render, Railway, VPS, DigitalOcean |
| Frontend hosting | Netlify, Vercel, shared hosting, VPS |
| Database | MySQL on hosting server or cloud database |
| Domain | sweetbite.com or similar |
| SSL | HTTPS certificate |
| Backup | Daily or weekly MySQL backup |
| Admin | Create first admin account manually or with seed file |

## Before publishing

Test these carefully:

- Login works
- Protected pages redirect correctly
- Products save correctly
- Image upload works
- Customer phone duplicate validation works
- Order total is correct
- Stock decreases after order
- Sales report is accurate
- Logout clears token
- Admin/staff permissions work

---

# 19. Final System Summary

The final architecture should be:

```text
HTML/CSS/JavaScript Frontend
        ↓ Fetch API / Axios
Node.js + Express Backend API
        ↓ mysql2 prepared queries
MySQL Database
```

The main dynamic data comes from:

- Users
- Roles
- Products
- Customers
- Orders
- Order items
- Payments
- Settings
- Team members

The most important modules are:

- Authentication
- Dashboard
- Products
- Customers
- Orders
- Sales
- Reports
- Settings

Build the system step by step:

1. Database
2. Authentication
3. Products
4. Customers
5. Orders
6. Sales and reports
7. Settings and final pages

This will keep the project clean, flexible, secure, and ready for real-world use.
