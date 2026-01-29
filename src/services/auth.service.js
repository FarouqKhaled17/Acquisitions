import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import db from '../config/database.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw error;
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing password:', error);
    throw error;
  }
};

export const createUser = async ({ name, email, password, role }) => {
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUsers.length > 0) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const insertedUsers = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash: hashedPassword,
      role,
    })
    .returning();

  const newUser = insertedUsers[0];

  logger.info(`User created: ${email} with role ${role}`);
  return newUser;
};

export const authenticateUser = async (email, password) => {
  try {
    const usersFound = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = usersFound[0];

    if (!user) {
      logger.warn(`Authentication failed: user not found for email ${email}`);
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      logger.warn(`Authentication failed: invalid password for email ${email}`);
      throw new Error('Invalid email or password');
    }

    logger.info(`User authenticated: ${email}`);
    return user;
  } catch (error) {
    logger.error('Error authenticating user:', error);
    throw error;
  }
};
