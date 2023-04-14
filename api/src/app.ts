import { App, HttpResponse, us_socket_local_port } from "uWebSockets.js";
import dotenv from "dotenv";
import { connect } from "./config/database";
import Color from "./services/color";
import Auth from "./services/auth";
import { object, string, ValidationError } from 'yup';
import Workspace from "./services/workspace";
import Comb from "./services/comb";
import cookie from "cookie";

dotenv.config();

const app = App();
let port = 5000;

const auth = new Auth();

const decoder = new TextDecoder('utf-8');

/* Helper function for reading a posted JSON body */
function readJson(res: HttpResponse, cb: (data: any) => unknown, err: any) {
    let buffer: Uint8Array | Buffer;
    /* Register data cb */
    res.onData((ab, isLast) => {
        let chunk = Buffer.from(ab);
        if (isLast) {
            let json;
            if (buffer) {
                try {
                    json = JSON.parse(decoder.decode(Buffer.concat([buffer, chunk])));
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            } else {
                try {
                    json = JSON.parse(decoder.decode(chunk));
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            }
        } else {
            if (buffer) {
                buffer = Buffer.concat([buffer, chunk]);
            } else {
                buffer = Buffer.concat([chunk]);
            }
        }
    });

    /* Register error cb */
    res.onAborted(err);
}

app.post('/auth', (res, req) => {

    /* Note that you cannot read from req after returning from here */
    let url = req.getUrl();

    /* Read the body until done or error */
    readJson(res, async (data) => {
        const color = new Color();

        const schema = object({
            email: string().email().required(),
            password: string().min(6).required()
        });

        try {
            const body = await schema.validate(data);

            const user = await auth.authenticate(body.email, body.password);

            /* res.writeHeader('Access-Control-Allow-Origin', 'origin');
            res.writeHeader('Access-Control-Allow-Credentials', 'true'); */
            res.writeHeader('Set-Cookie', 'myCookie=cookieValue; Max-Age=3600; HttpOnly');

            //res.writeHeader('content-type', 'application/json');

            res.end(JSON.stringify(user));

        } catch (error: any) {

            if (error instanceof ValidationError) {
                return res.writeStatus("400").end(error.message);
            }

            if (error instanceof Error) {
                return res.writeStatus("401").end(error.message);
            }

            return res.writeStatus("500").end(error.message);
        }
    }, () => {
        /* Request was prematurely aborted or invalid or missing, stop reading */
        console.log('Invalid JSON or no data at all!');
    });
})
app.post('/auth/register', (res, req) => {

    /* Note that you cannot read from req after returning from here */
    let url = req.getUrl();

    /* Read the body until done or error */
    readJson(res, async (data) => {
        const color = new Color();

        const schema = object({
            username: string().min(4).required(),
            email: string().email().required(),
            password: string().min(6).required()
        });

        try {
            const body = await schema.validate(data);

            const user = await auth.register(body.email, body.password, body.username);

            res.writeHeader('content-type', 'application/json');

            res.end(JSON.stringify(user));

        } catch (error: any) {

            if (error instanceof ValidationError) {
                return res.writeStatus("400").end(error.message);
            }

            if (error instanceof Error) {
                return res.writeStatus("401").end(error.message);
            }

            return res.writeStatus("500").end(error.message);
        }
    }, () => {
        /* Request was prematurely aborted or invalid or missing, stop reading */
        console.log('Invalid JSON or no data at all!');
    });
})

app.get('/me', async (res, req) => {

    const header = req.getHeader("authorization");

    res.onAborted(() => {
        res.aborted = true;
    });

    try {
        const user = await auth.user(header)

        if (!res.aborted) {
            res.writeHeader("content-type", "application/json");
            res.end(JSON.stringify(user));
        }
    } catch (error) {
        res.writeStatus("401").end("you must first login");
    }

});

app.get('/workspaces/:id', async (res, req) => {

    const id = req.getParameter(0);

    const header = req.getHeader("authorization");

    res.onAborted(() => {
        res.aborted = true;
    });

    const workspace = new Workspace();

    try {
        const user = await auth.user(header)

        const space = await workspace.get(user.id, id);

        if (!res.aborted) {
            res.writeHeader("content-type", "application/json");
            res.end(JSON.stringify(space));
        }
    } catch (error: any) {
        res.end(error.message);
    }

});
app.get('/workspaces', async (res, req) => {

    const header = req.getHeader("authorization");

    res.writeHeader('Set-Cookie', 'myCookie=cookieValue; Max-Age=3600; HttpOnly');

    req.forEach((k, v) => {
        console.log(k, v)
    })

    res.onAborted(() => {
        res.aborted = true;
    });

    const workspace = new Workspace();

    try {
        const user = await auth.user(header)

        const workspaces = await workspace.getAll(user.id);

        if (!res.aborted) {
            res.writeHeader('set-cookie', cookie.serialize('name', user.id, {
                httpOnly: false,
                maxAge: 60 * 60 * 24 * 7 // 1 week
            }));
            res.writeHeader("content-type", "application/json");
            res.end(JSON.stringify(workspaces));
        }
    } catch (error) {
        res.writeStatus("401").end("you must first login");
    }

});
app.post('/workspaces', async (res, req) => {

    const header = req.getHeader("authorization");

    res.onAborted(() => {
        res.aborted = true;
    });

    const schema = object({
        name: string().required(),
        color: string().required(),
    });

    readJson(res, async (data) => {
        try {
            const body = await schema.validate(data);

            const user = await auth.user(header)

            const space = new Workspace();

            const workspace = await space.create({
                name: body.name,
                color: body.color,
                user: user.id
            });

            if (!res.aborted) {
                res.writeHeader("content-type", "application/json");
                res.end(JSON.stringify(workspace));
            }

        } catch (error: any) {
            res.end(error.message);
        }

    }, () => {
        console.log('Invalid JSON or no data at all!');
    })
});
app.put('/workspaces/:id', async (res, req) => {

    const header = req.getHeader("authorization");

    const id = req.getParameter(0);

    res.onAborted(() => {
        res.aborted = true;
    });

    const schema = object({
        name: string().notRequired(),
        color: string().notRequired(),
    });

    readJson(res, async (data) => {
        try {
            const body = await schema.validate(data);

            const user = await auth.user(header)

            const space = new Workspace();

            const workspace = await space.update({
                name: body.name!,
                color: body.color!,
                user: user.id,
                id: id
            });

            if (!res.aborted) {
                res.writeHeader("content-type", "application/json");
                res.end(JSON.stringify(workspace));
            }

        } catch (error: any) {
            res.end(error.message);
        }

    }, () => {
        console.log('Invalid JSON or no data at all!');
    })
});
app.get('/join/:id', async (res, req) => {

    const header = req.getHeader("authorization");

    const id = req.getParameter(0);

    res.onAborted(() => {
        res.aborted = true;
    });

    try {
        const user = await auth.user(header)

        const space = new Workspace();

        const workspace = await space.addMember({
            user: user.id,
            workspace: id,
            role: "auth",
        });

        if (!res.aborted) {
            res.writeHeader("content-type", "application/json");
            res.end(JSON.stringify(workspace));
        }

    } catch (error: any) {
        res.end(error.message);
    }
});
app.get('/api/data', (res, req) => {
    // Set the "Set-Cookie" header in the response
    //res.writeHeader('Access-Control-Allow-Credentials', 'true');
    res.writeHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.writeHeader('Set-Cookie', 'myCookie=cookieValue; Max-Age=3600; HttpOnly');

    // Send the response
    res.writeStatus('200 OK');
    res.end(JSON.stringify({message: 'Hello, world!'}));
});

app.ws('/*', {
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60,

    upgrade: (res, req, context) => {

        console.log('An Http connection wants to become WebSocket, URL: ' + req.getUrl() + '!');

        console.log(cookie.parse(req.getHeader('cookie') || ''));

        res.upgrade({
            myData: "1234"
        },

            req.getHeader('sec-websocket-key'),
            req.getHeader('sec-websocket-protocol'),
            req.getHeader('sec-websocket-extensions'),
            context,
        );
    },

    open: (ws) => {
        // subscribe to topics

        //console.log("Connected");

        //ws.subscribe("room");
    },

    message: async (ws, message, isBinary) => {

        let event: ClientEvent = JSON.parse(decoder.decode(message));
        let body: ServerEvent;

        try {
            const user = await auth.user(event.token);

            ws.getUserData()

            const honeyComb = new Comb();

            switch (event.action) {
                case "collaborate":

                    ws.subscribe(event.data);

                    body = {
                        action: 'status',
                        data: {
                            cells: await honeyComb.cells(event.data),
                        }
                    };

                    ws.send(JSON.stringify(body));

                    break;
                case "host":

                    const comb = await honeyComb.create({
                        user: user.id,
                        workspace: event.data.topic,
                    });

                    const cell = await honeyComb.join({
                        combId: comb.id,
                        row: event.data.row,
                        column: event.data.column,
                        userId: user.id
                    });

                    let data: ServerEvent = {
                        action: 'joined',
                        data: cell,
                    }

                    ws.publish(event.data.topic, JSON.stringify(data));

                    ws.send(JSON.stringify(data));

                    break;
                case "join":

                    body = {
                        action: 'joined',
                        data: await honeyComb.join({
                            combId: event.data.comb,
                            row: event.data.row,
                            column: event.data.column,
                            userId: user.id
                        })
                    }

                    ws.publish(event.data.topic, JSON.stringify(body));

                    ws.send(JSON.stringify(body));
                    break;
                case "leave":
                    body = {
                        action: 'left',
                        data: await honeyComb.remove(event.data.id)
                    }

                    ws.publish(event.data.topic, JSON.stringify(body));

                    ws.send(JSON.stringify(body));

                    break;

                default:
                    break;
            }
        } catch (error: any) {

            const mgs: ServerEvent = {
                action: "error",
                data: error.message
            }

            ws.send(JSON.stringify(mgs));
        }

    },

    close(ws, code, message) {
        console.log("user disconnected", code.toString())
    },
})



app.listen(port, async (token) => {
    await connect();

    if (token) {
        // retrieve listening port
        port = us_socket_local_port(token);
        console.log('Listening to port ' + port);
    } else {
        console.log('Failed finding available port');
    }
});