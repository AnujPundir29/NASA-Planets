const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
const DEF_FLIGHT_NUM = 100;

const launch = {
    flightNumber: 100, // flight_number
    mission: 'Kepler Exploration X', // name
    rocket: 'Explorer IS1', // rocket.name
    launchDate: new Date('December 29, 2021'), // date_local
    target: 'Kepler-442 b', // NA
    customers: ['Anuj', 'NASA'], // payloads.customers for each payload
    upcoming: true, // upcoming
    success: true, // success
}

async function populateLaunches() {
    console.log('Downloading SpaceX Data');
    const response = await axios.post(SPACEX_API_URL, {
        // querying the data
        query: {},
        options: {
            // page : 1,
            // limit : 142,
            pagination: false,
            populate: [{
                    path: 'rocket',
                    select: 'name'
                },
                {
                    path: 'payloads',
                    select: 'customers'
                }
            ]
        }
    });

    if (response.statusCode !== 200) {
        console.log(`Problem loading SpaceX data ${response.ok}`);
        throw new Error('Problem loading SpaceX data');
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => { // flatMap is used to combine set of different customers 
            return payload['customers'] // of different payload into one
        });
        const newLaunch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            customers: customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success']
        }
        await saveLaunch(newLaunch);
    }
}

async function loadLaunchesData() {
    const filter = {
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    }
    if (!(await findLaunch(filter)))
        await populateLaunches();
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    return !latestLaunch ? DEF_FLIGHT_NUM : latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate({ // only includes the properties we inserted not additional
            flightNumber: launch.flightNumber, //if found with the flight number then update the next value otherwise insert a new one
        },
        launch, {
            upsert: true,
        });
}

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId
    });
}

async function getAllLaunches(limit, skip) {
    return await launchesDatabase
        .find({}, '-_id -__v ')
        .sort('flightNumber')
        .skip(skip) // skips the docs
        .limit(limit); // set the limit for page
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        kepler_name: launch.target
    });

    if (!planet) {
        throw new Error('Planet which is target is not matching with the database');
    }
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
    loadLaunchesData,
    existsLaunchWithId,
    getAllLaunches,
    // addNewLaunch,
    scheduleNewLaunch,
    abortLaunch,
};