import mongoose from "mongoose";

const schema = new mongoose.Schema<Workspace>(
    {
        name: { type: String, required: true },
        color: { type: String, required: true },
    },
    { timestamps: true }
);

const workspaces = mongoose.model<Workspace>("workspace", schema);

export default workspaces;