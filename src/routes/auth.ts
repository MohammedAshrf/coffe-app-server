import { Router, Request } from 'express';
import { register, login, deleteUser } from '../controllers/authController';
import verifyToken from '../middlewares/auth';

interface AuthRequest extends Request {
  user?: any;
}

const router: Router = Router();

router.post('/register', register);

router.post('/login', login);

// Protected route
router.get('/protected', verifyToken, (req: AuthRequest, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Delete user route (protected)
router.delete('/delete/:id', verifyToken, deleteUser);

export const authRoutes = router;
