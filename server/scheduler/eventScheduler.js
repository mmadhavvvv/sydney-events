const schedule = require('node-schedule');
const { scrapeEvents } = require('../controllers/scraperController');

const startScheduler = () => {
    // Run every day at midnight
    schedule.scheduleJob('0 0 * * *', async () => {
        console.log('Running daily scrape...');
        await scrapeEvents();
    });

    // Also run once immediately on server start (optional, for demo)
    console.log('Initial scrape starting...');
    scrapeEvents();
};

module.exports = startScheduler;
