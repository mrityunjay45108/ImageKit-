import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
  email: string;
  password: string;
  name: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function () {

  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
  
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err: any) {
    
    throw err;
  }
});

const UserModel = models.User || model<User>("User", userSchema);

export default UserModel;