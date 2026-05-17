// Step 13 — Delivery Queries
// SQL constants for packaging and delivery management

export const INSERT_DELIVERY_ORDER = `
    INSERT INTO DELIVERY_ORDER (package_id, agent_id, address_id, delivery_date, status, shift_start, shift_end, truck_name)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
`;

export const TRACK_DELIVERY_BY_BOOKING = `
    SELECT 
        b.booking_id, 
        b.status as booking_status,
        b.qurbani_day,
        ss.status as slaughter_status,
        ss.slaughter_date,
        ss.start_time as slaughter_start_time,
        ss.end_time as slaughter_end_time,
        mp.status as package_status,
        d.status as delivery_status,
        d.delivery_date,
        d.shift_start,
        d.shift_end,
        d.truck_name,
        a.name as agent_name,
        ad.address_line
    FROM BOOKING b
    LEFT JOIN SLAUGHTER_SCHEDULE ss ON b.animal_id = ss.animal_id
    LEFT JOIN MEAT_PACKAGE mp ON b.booking_id = mp.booking_id
    LEFT JOIN DELIVERY_ORDER d ON mp.package_id = d.package_id
    LEFT JOIN DELIVERY_AGENT a ON d.agent_id = a.agent_id
    LEFT JOIN ADDRESS ad ON b.address_id = ad.address_id
    WHERE b.booking_id = $1 AND b.user_id = $2
`;

export const UPDATE_DELIVERY_STATUS = `
    UPDATE DELIVERY_ORDER SET status = $1 WHERE delivery_id = $2
    RETURNING *
`;

export const GET_ALL_DELIVERIES = `
    SELECT d.*, a.name as agent_name, ad.address_line, mp.weight as package_weight,
           ss.slaughter_date, ss.end_time as slaughter_end_time
    FROM DELIVERY_ORDER d
    JOIN MEAT_PACKAGE mp ON d.package_id = mp.package_id
    JOIN BOOKING b ON mp.booking_id = b.booking_id
    LEFT JOIN SLAUGHTER_SCHEDULE ss ON b.animal_id = ss.animal_id
    LEFT JOIN DELIVERY_AGENT a ON d.agent_id = a.agent_id
    LEFT JOIN ADDRESS ad ON d.address_id = ad.address_id
`;

export const GET_ALL_AGENTS = `SELECT * FROM DELIVERY_AGENT`;

export const GET_PENDING_BOOKINGS_FOR_DELIVERY = `
    SELECT b.booking_id, p.name as customer_name, a.tag_no, ac.name as animal_category,
           b.booking_type, a.weight as animal_weight, b.qurbani_day,
           (SELECT address_id FROM ADDRESS WHERE user_id = b.user_id LIMIT 1) as address_id,
           ss.end_time as slaughter_end_time,
           ss.status as slaughter_status
    FROM BOOKING b
    JOIN PERSON p ON b.user_id = p.person_id
    LEFT JOIN ANIMAL a ON b.animal_id = a.animal_id
    LEFT JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
    LEFT JOIN SLAUGHTER_SCHEDULE ss ON a.animal_id = ss.animal_id
    WHERE b.status = 'confirmed' 
      AND NOT EXISTS (
          SELECT 1 FROM MEAT_PACKAGE mp WHERE mp.booking_id = b.booking_id
      )
`;

export const INSERT_MEAT_PACKAGE = `
    INSERT INTO MEAT_PACKAGE (booking_id, weight, status)
    VALUES ($1, $2, $3)
    RETURNING *
`;

export const GET_DELIVERY_STATS_FOR_SHIFT = `
    SELECT COUNT(*) as delivery_count, COALESCE(SUM(mp.weight), 0) as total_weight
    FROM DELIVERY_ORDER d
    JOIN MEAT_PACKAGE mp ON d.package_id = mp.package_id
    WHERE d.delivery_date = $1 
      AND d.shift_start = $2 
      AND d.agent_id = $3
`;

export const GET_TRUCK_DELIVERY_COUNT = `
    SELECT COUNT(*) as truck_count, COALESCE(SUM(mp.weight), 0) as truck_weight
    FROM DELIVERY_ORDER d
    JOIN MEAT_PACKAGE mp ON d.package_id = mp.package_id
    WHERE d.delivery_date = $1 
      AND d.shift_start = $2 
      AND d.agent_id = $3 
      AND d.truck_name = $4
`;
