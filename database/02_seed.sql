-- Step 2 — Foundational Seed Data for EzQurbani
-- This file populates the database with non-sensitive baseline data.
-- ALL Users, Admins, and Bookings must be created manually via the API.

-- 1. Cities
INSERT INTO CITY (name) VALUES 
('Karachi'), 
('Lahore'), 
('Islamabad');

-- 2. Animal Categories
INSERT INTO ANIMAL_CATEGORY (name) VALUES 
('Bakra'), 
('Cow'), 
('Dumba'), 
('Camel');

-- 3. Vendors
INSERT INTO VENDOR (name, contact, city_id) VALUES 
('Ali Cattle Farm', '0300-1112223', 1),
('Punjab Livestock', '0321-4445556', 2),
('Northern Grazers', '0311-7778889', 3);

-- 4. Animals (Initial Inventory)
INSERT INTO ANIMAL (category_id, vendor_id, tag_no, weight, price, status) VALUES 
(1, 1, 'TAG-B01', 45.0, 65000.0, 'available'),
(1, 1, 'TAG-B02', 50.5, 75000.0, 'available'),
(2, 2, 'TAG-C01', 280.0, 210000.0, 'available'),
(2, 2, 'TAG-C02', 310.0, 245000.0, 'available'),
(3, 3, 'TAG-D01', 35.0, 55000.0, 'available'),
(4, 1, 'TAG-CM1', 450.0, 450000.0, 'available');

-- 5. Animal Health Records
INSERT INTO ANIMAL_HEALTH_RECORD (animal_id, health_status) VALUES 
(1, 'Healthy - Vaccinated'),
(2, 'Healthy - All Clear'),
(3, 'Fit for Qurbani'),
(4, 'Fit for Qurbani'),
(5, 'Healthy'),
(6, 'Excellent Condition');

-- 6. Hissas (For Cows)
-- Cow 1 (animal_id 3)
INSERT INTO HISSA (animal_id, hissa_no, price, status) VALUES 
(3, 1, 30000.0, 'available'), (3, 2, 30000.0, 'available'), (3, 3, 30000.0, 'available'),
(3, 4, 30000.0, 'available'), (3, 5, 30000.0, 'available'), (3, 6, 30000.0, 'available'),
(3, 7, 30000.0, 'available');

-- 7. Payment Methods
INSERT INTO PAYMENT_METHOD (name) VALUES 
('Cash'), 
('Easypaisa'), 
('Bank Transfer'), 
('Credit Card');

-- 8. Discounts
INSERT INTO DISCOUNT (code, percentage, expiry_date) VALUES 
('EID2026', 10.0, '2026-06-30'),
('WELCOME5', 5.0, '2026-12-31');

-- 9. Slaughterhouse and Butchers
INSERT INTO SLAUGHTER_HOUSE (name, city_id, location) VALUES 
('Central Abattoir Karachi', 1, 'Korangi Industrial Area'),
('Lahore Meat Processing', 2, 'Shahdara');

INSERT INTO BUTCHER (name, contact, house_id) VALUES 
('Haji Rafiq', '0344-9998887', 1),
('Sajid Qasai', '0322-7776665', 2);

-- 10. Delivery Agents
INSERT INTO DELIVERY_AGENT (name, contact) VALUES 
('Bykea Delivery', '021-111222333'),
('Foodpanda Pro', '021-444555666');
