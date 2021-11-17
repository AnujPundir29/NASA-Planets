const http = require('http');
require('dotenv').config();   // this will get import here and all the file which server.js is requiring.
const app = require('./app');
const {connectDatabase} = require('./services/mongo');
const {loadLaunchesData} = require('./models/launches.model');

const {
    loadPlanetsData
} = require('./models/planets.models');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await connectDatabase();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => console.log(`Listening on port ${PORT}!`))
}

startServer();