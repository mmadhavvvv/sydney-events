const Datastore = require('nedb-promises');
const path = require('path');

const db = Datastore.create({ filename: path.join(__dirname, '../../users.db'), autoload: true });

db.ensureIndex({ fieldName: 'email', unique: true });

const User = {
    findOne: (query) => db.findOne(query),
    findById: (id) => db.findOne({ _id: id }),
    create: (data) => db.insert(data)
};

module.exports = User;
