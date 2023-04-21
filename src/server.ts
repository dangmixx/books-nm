import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/logging';
import authorRouter from './routes/author';
import bookRouter from './routes/book';
const router = express();
mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority',
    })
    .then(() => {
        Logging.info('DB Connected');
        startServer();
    })
    .catch((err) => {
        Logging.error('DB Connect fail');
        Logging.error(err);
    });

const startServer = () => {
    router.use((req, res, next) => {
        Logging.info(`Incoming => Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            Logging.info(
                `Incoming => Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
            );
        });
        next();
    });

    router.use(
        express.urlencoded({
            extended: true,
        })
    );
    router.use(express.json());

    /* Router Rule */

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    /* Healthy check */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /* Router Author */
    router.use('/authors', authorRouter);
    router.use('/books', bookRouter);

    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => {
        Logging.info(`Server is running at port: ${config.server.port}`);
    });
};
