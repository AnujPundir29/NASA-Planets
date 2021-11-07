const {
    getAllPlanets
} = require('../../models/planets.models')


async function httpgetAllPlanets(req, res) {
    res.status(200).json(await getAllPlanets());
}

module.exports = {
    httpgetAllPlanets
};