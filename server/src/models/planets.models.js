const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const HabitablePlanets = [];

function isHabitablePlanets(planet) {
    return planet['koi_disposition'] === "CONFIRMED" &&
        planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname,'..','..','data','Kepler Data.csv'))
            //Pipe just get an input and write the output into the parse function which is the destination
            .pipe(parse({
                comment: "#",
                columns: true
            }))
            .on('data', (data) => {
                if (isHabitablePlanets(data))
                    HabitablePlanets.push(data);
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('close', () => {
                // console.log(HabitablePlanets.map((planet) =>
                //     planet['kepler_name']))
                console.log(`Habitable planets are : ${HabitablePlanets.length}`);
                resolve();
            });
    });
}


module.exports = {
    loadPlanetsData,
    planets: HabitablePlanets
};