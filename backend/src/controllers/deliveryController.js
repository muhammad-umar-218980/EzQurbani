// Step 13 — Delivery Controller
// Logic for packaging meat and managing deliveries

import pool from '../config/db.js';
import {
    INSERT_DELIVERY_ORDER,
    TRACK_DELIVERY_BY_BOOKING,
    UPDATE_DELIVERY_STATUS,
    GET_ALL_DELIVERIES,
    GET_ALL_AGENTS,
    INSERT_MEAT_PACKAGE,
    GET_PENDING_BOOKINGS_FOR_DELIVERY,
    GET_DELIVERY_STATS_FOR_SHIFT,
    GET_TRUCK_DELIVERY_COUNT
} from '../queries/deliveryQueries.js';

const SHIFTS = [
    { start: '08:00:00', end: '12:30:00' },
    { start: '12:30:00', end: '17:00:00' },
    { start: '17:00:00', end: '21:30:00' }
];

const TRUCKS = ['Truck 1', 'Truck 2', 'Truck 3', 'Truck 4'];
const MAX_DELIVERIES_PER_SHIFT = 80;
const MAX_DELIVERIES_PER_TRUCK = 20;

// Helper to dynamically calculate dynamic, time-aware status
const computeDynamicStatus = (row) => {
    const now = new Date();
    
    // Default fallback
    let computedStatus = 'pending';
    
    if (row.slaughter_date && row.slaughter_end_time) {
        const sDateObj = new Date(row.slaughter_date);
        const sDateStr = `${sDateObj.getFullYear()}-${String(sDateObj.getMonth()+1).padStart(2,'0')}-${String(sDateObj.getDate()).padStart(2,'0')}`;
        const slaughterEnd = new Date(`${sDateStr}T${row.slaughter_end_time}`);
        
        if (now >= slaughterEnd) {
            computedStatus = 'slaughtered';
            
            if (row.delivery_date && row.shift_start && row.shift_end) {
                const dDateObj = new Date(row.delivery_date);
                const dDateStr = `${dDateObj.getFullYear()}-${String(dDateObj.getMonth()+1).padStart(2,'0')}-${String(dDateObj.getDate()).padStart(2,'0')}`;
                const shiftStartD = new Date(`${dDateStr}T${row.shift_start}`);
                const shiftEndD = new Date(`${dDateStr}T${row.shift_end}`);
                
                if (now >= shiftEndD) {
                    computedStatus = 'delivered';
                } else if (now >= shiftStartD) {
                    computedStatus = 'out_for_delivery';
                }
            }
        }
    }
    return computedStatus;
};

