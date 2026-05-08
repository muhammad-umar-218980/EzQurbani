-- Step 1 — Database Schema for EzQurbani
-- This file contains 23 table definitions in FK-safe order.

-- 1. CITY
CREATE TABLE CITY (
    city_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. ANIMAL_CATEGORY
CREATE TABLE ANIMAL_CATEGORY (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. VENDOR
CREATE TABLE VENDOR (
    vendor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    city_id INT REFERENCES CITY(city_id)
);

-- 4. PERSON (Generalization for Users and Admins)
CREATE TABLE PERSON (
    person_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Bcrypt hash
    phone VARCHAR(20) NOT NULL
);

-- 5. USER (Specialization of Person)
CREATE TABLE "USER" (
    user_id INT PRIMARY KEY REFERENCES PERSON(person_id) ON DELETE CASCADE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ADMIN (Specialization of Person)
CREATE TABLE ADMIN (
    admin_id INT PRIMARY KEY REFERENCES PERSON(person_id) ON DELETE CASCADE,
    admin_level VARCHAR(20) DEFAULT 'manager'
);

-- 7. ADDRESS
CREATE TABLE ADDRESS (
    address_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "USER"(user_id) ON DELETE CASCADE,
    city_id INT REFERENCES CITY(city_id),
    address_line TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE
);

-- 8. ANIMAL
CREATE TABLE ANIMAL (
    animal_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES ANIMAL_CATEGORY(category_id),
    vendor_id INT REFERENCES VENDOR(vendor_id),
    tag_no VARCHAR(50) UNIQUE NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'sold', 'slaughtered'))
);

-- 9. ANIMAL_HEALTH_RECORD
CREATE TABLE ANIMAL_HEALTH_RECORD (
    record_id SERIAL PRIMARY KEY,
    animal_id INT UNIQUE REFERENCES ANIMAL(animal_id) ON DELETE CASCADE,
    health_status VARCHAR(100) NOT NULL,
    last_checkup DATE DEFAULT CURRENT_DATE
);

-- 10. HISSA
CREATE TABLE HISSA (
    hissa_id SERIAL PRIMARY KEY,
    animal_id INT REFERENCES ANIMAL(animal_id) ON DELETE CASCADE,
    hissa_no INT NOT NULL CHECK (hissa_no BETWEEN 1 AND 7),
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'sold'))
);

-- 11. DISCOUNT
CREATE TABLE DISCOUNT (
    discount_id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    expiry_date DATE NOT NULL
);

-- 12. PAYMENT_METHOD
CREATE TABLE PAYMENT_METHOD (
    method_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 13. BOOKING
CREATE TABLE BOOKING (
    booking_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "USER"(user_id),
    animal_id INT REFERENCES ANIMAL(animal_id),
    hissa_id INT REFERENCES HISSA(hissa_id), -- Nullable if full animal booking
    discount_id INT REFERENCES DISCOUNT(discount_id),
    booking_type VARCHAR(10) NOT NULL CHECK (booking_type IN ('full', 'hissa')),
    qurbani_day VARCHAR(20),
    delivery_preference VARCHAR(50) CHECK (delivery_preference IN ('perform_and_deliver', 'deliver_alive', 'pickup')),
    address_id INT REFERENCES ADDRESS(address_id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. PAYMENT
CREATE TABLE PAYMENT (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES BOOKING(booking_id),
    method_id INT REFERENCES PAYMENT_METHOD(method_id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. RECEIPT
CREATE TABLE RECEIPT (
    receipt_id SERIAL PRIMARY KEY,
    payment_id INT UNIQUE REFERENCES PAYMENT(payment_id),
    receipt_no VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. SLAUGHTER_HOUSE
CREATE TABLE SLAUGHTER_HOUSE (
    house_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city_id INT REFERENCES CITY(city_id),
    location TEXT NOT NULL
);

-- 17. BUTCHER
CREATE TABLE BUTCHER (
    butcher_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    house_id INT REFERENCES SLAUGHTER_HOUSE(house_id)
);

-- 18. SLAUGHTER_SCHEDULE
CREATE TABLE SLAUGHTER_SCHEDULE (
    schedule_id SERIAL PRIMARY KEY,
    animal_id INT REFERENCES ANIMAL(animal_id),
    house_id INT REFERENCES SLAUGHTER_HOUSE(house_id),
    butcher_id INT REFERENCES BUTCHER(butcher_id),
    slaughter_date DATE NOT NULL,
    slaughter_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- 19. MEAT_PACKAGE
CREATE TABLE MEAT_PACKAGE (
    package_id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES BOOKING(booking_id),
    weight DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'prepared' CHECK (status IN ('prepared', 'picked_up', 'in_transit', 'delivered'))
);

-- 20. DELIVERY_AGENT
CREATE TABLE DELIVERY_AGENT (
    agent_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL
);

-- 21. DELIVERY_ORDER
CREATE TABLE DELIVERY_ORDER (
    delivery_id SERIAL PRIMARY KEY,
    package_id INT REFERENCES MEAT_PACKAGE(package_id),
    agent_id INT REFERENCES DELIVERY_AGENT(agent_id),
    address_id INT REFERENCES ADDRESS(address_id),
    delivery_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'out_for_delivery', 'delivered', 'failed'))
);

-- 22. NOTIFICATION
CREATE TABLE NOTIFICATION (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "USER"(user_id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 23. REVIEW
CREATE TABLE REVIEW (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "USER"(user_id),
    animal_id INT REFERENCES ANIMAL(animal_id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
