// Step 10 — Booking Controller
// Logic for creating and managing bookings

import pool from '../config/db.js';
import {
    CHECK_ANIMAL_AVAILABLE,
    CHECK_HISSA_AVAILABLE,
    INSERT_BOOKING,
    UPDATE_HISSA_STATUS,
    UPDATE_ANIMAL_STATUS,
    GET_MY_BOOKINGS,
    GET_ALL_BOOKINGS,
    UPDATE_BOOKING_STATUS,
    INSERT_ADDRESS
} from '../queries/bookingQueries.js';

// Create a new booking (Most Important Function)
export const createBooking = async (req, res) => {
    const { animal_id, hissa_id, discount_id, booking_type, total_amount, qurbani_day, delivery_preference, address_line, city_id } = req.body;
    const user_id = req.user.id; // From verifyToken middleware

    const client = await pool.connect(); // Use a single client for transaction

    try {
        await client.query('BEGIN');

        // 1. Availability and Rule Check
        if (booking_type === 'hissa') {
            if (delivery_preference === 'deliver_alive') {
                return res.status(400).json({ message: 'Whole animal delivery is only available for full bookings' });
            }
            if (!hissa_id) throw new Error('Hissa ID is required for hissa booking');
            const hissaCheck = await client.query(CHECK_HISSA_AVAILABLE, [hissa_id]);
            if (hissaCheck.rows.length === 0 || hissaCheck.rows[0].status !== 'available') {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Selected Hissa is no longer available' });
            }
        } else {
            const animalCheck = await client.query(CHECK_ANIMAL_AVAILABLE, [animal_id]);
            if (animalCheck.rows.length === 0 || animalCheck.rows[0].status !== 'available') {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Animal is no longer available for full booking' });
            }
        }

        // 2. Insert Address if needed
        let address_id = null;
        if (delivery_preference !== 'pickup' && address_line) {
            // Assume city_id is provided, default to 1 (Karachi) if not for simplicity
            const addressResult = await client.query(INSERT_ADDRESS, [
                user_id,
                city_id || 1,
                address_line
            ]);
            address_id = addressResult.rows[0].address_id;
        }

        // 3. Insert Booking
        const bookingResult = await client.query(INSERT_BOOKING, [
            user_id,
            animal_id,
            hissa_id || null,
            discount_id || null,
            booking_type,
            total_amount,
            'pending', // Default status
            qurbani_day || null,
            delivery_preference || null,
            address_id
        ]);
        const newBooking = bookingResult.rows[0];

        // 4. Update Status (Prevent Double Booking)
        if (booking_type === 'hissa') {
            await client.query(UPDATE_HISSA_STATUS, ['booked', hissa_id]);
        } else {
            await client.query(UPDATE_ANIMAL_STATUS, ['booked', animal_id]);
        }

        await client.query('COMMIT');
        res.status(201).json(newBooking);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error during booking' });
    } finally {
        client.release();
    }
};

// Get current user's bookings
export const getMyBookings = async (req, res) => {
    try {
        const result = await pool.query(GET_MY_BOOKINGS, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all bookings (Admin only)
export const getAllBookings = async (req, res) => {
    try {
        const result = await pool.query(GET_ALL_BOOKINGS);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update booking status (Admin only)
export const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(UPDATE_BOOKING_STATUS, [status, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