// Get pending bookings that need delivery assignment
export const getPendingDeliveries = async (req, res) => {
    try {
        const result = await pool.query(GET_PENDING_BOOKINGS_FOR_DELIVERY);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

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
    const { package_id, agent_id, address_id, status } = req.body;
    let delivery_date = req.body.delivery_date || new Date().toISOString().split('T')[0];

    try {
        // 1. Get slaughter end time and slaughter date for this package
        const slaughterQuery = await pool.query(`
            SELECT ss.end_time, ss.slaughter_date 
            FROM MEAT_PACKAGE mp
            JOIN BOOKING b ON mp.booking_id = b.booking_id
            JOIN SLAUGHTER_SCHEDULE ss ON b.animal_id = ss.animal_id
            WHERE mp.package_id = $1
        `, [package_id]);
        
        let slaughterEndTime = '08:00:00';
        let slaughterDate = delivery_date;
        if (slaughterQuery.rows.length > 0) {
            if (slaughterQuery.rows[0].end_time) slaughterEndTime = slaughterQuery.rows[0].end_time;
            if (slaughterQuery.rows[0].slaughter_date) {
                const sDate = new Date(slaughterQuery.rows[0].slaughter_date);
                slaughterDate = `${sDate.getFullYear()}-${String(sDate.getMonth()+1).padStart(2,'0')}-${String(sDate.getDate()).padStart(2,'0')}`;
            }
        }

        // Use slaughterDate as the base delivery_date if it wasn't explicitly passed
        if (!req.body.delivery_date) {
            delivery_date = slaughterDate;
        }

        // 2. Get meat package weight to enforce truck capacity
        const packageWeightQuery = await pool.query('SELECT weight FROM MEAT_PACKAGE WHERE package_id = $1', [package_id]);
        const packageWeight = parseFloat(packageWeightQuery.rows[0]?.weight || 0);

        // 3. Determine Initial Shift
        let initialShiftIndex = 0;
        if (slaughterEndTime >= '17:00:00') initialShiftIndex = 2;
        else if (slaughterEndTime >= '12:30:00') initialShiftIndex = 1;

        let assignedShift = null;
        let assignedTruck = null;

        // 4. Find available shift and truck
        let currentShiftIndex = initialShiftIndex;
        while (!assignedTruck) {
            if (currentShiftIndex >= SHIFTS.length) {
                // Roll over to next day, Shift 1
                const d = new Date(delivery_date);
                d.setDate(d.getDate() + 1);
                delivery_date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                currentShiftIndex = 0;
            }

            const targetShift = SHIFTS[currentShiftIndex];

            // Check shift capacity using our updated dynamic query
            const shiftStats = await pool.query(GET_DELIVERY_STATS_FOR_SHIFT, [delivery_date, targetShift.start, agent_id]);
            const shiftCount = parseInt(shiftStats.rows[0].delivery_count);

            if (shiftCount < MAX_DELIVERIES_PER_SHIFT) {
                // Find available truck
                for (let truck of TRUCKS) {
                    const truckStats = await pool.query(GET_TRUCK_DELIVERY_COUNT, [delivery_date, targetShift.start, agent_id, truck]);
                    const truckCount = parseInt(truckStats.rows[0].truck_count);
                    const truckWeight = parseFloat(truckStats.rows[0].truck_weight);

                    // Truck constraints:
                    // Max 20 deliveries AND Max 2000 KG capacity
                    if (truckCount < MAX_DELIVERIES_PER_TRUCK && (truckWeight + packageWeight) <= 2000.0) {
                        assignedShift = targetShift;
                        assignedTruck = truck;
                        break;
                    }
                }
            }

            if (!assignedTruck) {
                currentShiftIndex++; // Move to next shift if no truck or shift full
            }
        }

        const result = await pool.query(INSERT_DELIVERY_ORDER, [
            package_id, agent_id, address_id, delivery_date, status || 'pending',
            assignedShift.start, assignedShift.end, assignedTruck
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
        
        let row = result.rows[0];
        row.computed_status = computeDynamicStatus(row);
        row.status = row.computed_status;
        res.json(row);
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

        // Get user_id for notification
        const userQuery = await pool.query(`
            SELECT b.user_id 
            FROM DELIVERY_ORDER d
            JOIN MEAT_PACKAGE mp ON d.package_id = mp.package_id
            JOIN BOOKING b ON mp.booking_id = b.booking_id
            WHERE d.delivery_id = $1
        `, [req.params.id]);

        if (userQuery.rows.length > 0) {
            const userId = userQuery.rows[0].user_id;
            const { createNotification } = await import('./notificationController.js');
            await createNotification(
                pool,
                userId,
                `Your delivery status has been updated to: ${status.replace(/_/g, ' ')}`
            );
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
        const rows = result.rows.map(item => {
            const status = computeDynamicStatus(item);
            return {
                ...item,
                status: status,
                computed_status: status
            };
        });
        res.json(rows);
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

// Get current shift stats (Admin only)
export const getDeliveryStats = async (req, res) => {
    try {
        // Determine current shift based on server time
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0]; // HH:MM:SS
        
        let currentShift = null;
        if (timeString >= '08:00:00' && timeString < '12:30:00') {
            currentShift = SHIFTS[0]; // Shift 1
        } else if (timeString >= '12:30:00' && timeString < '17:00:00') {
            currentShift = SHIFTS[1]; // Shift 2
        } else if (timeString >= '17:00:00' && timeString < '21:30:00') {
            currentShift = SHIFTS[2]; // Shift 3
        }
        
        console.log(`[Logistics Stats] Server Time: ${timeString}, Active Shift:`, currentShift ? `${currentShift.start} - ${currentShift.end}` : 'Closed');

        // Let's aggregate for all active agents
        const agents = await pool.query(GET_ALL_AGENTS);
        
        let totalAssigned = 0;
        let totalWeight = 0;
        
        const dateStr = now.toISOString().split('T')[0];

        if (currentShift) {
            for (let agent of agents.rows) {
                const stats = await pool.query(GET_DELIVERY_STATS_FOR_SHIFT, [dateStr, currentShift.start, agent.agent_id]);
                totalAssigned += parseInt(stats.rows[0].delivery_count);
                totalWeight += parseFloat(stats.rows[0].total_weight);
            }
        }

        // Active vs completed counts must be computed dynamically using the dynamic time-based logic!
        const allDeliveriesQuery = await pool.query(GET_ALL_DELIVERIES);
        let activeCount = 0;
        let completedCount = 0;

        for (const item of allDeliveriesQuery.rows) {
            const d = new Date(item.delivery_date);
            const dDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (dDateStr === dateStr) {
                const dynamicStatus = computeDynamicStatus(item);
                if (dynamicStatus === 'delivered') {
                    completedCount++;
                } else {
                    activeCount++;
                }
            }
        }

        const statusCounts = [
            { status: 'active', count: activeCount },
            { status: 'delivered', count: completedCount }
        ];

        res.json({
            currentShift,
            maxCapacity: MAX_DELIVERIES_PER_SHIFT * agents.rows.length, // Total capacity across all cities
            totalAssigned,
            totalWeight,
            availableCapacity: currentShift ? ((MAX_DELIVERIES_PER_SHIFT * agents.rows.length) - totalAssigned) : 0,
            statusCounts
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

