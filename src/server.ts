import express from 'express';
import './database/connection';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/users', userRoutes);

app.listen(4000, () => {
    console.log('Server started on port 4000');
});
