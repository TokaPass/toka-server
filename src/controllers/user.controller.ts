import { type Context, Hono, type Next } from 'hono';
import { jwt } from 'hono/jwt';
import prisma from "../lib/prisma"
import { type TBindings } from '../types/index';

const app = new Hono<{ Bindings: TBindings }>();

app.use('*', async (ctx: Context, next: Next): Promise<void | Response> => {
    return (
        await jwt({
            cookie: 'token',
            secret: ctx.env.JWT_SECRET_KEY,
        })
    )(ctx, next);
});

/** GET /users/:id */
app.get('/:id', async (ctx: Context): Promise<Response> => {
    const id = ctx.req.param('id');
    const user = await prisma.user.findUnique({ where: { id } });

    return ctx.json({ data: user });
});

export default app;