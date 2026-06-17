-- SweetBite sample data. Run after schema.sql.
USE sweetbite_db;

INSERT INTO roles (role_id, role_name, description) VALUES
  (1, 'Admin', 'Full system access'),
  (2, 'Staff', 'Daily product, customer and order operations')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO categories (category_id, category_name, description) VALUES
  (1, 'Candy', 'Wrapped candy and bubble sweets'),
  (2, 'Gum', 'Chewing and bubble gum'),
  (3, 'Chocolate', 'Chocolate bars and chocolate sweets'),
  (4, 'Lollipop', 'Lollipops and stick sweets')
ON DUPLICATE KEY UPDATE description = VALUES(description), status = 'active';

INSERT INTO payment_methods (payment_method_id, method_name) VALUES
  (1, 'EVC'), (2, 'eDahab'), (3, 'Cash'), (4, 'Bank Transfer')
ON DUPLICATE KEY UPDATE status = 'active';

INSERT INTO products
(product_id, category_id, product_name, sku, description, price, stock_quantity, low_stock_limit, image_path, status)
VALUES
  (1, 1, 'Candy', 'CAN-001', 'Colorful fruit-flavoured bubble candy.', 0.50, 84, 10, '/uploads/products/candy.png', 'available'),
  (2, 1, 'Candy', 'CAN-002', 'Sweet and chewy candy for every occasion.', 0.50, 62, 10, '/uploads/products/candy.png', 'available'),
  (3, 1, 'Candy', 'CAN-003', 'Classic bubble candy in bright wrappers.', 0.50, 50, 10, '/uploads/products/candy.png', 'available'),
  (4, 1, 'Candy', 'CAN-004', 'Popular candy pack.', 0.50, 31, 10, '/uploads/products/candy.png', 'available'),
  (5, 2, 'Gum', 'GUM-001', 'Long-lasting classic bubble gum.', 0.60, 50, 10, '/uploads/products/gum.png', 'available'),
  (6, 1, 'Candy', 'CAN-005', 'Mixed candy pack.', 0.50, 22, 10, '/uploads/products/candy.png', 'available'),
  (7, 3, 'Chocolate', 'CHO-001', 'Creamy milk chocolate bar.', 2.00, 40, 8, '/uploads/products/chocolate.png', 'available'),
  (8, 4, 'Lollipop', 'LOL-001', 'Colorful lollipops.', 0.75, 28, 8, '/uploads/products/lollipop.png', 'available')
ON DUPLICATE KEY UPDATE
  product_name = VALUES(product_name), category_id = VALUES(category_id), description = VALUES(description),
  price = VALUES(price), stock_quantity = VALUES(stock_quantity), image_path = VALUES(image_path), status = VALUES(status);

INSERT INTO customers
(customer_id, full_name, phone, email, location, address)
VALUES
  (1, 'Amira Salman', '0610000001', 'amira@email.com', 'Wabary', '089 Kutch Green Apt. 448'),
  (2, 'Maram Majed', '0610000002', 'maram@email.com', 'Wabary', '979 Immanuel Ferry Suite 526'),
  (3, 'Sumaya Axmed', '0610000003', 'sumaya@email.com', 'Hodan', '8587 Frida Ports'),
  (4, 'Muna Noor', '0610000004', 'muna@email.com', 'Wabary', '089 Kutch Green Apt. 448'),
  (5, 'Kawther Jamec', '0610000005', 'kawtherj@email.com', 'Hodan', '979 Immanuel Ferry Suite 526'),
  (6, 'Ismacil Abdirazak', '0610000006', 'ismacil@email.com', 'Wadajir', '8587 Frida Ports'),
  (7, 'Asiya Ibrahim', '0610000007', 'asiya@email.com', 'Waberi', '768 Destiny Lake Suite 600'),
  (8, 'Malyun Abdullahi', '0610000008', 'malyun@email.com', 'Hodan', '042 Mylene Throughway'),
  (9, 'Maryama Ali', '0610000009', 'maryama@email.com', 'Karaan', '543 Weimann Mountain')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name), email = VALUES(email), location = VALUES(location), address = VALUES(address), status = 'active';

