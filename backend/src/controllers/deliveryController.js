// Step 13 — Delivery Controller
// Logic for packaging meat and managing deliveries

import pool from '../config/db.js';
import {
    INSERT_DELIVERY_ORDER,
    TRACK_DELIVERY_BY_BOOKING,
    UPDATE_DELIVERY_STATUS,
    GET_ALL_DELIVERIES,
    GET_ALL_AGENTS,
    INSERT_MEAT_PACKAGE
} from '../queries/deliveryQueries.js';

// Create a meat package (Admin only)
export const createMeatPackage = async (req, res) => {
    const { booking_id, weight, status } = req.body;
    try {
        const result = await pool.query(INSERT_MEAT_PACKAGE, [
            booking_id, weight, status || 'prepared'
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a delivery order (Admin only)
export const createDelivery = async (req, res) => {
    const { package_id, agent_id, address_id, delivery_date, status } = req.body;
    try {
        const result = await pool.query(INSERT_DELIVERY_ORDER, [
            package_id, agent_id, address_id, delivery_date, status || 'pending'
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Track delivery for a customer booking
export const trackDelivery = async (req, res) => {
    const { booking_id } = req.params;
    const user_id = req.user.id;
    try {
        const result = await pool.query(TRACK_DELIVERY_BY_BOOKING, [booking_id, user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No delivery info found for this booking' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update delivery status (Admin only)
export const updateDeliveryStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(UPDATE_DELIVERY_STATUS, [status, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Delivery order not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all deliveries (Admin only)
export const getAllDeliveries = async (req, res) => {
    try {
        const result = await pool.query(GET_ALL_DELIVERIES);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all delivery agents (Admin only)
export const getAllAgents = async (req, res) => {
    try {
        const result = await pool.query(GET_ALL_AGENTS);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
