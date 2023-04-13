import { ObjectId } from "mongoose";
import cells from "../models/cell";
import combs from "../models/comb";
import users from "../models/user";

class Comb {
    async create({ user, label, workspace }: { user: ObjectId, label?: string, workspace: ObjectId }) {

        const result = await combs.findOne({ user: user, workspace: workspace });

        if (result) {
            await this.exist(user);
            await combs.deleteOne({ user: user });
        }

        const comb = await combs.create({
            user: user,
            label: label,
            workspace: workspace,
        });

        return {
            id: comb.id,
            user: comb.user,
            label: comb.label
        }
    }

    async exist(userId: ObjectId) {
        const cell = await cells.findOne({ user: userId });

        if (!cell) throw new Error("Cell not found");

        await cells.deleteOne({ user: userId });
    }

    async join({ combId, row, column, userId }: { combId: string, row: number, column: number, userId: ObjectId }) {
        const comb = await combs.findById(combId);

        if (!comb) throw new Error('Comb found found');

        const user = await users.findById(userId);

        if (!user) throw new Error('User not found');

        const result = await cells.findOne({ row: row, column: column });

        if (result) throw new Error("Cell not empty");

        const cell = await cells.create({
            comb: comb.id,
            row: row,
            column: column,
            user: user.id,
        });

        return {
            id: cell.id,
            comb: {
                id: comb.id,
                user: comb.user,
                label: comb.label,
            },
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                color: user.color
            },
            row: cell.row,
            column: cell.column
        };
    }


    async cells(workspace: string) {
        const comb = await combs.find({
            workspace: workspace
        });

        const ids = comb.map(c => c.id);

        const cell = await cells.find({ comb: ids }).populate('user').populate('comb');

        return cell.map((cell: any) => {

            return {
                comb: {
                    id: cell.comb.id,
                    user: cell.comb.user,
                    label: cell.comb.label,
                },
                user: {
                    id: cell.user.id,
                    username: cell.user.username,
                    email: cell.user.email,
                    color: cell.user.color
                },
                row: cell.row,
                column: cell.column
            }
        })
    }
}

export default Comb;