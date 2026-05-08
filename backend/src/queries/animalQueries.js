// Step 9 — Animal Queries
// SQL constants for animal management

export const GET_ALL_AVAILABLE_ANIMALS = `
    SELECT a.*, ac.name as category_name, v.name as vendor_name 
    FROM ANIMAL a
    JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
    JOIN VENDOR v ON a.vendor_id = v.vendor_id
    WHERE a.status = 'available'
`;

export const GET_ANIMALS_BY_CATEGORY = `
    SELECT a.*, ac.name as category_name, v.name as vendor_name 
    FROM ANIMAL a
    JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
    JOIN VENDOR v ON a.vendor_id = v.vendor_id
    WHERE a.status = 'available' AND ac.name = $1
`;

export const GET_ANIMALS_SUMMARY = `
    SELECT ac.category_id, ac.name as category_name, COUNT(a.animal_id) as available_count, MIN(a.price) as starting_price
    FROM ANIMAL_CATEGORY ac
    LEFT JOIN ANIMAL a ON ac.category_id = a.category_id AND a.status = 'available'
    GROUP BY ac.category_id, ac.name
    ORDER BY ac.category_id
`;

export const GET_ANIMAL_BY_ID = `
    SELECT a.*, ac.name as category_name, v.name as vendor_name 
    FROM ANIMAL a
    JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
    JOIN VENDOR v ON a.vendor_id = v.vendor_id
    WHERE a.animal_id = $1
`;

export const GET_ANIMAL_HISSAS = `
    SELECT * FROM HISSA WHERE animal_id = $1
`;

export const INSERT_ANIMAL = `
    INSERT INTO ANIMAL (category_id, vendor_id, tag_no, weight, price, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING animal_id
`;

export const UPDATE_ANIMAL_STATUS = `
    UPDATE ANIMAL SET status = $1 WHERE animal_id = $2
    RETURNING *
`;

export const GET_ACTIVE_HISSA_ANIMAL = `
    SELECT a.*, COUNT(h.hissa_id) as booked_hissas
    FROM ANIMAL a
    JOIN HISSA h ON a.animal_id = h.animal_id AND h.status = 'booked'
    WHERE a.category_id = (SELECT category_id FROM ANIMAL_CATEGORY WHERE name = $1)
    AND a.status = 'available'
    GROUP BY a.animal_id
    HAVING COUNT(h.hissa_id) < 7 AND COUNT(h.hissa_id) > 0
    ORDER BY a.animal_id ASC
    LIMIT 1
`;

export const GET_EMPTY_HISSA_ANIMAL = `
    SELECT a.*, 0 as booked_hissas
    FROM ANIMAL a
    WHERE a.category_id = (SELECT category_id FROM ANIMAL_CATEGORY WHERE name = $1)
    AND a.status = 'available'
    AND NOT EXISTS (
        SELECT 1 FROM HISSA h WHERE h.animal_id = a.animal_id AND h.status = 'booked'
    )
    ORDER BY a.animal_id ASC
    LIMIT 1
`;
