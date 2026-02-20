const Datastore = require('nedb-promises');
const path = require('path');

const db = Datastore.create({ filename: path.join(__dirname, '../../subscriptions.db'), autoload: true });

const Subscription = {
    create: (data) => {
        data.createdAt = new Date();
        return db.insert(data);
    },
    find: (query) => db.find(query)
};

module.exports = Subscription;
