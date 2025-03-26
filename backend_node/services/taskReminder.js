const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('./emailService');

const checkDueTasks = async () => {
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 1);

    try {
        const tasks = await Task.find({
            dueDate: { $gte: now, $lte: nextDay },
            status: 'pending',
            reminderSent: false
        }).populate('user');

        await Promise.all(tasks.map(async (task) => {
            try {
                const user = task.user;
                if (user) {
                    console.log(`Sending notification to ${user.email} for task: ${task.title}`);

                    await sendEmail(
                        user.email,
                        "Task Reminder",
                        `Your task "${task.title}" is due soon!`
                    );

                    task.reminderSent = true;
                    await task.save();
                }
            } catch (taskError) {
                console.error(`Error processing task ${task._id}:`, taskError);
            }
        }));

    } catch (error) {
        console.error("Error sending notifications:", error);
    }
};

cron.schedule('0 * * * *', () => {
    console.log('Running task reminder check...');
    checkDueTasks().catch(console.error);
});

module.exports = checkDueTasks;