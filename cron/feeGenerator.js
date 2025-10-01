const cron = require('node-cron');
const User = require('../models/user.model');
const FeeRecord = require('../models/feeRecord.model');

// This cron job runs at 1 AM on the first day of every month.
const generateMonthlyFees = () => {
  cron.schedule('0 1 1 * *', async () => {
    try {
      const students = await User.find({ isAdmin: false, isApproved: true });
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      for (const student of students) {
        // Check if a fee record for the current month already exists
        const existingRecord = await FeeRecord.findOne({
          user: student._id,
          month: currentMonth,
          year: currentYear,
        });

        if (!existingRecord) {
          const newFee = new FeeRecord({
            user: student._id,
            month: currentMonth,
            year: currentYear,
            amount: 500, // Monthly fee amount
          });
          await newFee.save();
        }
      }
    } catch (err) {
      console.error('Error generating monthly fees:', err);
    }
  });
};

module.exports = generateMonthlyFees;