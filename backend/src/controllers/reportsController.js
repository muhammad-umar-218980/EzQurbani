import pool from '../config/db.js';
import { ADVANCED_REPORTS } from '../queries/reportQueries.js';

export const getAdvancedReports = async (req, res) => {
    try {
        const [
            spendingAboveAvg,
            highestSpender,
            moreBookingsThanAvg,
            expensiveAnimals,
            revenuePerMethod,
            topVendors,
            extremePrices,
            tagLengths,
            splitNames
        ] = await Promise.all([
            pool.query(ADVANCED_REPORTS.SPENDING_ABOVE_AVERAGE),
            pool.query(ADVANCED_REPORTS.HIGHEST_SPENDING_USER),
            pool.query(ADVANCED_REPORTS.MORE_BOOKINGS_THAN_AVG),
            pool.query(ADVANCED_REPORTS.EXPENSIVE_ANIMALS_IN_CATEGORY),
            pool.query(ADVANCED_REPORTS.REVENUE_PER_PAYMENT_METHOD),
            pool.query(ADVANCED_REPORTS.TOP_VENDORS),
            pool.query(ADVANCED_REPORTS.EXTREME_PRICED_ANIMALS),
            pool.query(ADVANCED_REPORTS.TAG_LENGTHS),
            pool.query(ADVANCED_REPORTS.SPLIT_NAMES)
        ]);

        res.json({
            spendingAboveAvg: spendingAboveAvg.rows,
            highestSpender: highestSpender.rows,
            moreBookingsThanAvg: moreBookingsThanAvg.rows,
            expensiveAnimals: expensiveAnimals.rows,
            revenuePerMethod: revenuePerMethod.rows,
            topVendors: topVendors.rows,
            extremePrices: extremePrices.rows[0],
            tagLengths: tagLengths.rows,
            splitNames: splitNames.rows
        });
    } catch (err) {
        console.error('Reports Error:', err.message);
        res.status(500).json({ message: 'Server error while generating reports' });
    }
};
