// Step 12 — Admin Controller
// Logic for dashboard stats and managing operations

import pool from '../config/db.js';
import {
    GET_DASHBOARD_STATS,
    GET_ALL_USERS,
    INSERT_SCHEDULE,
    GET_ALL_SCHEDULES,
    GET_ALL_HOUSES,
    GET_ALL_BUTCHERS,
    GET_BOOKED_ANIMALS_FOR_SCHEDULING
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

// Animal duration map (in minutes) — matches frontend ManageSchedules.jsx
const ANIMAL_DURATIONS = { 'Bakra': 45, 'Dumba': 45, 'Cow': 180, 'Camel': 270 };

const addMinutesToTime = (timeStr, mins) => {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    d.setMinutes(d.getMinutes() + mins);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:00`;
};

// Create a slaughter schedule with workload check
export const createSchedule = async (req, res) => {
    const { animal_id, house_id, butcher_id, slaughter_date, slaughter_time, status } = req.body;
    try {
        // Look up animal category to compute end_time and duration
        const catResult = await pool.query(
            `SELECT ac.name FROM ANIMAL a JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id WHERE a.animal_id = $1`,
            [animal_id]
        );
        
        if (catResult.rows.length === 0) {
            return res.status(404).json({ message: 'Animal not found' });
        }
        
        const catName = catResult.rows[0].name || 'Bakra';
        
        let duration = 45;
        if (catName.toLowerCase().includes('cow')) {
            duration = 180;
        } else if (catName.toLowerCase().includes('camel')) {
            duration = 270;
        } else if (catName.toLowerCase().includes('dumba') || catName.toLowerCase().includes('bakra') || catName.toLowerCase().includes('goat')) {
            duration = 45;
        }

        // Fetch current schedules for this butcher on that date to compute remaining_minutes
        const workloadResult = await pool.query(`
            SELECT s.animal_id, ac.name as category_name
            FROM SLAUGHTER_SCHEDULE s
            JOIN ANIMAL a ON s.animal_id = a.animal_id
            JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
            WHERE s.butcher_id = $1 AND s.slaughter_date = $2
        `, [butcher_id, slaughter_date]);
        
        let used_minutes = 0;
        workloadResult.rows.forEach(row => {
            const cat = row.category_name || '';
            let d = 45;
            if (cat.toLowerCase().includes('cow')) {
                d = 180;
            } else if (cat.toLowerCase().includes('camel')) {
                d = 270;
            }
            used_minutes += d;
        });
        
        const remaining_minutes = (9 * 60) - used_minutes;
        
        console.log(`[Slaughter Scheduling] Assigning animal: ${catName} (${duration} mins). Crew remaining: ${remaining_minutes} mins`);
        
        // Prevent overbooking
        if (remaining_minutes < duration) {
            console.log(`[Slaughter Scheduling] Overbooking blocked for crew ${butcher_id}!`);
            return res.status(400).json({ message: 'This crew does not have enough time remaining today' });
        }

        const start_time = slaughter_time;
        const end_time = addMinutesToTime(slaughter_time, duration);

        const result = await pool.query(INSERT_SCHEDULE, [
            animal_id, house_id, butcher_id, slaughter_date, slaughter_time, status || 'pending',
            start_time, end_time
        ]);
        
        console.log(`[Slaughter Scheduling] Assignment successful! Remaining time for crew ${butcher_id}: ${remaining_minutes - duration} mins`);
        
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

// Get all butchers with workload calculation
export const getAllButchers = async (req, res) => {
    const { date } = req.query;
    const dateVal = date || '2026-05-27'; // Default to first day of Eid
    
    try {
        // Fetch all butchers
        const butchersResult = await pool.query(GET_ALL_BUTCHERS);
        
        // Fetch all schedule items on this day
        const schedsResult = await pool.query(`
            SELECT s.butcher_id, ac.name as category_name
            FROM SLAUGHTER_SCHEDULE s
            JOIN ANIMAL a ON s.animal_id = a.animal_id
            JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
            WHERE s.slaughter_date = $1
        `, [dateVal]);
        
        // Compute workload per butcher
        const butcherWorkload = {};
        schedsResult.rows.forEach(row => {
            const bId = row.butcher_id;
            const cat = row.category_name || '';
            
            let duration = 45;
            if (cat.toLowerCase().includes('cow')) {
                duration = 180;
            } else if (cat.toLowerCase().includes('camel')) {
                duration = 270;
            } else if (cat.toLowerCase().includes('dumba') || cat.toLowerCase().includes('bakra') || cat.toLowerCase().includes('goat')) {
                duration = 45;
            }
            
            butcherWorkload[bId] = (butcherWorkload[bId] || 0) + duration;
        });
        
        console.log(`[Slaughter Scheduling] Workload calculated for Date: ${dateVal}`);
        
        // Map through butchers
        const butchers = butchersResult.rows.map(b => {
            const used_minutes = butcherWorkload[b.butcher_id] || 0;
            const remaining_minutes = (9 * 60) - used_minutes;
            
            console.log(` - Crew: ${b.name}, Used Mins: ${used_minutes}, Remaining Mins: ${remaining_minutes}`);
            
            return {
                butcher_id: b.butcher_id,
                name: b.name,
                house_id: b.house_id,
                contact: b.contact,
                used_minutes,
                remaining_minutes,
                remaining_hours: parseFloat((remaining_minutes / 60).toFixed(2))
            };
        });
        
        // Step 6: Sort by MOST available time first
        butchers.sort((a, b) => b.remaining_minutes - a.remaining_minutes);
        
        res.json(butchers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all booked animals for scheduling
export const getBookedAnimals = async (req, res) => {
    try {
        const result = await pool.query(GET_BOOKED_ANIMALS_FOR_SCHEDULING);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
