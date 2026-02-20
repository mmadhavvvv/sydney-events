const Datastore = require('nedb-promises');
const path = require('path');

const db = Datastore.create({ filename: path.join(__dirname, '../../events.db'), autoload: true });

db.ensureIndex({ fieldName: 'sourceUrl', unique: true });

const Event = {
    // Pass through to NeDB, which supports chaining: await db.find().sort().limit()
    find: (query) => db.find(query),
    findOne: (query) => db.findOne(query),
    findById: (id) => db.findOne({ _id: id }),
    create: (data) => db.insert(data),
    countDocuments: (query) => db.count(query),
    // NeDB update returns numAffected, but we want the doc for findByIdAndUpdate usually
    // But our controller uses it and expects the doc? 
    // route: const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
    // We need to implement findByIdAndUpdate
    findByIdAndUpdate: async (id, update, options) => {
        // update is like { status: '...' } or { $set: { status: '...' } }
        // Mongoose might pass $set or direct fields. 
        // Our controller passes { status } (direct fields). NeDB needs { $set: ... } usually for partial update?
        // Actually NeDB replace if no modifier.
        // Let's assume we need $set.
        const modifier = update.$set ? update : { $set: update };
        await db.update({ _id: id }, modifier, { ...options });
        return db.findOne({ _id: id });
    },
    updateOne: (query, update) => {
        const modifier = update.$set ? update : { $set: update };
        return db.update(query, modifier);
    },
    _db: db
};

module.exports = Event;
