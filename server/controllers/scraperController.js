const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

exports.scrapeEvents = async () => {
    console.log('Starting scrape (Local DB Mode)...');
    const baseUrl = 'https://whatson.cityofsydney.nsw.gov.au';
    const sourceName = 'What\'s On Sydney';

    try {
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);
        const eventLinks = new Set();

        $('a[href^="/events/"]').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.length > 8) {
                eventLinks.add(baseUrl + href);
            }
        });

        console.log(`Found ${eventLinks.size} potential events.`);

        for (const link of eventLinks) {
            try {
                const existingEvent = await Event.findOne({ sourceUrl: link });
                if (existingEvent && existingEvent.status === 'inactive') {
                    continue;
                }

                const eventPage = await axios.get(link);
                const $event = cheerio.load(eventPage.data);

                const title = $event('h1').first().text().trim();
                let description = $event('.description, .content-body, p').first().text().substring(0, 500);

                let date = new Date();
                let venue = 'Sydney';
                let imageUrl = $event('meta[property="og:image"]').attr('content');

                const ldJson = $event('script[type="application/ld+json"]').html();
                if (ldJson) {
                    try {
                        const schema = JSON.parse(ldJson);
                        if (schema.startDate) date = new Date(schema.startDate);
                        if (schema.location && schema.location.name) venue = schema.location.name;
                        if (schema.image) imageUrl = schema.image;
                        if (schema.description) description = schema.description;
                    } catch (e) {
                        console.log('Schema parse error', e.message);
                    }
                }

                if (date < new Date()) {
                    if (existingEvent) {
                        await Event.updateOne({ _id: existingEvent._id }, { status: 'inactive' });
                    }
                    continue;
                }

                if (existingEvent) {
                    // Check for updates
                    const updates = { lastScraped: new Date() };
                    if (new Date(existingEvent.date).getTime() !== date.getTime() || existingEvent.venue !== venue) {
                        updates.date = date;
                        updates.venue = venue;
                        updates.status = 'updated';
                    }
                    await Event.updateOne({ _id: existingEvent._id }, updates);
                    console.log(`Updated: ${title}`);
                } else {
                    await Event.create({
                        title,
                        date,
                        venue,
                        city: 'Sydney',
                        description,
                        imageUrl,
                        source: sourceName,
                        sourceUrl: link,
                        status: 'new',
                        lastScraped: new Date()
                    });
                    console.log(`New Event: ${title}`);
                }

                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (err) {
                console.error(`Failed to scrape ${link}: ${err.message}`);
            }
        }
    } catch (err) {
        console.error(`Scrape master error: ${err.message}`);
    }
};
