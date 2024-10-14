import express, { Application } from "express";
import cors from "cors";
import router from "./routes";
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import connectDB from "./mongooseConfig";
import './models/Address';
import './models/Company';
import './models/AppliedJob';
import './models/Education';
import './models/Experience';
import './models/Skill';
import './models/User';

dotenv.config();

const app: Application = express();

const client_url = process.env.CLIENT_URL || 'https://remotewor.netlify.app';
const corsOptions = {
    origin: client_url,
    credentials: true,
};

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));
app.use(express.json());

// Morgan format for logging
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';
app.use(morgan(morganFormat));

app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});