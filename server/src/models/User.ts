import mongoose, { Document, Schema } from 'mongoose';

export type Role = 'vendor' | 'delivery' | 'customer';

export interface IUser extends Document {
  email: string;
  password: string;
  role: Role;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['vendor', 'delivery', 'customer'],
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
