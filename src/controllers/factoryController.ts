import { Model, Document, Types } from 'mongoose';
import AppError from '../utils/AppError';
import { catchError } from '../utils/catchError';
import { Request, Response, NextFunction } from 'express';
import APIFeatures from '../utils/APIFeatures';

// export const createEntity = <T extends { _id: Types.ObjectId }>(
//   Model: Model<T>,
// ) =>
//   catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const doc = await Model.create(req.body);
//     res.status(200).json({ data: { doc } });
//   });

type CreateOptions<T> = {
  inject?: Partial<T>;
  afterCreate?: (doc: T) => Promise<void>;
};

export const getAllEntities = <T extends { _id: Types.ObjectId }>(
  Model: Model<T>,
) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    // await User.find()

    const features = new APIFeatures(Model.find(), req.query)
      .paginate()
      .filter()
      .sort()
      .limitFields();

    let query = features.query;

    // Apply population if custom options exist
    const customOptions = res.locals.customQueryOptions || {};

    console.log('Custom populate options:', customOptions.populate);

    if (customOptions.populate) {
      for (const pop of customOptions.populate) {
        query = query.populate(pop);
      }
    }

    const docs = await query;

    if (docs.length === 0) {
      res.status(200).json({
        message: 'No data found',
        data: docs,
      });
    }

    res
      .status(200)
      .json({ message: 'Data fetched successfully', data: { docs } });
  });

export const getEntity = <T extends { _id: Types.ObjectId }>(Model: Model<T>) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    res.status(200).json({ data: { doc } });
  });

export const createEntity = <T extends { _id: Types.ObjectId }>(
  Model: Model<T>,
) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    const options = res.locals.customCreateOptions as
      | CreateOptions<T>
      | undefined;

    const inject = options?.inject ?? {};
    const doc = await Model.create({ ...req.body, ...inject });

    if (options?.afterCreate) {
      await options.afterCreate(doc);
    }

    res.status(200).json({ data: { doc } });
  });

// export const updateEntity = <T extends { _id: Types.ObjectId }>(
//   Model: Model<T>,
// ) =>
//   catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const doc = await Model.findByIdAndUpdate(id, req.body, { new: true });
//     if (!doc) return next(new AppError('No document found with this id', 404));
//     res.status(200).json({ data: { doc } });
//   });

export const updateEntity = <T extends { _id: Types.ObjectId }>(
  Model: Model<T>,
  populateFields: string[] = [],
) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // remove _id from body before updating
    const { _id, ...safeBody } = req.body;

    let query = Model.findByIdAndUpdate(id, safeBody, { new: true });

    // Apply populate if any
    populateFields.forEach((field) => {
      query = query.populate(field);
    });

    const doc = await query;

    if (!doc) return next(new AppError('No document found with this id', 404));

    res.status(200).json({
      message: 'Updated successfully',
      data: { doc },
    });
  });

export const deleteEntity = <T extends { _id: Types.ObjectId }>(
  Model: Model<T>,
) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new AppError('No document found with this id', 404));

    res.status(200).json({ message: 'succsessfully deleted' });
  });
