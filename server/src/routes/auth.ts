import { Router, Request, Response, NextFunction } from 'express';
import { DbService } from '../services/db.js';
import { AuthUtils } from '../services/authUtils.js';

const router = Router();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// Authentication middleware
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = AuthUtils.verifyToken(token);
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await DbService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const passwordHash = await AuthUtils.hashPassword(password);
    const userId = await DbService.createUser(email, passwordHash);

    const token = AuthUtils.generateToken(userId, email);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, email }
    });
  } catch (error: any) {
    console.error('Error during signup:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await DbService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await AuthUtils.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = AuthUtils.generateToken(user.id, user.email);

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error: any) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get current user details and their profile
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await DbService.getProfile(req.user.id);
    const settings = await DbService.getSettings(req.user.id);

    return res.json({
      user: req.user,
      profile,
      settings
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

export default router;
