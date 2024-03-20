-- Create Users
INSERT INTO USER (id, username, role) VALUES (1, 'user1', 'guest');
INSERT INTO USER (id, username, role) VALUES (2, 'user2', 'orga');

-- -- Create Products
INSERT INTO PRODUCT (id, name, price, category) VALUES (1, 'Bratwurst', 10.99, "Food");
INSERT INTO PRODUCT (id, name, price, category) VALUES (2, 'Cola', 15.99, "Drink");
INSERT INTO PRODUCT (id, name, price, category) VALUES (3, 'Wasser', 20.99, "Drink");
INSERT INTO PRODUCT (id, name, price, category) VALUES (4, 'Rote', 25.99, "Food");
INSERT INTO PRODUCT (id, name, price, category) VALUES (5, 'Krakauer', 30.99, "Food");
INSERT INTO PRODUCT (id, name, price, category) VALUES (6, 'Sprite', 35.99, "Drink");

-- -- Create Extras
INSERT INTO EXTRAS (id, name, price, category) VALUES (1, 'Ketchup', 5.99, "Food");
INSERT INTO EXTRAS (id, name, price, category) VALUES (2, 'Mayo', 10.99, "Food");
INSERT INTO EXTRAS (id, name, price, category) VALUES (3, 'Senf', 15.99, "Food");
INSERT INTO EXTRAS (id, name, price, category) VALUES (4, 'Curry', 20.99, "Food");
INSERT INTO EXTRAS (id, name, price, category) VALUES (5, 'Eiswuerfel', 25.99, "Drink");

-- -- Create Orders
INSERT INTO REQUESTS (id, userId, sum) VALUES (1, 1, 0);