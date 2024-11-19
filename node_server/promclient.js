import express from 'express';
import path from 'path';
import promClient from 'prom-client';

const counter = new promClient.Counter({
    name: 'reuqest_durations_milliseconds',
    help: 'request duration in milliseconds',
    labelNames: ['method', 'path', 'status', 'duration_area'],
});

const app = express();

const durations = [10, 20, 20, 30, 30, 30, 40, 40, 40, 40, 50, 50, 50, 50, 50, 50, 50, 60, 60, 60, 60, 70, 70, 70, 80, 80, 90]
setInterval(() => {
    const duration = durations[Math.floor(Math.random() * durations.length)];

    counter.inc({
        method: 'GET',
        path: '/',
        status: '200',
        duration_area: getDurationArea(duration).toString().padStart(3, '0'),
    });
}, 100);

//functan that get a duration an floor the value to the nearest 10
function getDurationArea(duration) {
    return Math.floor(duration / 10) * 10;
}

app.get("/metrics", async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

app.listen(3003, () => {
    console.log('Server is running on http://localhost:3000');
});

