-- Create Users
INSERT INTO USER (id, username, role) VALUES (1, 'user1', 'guest');
INSERT INTO USER (id, username, role) VALUES (2, 'user2', 'orga');
INSERT INTO USER (id, username, role) VALUES (3, 'user3', 'guest');
INSERT INTO USER (id, username, role) VALUES (4, 'user4', 'orga');
INSERT INTO USER (id, username, role) VALUES (5, 'user5', 'guest');
INSERT INTO USER (id, username, role) VALUES (6, 'user6', 'orga');
INSERT INTO USER (id, username, role) VALUES (7, 'user7', 'guest');
INSERT INTO USER (id, username, role) VALUES (8, 'user8', 'orga');
INSERT INTO USER (id, username, role) VALUES (9, 'user9', 'guest');
INSERT INTO USER (id, username, role) VALUES (10, 'user10', 'guest');

-- -- Create Products
INSERT INTO PRODUCTS (id, name, price, category, stock, consumption) VALUES (1, 'Bratwurst', 10.99, "Food", 10, 0);
INSERT INTO PRODUCTS (id, name, price, category, stock, consumption) VALUES (2, 'Rote', 25.99, "Food", 25, 0);
INSERT INTO PRODUCTS (id, name, price, category, stock, consumption) VALUES (3, 'Krakauer', 30.99, "Food", 21, 0);
INSERT INTO PRODUCTS (id, name, price, category, stock, consumption) VALUES (4, 'Cola', 15.99, "Drink", 230, 0);
INSERT INTO PRODUCTS (id, name, price, category, stock, consumption) VALUES (5, 'Wasser', 20.99, "Drink", 240, 0);
INSERT INTO PRODUCTS (id, name, price, category, stock, consumption) VALUES (6, 'Sprite', 35.99, "Drink", 200, 0);

-- -- Create Extras
INSERT INTO EXTRAS (id, name, price, category) VALUES (1, 'Ketchup', 5.99, "Food");
INSERT INTO EXTRAS (id, name, price, category) VALUES (2, 'Mayo', 10.99, "Food");
INSERT INTO EXTRAS (id, name, price, category) VALUES (3, 'Senf', 15.99, "Food");
INSERT INTO EXTRAS (id, name, price, category) VALUES (4, 'Curry', 20.99, "Food");
INSERT INTO EXTRAS (id, name, price, category) VALUES (5, 'Eiswuerfel', 25.99, "Drink");

-- -- Create Orders
INSERT INTO REQUESTS (id, userId, sum, order_paid, order_delivered, order_completed) VALUES (1, 1, 0, false, false, false);
INSERT INTO REQUESTS (id, userId, sum, order_paid, order_delivered, order_completed) VALUES (2, 1, 0, true, true, true);
INSERT INTO REQUESTS (id, userId, sum, order_paid, order_delivered, order_completed) VALUES (3, 2, 0, false, false, false);
INSERT INTO REQUESTS (id, userId, sum, order_paid, order_delivered, order_completed) VALUES (4, 2, 0, true, true, true);