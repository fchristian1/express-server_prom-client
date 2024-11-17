import express from 'express'
import cors from 'cors'
import winston, { Logger } from 'winston'
import promClient from 'prom-client'

const app = express()

app.use(cors())

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ],
});

app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`)
    });
    next()
});

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
});

app.listen(3000, () => {
    logger.info('Server listening on port 3000')
});