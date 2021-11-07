const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

const {
    loadPlanetsData
} = require('./models/planets.models');

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://dbUser:2MJXuqsyJNGKW3bJ@nasacluster.qi6uz.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('Connection Ready!.');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});
async function startServer() {
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();

    server.listen(PORT, () => console.log(`Listening on port ${PORT}!`))
}

startServer();