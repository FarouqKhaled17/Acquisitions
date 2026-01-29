import expressAsyncHandler from 'express-async-handler';
import { formatValidationErrors } from '../utils/format.js';
import logger from '#config/logger';
import { signUpSchema, loginSchema } from '../validations/auth.validation.js';
import { createUser, authenticateUser } from '../services/auth.service.js';
import { jwtTKN } from '../utils/jwt.js';
import { cookies } from '../utils/cookies.js';

export const signup = expressAsyncHandler(async (req, res) => {
  const validationRes = signUpSchema.safeParse(req.body);

  if (!validationRes.success) {
    const formattedErrors = formatValidationErrors(validationRes.error);
    logger.warn(`Signup validation failed: ${formattedErrors}`);

    return res.status(400).json({
      errors: formattedErrors
    });
  }

  const { name, email, password, role } = validationRes.data;
  const user = await createUser({ name, email, password, role });
  const tkn = jwtTKN.sign({ id: user.id, email: user.email, role: user.role });
  cookies.set(res, 'token', tkn);

  logger.info(`New user signup: ${email} with role ${role}`);

  res.status(201).json({
    message: 'User signed up successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export const login = expressAsyncHandler(async (req, res) => {
  const validationRes = loginSchema.safeParse(req.body);

  if (!validationRes.success) {
    const formattedErrors = formatValidationErrors(validationRes.error);
    logger.warn(`Login validation failed: ${formattedErrors}`);

    return res.status(400).json({
      errors: formattedErrors
    });
  }

  const { email, password } = validationRes.data;

  try {
    const user = await authenticateUser(email, password);
    const tkn = jwtTKN.sign({ id: user.id, email: user.email, role: user.role });
    cookies.set(res, 'token', tkn);

    logger.info(`User login successful: ${email}`);

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    logger.error('Unexpected error during login:', error);
    throw error;
  }
});

export const logout = expressAsyncHandler(async (req, res) => {
  cookies.clear(res, 'token');
  logger.info('User logged out');

  res.status(200).json({
    message: 'User logged out successfully'
  });
});
