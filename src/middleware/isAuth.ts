import { RequestHandler, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import 'dotenv/config';
import mongoose from 'mongoose';
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const isAuth: RequestHandler = async (req, res, next) => {
    try {
        const header = req.get('Authorization');

        if (!header) {
            return res.status(401).json({ message: "You're not authorized." });
        }

        const token = header.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

        if (!decodedToken) {
            return res.status(401).json({ message: "You're not authorized." });
        }

        req.userId = decodedToken.userId;
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (err) {
        if ((err as Error).name === 'JsonWebTokenError' || (err as Error).name === 'TokenExpiredError') {
            res.status(401).json({ message: 'You\'re not authorized.' });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }
}

export const isUserAuth: RequestHandler = async (req, res, next) => {
    try {
        const header = req.get('Authorization');

        if (!header) {
            return res.status(401).json({ message: "You're not authorized" });
        }

        const token = header.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

        if (!decodedToken) {
            return res.status(401).json({ message: "You're not authorized" });
        }

        req.userId = decodedToken.userId;
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (err) {
        if ((err as Error).name === 'JsonWebTokenError' || (err as Error).name === 'TokenExpiredError') {
            res.status(401).json({ message: 'You\'re not authorized' });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }
}

export const isAdminAuth: RequestHandler = async (req, res, next) => {
    try {
        const header = req.get('Authorization');

        if (!header) {
            return res.status(401).json({ message: "You're not authorized" });
        }

        const token = header.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

        if (!decodedToken) {
            return res.status(401).json({ message: "You're not authorized" });
        }

        req.userId = decodedToken.userId;
        const user = await User.findById(decodedToken.userId);

        if (!user || user.role !== 'admin') {
            return res.status(404).json({ message: "Admin not found" });
        }

        next();
    } catch (err) {
        if ((err as Error).name === 'JsonWebTokenError' || (err as Error).name === 'TokenExpiredError') {
            res.status(401).json({ message: 'You\'re not authorized' });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }
}