import { ObjectId } from "mongoose";
import cells from "../models/cell";
import combs from "../models/comb";
import users from "../models/user";

class Comb {
    async create({ user, label, workspace, peer }: { user: ObjectId, label?: string, workspace: ObjectId, peer: string }) {

        const comb = await combs.create({
            user: user,
            label: label,
            workspace: workspace,
            peer: peer
        });

        return {
            id: comb.id,
            user: comb.user,
            label: comb.label,
            peer: comb.peer,
        }
    }

    async find(row: number, column: number) {
        const cell: any = await cells.findOne({ row: row, column: column }).populate('user').populate('comb');

        if (!cell) throw new Error("Cell not found");

        return {
            id: cell.id,
            user: {
                id: cell.user.id,
                username: cell.user.name,
                email: cell.user.email,
                color: cell.user.color,
            },
            comb: {
                id: cell.comb.id,
                user: cell.comb.user,
                label: cell.comb.label,
                peer: cell.comb.peer,
            },
            row: cell.row,
            column: cell.column,
        };
    }

    async remove(id: ObjectId) {

        const member = await cells.findById(id);

        if (member) {

            const comb = await combs.findOne({ user: member.user });

            if (comb) {

                const members = await cells.find({ comb: comb.id });

                if (members.length && members.length < 2) {
                    await combs.deleteOne({ user: member.user });
                }

                await cells.deleteOne({ _id: member.id })

                return {
                    id: member.id,
                    peer: comb.peer
                };

            }

            await cells.deleteOne({ _id: member.id })

            return {
                id: member.id
            };
        }
    }

    async join({ combId, row, column, userId, peer }: { combId: string, row: number, column: number, userId: ObjectId, peer: string }) {

        const member = await cells.findOne({ user: userId });

        if (member) {

            const comb = await combs.findOne({ user: member.user, peer: peer });

            if (comb) {

                const members = await cells.find({ comb: comb.id });

                if (members.length && members.length < 2) {
                    await combs.deleteOne({ user: member.user });
                }

            }

            await cells.deleteOne({ user: member.user })

        }


        const cell = await cells.create({
            comb: combId,
            user: userId,
            row: row,
            column: column
        });

        return this.find(cell.row, cell.column);
    }


    async cells(workspace: string) {
        const comb = await combs.find({
            workspace: workspace
        });

        const ids = comb.map(c => c.id);

        const cell = await cells.find({ comb: ids }).populate('user').populate('comb');

        return cell.map((cell: any) => {

            return {
                id: cell.id,
                comb: {
                    id: cell.comb.id,
                    user: cell.comb.user,
                    label: cell.comb.label,
                    peer: cell.comb.peer,
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