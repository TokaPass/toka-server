import { type Context, Hono } from 'hono';
import prisma from "../lib/prisma"
import { sign } from 'hono/utils/jwt/jwt';
import { setCookie } from 'hono/cookie';
import { type TBindings } from '../types/';

const app = new Hono<{ Bindings: TBindings }>();

/** POST /auth/register */
app.post('/register', async (ctx: Context): Promise<Response> => {
  const {
    username,
    password,
  }: {
    username: string;
    password: string;
  } = await ctx.req.json();

  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10
  })

  const user = await prisma.user.create({
    data: {
      hashedPass: hashedPassword,
      username,
      id: crypto.randomUUID(),
    }
  })

  return ctx.json({ data: user });
});

/** POST /auth/login */
app.post('/login', async (ctx: Context): Promise<Response> => {
  const { username, password } = await ctx.req.json();

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await Bun.password.verify(await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10
  }), user.hashedPass))) {
    ctx.json({
      err: 404
    })
  }

  const token = await sign({ id: user?.id, username }, `${process.env.JWT_SECRET}`);

  ctx.header('Access-Control-Allow-Credentials', 'true');
  ctx.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  ctx.header('Access-Control-Allow-Headers', '*');
  ctx.header('Access-Control-Allow-Origin', ctx.env.CLIENT_ORIGIN_URL);

  setCookie(ctx, 'token', token, {
    expires: new Date(new Date().setDate(new Date().getDate() + 7)),
    secure: true,
    sameSite: 'None',
    httpOnly: true,
  });

  return ctx.json({ data: { token } });
});

export default app;