import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/users', userRoutes);

export default app;
