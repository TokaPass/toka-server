import { Hono } from "hono";
import type { JwtVariables } from 'hono/jwt'
import initIndexRoutes from "./src/routes/index"

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

//@ts-ignore
// if someone knows how to fix this please help me
initIndexRoutes(app);

export default app;