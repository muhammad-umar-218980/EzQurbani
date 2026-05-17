// Step 12 — Admin Queries
// SQL constants for dashboard stats and operational management

export const GET_DASHBOARD_STATS = {
    TOTAL_BOOKINGS: `SELECT COUNT(*) as count FROM BOOKING`,
    TOTAL_REVENUE: `SELECT SUM(amount) as total FROM PAYMENT`,
    AVAILABLE_ANIMALS: `SELECT COUNT(*) as count FROM ANIMAL WHERE status = 'available'`,
    PENDING_DELIVERIES: `SELECT COUNT(*) as count FROM DELIVERY_ORDER WHERE status != 'delivered'`,
    CATEGORY_DISTRIBUTION: `
        SELECT ac.name as name, COUNT(b.booking_id) as value
        FROM BOOKING b
        JOIN ANIMAL a ON b.animal_id = a.animal_id
        JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
        GROUP BY ac.name
    `,
    REVENUE_TREND: `
        SELECT TO_CHAR(created_at, 'Mon DD') as date, SUM(total_amount) as total
        FROM BOOKING
        GROUP BY TO_CHAR(created_at, 'Mon DD'), DATE(created_at)
        ORDER BY DATE(created_at) ASC
        LIMIT 7
    `
};

export const GET_ALL_USERS = `
    SELECT p.person_id, p.name, p.email, p.phone, u.registration_date 
    FROM PERSON p
    JOIN "USER" u ON p.person_id = u.user_id
`;

export const INSERT_SCHEDULE = `
    INSERT INTO SLAUGHTER_SCHEDULE (animal_id, house_id, butcher_id, slaughter_date, slaughter_time, status, start_time, end_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
`;

export const GET_ALL_SCHEDULES = `
    SELECT s.*, a.tag_no, b.name as butcher_name, h.name as house_name, ac.name as category_name,
           s.start_time, s.end_time
    FROM SLAUGHTER_SCHEDULE s
    JOIN ANIMAL a ON s.animal_id = a.animal_id
    JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
    JOIN BUTCHER b ON s.butcher_id = b.butcher_id
    JOIN SLAUGHTER_HOUSE h ON s.house_id = h.house_id
`;

export const GET_ALL_HOUSES = `SELECT * FROM SLAUGHTER_HOUSE`;

export const GET_ALL_BUTCHERS = `SELECT * FROM BUTCHER`;

export const GET_BOOKED_ANIMALS_FOR_SCHEDULING = `
    SELECT a.*, ac.name as category_name, MAX(b.qurbani_day) as qurbani_day
    FROM ANIMAL a
    JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
    JOIN BOOKING b ON a.animal_id = b.animal_id
    WHERE a.status = 'booked'
    GROUP BY a.animal_id, ac.name
    ORDER BY a.animal_id
`;
