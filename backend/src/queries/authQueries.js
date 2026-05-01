// Step 7 — Auth Queries
// SQL constants for authentication and user management

export const FIND_PERSON_BY_EMAIL = `SELECT * FROM PERSON WHERE email = $1`;

export const INSERT_PERSON = `
    INSERT INTO PERSON (name, email, password, phone) 
    VALUES ($1, $2, $3, $4) 
    RETURNING person_id
`;

export const INSERT_USER = `INSERT INTO "USER" (user_id) VALUES ($1)`;

export const INSERT_ADMIN = `INSERT INTO ADMIN (admin_id) VALUES ($1)`;

export const GET_USER_WITH_ROLE = `
    SELECT p.person_id, p.name, p.email, p.phone,
    CASE 
        WHEN u.user_id IS NOT NULL THEN 'customer'
        WHEN a.admin_id IS NOT NULL THEN 'admin'
    END as role
    FROM PERSON p
    LEFT JOIN "USER" u ON p.person_id = u.user_id
    LEFT JOIN ADMIN a ON p.person_id = a.admin_id
    WHERE p.person_id = $1
`;
