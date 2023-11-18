import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { prisma } from '../prisma';

const app: Express = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

dotenv.config();

prisma
.$connect()
.then(() => {
  console.log('Database connected');
})
.catch((err) => {
  console.log('Database connection failed');
  console.log(err);
});

export { prisma, app };