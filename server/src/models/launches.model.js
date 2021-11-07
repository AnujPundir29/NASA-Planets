const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

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
    await launchesDatabase.findOneAndUpdate({ // only includes the properties we inserted not additional
            flightNumber: launch.flightNumber, //if found with the flight number then update the next value otherwise insert a new one
        },
        launch, {
            upsert: true,
        });
}

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber: launchId
    });
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

async function abortLaunch(flightNumber) {
    // if (launches.has(flightNumber)) {
    //     const launch = launches.get(flightNumber);
    //     launch.upcoming = false;
    //     launch.success = false;
    // }
    const aborted = await launchesDatabase.updateOne({
        flightNumber: flightNumber,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    // addNewLaunch,
    scheduleNewLaunch,
    abortLaunch,
};