import mongoose from "mongoose";

const schema = new mongoose.Schema<Cell>(
    {
        user: {type: mongoose.Types.ObjectId, ref: 'user', required: true},
        comb: {type: mongoose.Types.ObjectId, ref: 'comb', required: true},
        row: {type: Number, required: true},
        column: {type: Number, required: true},
    },
    {timestamps: true}
)

const cells = mongoose.model<Cell>("cell", schema);

export default cells;