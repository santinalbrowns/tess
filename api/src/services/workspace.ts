import members from "../models/member";
import users from "../models/user";
import workspaces from "../models/workspace";
import Color from "./color";

class Workspace {
    async create({ name, color, user }: { name: string, color: string, user: string }) {
        const result = await workspaces.findOne({ name: name });
        
        if (result) {
            const member =  await members.findOne({user: user, workspace: result.id});

            if(member) {
                throw new Error('Duplicate workspace name');
            }
        }

        const colors = new Color();

        const workspace = await workspaces.create({
            name: name,
            color: color || colors.random,
        });

        const member = this.addMember({
            user: user,
            workspace: workspace.id,
            role: "admin"
        })

        return {
            id: workspace.id,
            name: workspace.name,
            color: workspace.color,
        };
    }
    async update({ name, color, user, id }: { name?: string, color?: string, user: string, id: string }) {
        
        const member =  await members.findOne({user: user, workspace: id});

        if(!member) {
            throw new Error('Membership not found');
        }

        const workspace = await workspaces.findById(member.workspace);

        if(!workspace) {
            throw new Error("Workspace does not exist");
        }

        if(name) {
            workspace.name = name;
        }

        if(color) {
            workspace.color = color;
        }

        if(color || name) {
            await workspace.save();
        }

        return {
            id: workspace.id,
            name: workspace.name,
            color: workspace.color,
        };
    }

    async addMember({user, workspace, role}:{user: string, workspace: string, role: string}) {

        const result = await members.findOne({user: user, workspace: workspace});

        if(result) {
            throw new Error("User already a member");
        }

        const member = await members.create({
            user: user,
            workspace: workspace,
            role: role,
        });


        return {
            id: member.id,
            user: member.user,
            workspace: member.workspace,
            role: member.role
        }
    }

    async getAll(user: string) {

        const memberships = await members.find({user: user});

        const space_ids = memberships.map(member => member.workspace);

        const spaces = await workspaces.find({_id: space_ids});

        return spaces.map(space => {
            return {
                id: space.id,
                name: space.name,
                color: space.color
            }
        })
    }

    async get(user: string, id: string) {
        const member = await members.findOne({user: user, workspace: id});

        if(!member) {
            throw new Error("Membership not found");
        }

        const workspace = await workspaces.findById(member.workspace);

        if(!workspace) {
            throw new Error("Workspace not found");
        }

        return {
            id: workspace.id,
            name: workspace.name,
            color: workspace.color,
        }
    }
}

export default Workspace;