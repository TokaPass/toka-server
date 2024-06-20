import { type Context, Hono, type Next } from 'hono';
import { jwt } from 'hono/jwt';
import { verify } from 'hono/utils/jwt/jwt';
import prisma from "../lib/prisma"
import { type TBindings } from '../types/index';
import { getCookie } from 'hono/cookie';
import { algorithm } from '../lib/encryption';

const app = new Hono<{ Bindings: TBindings }>();

app.use('*', async (ctx: Context, next: Next): Promise<void | Response> => {
    return (
        await jwt({
            cookie: 'token',
            secret: `${process.env.JWT_SECRET}`,
        })
    )(ctx, next);
});

/** POST /logins/create */
app.post("/create", async (ctx: Context): Promise<Response> => {
    const { username, password, url } = await ctx.req.json();
/*
    const hashedPassword = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10
    })
*/

    const hashedPassword = algorithm.encrypt(password)

    const token = getCookie(ctx, "token")
    if (token) {
        const { id } = await verify(token, `${process.env.JWT_SECRET}`);
        const user = await prisma.user.findUniqueOrThrow({ where: { id: `${id}` }, select: { id: true, username: true } });
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            logins: {
              create: {
                id: crypto.randomUUID(),
                username: username,
                pass: hashedPassword,
                url: url
              }
            }
          }
        })
        
        return ctx.json({ message: "success" });
    }

    return ctx.json({ data: "ads" });
})

app.get("/get/:id", async (ctx: Context): Promise<Response> => {
    const id = ctx.req.param('id');

    const thingy = await prisma.user.findFirst({
      where: {
        logins: {
          some: {
            id,
          },
        },
      },
      select: {
        logins: {
          select: {
            url: true,
            id: true,
            username: true,
            pass: true
          },
        },
      },
    });

    let login = thingy?.logins.find((l) => l.id === id);

    const decryptedPassword = algorithm.decrypt(login?.pass)

    return ctx.json({ data: { url: login?.url, username: login?.username, password: decryptedPassword } });
})

app.get("/all", async (ctx: Context): Promise<Response> => {
    const thingy = await prisma.user.findFirst({
      select: {
        logins: {
          select: {
            url: true,
            id: true,
            pass: true,
            username: true
          },
        },
      },
    });

    const data = thingy?.logins.map((l) => ({ url: l.url, id: l.id, username: l.username, password: algorithm.decrypt(l.pass) }));

    return ctx.json({ data });
})

export default app;