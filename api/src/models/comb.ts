import mongoose from "mongoose";

const schema = new mongoose.Schema<Comb>(
    {
        label: { type: String },
        user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
        workspace: { type: mongoose.Types.ObjectId, ref: 'workspace', required: true }
    },
    { timestamps: true }
)

const combs = mongoose.model<Comb>("comb", schema);

export default combs;