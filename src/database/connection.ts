import mongoose from 'mongoose';
import { config } from '../config/config';

(async () => {
    try {
        await mongoose.connect(config.db.url, {
            retryWrites: true, // retry if initial connection fails
            w: 'majority', // wait for majority of nodes to be available
        });
        console.log('Connected to database');
    } catch (error) {
        console.log('Error connecting to database: ', error);
    }
})();
