// Step 10 — Booking Queries
// SQL constants for booking management and status updates

export const CHECK_ANIMAL_AVAILABLE = `SELECT status FROM ANIMAL WHERE animal_id = $1`;

export const CHECK_HISSA_AVAILABLE = `SELECT status FROM HISSA WHERE hissa_id = $1`;

export const INSERT_BOOKING = `
    INSERT INTO BOOKING (user_id, animal_id, hissa_id, discount_id, booking_type, total_amount, status, qurbani_day, delivery_preference, address_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
`;

export const INSERT_ADDRESS = `
    INSERT INTO ADDRESS (user_id, city_id, address_line)
    VALUES ($1, $2, $3)
    RETURNING *
`;

export const UPDATE_HISSA_STATUS = `UPDATE HISSA SET status = $1 WHERE hissa_id = $2`;

export const UPDATE_ANIMAL_STATUS = `UPDATE ANIMAL SET status = $1 WHERE animal_id = $2`;

export const GET_MY_BOOKINGS = `SELECT * FROM customer_booking_view WHERE user_id = $1`;

export const GET_ALL_BOOKINGS = `SELECT * FROM admin_dashboard_view`;

export const UPDATE_BOOKING_STATUS = `UPDATE BOOKING SET status = $1 WHERE booking_id = $2 RETURNING *`;
