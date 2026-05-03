// Step 7 — Auth Controller
// Logic for user registration and login

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { 
    FIND_PERSON_BY_EMAIL, 
    INSERT_PERSON, 
    INSERT_USER, 
    INSERT_ADMIN, 
    GET_USER_WITH_ROLE 
} from '../queries/authQueries.js';

// Register a new user or admin
export const register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    
    try {
        // 1. Check if user already exists
        const existingPerson = await pool.query(FIND_PERSON_BY_EMAIL, [email]);
        if (existingPerson.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into PERSON
        const personResult = await pool.query(INSERT_PERSON, [name, email, hashedPassword, phone]);
        const personId = personResult.rows[0].person_id;

        // 4. Insert into role-specific table
        const assignedRole = role === 'admin' ? 'admin' : 'customer';
        if (assignedRole === 'admin') {
            await pool.query(INSERT_ADMIN, [personId]);
        } else {
            await pool.query(INSERT_USER, [personId]);
        }

        // 5. Sign and return JWT
        const token = jwt.sign(
            { id: personId, role: assignedRole, name, email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(201).json({ token, role: assignedRole });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find person by email
        const result = await pool.query(FIND_PERSON_BY_EMAIL, [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const person = result.rows[0];

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, person.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 3. Get user role
        const roleResult = await pool.query(GET_USER_WITH_ROLE, [person.person_id]);
        const role = roleResult.rows[0].role;

        // 4. Sign and return JWT
        const token = jwt.sign(
            { id: person.person_id, role, name: person.name, email: person.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ token, role });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
