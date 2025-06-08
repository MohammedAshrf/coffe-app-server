import { Request, Response, NextFunction } from 'express';
import { Post, IPost } from '../models/Post.model';
import AppError from '../utils/AppError';
import { catchError } from '../utils/catchError';
import {
  createEntity,
  deleteEntity,
  getAllEntities,
  getEntity,
  updateEntity,
} from './factoryController';
import { Model, Types } from 'mongoose';

// Extend Express Request to include the user (provided by JWT middleware)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string; // assuming you have a role property to check for admin privileges
  };
}

export const getAllPosts = getAllEntities(
  Post as Model<IPost & { _id: Types.ObjectId }>,
);
export const getPost = getEntity(
  Post as Model<IPost & { _id: Types.ObjectId }>,
);
export const createPost = createEntity(
  Post as Model<IPost & { _id: Types.ObjectId }>,
);
export const updatePost = updateEntity(
  Post as Model<IPost & { _id: Types.ObjectId }>,
);
export const deletePost = deleteEntity(
  Post as Model<IPost & { _id: Types.ObjectId }>,
);

// export const getAllPosts = catchError(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const posts = await Post.find();

//     if (posts.length === 0) {
//       res.status(200).json({ message: 'No posts found', data: { posts } });
//       return;
//     }

//     res
//       .status(200)
//       .json({ message: 'Posts fetched successfully', data: { posts: posts } });
//   },
// );

// export const createPost = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { title, content } = req.body;

//     if (!title || !content) {
//       return next(new AppError('Title and content are required', 400));
//     }

//     console.log('Authenticated user:', req.user);

//     // Ensure the user is authenticated
//     if (!req.user) {
//       return next(new AppError('Unauthorized', 401));
//     }

//     const newPost: IPost = await Post.create({
//       title,
//       content,
//       author: req.user.id,
//     });

//     res
//       .status(201)
//       .json({ message: 'Post created successfully', data: { post: newPost } });
//   },
// );

// export const getPost = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { id } = req.params;

//     const post = await Post.findById(id);

//     if (!post) {
//       return next(new AppError('Post not found', 404));
//     }

//     res
//       .status(200)
//       .json({ message: 'Post fetched successfully', data: { post } });
//   },
// );

// export const updatePost = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { id } = req.params;
//     const { title, content } = req.body;

//     if (!title && !content) {
//       return next(
//         new AppError(
//           'At least one of title or content must be provided to update',
//           400,
//         ),
//       );
//     }

//     const post = await Post.findByIdAndUpdate(id);
//     if (!post) {
//       return next(new AppError('Post not found', 404));
//     }

//     // Check if the authenticated user is the owner of the post or an admin
//     if (
//       post.author.toString() !== req.user?.id.toString() &&
//       req.user?.role !== 'admin'
//     ) {
//       return next(
//         new AppError('You are not authorized to update this post', 403),
//       );
//     }

//     if (title) post.title = title;
//     if (content) post.content = content;

//     await post.save();

//     res
//       .status(200)
//       .json({ message: 'Post updated successfully', data: { post } });
//   },
// );

// export const deletePost = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { id } = req.params;

//     const post = await Post.findById(id);
//     if (!post) {
//       return next(new AppError('Post not found', 404));
//     }

//     // Check if the authenticated user is the owner of the post or an admin
//     if (
//       post.author.toString() !== req.user?.id.toString() &&
//       req.user?.role !== 'admin'
//     ) {
//       return next(
//         new AppError('You are not authorized to delete this post', 403),
//       );
//     }

//     await Post.findByIdAndDelete(id);

//     res.status(200).json({ message: 'Post deleted successfully' });
//   },
// );
