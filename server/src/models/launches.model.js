const launches = new Map();
let latestFlightNumber = 100;
const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 29,2021'),
    target: 'Kepler-442 b',
    customer: ['Anuj', 'NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

function getAllLaunches() {
    return Array.from(launches.values());
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