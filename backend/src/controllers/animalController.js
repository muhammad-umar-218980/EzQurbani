// Step 9 — Animal Controller
// Logic for browsing and managing animals

import pool from '../config/db.js';
import {
    GET_ALL_AVAILABLE_ANIMALS,
    GET_ANIMALS_BY_CATEGORY,
    GET_ANIMALS_SUMMARY,
    GET_ANIMAL_BY_ID,
    GET_ANIMAL_HISSAS,
    INSERT_ANIMAL,
    UPDATE_ANIMAL_STATUS
} from '../queries/animalQueries.js';

// Get animals summary (count per category)
export const getAnimalsSummary = async (req, res) => {
    try {
        const result = await pool.query(GET_ANIMALS_SUMMARY);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all available animals (optionally filtered by category)
export const getAnimals = async (req, res) => {
    try {
        const { category } = req.query;
        let result;
        if (category) {
            result = await pool.query(GET_ANIMALS_BY_CATEGORY, [category]);
        } else {
            result = await pool.query(GET_ALL_AVAILABLE_ANIMALS);
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single animal by ID
export const getAnimalById = async (req, res) => {
    try {
        const result = await pool.query(GET_ANIMAL_BY_ID, [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Animal not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get hissas for a specific animal
export const getAnimalHissas = async (req, res) => {
    try {
        const result = await pool.query(GET_ANIMAL_HISSAS, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new animal (Admin only)
export const addAnimal = async (req, res) => {
    const { category_id, vendor_id, tag_no, weight, price, status } = req.body;
    try {
        const result = await pool.query(INSERT_ANIMAL, [
            category_id, 
            vendor_id, 
            tag_no, 
            weight, 
            price, 
            status || 'available'
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update animal status (Admin only)
export const updateAnimalStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(UPDATE_ANIMAL_STATUS, [status, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Animal not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
