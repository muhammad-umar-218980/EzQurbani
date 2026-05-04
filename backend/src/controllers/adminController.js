// Step 12 — Admin Controller
// Logic for dashboard stats and managing operations

import pool from '../config/db.js';
import {
    GET_DASHBOARD_STATS,
    GET_ALL_USERS,
    INSERT_SCHEDULE,
    GET_ALL_SCHEDULES,
    GET_ALL_HOUSES,
    GET_ALL_BUTCHERS
} from '../queries/adminQueries.js';

// Get aggregated stats for the dashboard
export const getDashboardStats = async (req, res) => {
    try {
        const bookings = await pool.query(GET_DASHBOARD_STATS.TOTAL_BOOKINGS);
        const revenue = await pool.query(GET_DASHBOARD_STATS.TOTAL_REVENUE);
        const animals = await pool.query(GET_DASHBOARD_STATS.AVAILABLE_ANIMALS);
        const deliveries = await pool.query(GET_DASHBOARD_STATS.PENDING_DELIVERIES);
        
        const distribution = await pool.query(GET_DASHBOARD_STATS.CATEGORY_DISTRIBUTION);
        const trend = await pool.query(GET_DASHBOARD_STATS.REVENUE_TREND);

        res.json({
            totalBookings: parseInt(bookings.rows[0].count),
            totalRevenue: parseFloat(revenue.rows[0].total || 0),
            availableAnimals: parseInt(animals.rows[0].count),
            pendingDeliveries: parseInt(deliveries.rows[0].count),
            categoryDistribution: distribution.rows.map(d => ({ name: d.name, value: parseInt(d.value) })),
            revenueTrend: trend.rows.map(t => ({ date: t.date, total: parseFloat(t.total) }))
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all registered customers
export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(GET_ALL_USERS);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a slaughter schedule
export const createSchedule = async (req, res) => {
    const { animal_id, house_id, butcher_id, slaughter_date, slaughter_time, status } = req.body;
    try {
        const result = await pool.query(INSERT_SCHEDULE, [
            animal_id, house_id, butcher_id, slaughter_date, slaughter_time, status || 'pending'
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all schedules
export const getAllSchedules = async (req, res) => {
    try {
        const result = await pool.query(GET_ALL_SCHEDULES);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all slaughterhouses
export const getAllHouses = async (req, res) => {
    try {
        const result = await pool.query(GET_ALL_HOUSES);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all butchers
export const getAllButchers = async (req, res) => {
    try {
        const result = await pool.query(GET_ALL_BUTCHERS);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
