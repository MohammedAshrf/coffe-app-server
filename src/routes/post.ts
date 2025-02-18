import { Router } from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPost,
} from '../controllers/postController';
import verifyToken from '../middlewares/auth'; // or use your 'protect' middleware

const router: Router = Router();

// Create a new post
router.route('/').post(verifyToken, createPost).get(verifyToken, getAllPosts);

// Update or Delete a post
router
  .route('/:id')
  .get(verifyToken, getPost)
  .put(verifyToken, updatePost)
  .delete(verifyToken, deletePost);

export const postRoutes = router;
