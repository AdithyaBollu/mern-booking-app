import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Model for code.
export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

// Creates user Schema for db
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

// Before document gets saved
// if password has changed, bcrypt to hash it
userSchema.pre("save", async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Binds the code and db model together to the User route
const User = mongoose.model<UserType>("User", userSchema);

export default User;