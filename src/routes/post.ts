import { Router } from 'express';
import {
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController';
import verifyToken from '../middlewares/auth'; // or use your 'protect' middleware

const router: Router = Router();

// Create a new post
router.post('/', verifyToken, createPost);

// Update (edit) an existing post
// router.put('post/:id', verifyToken, updatePost);

// Delete a post
// router.delete('post/:id', verifyToken, deletePost);

router
  .route('/:id')
  .put(verifyToken, updatePost)
  .delete(verifyToken, deletePost);

export const postRoutes = router;
