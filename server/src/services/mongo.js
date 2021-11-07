const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://dbUser:2MJXuqsyJNGKW3bJ@nasacluster.qi6uz.mongodb.net/nasa?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('Connection Ready!.');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function connectDatabase() {
    await mongoose.connect(MONGO_URL);
}

async function disconnectDatabase() {
    await mongoose.disconnect();
}

module.exports = {
    connectDatabase,
    disconnectDatabase
}