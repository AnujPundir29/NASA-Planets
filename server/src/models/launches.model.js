const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();
const DEF_FLIGHT_NUM = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 29, 2021'),
    target: 'Kepler-442 b',
    customers: ['Anuj', 'NASA'],
    upcoming: true,
    success: true,
}

// launches.set(launch.flightNumber, launch);

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    return !latestLaunch ? DEF_FLIGHT_NUM : latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        kepler_name: launch.target
    });

    if (!planet) {
        throw new Error('Planet which is target is not matching with the database');
    }
    await launchesDatabase.updateOne({
            flightNumber: launch.flightNumber, //if found with the flight number then update the next value otherwise insert a new one
        },
        launch, {
            upsert: true,
        });
}

saveLaunch(launch);

function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, '-_id -__v ');
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    console.log(newFlightNumber);
    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['Anuj', 'NASA'],
        success: true,
        upcoming: true,
    });

    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     launches.set(latestFlightNumber, Object.assign(launch, {
//         flightNumber: latestFlightNumber,
//         customer: ['Anuj', 'NASA'],
//         success: true,
//         upcoming: true,
//     }));
// }

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
    // addNewLaunch,
    scheduleNewLaunch,
    abortLaunch,
};