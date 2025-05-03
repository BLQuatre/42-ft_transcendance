import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getenvVar } from './functions';
// import dotenv from 'dotenv';
// import path = require('path');

// dotenv.config({ path: path.resolve(__dirname, '../../.env')});

const JWT_SECRET = getenvVar('JWT_SECRET')
const REFRESH_SECRET = getenvVar('REFRESH_SECRET');
const tokenStore = new Map<string, string>();

const generateTokens = (userId: string) => {
	const accesToken = jwt.sign({ userId }, JWT_SECRET, {expiresIn: '15m' });
	const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {expiresIn: '7D'});
	return {accesToken, refreshToken};
}