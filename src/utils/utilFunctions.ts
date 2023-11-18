import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { DecodedToken } from '../interfaces';

/**
 * @param userId A user id
 * @param email A user email
 * @returns A token
 * @description Generates a token using jsonwebtoken
 */
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, process.env.TOKEN_SECRET!, {
    expiresIn: '1h',
  });
};

/**
 * @param password A password to be hashed
 * @returns A hashed password
 * @description Hashes a password using bcrypt
 */
export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

/**
 * @param password A password to be checked
 * @param hashedPassword A hashed password
 * @returns A boolean
 * @description Checks if a password matches a hashed password
 */
export const checkPassword = (
  password: string,
  hashedPassword: string,
): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};

/**
 * @param token A token to be verified
 * @returns A decoded token
 * @description Verifies a token using jsonwebtoken
 */
export const verifyToken = (token: string): DecodedToken | null => {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET!) as DecodedToken;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null; // Token is expired
    }
    throw error; // Re-throw other errors
  }
};