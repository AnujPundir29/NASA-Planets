const {
    getAllLaunches,
    // addNewLaunch,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunch
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    res.json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
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
    await scheduleNewLaunch(launch);
    return res.json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    if(!(await existsLaunchWithId(launchId))) {
        return res.status(404).json({
            error: `Launch with id ${launchId} does not exist`
        });
    }
    const aborted = await abortLaunch(launchId);
    if(!aborted)
    {
        return res.status(400).json({
            error: 'Launch not aborted',
        });
    }
    return res.json({
        ok:true,
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};