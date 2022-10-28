import mongoose from 'mongoose';
import { config } from '../config/config';

mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error(err);
    });
