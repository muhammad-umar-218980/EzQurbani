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
