-- Step 3 — SQL Views for EzQurbani
-- These views simplify complex joins for the application dashboards.

-- 1. customer_booking_view
-- Purpose: For individual users to see their own booking details.
-- Note: The backend will filter by user_id.
CREATE OR REPLACE VIEW customer_booking_view AS
SELECT 
    b.booking_id,
    b.user_id,
    p.name AS customer_name,
    a.tag_no,
    ac.name AS category_name,
    b.booking_type,
    h.hissa_no,
    b.total_amount,
    b.status AS booking_status,
    pay.amount AS paid_amount,
    pm.name AS payment_method,
    r.receipt_no,
    del.status AS delivery_status,
    b.created_at AS booking_date,
    b.qurbani_day,
    b.delivery_preference,
    addr.address_line AS delivery_address
FROM 
    BOOKING b
JOIN "USER" u ON b.user_id = u.user_id
JOIN PERSON p ON u.user_id = p.person_id
LEFT JOIN ANIMAL a ON b.animal_id = a.animal_id
LEFT JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
LEFT JOIN HISSA h ON b.hissa_id = h.hissa_id
LEFT JOIN PAYMENT pay ON b.booking_id = pay.booking_id
LEFT JOIN PAYMENT_METHOD pm ON pay.method_id = pm.method_id
LEFT JOIN RECEIPT r ON pay.payment_id = r.payment_id
LEFT JOIN MEAT_PACKAGE mp ON b.booking_id = mp.booking_id
LEFT JOIN DELIVERY_ORDER del ON mp.package_id = del.package_id
LEFT JOIN ADDRESS addr ON b.address_id = addr.address_id;

-- 2. admin_dashboard_view
-- Purpose: For administrators to see a global view of all operations.
CREATE OR REPLACE VIEW admin_dashboard_view AS
SELECT 
    b.booking_id,
    p.name AS customer_name,
    p.phone AS customer_phone,
    a.tag_no,
    ac.name AS category_name,
    v.name AS vendor_name,
    b.booking_type,
    h.hissa_no,
    b.total_amount,
    b.status AS booking_status,
    COALESCE(SUM(pay.amount), 0) AS total_paid,
    ss.status AS slaughter_status,
    bch.name AS butcher_name,
    sh.name AS slaughter_house,
    del.status AS delivery_status,
    da.name AS delivery_agent,
    b.created_at AS booking_date,
    b.qurbani_day,
    b.delivery_preference,
    addr.address_line AS delivery_address
FROM 
    BOOKING b
JOIN PERSON p ON b.user_id = p.person_id
LEFT JOIN ANIMAL a ON b.animal_id = a.animal_id
LEFT JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
LEFT JOIN VENDOR v ON a.vendor_id = v.vendor_id
LEFT JOIN HISSA h ON b.hissa_id = h.hissa_id
LEFT JOIN PAYMENT pay ON b.booking_id = pay.booking_id
LEFT JOIN SLAUGHTER_SCHEDULE ss ON a.animal_id = ss.animal_id
LEFT JOIN BUTCHER bch ON ss.butcher_id = bch.butcher_id
LEFT JOIN SLAUGHTER_HOUSE sh ON ss.house_id = sh.house_id
LEFT JOIN MEAT_PACKAGE mp ON b.booking_id = mp.booking_id
LEFT JOIN DELIVERY_ORDER del ON mp.package_id = del.package_id
LEFT JOIN DELIVERY_AGENT da ON del.agent_id = da.agent_id
LEFT JOIN ADDRESS addr ON b.address_id = addr.address_id
GROUP BY 
    b.booking_id, p.name, p.phone, a.tag_no, ac.name, v.name, b.booking_type, 
    h.hissa_no, b.total_amount, b.status, ss.status, bch.name, sh.name, 
    del.status, da.name, b.created_at, b.qurbani_day, b.delivery_preference, addr.address_line;
