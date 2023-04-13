import mongoose from "mongoose";

const schema = new mongoose.Schema<Member>(
    {
        user: {type: mongoose.Types.ObjectId, required: true},
        workspace: {type: mongoose.Types.ObjectId, required: true},
        role: {type: String, required: true}
    },
    {timestamps: true}
)

const members = mongoose.model<Member>("member", schema);

export default members;