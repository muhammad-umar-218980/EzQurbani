export const ADVANCED_REPORTS = {
    SPENDING_ABOVE_AVERAGE: `
        SELECT p.name, p.email, SUM(b.total_amount) AS total_spent
        FROM PERSON p
        JOIN BOOKING b ON p.person_id = b.user_id
        GROUP BY p.person_id, p.name, p.email
        HAVING SUM(b.total_amount) > (
            SELECT AVG(user_total)
            FROM (SELECT SUM(total_amount) AS user_total FROM BOOKING GROUP BY user_id) AS sub
        )
        ORDER BY total_spent DESC
    `,
    HIGHEST_SPENDING_USER: `
        SELECT p.name, p.email, SUM(b.total_amount) AS total_spent
        FROM PERSON p
        JOIN BOOKING b ON p.person_id = b.user_id
        GROUP BY p.person_id, p.name, p.email
        ORDER BY total_spent DESC
        LIMIT 1
    `,
    MORE_BOOKINGS_THAN_AVG: `
        SELECT p.name, COUNT(b.booking_id) AS total_bookings
        FROM PERSON p
        JOIN BOOKING b ON p.person_id = b.user_id
        GROUP BY p.person_id, p.name
        HAVING COUNT(b.booking_id) > (
            SELECT AVG(booking_count)
            FROM (SELECT COUNT(*) AS booking_count FROM BOOKING GROUP BY user_id) AS sub
        )
        ORDER BY total_bookings DESC
    `,
    EXPENSIVE_ANIMALS_IN_CATEGORY: `
        SELECT a.tag_no, ac.name AS category, a.price
        FROM ANIMAL a
        JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
        WHERE a.price > (
            SELECT AVG(a2.price)
            FROM ANIMAL a2
            WHERE a2.category_id = a.category_id
        )
        ORDER BY a.price DESC
    `,
    REVENUE_PER_PAYMENT_METHOD: `
        SELECT pm.name AS method, SUM(p.amount) AS total_revenue
        FROM PAYMENT p
        JOIN PAYMENT_METHOD pm ON p.method_id = pm.method_id
        GROUP BY pm.name
        HAVING SUM(p.amount) > 50000
        ORDER BY total_revenue DESC
    `,
    TOP_VENDORS: `
        SELECT v.name AS vendor, COUNT(a.animal_id) AS supply_count
        FROM VENDOR v
        JOIN ANIMAL a ON a.vendor_id = v.vendor_id
        GROUP BY v.vendor_id, v.name
        ORDER BY supply_count DESC
        LIMIT 5
    `,
    EXTREME_PRICED_ANIMALS: `
        SELECT 
            MAX(price) AS highest_price, 
            MIN(price) AS lowest_price 
        FROM ANIMAL 
        WHERE status = 'available'
    `,
    TAG_LENGTHS: `
        SELECT tag_no, LENGTH(tag_no) AS tag_length 
        FROM ANIMAL 
        ORDER BY tag_length DESC
        LIMIT 10
    `,
    SPLIT_NAMES: `
        SELECT 
            person_id, 
            SPLIT_PART(name, ' ', 1) AS first_name, 
            SPLIT_PART(name, ' ', 2) AS last_name, 
            name AS full_name 
        FROM PERSON
        LIMIT 10
    `
};
