import users from "../models/user";
import jwt from "../helpers/jwt";
import * as bcrypt from 'bcrypt';
import { HttpRequest } from "uWebSockets.js";
import Color from "./color";


class Auth {
    async authenticate(email: string, password: string): Promise<{ token: string }> {

        const user = await users.findOne({ email: email });

        if (!user) {
            throw Error("Wrong email");
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new Error("wrong password");
        }

        const token = jwt.sign(
            { id: user.id },
            { expiresIn: process.env.ATLT }
        );

        return { token };
    }

    async register(email: string, password: string, username: string): Promise<{ token: string }> {

        const result = await users.findOne({ email: email });

        if (result) {
            throw Error("user alraedy exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const color = new Color();

        const user = await users.create({
            username: username,
            email: email,
            password: hash,
            color: color.random
        })

        const token = jwt.sign(
            { id: user.id },
            { expiresIn: process.env.ATLT }
        );

        return { token };
    }

    async user(header: string) {

        if (header) {
            const token = header.replace(/^bearer/i, "").trim();


            const { payload } = jwt.verify(token) as any;

            const user = await users.findById(payload.id);

            if (!user) {
                throw new Error('User not found');
            }

            return {
                id: user.id,
                username: user.username,
                email: user.email,
                color: user.color
            }

        } else {
            throw new Error("Forbiden");
        }
    }
}

export default Auth;