import { Request, Response } from "express";
import crypto from "crypto";
import os from "os";
import { readFileSync } from "fs";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import User from "../models/user.js";
dotenv.config();
import { CommunicationIdentityClient } from '@azure/communication-identity';

export const generateRandomNumber = (digitLength: number): number => {
    const min = Math.pow(10, digitLength - 1);
    const max = Math.pow(10, digitLength) - 1;
    const range = max - min;
    const byteLength = Math.ceil(Math.log2(range + 1) / 8);
    const randomBytes = crypto.randomBytes(byteLength);
    const randomNumber = randomBytes.readUIntBE(0, byteLength) % range + min;
    return randomNumber;
};

export const makeUniqueAlphaNumeric = (length: number) => {
    var result = '';
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const getLocaleMessages = (): Record<string, string> => {
    const language = "en";
    const data = readFileSync(__basedir + "locals/" + language + ".json");
    return JSON.parse(data.toString());
};

export const getLocalIp = (): string | undefined => {
    const interfaces = os.networkInterfaces();
    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]!) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return `http://${iface.address}:${process.env.PORT}/`;
            }
        }
    }
}

export const validateUser = async (req: Request, res: Response): Promise<User | null> => {
    const userToken = req.headers.authorization;
    if (!userToken) {
        res.status(400).send({ message: locals.token_not_found, success: false, data: null });
        return null;
    }

    const token = userToken.split(' ');
    if (token.length < 2) {
        res.status(400).send({ message: locals.token_invalid, success: false, data: null });
        return null;
    }

    try {
        const decoded = jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET || '') as { id: "" };
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            res.status(400).send({ message: locals.record_not_found, success: false, data: null });
            return null;
        }

        return user;
    } catch (error) {
        res.status(400).send({ message: locals.user_not_found, success: false, data: null });
        return null;
    }
};

export const getCommunicationToken = async () => {
    try {
        // Create a new ACS user
        const connectionString = process.env.COMMUNIUCATION_TOKEN || '';
        const identityClient = new CommunicationIdentityClient(connectionString);
        const user = await identityClient.createUser();
        // Issue an access token for the user
        const tokenResponse = await identityClient.getToken(user, ["voip"]);
        return {
            userId: user.communicationUserId,
            token: tokenResponse.token
        };
        
    } catch (error) {
        console.error('Error generating token:', error);
        //res.status(500).send('Error generating token');
    }
};