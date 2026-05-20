/**
 * Mongoose User model.
 * Guards against model re-compilation in Next.js dev hot-reload.
 */
import bcrypt from "bcryptjs";
import mongoose, { type Document, type Model, Schema } from "mongoose";

import type { UserRole } from "@/types/auth";

/* ── Document interface ─────────────────────────────────────── */
export interface IUser extends Document {
  name:        string;
  email:       string;
  password?:   string;        // undefined for OAuth users
  image?:      string;
  bio?:        string;
  role:        UserRole;
  provider:    "credentials" | "google" | "github";
  isVerified:  boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  resetToken?:  string;
  resetTokenExpiry?: Date;
  lastLoginAt?: Date;
  createdAt:   Date;
  updatedAt:   Date;
  comparePassword(plain: string): Promise<boolean>;
}

/* ── Schema ─────────────────────────────────────────────────── */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type:     String,
      required: [true, "Name is required."],
      trim:     true,
      minlength: [2,  "Name must be at least 2 characters."],
      maxlength: [50, "Name must be at most 50 characters."],
    },
    email: {
      type:     String,
      required: [true, "Email is required."],
      unique:   true,
      lowercase: true,
      trim:     true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
      type:     String,
      select:   false,         // never returned by default
      minlength: [8, "Password must be at least 8 characters."],
    },
    image: {
      type:    String,
      default: null,
    },
    bio: {
      type:     String,
      maxlength: [500, "Bio must be at most 500 characters."],
    },
    role: {
      type:    String,
      enum:    ["user", "admin", "moderator"],
      default: "user",
    },
    provider: {
      type:    String,
      enum:    ["credentials", "google", "github"],
      default: "credentials",
    },
    isVerified:         { type: Boolean, default: false },
    verifyToken:        String,
    verifyTokenExpiry:  Date,
    resetToken:         String,
    resetTokenExpiry:   Date,
    lastLoginAt:        Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.verifyToken;
        delete ret.verifyTokenExpiry;
        delete ret.resetToken;
        delete ret.resetTokenExpiry;
        return ret;
      },
    },
  }
);

/* ── Indexes ────────────────────────────────────────────────── */
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

/* ── Pre-save: hash password ────────────────────────────────── */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* ── Instance method: compare password ─────────────────────── */
UserSchema.methods.comparePassword = async function (plain: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(plain, this.password);
};

/* ── Prevent model re-compilation in dev ────────────────────── */
const UserModel: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default UserModel;
