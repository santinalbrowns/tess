import mongoose from "mongoose";
import * as bcrypt from 'bcrypt';

const schema = new mongoose.Schema<User>(
    {
        username: { type: String, lowercase: true, default: null },
        email: { type: String, lowercase: true, unique: true },
        password: { type: String, required: true },
        color: { type: String, lowercase: true, required: true }
    },
    { timestamps: true }
);


/* schema.pre("save", async function (next) {

    const user = this as unknown as User;

    if (!user.isModified('password')) {
        return next();
    }

    const salf = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salf);

    user.password = hash;

    return next();
}); */

const users = mongoose.model<User>("user", schema);

export default users;