import { type Context, Hono, type Next } from 'hono';
import { cors } from 'hono/cors';
import AuthRoute from './src/controllers/auth.controller';
import UsersRoute from './src/controllers/user.controller';

const app = new Hono();

app.use('*', async (ctx: Context, next: Next): Promise<void | Response> => {
    return await cors({
        origin: [ctx.env.CLIENT_ORIGIN_URL],
        credentials: true,
    })(ctx, next);
});

app.onError((err, ctx: Context) => {
    ctx.status(500);

    return ctx.json({
        success: false,
        message: err.message,
        data: null,
    });
});

app.route('/auth', AuthRoute);
app.route('/users', UsersRoute);

export default app;