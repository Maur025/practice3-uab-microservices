import bcrypt from 'bcryptjs';
import env from '../config/env.js';

export const hashPassword = async (password) =>
  bcrypt.hash(password, env.bcryptSaltRounds);

export const comparePassword = async (password, hash) =>
  bcrypt.compare(password, hash);

export const hashToken = async (token) =>
  bcrypt.hash(token, env.bcryptSaltRounds);

export const compareToken = async (token, hash) => {
  if (!hash) return false;
  return bcrypt.compare(token, hash);
};