INSERT INTO orders
(order_id, order_number, customer_id, order_date, subtotal, discount, total_amount, payment_method_id, payment_status, order_status, notes)
VALUES
  (1, 'SB-00001', 4, '2026-09-04', 5.00, 0.00, 5.00, 1, 'paid', 'completed', NULL),
  (2, 'SB-00002', 5, '2026-05-28', 25.80, 0.00, 25.80, 2, 'unpaid', 'processing', NULL),
  (3, 'SB-00003', 6, '2026-11-23', 11.25, 0.25, 11.00, 1, 'unpaid', 'rejected', NULL),
  (4, 'SB-00004', 7, '2026-02-05', 6.00, 1.00, 5.00, 1, 'paid', 'completed', NULL),
  (5, 'SB-00005', 8, '2026-07-29', 4.20, 0.20, 4.00, 1, 'unpaid', 'processing', NULL),
  (6, 'SB-00006', 9, '2026-08-15', 44.00, 0.00, 44.00, 1, 'paid', 'completed', NULL),
  (7, 'SB-00007', 1, '2026-12-21', 6.00, 0.00, 6.00, 3, 'unpaid', 'processing', NULL),
  (8, 'SB-00008', 2, '2026-04-30', 8.00, 0.00, 8.00, 1, 'unpaid', 'on_hold', NULL),
  (9, 'SB-00009', 3, '2026-01-09', 3.60, 0.00, 3.60, 2, 'unpaid', 'in_transit', NULL)
ON DUPLICATE KEY UPDATE
  customer_id = VALUES(customer_id), order_date = VALUES(order_date), subtotal = VALUES(subtotal),
  discount = VALUES(discount), total_amount = VALUES(total_amount), payment_status = VALUES(payment_status), order_status = VALUES(order_status);

INSERT INTO order_items
(order_item_id, order_id, product_id, quantity, unit_price, line_total)
VALUES
  (1, 1, 1, 10, 0.50, 5.00),
  (2, 2, 5, 43, 0.60, 25.80),
  (3, 3, 8, 15, 0.75, 11.25),
  (4, 4, 7, 3, 2.00, 6.00),
  (5, 5, 5, 7, 0.60, 4.20),
  (6, 6, 7, 22, 2.00, 44.00),
  (7, 7, 7, 3, 2.00, 6.00),
  (8, 8, 7, 4, 2.00, 8.00),
  (9, 9, 5, 6, 0.60, 3.60)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), unit_price = VALUES(unit_price), line_total = VALUES(line_total);

INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
  ('company_name', 'SweetBite', 'company'),
  ('company_email', 'Amina22@gmail.com', 'company'),
  ('phone', '0613647017', 'company'),
  ('founded', 'March 2026', 'company'),
  ('currency', 'USD', 'sales'),
  ('low_stock_limit', '5', 'stock')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_group = VALUES(setting_group);

INSERT INTO team_members
(member_id, full_name, email, image_path, role_title, display_order)
VALUES
  (1, 'Amina Noor Abdi', 'Amina22nr@gmail.com', '/uploads/team/amina.png', 'Team Member', 1),
  (2, 'Kawther Jamec', 'Amina22@gmail.com', '/uploads/team/kawther.png', 'Team Member', 2),
  (3, 'Malyun Abdullahi', 'Amina22@gmail.com', '/uploads/team/malyun.png', 'Team Member', 3),
  (4, 'Ismacil Abdirizak', 'Amina22@gmail.com', '/uploads/team/ismacil.png', 'Team Member', 4),
  (5, 'Abdigani Garad', 'Amina22@gmail.com', '/uploads/team/abdigani.png', 'Team Member', 5)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name), email = VALUES(email), image_path = VALUES(image_path),
  role_title = VALUES(role_title), display_order = VALUES(display_order), status = 'active';
