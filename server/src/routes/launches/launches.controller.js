const {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunch
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    res.json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (
        !launch.mission ||
        !launch.rocket ||
        !launch.launchDate ||
        !launch.target
    ) {
        return res.status(400).json({
            error: `Missing required launch property`
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid date'
        });
    }

    return res.json(addNewLaunch(launch));
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    if(!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: `Launch with id ${launchId} does not exist`
        });
    }
    return res.json(abortLaunch(launchId));
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};