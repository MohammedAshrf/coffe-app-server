import { Request, Response, NextFunction } from 'express';
import { Post, IPost } from '../models/Post.model';
import AppError from '../utils/AppError';
import { catchError } from '../utils/catchError';

// Extend Express Request to include the user (provided by JWT middleware)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string; // assuming you have a role property to check for admin privileges
  };
}

/**
 * Create a new post.
 * Requires: title, content in req.body and a valid user in req.user.
 */
export const createPost = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { title, content } = req.body;

    if (!title || !content) {
      return next(new AppError('Title and content are required', 400));
    }

    console.log('Authenticated user:', req.user);

    // Ensure the user is authenticated
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const newPost: IPost = await Post.create({
      title,
      content,
      author: req.user.id,
    });

    res
      .status(201)
      .json({ message: 'Post created successfully', data: { post: newPost } });
  },
);

/**
 * Update (edit) a post.
 * Requires: Post id in req.params and title and/or content in req.body.
 * Only the owner or an admin can update the post.
 */
export const updatePost = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title && !content) {
      return next(
        new AppError(
          'At least one of title or content must be provided to update',
          400,
        ),
      );
    }

    const post = await Post.findById(id);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check if the authenticated user is the owner of the post or an admin
    if (
      post.author.toString() !== req.user?.id.toString() &&
      req.user?.role !== 'admin'
    ) {
      return next(
        new AppError('You are not authorized to update this post', 403),
      );
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();

    res
      .status(200)
      .json({ message: 'Post updated successfully', data: { post } });
  },
);

/**
 * Delete a post.
 * Requires: Post id in req.params.
 * Only the owner or an admin can delete the post.
 */
export const deletePost = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check if the authenticated user is the owner of the post or an admin
    if (
      post.author.toString() !== req.user?.id.toString() &&
      req.user?.role !== 'admin'
    ) {
      return next(
        new AppError('You are not authorized to delete this post', 403),
      );
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post deleted successfully' });
  },
);
