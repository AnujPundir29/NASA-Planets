const request = require('supertest');
const app = require('../../app')

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        // expect(response.statusCode).toBe(200);
    });
});

describe('Test POST /launch', () => {
    const comleteLaunchData = {
        mission: 'USS Enterprice',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'January 4, 2028',
    }

    const launchDataWithoutDate = {
        mission: 'USS Enterprice',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
    }

    const launchDataWithInvalidDate = {
        mission: 'USS Enterprice',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'Jan',
    }
    test('It should respond with 201 created', async () => {
        const response = await request(app)
            .post('/launches')
            .send(comleteLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(comleteLaunchDate.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();

        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test('It should catch for missing attributes',async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: `Missing required launch property`,
        });

    });
    test('It should catch for valid date',async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid date'
        });
    });
});