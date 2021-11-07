const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

let latestFlightNumber = 100;
const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 29,2021'),
    target: 'Kepler-442 b',
    customers: ['Anuj', 'NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        kepler_name: launch.target
    });

    if(!planet) {
        throw new Error('Planet which is target is not matching with the database');
    }
    await launchesDatabase.updateOne({
            flightNumber: launch.flightNumber, //if found with the flight number then update the next value otherwise insert a new one
        },
        launch, {
            upsert: true,
        });
}

function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

async function getAllLaunches() {
    // return Array.from(launches.values());
    return await launchesDatabase.find({}, '-_id -__v ');
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customer: ['Anuj', 'NASA'],
        success: true,
        upcoming: true,
    }));
}

function abortLaunch(flightNumber) {
    if (launches.has(flightNumber)) {
        const launch = launches.get(flightNumber);
        launch.upcoming = false;
        launch.success = false;
    }
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunch,
};