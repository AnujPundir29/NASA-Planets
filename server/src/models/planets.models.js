const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./planets.mongo');

function isHabitablePlanets(planet) {
    return planet['koi_disposition'] === "CONFIRMED" &&
        planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6;
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            kepler_name: planet.kepler_name //if new insert
        }, {
            kepler_name: planet.kepler_name // to update
        }, {
            upsert: true,
        });
    } catch (error) {
        return console.error(`could not save planet ${error}`);
    }
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'Kepler Data.csv'))
            //Pipe just get an input and write the output into the parse function which is the destination
            .pipe(parse({
                comment: "#",
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanets(data))
                    // HabitablePlanets.push(data);

                    //upsert = update + insert (no duplication)
                    savePlanet(data);
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('close', async () => {
                // console.log(HabitablePlanets.map((planet) =>
                //     planet['kepler_name']))
                const countPlanets = (await getAllPlanets()).length;
                console.log(`Habitable planets are : ${countPlanets}`);
                resolve();
            });
    });
}

async function getAllPlanets() {
    return await planets.find({});
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};