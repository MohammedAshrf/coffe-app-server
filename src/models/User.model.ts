import { Document, model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IOrder } from './Order.mode';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isAdmin: boolean;
  cart: { productId: string; quantity: number }[];
  orders: string[];
  createdAt: Date;
  updatedAt: Date;
  passwordChangeAt: Date;
  passwordConfirm: string;
  refreshToken: string;
  comparePassword(password: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

// When `.populate("orders")` is used, this type applies
export interface IUserPopulated extends Omit<IUser, 'orders'> {
  orders: IOrder[]; // Orders are now full objects
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    passwordChangeAt: { type: Date },
    isAdmin: { type: Boolean, default: false },
    refreshToken: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], // Referencing orders
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Track password change time
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = new Date(Date.now() - 1000); // prevent issues with timing
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Method to check if the password was changed after a given JWT timestamp
userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number,
): boolean {
  if (this.passwordChangeAt) {
    const changedTimeStamp = this.passwordChangeAt.getTime() / 1000;
    return JWTTimestamp < changedTimeStamp;
  }
  return false; // if no password change date, return false
};

export const User = model<IUser>('User', userSchema);
